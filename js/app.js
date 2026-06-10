"use strict";

/* ========================================
   Expense & Income Manager — Shared Logic
   Arrow IIFE | Map | Set
   ======================================== */

const App = (() => {

    /* --- Expense Categories --- */
    const EXPENSE_CATEGORIES = [
        { value: "food", label: "מזון", icon: "🍔", cssClass: "cat-food" },
        { value: "vehicle", label: "רכב/דלק/ביטוח", icon: "🚗", cssClass: "cat-vehicle" },
        { value: "leisure", label: "פנאי", icon: "🎭", cssClass: "cat-leisure" },
        { value: "gov", label: "רשויות", icon: "🏛️", cssClass: "cat-gov" },
        { value: "housing", label: "שכירות/משכנתה/ביטוח", icon: "🏠", cssClass: "cat-housing" },
        { value: "education", label: "חינוך", icon: "📚", cssClass: "cat-education" },
        { value: "loans", label: "הלוואות", icon: "💳", cssClass: "cat-loans" },
        { value: "invest-exp", label: "מניות/אופציות/נכסים", icon: "📈", cssClass: "cat-invest" },
        { value: "salaries", label: "משכורות", icon: "👥", cssClass: "cat-salaries" },
        { value: "accountant", label: 'רו"ח', icon: "🧮", cssClass: "cat-accountant" },
        { value: "materials", label: "חומר גלם", icon: "📦", cssClass: "cat-materials" },
        { value: "telecom", label: "תקשורת", icon: "📡", cssClass: "cat-telecom" },
        { value: "marketing", label: "שיווק ופרסום", icon: "📣", cssClass: "cat-marketing" },
        { value: "shipping", label: "משלוחים", icon: "🚚", cssClass: "cat-shipping" },
        { value: "fees", label: "עמלות סליקה ובנקים", icon: "🏧", cssClass: "cat-fees" },
        { value: "other-exp", label: "אחר", icon: "📌", cssClass: "cat-other" }
    ];

    /* --- Income Categories --- */
    const INCOME_CATEGORIES = [
        { value: "salary", label: "שכר/עסק", icon: "💼", cssClass: "cat-salary" },
        { value: "invest-inc", label: "מניות/אופציות/נכסים", icon: "📈", cssClass: "cat-invest-inc" },
        { value: "rental", label: "שכירות", icon: "🏘️", cssClass: "cat-rental" },
        { value: "allowance", label: "קצבאות/החזרי מס", icon: "🏦", cssClass: "cat-allowance" },
        { value: "keren", label: "קרן השתלמות", icon: "🎓", cssClass: "cat-keren" },
        { value: "interest", label: "ריביות והלוואות", icon: "💰", cssClass: "cat-interest" },
        { value: "family", label: "משפחה/אירועים", icon: "👨‍👩‍👧‍👦", cssClass: "cat-family" },
        { value: "other-inc", label: "אחר", icon: "📌", cssClass: "cat-other-inc" }
    ];

    /* --- Category Maps — O(1) lookup --- */
    const expenseCategoryMap = new Map();
    EXPENSE_CATEGORIES.forEach((category) => expenseCategoryMap.set(category.value, category));

    const incomeCategoryMap = new Map();
    INCOME_CATEGORIES.forEach((category) => incomeCategoryMap.set(category.value, category));

    /* --- Chart Colors --- */
    const EXPENSE_COLORS = new Map([
        ["food", "#ff6b6b"], ["vehicle", "#ffa94d"], ["leisure", "#cc5de8"],
        ["gov", "#339af0"], ["housing", "#20c997"], ["education", "#748ffc"],
        ["loans", "#f06595"], ["invest-exp", "#51cf66"], ["salaries", "#da77f2"],
        ["accountant", "#e599f7"], ["materials", "#fcc419"], ["telecom", "#63e6be"],
        ["marketing", "#ff8787"], ["shipping", "#74c0fc"], ["fees", "#adb5bd"],
        ["other-exp", "#868e96"]
    ]);

    const INCOME_COLORS = new Map([
        ["salary", "#69db7c"], ["invest-inc", "#38d9a9"], ["rental", "#66d9e8"],
        ["allowance", "#91a7ff"], ["keren", "#e599f7"], ["interest", "#ffd43b"],
        ["family", "#ff922b"], ["other-inc", "#adb5bd"]
    ]);

    /* ========================================
       LOCAL STORAGE — Expenses CRUD
       ======================================== */

    const getExpenses = () => {
        try {
            const data = localStorage.getItem("expenses");
            return data ? JSON.parse(data) : [];
        } catch (error) { return []; }
    };

    const saveExpenses = (expenseArray) => {
        try { localStorage.setItem("expenses", JSON.stringify(expenseArray)); }
        catch (error) { console.error(error); }
    };

    const addExpense = (expense) => {
        const expenseArray = getExpenses();
        expense.id = Date.now();
        expenseArray.push(expense);
        saveExpenses(expenseArray);
        return expense;
    };

    const updateExpense = (id, updatedData) => {
        const expenseArray = getExpenses();
        const expense = expenseArray.find((item) => item.id === id);
        if (expense) {
            expense.category = updatedData.category;
            expense.description = updatedData.description;
            expense.amount = updatedData.amount;
            expense.date = updatedData.date;
        }
        saveExpenses(expenseArray);
    };

    const deleteExpense = (id) => {
        saveExpenses(getExpenses().filter((expense) => expense.id !== id));
    };

    const getExpenseById = (id) => getExpenses().find((expense) => expense.id === id);

    /* ========================================
       LOCAL STORAGE — Incomes CRUD
       ======================================== */

    const getIncomes = () => {
        try {
            const data = localStorage.getItem("incomes");
            return data ? JSON.parse(data) : [];
        } catch (error) { return []; }
    };

    const saveIncomes = (incomeArray) => {
        try { localStorage.setItem("incomes", JSON.stringify(incomeArray)); }
        catch (error) { console.error(error); }
    };

    const addIncome = (income) => {
        const incomeArray = getIncomes();
        income.id = Date.now();
        incomeArray.push(income);
        saveIncomes(incomeArray);
        return income;
    };

    const updateIncome = (id, updatedData) => {
        const incomeArray = getIncomes();
        const income = incomeArray.find((item) => item.id === id);
        if (income) {
            income.category = updatedData.category;
            income.description = updatedData.description;
            income.amount = updatedData.amount;
            income.date = updatedData.date;
        }
        saveIncomes(incomeArray);
    };

    const deleteIncome = (id) => {
        saveIncomes(getIncomes().filter((income) => income.id !== id));
    };

    const getIncomeById = (id) => getIncomes().find((income) => income.id === id);

    /* ========================================
       Utility Functions
       ======================================== */

    const getExpCategory = (value) => expenseCategoryMap.get(value);
    const getIncCategory = (value) => incomeCategoryMap.get(value);

    const formatCurrency = (amount) => {
        return "₪ " + Number(amount).toLocaleString("he-IL", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    };

    const formatDate = (dateString) => {
        const parts = dateString.split("-");
        return parts[2] + "/" + parts[1] + "/" + parts[0];
    };

    const getTodayString = () => {
        const today = new Date();
        const month = today.getMonth() + 1;
        const day = today.getDate();
        return today.getFullYear() + "-" +
            (month < 10 ? "0" + month : "" + month) + "-" +
            (day < 10 ? "0" + day : "" + day);
    };

    const getCategoryBadgeHTML = (categoryValue, recordType) => {
        const category = recordType === "income"
            ? incomeCategoryMap.get(categoryValue)
            : expenseCategoryMap.get(categoryValue);
        if (!category) return categoryValue;
        return '<span class="category-badge ' + category.cssClass + '">' +
            category.icon + ' ' + category.label + '</span>';
    };

    /* --- Helper: Add type property to item (without spread operator) --- */
    const addType = (item, recordType) => {
        return {
            id: item.id,
            category: item.category,
            description: item.description,
            amount: item.amount,
            date: item.date,
            _type: recordType
        };
    };

    /* --- Helper: Convert Set to Array (without spread) --- */
    const setToArray = (sourceSet) => {
        const result = [];
        sourceSet.forEach((value) => { result.push(value); });
        return result;
    };

    /* --- Helper: Pad number with zero (without padStart) --- */
    const padZero = (number) => {
        return Number(number) < 10 ? "0" + number : "" + number;
    };

    /* --- Helper: Get year-month key from date string (without substring) --- */
    const getYearMonth = (dateString) => {
        const parts = dateString.split("-");
        return parts[0] + "-" + parts[1];
    };

    /* --- Helper: Find closest ancestor matching selector (without closest) --- */
    const findClosest = (element, selector) => {
        let current = element;
        while (current && current !== document) {
            if (current.matches(selector)) {
                return current;
            }
            current = current.parentElement;
        }
        return null;
    };

    /* ========================================
       Navigation — Active Link Highlighting
       ======================================== */

    document.addEventListener("DOMContentLoaded", () => {
        let currentPage = window.location.pathname.split("/").pop();
        if (!currentPage || currentPage === "") currentPage = "index.html";
        document.querySelectorAll(".navbar .nav-link").forEach((link) => {
            if (link.getAttribute("href") === currentPage) link.classList.add("active");
            else link.classList.remove("active");
        });
    });

    /* ========================================
       Public API
       ======================================== */

    return {
        EXPENSE_CATEGORIES, INCOME_CATEGORIES,
        EXPENSE_COLORS, INCOME_COLORS,
        getExpenses, saveExpenses, addExpense, updateExpense, deleteExpense, getExpenseById,
        getIncomes, saveIncomes, addIncome, updateIncome, deleteIncome, getIncomeById,
        getExpCategory, getIncCategory,
        formatCurrency, formatDate, getTodayString, getCategoryBadgeHTML,
        addType, setToArray, padZero, getYearMonth, findClosest
    };

})();
