"use strict";

/* ========================================
   Reports Page — Charts + Export
   Arrow IIFE | addEventListener | Map
   jsPDF with Hebrew font for PDF export
   ======================================== */

(() => {

    let pieChart = null;
    let barChart = null;
    let chartType = "both";
    let exportType = "both";

    /* ========================================
       Type Selectors
       ======================================== */

    const chartSelector = document.getElementById("chart-type-selector");
    const exportSelector = document.getElementById("export-type-selector");

    chartSelector.addEventListener("click", (event) => {
        const button = App.findClosest(event.target, ".type-selector-btn");
        if (!button) return;
        chartSelector.querySelectorAll(".type-selector-btn").forEach((btn) => btn.classList.remove("active"));
        button.classList.add("active");
        chartType = button.getAttribute("data-value");
        renderPieChart();
        renderBarChart();
    });

    exportSelector.addEventListener("click", (event) => {
        const button = App.findClosest(event.target, ".type-selector-btn");
        if (!button) return;
        exportSelector.querySelectorAll(".type-selector-btn").forEach((btn) => btn.classList.remove("active"));
        button.classList.add("active");
        exportType = button.getAttribute("data-value");
    });

    document.getElementById("export-pdf-btn").addEventListener("click", () => exportPDF());
    document.getElementById("export-csv-btn").addEventListener("click", () => exportCSV());

    /* Initial render */
    renderPieChart();
    renderBarChart();

    /* ========================================
       Data Helper
       ======================================== */

    function getDataByType(type) {
        if (type === "expenses") return App.getExpenses().map((expense) => App.addType(expense, "expense"));
        if (type === "incomes") return App.getIncomes().map((income) => App.addType(income, "income"));
        return App.getExpenses().map((expense) => App.addType(expense, "expense"))
            .concat(App.getIncomes().map((income) => App.addType(income, "income")));
    }

    function getCategoryInfo(record) {
        return record._type === "income" ? App.getIncCategory(record.category) : App.getExpCategory(record.category);
    }

    function getCategoryColor(record) {
        return record._type === "income"
            ? (App.INCOME_COLORS.get(record.category) || "#69db7c")
            : (App.EXPENSE_COLORS.get(record.category) || "#868e96");
    }

    /* ========================================
       Pie Chart
       ======================================== */

    function renderPieChart() {
        const records = getDataByType(chartType);
        const canvas = document.getElementById("pie-chart");
        const emptyElement = document.getElementById("pie-empty");

        if (records.length === 0) {
            emptyElement.classList.remove("d-hidden");
            canvas.classList.add("d-hidden");
            if (pieChart) { pieChart.destroy(); pieChart = null; }
            return;
        }
        emptyElement.classList.add("d-hidden");
        canvas.classList.remove("d-hidden");

        const categoryTotals = new Map();
        const colorLookup = new Map();

        records.forEach((record) => {
            const category = getCategoryInfo(record);
            const key = record._type + ":" + record.category;
            const label = category ? category.icon + " " + category.label : record.category;
            categoryTotals.set(key, (categoryTotals.get(key) || 0) + record.amount);
            if (!colorLookup.has(key)) colorLookup.set(key, { label: label, color: getCategoryColor(record) });
        });

        const labels = [];
        const values = [];
        const colors = [];
        categoryTotals.forEach((total, key) => {
            const info = colorLookup.get(key);
            labels.push(info.label);
            values.push(total);
            colors.push(info.color);
        });

        if (pieChart) pieChart.destroy();
        pieChart = new Chart(canvas, {
            type: "pie",
            data: { labels, datasets: [{ data: values, backgroundColor: colors, borderColor: "#111827", borderWidth: 2 }] },
            options: {
                responsive: true, maintainAspectRatio: false,
                plugins: {
                    legend: { position: "bottom", rtl: true, labels: { color: "#e4e7f0", font: { family: "Rubik", size: 12 }, padding: 12, usePointStyle: true } },
                    tooltip: { rtl: true, callbacks: {
                        label: (context) => {
                            let totalAmount = 0;
                            context.dataset.data.forEach((value) => { totalAmount += value; });
                            const percentage = ((context.parsed / totalAmount) * 100).toFixed(1);
                            return context.label + ": ₪" + context.parsed.toLocaleString("he-IL") + " (" + percentage + "%)";
                        }
                    }}
                }
            }
        });
    }

    /* ========================================
       Bar Chart
       ======================================== */

    function renderBarChart() {
        const canvas = document.getElementById("bar-chart");
        const emptyElement = document.getElementById("bar-empty");
        const expenses = App.getExpenses();
        const incomes = App.getIncomes();

        if (chartType === "expenses" && expenses.length === 0 ||
            chartType === "incomes" && incomes.length === 0 ||
            chartType === "both" && expenses.length === 0 && incomes.length === 0) {
            emptyElement.classList.remove("d-hidden");
            canvas.classList.add("d-hidden");
            if (barChart) { barChart.destroy(); barChart = null; }
            return;
        }
        emptyElement.classList.add("d-hidden");
        canvas.classList.remove("d-hidden");

        const monthNames = ["", "ינואר", "פברואר", "מרץ", "אפריל", "מאי", "יוני", "יולי", "אוגוסט", "ספטמבר", "אוקטובר", "נובמבר", "דצמבר"];
        const allKeys = new Set();
        const expenseMonthTotals = new Map();
        const incomeMonthTotals = new Map();

        if (chartType === "expenses" || chartType === "both") {
            expenses.forEach((expense) => {
                const monthKey = App.getYearMonth(expense.date);
                allKeys.add(monthKey);
                expenseMonthTotals.set(monthKey, (expenseMonthTotals.get(monthKey) || 0) + expense.amount);
            });
        }
        if (chartType === "incomes" || chartType === "both") {
            incomes.forEach((income) => {
                const monthKey = App.getYearMonth(income.date);
                allKeys.add(monthKey);
                incomeMonthTotals.set(monthKey, (incomeMonthTotals.get(monthKey) || 0) + income.amount);
            });
        }

        const sortedKeys = App.setToArray(allKeys).sort();
        const labels = sortedKeys.map((key) => {
            const parts = key.split("-");
            return monthNames[Number(parts[1])] + " " + parts[0];
        });

        const datasets = [];
        if (chartType === "expenses" || chartType === "both") {
            datasets.push({ label: "הוצאות", data: sortedKeys.map((key) => expenseMonthTotals.get(key) || 0), backgroundColor: "rgba(255, 107, 107, 0.6)", borderColor: "#ff6b6b", borderWidth: 1, borderRadius: 6, maxBarThickness: 40 });
        }
        if (chartType === "incomes" || chartType === "both") {
            datasets.push({ label: "הכנסות", data: sortedKeys.map((key) => incomeMonthTotals.get(key) || 0), backgroundColor: "rgba(0, 212, 170, 0.6)", borderColor: "#00d4aa", borderWidth: 1, borderRadius: 6, maxBarThickness: 40 });
        }

        if (barChart) barChart.destroy();
        barChart = new Chart(canvas, {
            type: "bar",
            data: { labels, datasets },
            options: {
                responsive: true, maintainAspectRatio: false,
                scales: {
                    y: { beginAtZero: true, ticks: { color: "#6b7394", font: { family: "Rubik" }, callback: (value) => "₪" + value.toLocaleString("he-IL") }, grid: { color: "rgba(255,255,255,0.04)" } },
                    x: { ticks: { color: "#6b7394", font: { family: "Rubik", size: 11 } }, grid: { display: false } }
                },
                plugins: {
                    legend: { display: chartType === "both", rtl: true, labels: { color: "#e4e7f0", font: { family: "Rubik" } } },
                    tooltip: { rtl: true, callbacks: { label: (context) => context.dataset.label + ": ₪" + context.parsed.y.toLocaleString("he-IL") } }
                }
            }
        });
    }

    /* ========================================
       CSV Export
       ======================================== */

    function exportCSV() {
        const records = getDataByType(exportType);
        if (records.length === 0) { alert("אין נתונים לייצוא!"); return; }

        const bom = "\uFEFF";
        let csvContent = bom + '"סוג","קטגוריה","תיאור","סכום","תאריך"\n';

        records.forEach((record) => {
            const category = getCategoryInfo(record);
            const typeName = record._type === "income" ? "הכנסה" : "הוצאה";
            const categoryLabel = category ? category.label : record.category;
            const description = (record.description || "").replace(/"/g, '""');
            const dateString = App.formatDate(record.date);
            csvContent += '"' + typeName + '","' + categoryLabel + '","' + description + '",' + record.amount + ',="' + dateString + '"\n';
        });

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const downloadLink = document.createElement("a");
        downloadLink.href = URL.createObjectURL(blob);
        downloadLink.download = "finance-report.csv";
        downloadLink.click();
        URL.revokeObjectURL(downloadLink.href);
    }

    /* ========================================
       PDF Export — jsPDF with Hebrew font
       ======================================== */

    async function exportPDF() {
        const records = getDataByType(exportType);
        if (records.length === 0) { alert("אין נתונים לייצוא!"); return; }

        const titleMap = { expenses: "דו\"ח הוצאות", incomes: "דו\"ח הכנסות", both: "דו\"ח הוצאות והכנסות" };
        const pdfDocument = new jspdf.jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
        pdfDocument.setR2L(true);

        /* Load Hebrew font from Google Fonts */
        try {
            const fontUrl = "https://fonts.gstatic.com/s/rubik/v28/iJWKBXyIfDnIV7nBrXw.ttf";
            const fontResponse = await fetch(fontUrl);
            const fontBuffer = await fontResponse.arrayBuffer();
            const fontBytes = new Uint8Array(fontBuffer);
            let binaryString = "";
            for (let index = 0; index < fontBytes.length; index++) {
                binaryString += String.fromCharCode(fontBytes[index]);
            }
            const fontBase64 = btoa(binaryString);
            pdfDocument.addFileToVFS("Rubik-Regular.ttf", fontBase64);
            pdfDocument.addFont("Rubik-Regular.ttf", "Rubik", "normal");
            pdfDocument.setFont("Rubik");
        } catch (fontError) {
            console.error("Failed to load Hebrew font:", fontError);
        }

        /* Title */
        pdfDocument.setFontSize(18);
        pdfDocument.text(titleMap[exportType], 105, 20, { align: "center" });
        pdfDocument.setFontSize(10);
        pdfDocument.text("תאריך הפקה: " + App.formatDate(App.getTodayString()), 105, 28, { align: "center" });

        /* Table headers */
        const headers = ["סוג", "קטגוריה", "תיאור", "סכום", "תאריך"];
        const columnWidths = [25, 40, 45, 35, 35];
        let yPosition = 40;

        pdfDocument.setFontSize(10);
        pdfDocument.setFillColor(124, 92, 252);
        pdfDocument.rect(15, yPosition - 6, 180, 10, "F");
        pdfDocument.setTextColor(255, 255, 255);
        let xPosition = 195;
        headers.forEach((header, headerIndex) => {
            pdfDocument.text(header, xPosition - 3, yPosition, { align: "right" });
            xPosition -= columnWidths[headerIndex];
        });

        /* Table rows */
        pdfDocument.setTextColor(0, 0, 0);
        pdfDocument.setFontSize(9);
        yPosition += 10;
        let totalExpenses = 0;
        let totalIncomes = 0;

        records.forEach((record, rowIndex) => {
            if (yPosition > 270) { pdfDocument.addPage(); yPosition = 20; }
            if (rowIndex % 2 === 0) { pdfDocument.setFillColor(245, 245, 250); pdfDocument.rect(15, yPosition - 5, 180, 8, "F"); }

            const category = getCategoryInfo(record);
            const typeName = record._type === "income" ? "הכנסה" : "הוצאה";
            if (record._type === "income") totalIncomes += record.amount;
            else totalExpenses += record.amount;

            const rowData = [typeName, category ? category.label : record.category, record.description || "—", App.formatCurrency(record.amount), App.formatDate(record.date)];
            xPosition = 195;
            rowData.forEach((cellValue, cellIndex) => {
                pdfDocument.text(cellValue, xPosition - 3, yPosition, { align: "right" });
                xPosition -= columnWidths[cellIndex];
            });
            yPosition += 8;
        });

        /* Summary */
        yPosition += 6;
        pdfDocument.setFontSize(11);
        pdfDocument.setFont("Rubik", "normal");
        if (exportType === "both" || exportType === "expenses") {
            pdfDocument.text("סה\"כ הוצאות: " + App.formatCurrency(totalExpenses), 190, yPosition, { align: "right" });
            yPosition += 7;
        }
        if (exportType === "both" || exportType === "incomes") {
            pdfDocument.text("סה\"כ הכנסות: " + App.formatCurrency(totalIncomes), 190, yPosition, { align: "right" });
            yPosition += 7;
        }
        if (exportType === "both") {
            pdfDocument.text("מאזן: " + App.formatCurrency(totalIncomes - totalExpenses), 190, yPosition, { align: "right" });
        }

        /* Download */
        pdfDocument.save("finance-report.pdf");
    }

})();
