"use strict";

/* ========================================
   Home Page — Expenses + Incomes
   Arrow IIFE | addEventListener | async/await
   ======================================== */

(() => {

    let expenseEditingId = null;
    let incomeEditingId = null;

    /* ========================================
       Element References
       ======================================== */

    const expenseCategory = document.getElementById("exp-category");
    const expenseDescription = document.getElementById("exp-description");
    const expenseAmount = document.getElementById("exp-amount");
    const expenseDate = document.getElementById("exp-date");
    const expenseSubmitBtn = document.getElementById("exp-submit-btn");
    const expenseCancelBtn = document.getElementById("exp-cancel-btn");
    const expenseFormTitle = document.getElementById("exp-form-title");
    const expenseTableBody = document.getElementById("expenses-tbody");

    const incomeCategory = document.getElementById("inc-category");
    const incomeDescription = document.getElementById("inc-description");
    const incomeAmount = document.getElementById("inc-amount");
    const incomeDate = document.getElementById("inc-date");
    const incomeSubmitBtn = document.getElementById("inc-submit-btn");
    const incomeCancelBtn = document.getElementById("inc-cancel-btn");
    const incomeFormTitle = document.getElementById("inc-form-title");
    const incomeTableBody = document.getElementById("incomes-tbody");

    /* ========================================
       Initialization
       ======================================== */

    populateSelect(expenseCategory, App.EXPENSE_CATEGORIES);
    populateSelect(incomeCategory, App.INCOME_CATEGORIES);
    expenseDate.setAttribute("max", App.getTodayString());
    incomeDate.setAttribute("max", App.getTodayString());
    renderExpensesTable();
    renderIncomesTable();
    updateStats();
    loadMarketData();

    /* ========================================
       Event Listeners
       ======================================== */

    expenseSubmitBtn.addEventListener("click", () => handleExpenseSubmit());
    expenseCancelBtn.addEventListener("click", () => cancelExpenseEdit());
    incomeSubmitBtn.addEventListener("click", () => handleIncomeSubmit());
    incomeCancelBtn.addEventListener("click", () => cancelIncomeEdit());

    /* Event delegation — expenses table */
    expenseTableBody.addEventListener("click", (event) => {
        const button = App.findClosest(event.target, "[data-action]");
        if (!button) return;
        const recordId = Number(button.getAttribute("data-id"));
        if (button.getAttribute("data-action") === "edit") editExpense(recordId);
        else if (button.getAttribute("data-action") === "delete") confirmDeleteExpense(recordId);
    });

    /* Event delegation — incomes table */
    incomeTableBody.addEventListener("click", (event) => {
        const button = App.findClosest(event.target, "[data-action]");
        if (!button) return;
        const recordId = Number(button.getAttribute("data-id"));
        if (button.getAttribute("data-action") === "edit") editIncome(recordId);
        else if (button.getAttribute("data-action") === "delete") confirmDeleteIncome(recordId);
    });

    /* ========================================
       Shared Helpers
       ======================================== */

    function populateSelect(selectElement, categories) {
        categories.forEach((category) => {
            const option = document.createElement("option");
            option.value = category.value;
            option.textContent = category.icon + " " + category.label;
            selectElement.appendChild(option);
        });
    }

    function validateForm(categoryValue, descriptionValue, amountValue, dateValue, prefix) {
        let isValid = true;
        clearErrors(prefix);

        if (!categoryValue) {
            showError(prefix + "-error-category", "יש לבחור קטגוריה");
            isValid = false;
        }

        /* "Other" category requires description */
        if ((categoryValue === "other-exp" || categoryValue === "other-inc") && (!descriptionValue || descriptionValue.trim() === "")) {
            showError(prefix + "-error-description", "כאשר הקטגוריה היא 'אחר' — חובה להזין תיאור");
            isValid = false;
        }

        if (!amountValue || amountValue === "") {
            showError(prefix + "-error-amount", "יש להזין סכום");
            isValid = false;
        }
        else if (Number(amountValue) <= 0) {
            showError(prefix + "-error-amount", "הסכום חייב להיות חיובי");
            isValid = false;
        }
        else if (Number(amountValue) > 100000) {
            showError(prefix + "-error-amount", "הסכום לא יכול לעלות על 100,000");
            isValid = false;
        }

        if (!dateValue) {
            showError(prefix + "-error-date", "יש לבחור תאריך");
            isValid = false;
        }
        else if (new Date(dateValue) > new Date(App.getTodayString())) {
            showError(prefix + "-error-date", "התאריך לא יכול להיות עתידי");
            isValid = false;
        }

        return isValid;
    }

    function showError(elementId, message) {
        const errorElement = document.getElementById(elementId);
        if (errorElement) errorElement.textContent = message;
    }

    function clearErrors(prefix) {
        document.querySelectorAll("[id^='" + prefix + "-error']").forEach((element) => {
            element.textContent = "";
        });
    }

    /* ========================================
       Expense CRUD
       ======================================== */

    function handleExpenseSubmit() {
        if (!validateForm(expenseCategory.value, expenseDescription.value, expenseAmount.value, expenseDate.value, "exp")) return;
        const expenseData = {
            category: expenseCategory.value,
            description: expenseDescription.value.trim(),
            amount: Number(expenseAmount.value),
            date: expenseDate.value
        };
        if (expenseEditingId !== null) {
            App.updateExpense(expenseEditingId, expenseData);
            expenseEditingId = null;
            expenseFormTitle.innerHTML = '<i class="bi bi-dash-circle"></i> הוספת הוצאה חדשה';
            expenseSubmitBtn.textContent = "הוסף הוצאה";
            expenseCancelBtn.classList.add("d-hidden");
        } else {
            App.addExpense(expenseData);
        }
        expenseCategory.value = "";
        expenseDescription.value = "";
        expenseAmount.value = "";
        expenseDate.value = "";
        clearErrors("exp");
        renderExpensesTable();
        updateStats();
    }

    function cancelExpenseEdit() {
        expenseEditingId = null;
        expenseFormTitle.innerHTML = '<i class="bi bi-dash-circle"></i> הוספת הוצאה חדשה';
        expenseSubmitBtn.textContent = "הוסף הוצאה";
        expenseCancelBtn.classList.add("d-hidden");
        expenseCategory.value = "";
        expenseDescription.value = "";
        expenseAmount.value = "";
        expenseDate.value = "";
        clearErrors("exp");
    }

    function editExpense(recordId) {
        const expense = App.getExpenseById(recordId);
        if (!expense) return;
        expenseEditingId = recordId;
        expenseCategory.value = expense.category;
        expenseDescription.value = expense.description || "";
        expenseAmount.value = expense.amount;
        expenseDate.value = expense.date;
        expenseFormTitle.innerHTML = '<i class="bi bi-pencil"></i> עדכון הוצאה';
        expenseSubmitBtn.textContent = "עדכן הוצאה";
        expenseCancelBtn.classList.remove("d-hidden");
        document.getElementById("expense-form-card").scrollIntoView({ behavior: "smooth" });
    }

    function confirmDeleteExpense(recordId) {
        const expense = App.getExpenseById(recordId);
        if (!expense) return;
        const category = App.getExpCategory(expense.category);
        if (confirm("האם למחוק את ההוצאה?\n\nקטגוריה: " + (category ? category.label : expense.category) + "\nסכום: " + App.formatCurrency(expense.amount))) {
            App.deleteExpense(recordId);
            renderExpensesTable();
            updateStats();
            if (expenseEditingId === recordId) cancelExpenseEdit();
        }
    }

    function renderExpensesTable() {
        const expenses = App.getExpenses();
        expenseTableBody.innerHTML = "";
        if (expenses.length === 0) {
            expenseTableBody.innerHTML = '<tr><td colspan="5"><div class="empty-state"><div class="empty-icon">📭</div><p>אין הוצאות עדיין</p></div></td></tr>';
            return;
        }
        expenses.sort((first, second) => new Date(second.date) - new Date(first.date));
        expenses.forEach((expense) => {
            const row = document.createElement("tr");
            row.innerHTML =
                '<td>' + App.getCategoryBadgeHTML(expense.category, "expense") + '</td>' +
                '<td>' + (expense.description || "—") + '</td>' +
                '<td class="font-bold">' + App.formatCurrency(expense.amount) + '</td>' +
                '<td>' + App.formatDate(expense.date) + '</td>' +
                '<td><div class="action-btns">' +
                '<button class="btn-edit-soft" data-action="edit" data-id="' + expense.id + '"><i class="bi bi-pencil"></i> עדכון</button>' +
                '<button class="btn-danger-soft" data-action="delete" data-id="' + expense.id + '"><i class="bi bi-trash3"></i> מחיקה</button>' +
                '</div></td>';
            expenseTableBody.appendChild(row);
        });
    }

    /* ========================================
       Income CRUD
       ======================================== */

    function handleIncomeSubmit() {
        if (!validateForm(incomeCategory.value, incomeDescription.value, incomeAmount.value, incomeDate.value, "inc")) return;
        const incomeData = {
            category: incomeCategory.value,
            description: incomeDescription.value.trim(),
            amount: Number(incomeAmount.value),
            date: incomeDate.value
        };
        if (incomeEditingId !== null) {
            App.updateIncome(incomeEditingId, incomeData);
            incomeEditingId = null;
            incomeFormTitle.innerHTML = '<i class="bi bi-plus-circle"></i> הוספת הכנסה חדשה';
            incomeSubmitBtn.textContent = "הוסף הכנסה";
            incomeCancelBtn.classList.add("d-hidden");
        } else {
            App.addIncome(incomeData);
        }
        incomeCategory.value = "";
        incomeDescription.value = "";
        incomeAmount.value = "";
        incomeDate.value = "";
        clearErrors("inc");
        renderIncomesTable();
        updateStats();
    }

    function cancelIncomeEdit() {
        incomeEditingId = null;
        incomeFormTitle.innerHTML = '<i class="bi bi-plus-circle"></i> הוספת הכנסה חדשה';
        incomeSubmitBtn.textContent = "הוסף הכנסה";
        incomeCancelBtn.classList.add("d-hidden");
        incomeCategory.value = "";
        incomeDescription.value = "";
        incomeAmount.value = "";
        incomeDate.value = "";
        clearErrors("inc");
    }

    function editIncome(recordId) {
        const income = App.getIncomeById(recordId);
        if (!income) return;
        incomeEditingId = recordId;
        incomeCategory.value = income.category;
        incomeDescription.value = income.description || "";
        incomeAmount.value = income.amount;
        incomeDate.value = income.date;
        incomeFormTitle.innerHTML = '<i class="bi bi-pencil"></i> עדכון הכנסה';
        incomeSubmitBtn.textContent = "עדכן הכנסה";
        incomeCancelBtn.classList.remove("d-hidden");
        document.getElementById("income-form-card").scrollIntoView({ behavior: "smooth" });
    }

    function confirmDeleteIncome(recordId) {
        const income = App.getIncomeById(recordId);
        if (!income) return;
        const category = App.getIncCategory(income.category);
        if (confirm("האם למחוק את ההכנסה?\n\nקטגוריה: " + (category ? category.label : income.category) + "\nסכום: " + App.formatCurrency(income.amount))) {
            App.deleteIncome(recordId);
            renderIncomesTable();
            updateStats();
            if (incomeEditingId === recordId) cancelIncomeEdit();
        }
    }

    function renderIncomesTable() {
        const incomes = App.getIncomes();
        incomeTableBody.innerHTML = "";
        if (incomes.length === 0) {
            incomeTableBody.innerHTML = '<tr><td colspan="5"><div class="empty-state"><div class="empty-icon">📭</div><p>אין הכנסות עדיין</p></div></td></tr>';
            return;
        }
        incomes.sort((first, second) => new Date(second.date) - new Date(first.date));
        incomes.forEach((income) => {
            const row = document.createElement("tr");
            row.innerHTML =
                '<td>' + App.getCategoryBadgeHTML(income.category, "income") + '</td>' +
                '<td>' + (income.description || "—") + '</td>' +
                '<td class="amount-income">' + App.formatCurrency(income.amount) + '</td>' +
                '<td>' + App.formatDate(income.date) + '</td>' +
                '<td><div class="action-btns">' +
                '<button class="btn-edit-soft" data-action="edit" data-id="' + income.id + '"><i class="bi bi-pencil"></i> עדכון</button>' +
                '<button class="btn-danger-soft" data-action="delete" data-id="' + income.id + '"><i class="bi bi-trash3"></i> מחיקה</button>' +
                '</div></td>';
            incomeTableBody.appendChild(row);
        });
    }

    /* ========================================
       Stats
       ======================================== */

    function updateStats() {
        const expenses = App.getExpenses();
        const incomes = App.getIncomes();
        let totalExpenses = 0;
        let totalIncomes = 0;
        expenses.forEach((expense) => { totalExpenses += expense.amount; });
        incomes.forEach((income) => { totalIncomes += income.amount; });
        const balance = totalIncomes - totalExpenses;

        document.getElementById("stat-expenses").textContent = App.formatCurrency(totalExpenses);
        document.getElementById("stat-incomes").textContent = App.formatCurrency(totalIncomes);
        document.getElementById("stat-count").textContent = expenses.length + incomes.length;

        const balanceElement = document.getElementById("stat-balance");
        balanceElement.textContent = App.formatCurrency(balance);
        if (balance >= 0) {
            balanceElement.classList.add("balance-positive");
            balanceElement.classList.remove("balance-negative");
        } else {
            balanceElement.classList.add("balance-negative");
            balanceElement.classList.remove("balance-positive");
        }
    }

    /* ========================================
       Market Data — async/await + fetch
       ======================================== */

    const CORS_PROXY = "https://corsproxy.io/?url=";

    async function loadMarketData() {
        /* Exchange rates — direct, no proxy needed */
        try {
            const response = await fetch("https://api.exchangerate-api.com/v4/latest/ILS");
            const ratesData = await response.json();
            document.getElementById("market-usd").textContent = "₪ " + (1 / ratesData.rates.USD).toFixed(4);
            document.getElementById("market-eur").textContent = "₪ " + (1 / ratesData.rates.EUR).toFixed(4);
            document.getElementById("market-gbp").textContent = "₪ " + (1 / ratesData.rates.GBP).toFixed(4);
            ["market-usd", "market-eur", "market-gbp"].forEach((elementId) => document.getElementById(elementId).classList.remove("loading"));
            const updateElement = document.getElementById("market-updated");
            if (updateElement) {
                const now = new Date();
                updateElement.textContent = "עודכן: " + now.toLocaleDateString("he-IL") + " " + now.toLocaleTimeString("he-IL", { hour: "2-digit", minute: "2-digit" });
            }
        } catch (error) {
            ["market-usd", "market-eur", "market-gbp"].forEach((elementId) => { document.getElementById(elementId).textContent = "לא זמין"; });
        }

        /* BOI + Prime — fallback values */
        document.getElementById("market-boi").textContent = "4.50%";
        document.getElementById("market-prime").textContent = "6.00%";
        ["market-boi", "market-prime"].forEach((elementId) => document.getElementById(elementId).classList.remove("loading"));

        /* S&P 500 — via CORS proxy */
        try {
            const spUrl = "https://query1.finance.yahoo.com/v8/finance/chart/%5EGSPC?interval=1d&range=1d";
            const spResponse = await fetch(CORS_PROXY + encodeURIComponent(spUrl));
            const spData = await spResponse.json();
            const spPrice = spData.chart.result[0].meta.regularMarketPrice;
            document.getElementById("market-sp500").textContent = spPrice.toLocaleString("en-US", { maximumFractionDigits: 0 });
        } catch (error) {
            document.getElementById("market-sp500").textContent = "לא זמין";
        }
        document.getElementById("market-sp500").classList.remove("loading");

        /* NASDAQ — via CORS proxy */
        try {
            const nasdaqUrl = "https://query1.finance.yahoo.com/v8/finance/chart/%5EIXIC?interval=1d&range=1d";
            const nasdaqResponse = await fetch(CORS_PROXY + encodeURIComponent(nasdaqUrl));
            const nasdaqData = await nasdaqResponse.json();
            const nasdaqPrice = nasdaqData.chart.result[0].meta.regularMarketPrice;
            document.getElementById("market-nasdaq").textContent = nasdaqPrice.toLocaleString("en-US", { maximumFractionDigits: 0 });
        } catch (error) {
            document.getElementById("market-nasdaq").textContent = "לא זמין";
        }
        document.getElementById("market-nasdaq").classList.remove("loading");
    }

})();
