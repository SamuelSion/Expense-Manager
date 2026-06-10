"use strict";

/* ========================================
   Filters Page — AND logic (intersection)
   Arrow IIFE | addEventListener | Set | Map
   ======================================== */

(() => {

    /* Element references */
    const toggleYears = document.getElementById("toggle-years");
    const toggleMonths = document.getElementById("toggle-months");
    const toggleDays = document.getElementById("toggle-days");
    const panelYears = document.getElementById("panel-years");
    const panelMonths = document.getElementById("panel-months");
    const panelDays = document.getElementById("panel-days");
    const yearsContainer = document.getElementById("years-checks");
    const monthsContainer = document.getElementById("months-checks");
    const expenseCategoryContainer = document.getElementById("category-checks");
    const incomeCategoryContainer = document.getElementById("income-category-checks");
    const dateFromInput = document.getElementById("filter-date-from");
    const dateToInput = document.getElementById("filter-date-to");
    const minAmountInput = document.getElementById("filter-min-amount");
    const maxAmountInput = document.getElementById("filter-max-amount");
    const applyButton = document.getElementById("apply-filters-btn");
    const resetButton = document.getElementById("reset-filters-btn");
    const resultsContainer = document.getElementById("results-container");
    const typeSelector = document.getElementById("filter-type-selector");

    const activeToggles = new Set();
    let filterDataType = "both";

    /* ========================================
       Initialization
       ======================================== */

    populateYearCheckboxes();
    populateMonthCheckboxes();
    populateCategoryCheckboxes(expenseCategoryContainer, App.EXPENSE_CATEGORIES);
    populateCategoryCheckboxes(incomeCategoryContainer, App.INCOME_CATEGORIES);

    toggleYears.addEventListener("click", () => handleToggle("years", toggleYears, panelYears, "active-purple"));
    toggleMonths.addEventListener("click", () => handleToggle("months", toggleMonths, panelMonths, "active-green"));
    toggleDays.addEventListener("click", () => handleToggle("days", toggleDays, panelDays, "active-cyan"));
    applyButton.addEventListener("click", () => applyFilters());
    resetButton.addEventListener("click", () => resetAll());

    typeSelector.addEventListener("click", (event) => {
        const button = App.findClosest(event.target, ".type-selector-btn");
        if (!button) return;
        typeSelector.querySelectorAll(".type-selector-btn").forEach((btn) => btn.classList.remove("active"));
        button.classList.add("active");
        filterDataType = button.getAttribute("data-value");
    });

    /* ========================================
       Toggle Circles
       ======================================== */

    function handleToggle(name, element, panel, colorClass) {
        if (activeToggles.has(name)) {
            activeToggles.delete(name);
            element.classList.remove(colorClass);
            panel.classList.remove("visible");
        } else {
            activeToggles.add(name);
            element.classList.add(colorClass);
            panel.classList.add("visible");
        }
    }

    /* ========================================
       Populate Checkboxes
       ======================================== */

    function populateYearCheckboxes() {
        const allRecords = App.getExpenses().concat(App.getIncomes());
        const yearSet = new Set();
        allRecords.forEach((record) => yearSet.add(record.date.split("-")[0]));
        const sortedYears = App.setToArray(yearSet).sort((first, second) => Number(second) - Number(first));

        if (sortedYears.length === 0) {
            yearsContainer.innerHTML = '<span class="no-data-msg">אין נתונים</span>';
            return;
        }
        sortedYears.forEach((year) => createCheckItem(yearsContainer, year, year));
    }

    function populateMonthCheckboxes() {
        const monthNames = ["ינואר", "פברואר", "מרץ", "אפריל", "מאי", "יוני", "יולי", "אוגוסט", "ספטמבר", "אוקטובר", "נובמבר", "דצמבר"];
        monthNames.forEach((name, index) => createCheckItem(monthsContainer, App.padZero(index + 1), name));
    }

    function populateCategoryCheckboxes(container, categories) {
        categories.forEach((category) => {
            const label = document.createElement("label");
            label.className = "check-item checked";
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.value = category.value;
            checkbox.checked = true;
            checkbox.addEventListener("change", function () {
                this.checked ? label.classList.add("checked") : label.classList.remove("checked");
            });
            label.appendChild(checkbox);
            label.appendChild(document.createTextNode(" " + category.icon + " " + category.label));
            container.appendChild(label);
        });
    }

    function createCheckItem(container, value, displayText) {
        const label = document.createElement("label");
        label.className = "check-item";
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.value = value;
        checkbox.addEventListener("change", function () {
            this.checked ? label.classList.add("checked") : label.classList.remove("checked");
        });
        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(" " + displayText));
        container.appendChild(label);
    }

    function getSelectedValues(container) {
        const selectedSet = new Set();
        container.querySelectorAll("input[type='checkbox']:checked").forEach((checkbox) => selectedSet.add(checkbox.value));
        return selectedSet;
    }

    /* ========================================
       Get Data by Type
       ======================================== */

    function getRawData() {
        let records = [];
        if (filterDataType === "expenses" || filterDataType === "both") {
            records = records.concat(App.getExpenses().map((expense) => App.addType(expense, "expense")));
        }
        if (filterDataType === "incomes" || filterDataType === "both") {
            records = records.concat(App.getIncomes().map((income) => App.addType(income, "income")));
        }
        return records;
    }

    /* ========================================
       Apply Filters — AND Logic (Intersection)
       All active filters combine into ONE result
       ======================================== */

    function applyFilters() {
        let filteredRecords = getRawData();
        let filterDescription = "";

        const monthNameMap = new Map([
            ["01", "ינואר"], ["02", "פברואר"], ["03", "מרץ"], ["04", "אפריל"],
            ["05", "מאי"], ["06", "יוני"], ["07", "יולי"], ["08", "אוגוסט"],
            ["09", "ספטמבר"], ["10", "אוקטובר"], ["11", "נובמבר"], ["12", "דצמבר"]
        ]);

        /* AND filter: Years */
        if (activeToggles.has("years")) {
            const selectedYears = getSelectedValues(yearsContainer);
            if (selectedYears.size > 0) {
                filteredRecords = filteredRecords.filter((record) => selectedYears.has(record.date.split("-")[0]));
                filterDescription += " | שנים: " + App.setToArray(selectedYears).join(", ");
            }
        }

        /* AND filter: Months */
        if (activeToggles.has("months")) {
            const selectedMonths = getSelectedValues(monthsContainer);
            if (selectedMonths.size > 0) {
                filteredRecords = filteredRecords.filter((record) => selectedMonths.has(record.date.split("-")[1]));
                const monthLabels = App.setToArray(selectedMonths).map((monthNum) => monthNameMap.get(monthNum) || monthNum);
                filterDescription += " | חודשים: " + monthLabels.join(", ");
            }
        }

        /* AND filter: Date range */
        if (activeToggles.has("days")) {
            const fromDate = dateFromInput.value;
            const toDate = dateToInput.value;
            if (fromDate) {
                filteredRecords = filteredRecords.filter((record) => record.date >= fromDate);
                filterDescription += " | מתאריך: " + App.formatDate(fromDate);
            }
            if (toDate) {
                filteredRecords = filteredRecords.filter((record) => record.date <= toDate);
                filterDescription += " | עד: " + App.formatDate(toDate);
            }
        }

        /* AND filter: Categories */
        const selectedExpenseCategories = getSelectedValues(expenseCategoryContainer);
        const selectedIncomeCategories = getSelectedValues(incomeCategoryContainer);
        filteredRecords = filteredRecords.filter((record) => {
            if (record._type === "expense") return selectedExpenseCategories.has(record.category);
            if (record._type === "income") return selectedIncomeCategories.has(record.category);
            return true;
        });

        /* AND filter: Amount range */
        const minValue = minAmountInput.value;
        const maxValue = maxAmountInput.value;
        if (minValue && Number(minValue) > 0) {
            filteredRecords = filteredRecords.filter((record) => record.amount >= Number(minValue));
        }
        if (maxValue && Number(maxValue) > 0) {
            filteredRecords = filteredRecords.filter((record) => record.amount <= Number(maxValue));
        }

        /* Build title */
        const title = filterDescription ? "תוצאות סינון" + filterDescription : "כל הרשומות";

        /* Render single combined result */
        renderResultTable(title, filteredRecords);
    }

    /* ========================================
       Render Single Result Table
       ======================================== */

    function renderResultTable(title, records) {
        resultsContainer.innerHTML = "";

        /* Title */
        const titleElement = document.createElement("div");
        titleElement.className = "result-block-title purple-title";
        titleElement.innerHTML = '<i class="bi bi-funnel-fill"></i> ' + title +
            ' <span class="result-count">(' + records.length + ' תוצאות)</span>';
        resultsContainer.appendChild(titleElement);

        if (records.length === 0) {
            resultsContainer.innerHTML += '<div class="empty-state"><div class="empty-icon">🔍</div><p>לא נמצאו רשומות</p></div>';
            return;
        }

        records.sort((first, second) => new Date(second.date) - new Date(first.date));

        let totalExpenses = 0;
        let totalIncomes = 0;
        let tableHTML = '<div class="table-container"><table class="expense-table"><thead><tr><th>סוג</th><th>קטגוריה</th><th>תיאור</th><th>סכום</th><th>תאריך</th></tr></thead><tbody>';

        records.forEach((record) => {
            const isIncome = record._type === "income";
            if (isIncome) totalIncomes += record.amount;
            else totalExpenses += record.amount;

            const typeLabel = isIncome
                ? '<span class="text-income">הכנסה</span>'
                : '<span class="text-expense">הוצאה</span>';
            const amountClass = isIncome ? "amount-income" : "font-bold";

            tableHTML += '<tr>' +
                '<td>' + typeLabel + '</td>' +
                '<td>' + App.getCategoryBadgeHTML(record.category, record._type) + '</td>' +
                '<td>' + (record.description || "—") + '</td>' +
                '<td class="' + amountClass + '">' + App.formatCurrency(record.amount) + '</td>' +
                '<td>' + App.formatDate(record.date) + '</td></tr>';
        });

        /* Total row */
        tableHTML += '<tr class="total-row"><td colspan="3" class="total-label">סה"כ</td><td class="total-label-full">';
        if (totalExpenses > 0) tableHTML += '<span class="text-expense">הוצאות: ' + App.formatCurrency(totalExpenses) + '</span><br>';
        if (totalIncomes > 0) tableHTML += '<span class="text-income">הכנסות: ' + App.formatCurrency(totalIncomes) + '</span>';
        tableHTML += '</td><td></td></tr></tbody></table></div>';

        const tableWrapper = document.createElement("div");
        tableWrapper.innerHTML = tableHTML;
        resultsContainer.appendChild(tableWrapper.firstElementChild);
    }

    /* ========================================
       Reset All
       ======================================== */

    function resetAll() {
        activeToggles.clear();
        toggleYears.classList.remove("active-purple");
        toggleMonths.classList.remove("active-green");
        toggleDays.classList.remove("active-cyan");
        panelYears.classList.remove("visible");
        panelMonths.classList.remove("visible");
        panelDays.classList.remove("visible");

        [yearsContainer, monthsContainer].forEach((container) => {
            container.querySelectorAll("input[type='checkbox']").forEach((checkbox) => {
                checkbox.checked = false;
                App.findClosest(checkbox, ".check-item").classList.remove("checked");
            });
        });

        [expenseCategoryContainer, incomeCategoryContainer].forEach((container) => {
            container.querySelectorAll("input[type='checkbox']").forEach((checkbox) => {
                checkbox.checked = true;
                App.findClosest(checkbox, ".check-item").classList.add("checked");
            });
        });

        dateFromInput.value = "";
        dateToInput.value = "";
        minAmountInput.value = "";
        maxAmountInput.value = "";

        filterDataType = "both";
        typeSelector.querySelectorAll(".type-selector-btn").forEach((button) => button.classList.remove("active"));
        typeSelector.querySelector("[data-value='both']").classList.add("active");

        resultsContainer.innerHTML = '<div class="empty-state"><div class="empty-icon">🔍</div><p>בחרו פילטר ולחצו "החל פילטרים" כדי לראות תוצאות</p></div>';
    }

})();
