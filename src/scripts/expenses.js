import { budgetStorage, expenseStorage, dateUtils } from './utils.js';

// Remove the duplicate storage functions and use the imported ones instead
function renderExpenses() {
    const expenses = expenseStorage.getMonthlyExpenses(selectedMonth);
    const tbody = document.getElementById('expenses-list');
    tbody.innerHTML = '';
    let total = 0;
    
    expenses.forEach((exp, idx) => {
        total += Number(exp.amount);
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>$${Number(exp.amount).toFixed(2)}</td>
            <td>${exp.category}</td>
            <td>${exp.date}</td>
            <td>${exp.description || ''}</td>
            <td><button data-idx="${idx}" class="remove-btn">Remove</button></td>
        `;
        tbody.appendChild(tr);
    });

    updateBudgetDisplay();
}

function updateBudgetDisplay() {
    const fullBudget = budgetStorage.getBudget();
    
    // Update full budget display
    const fullBudgetElement = document.getElementById('full-budget-amount');
    if (fullBudgetElement) {
        fullBudgetElement.textContent = `$${fullBudget.toFixed(2)}`;
    }

    // Calculate total expenses for current month
    const expenses = expenseStorage.getMonthlyExpenses(selectedMonth);
    const totalExpenses = expenses.reduce((sum, expense) => 
        sum + parseFloat(expense.amount), 0);

    // Update remaining balance
    const remainingBalance = fullBudget - totalExpenses;
    const balanceElement = document.getElementById('balance-amount');
    if (balanceElement) {
        balanceElement.textContent = `$${remainingBalance.toFixed(2)}`;
        
        // Color coding for balance
        balanceElement.style.color = 
            remainingBalance < 0 ? '#dc3545' : 
            remainingBalance === 0 ? '#ffc107' : '#28a745';
    }
}

let selectedMonth = dateUtils.getCurrentMonthKey();

// Update form submission handler
document.getElementById('expense-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const amount = document.getElementById('amount').value;
    const category = document.getElementById('category').value;
    const date = document.getElementById('date').value;
    const description = document.getElementById('description').value;
    
    if (!amount || !category || !date) return;
    
    const expenses = expenseStorage.getMonthlyExpenses(selectedMonth);
    expenses.push({ amount, category, date, description });
    expenseStorage.saveExpenses(selectedMonth, expenses);
    
    renderExpenses();
    this.reset();
    document.getElementById('category').selectedIndex = 0;
});

function populateMonthDropdown() {
    const monthSelect = document.getElementById('month-select');
    if (!monthSelect) return;

    // Clear existing options
    monthSelect.innerHTML = '';

    // Get current date
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();

    // Create options for the last 12 months
    for (let i = 0; i < 12; i++) {
        const date = new Date(currentYear, currentMonth - i, 1);
        const monthKey = date.toISOString().slice(0, 7); // Format: YYYY-MM
        const monthName = date.toLocaleString('default', { 
            month: 'long', 
            year: 'numeric' 
        });

        const option = document.createElement('option');
        option.value = monthKey;
        option.textContent = monthName;
        monthSelect.appendChild(option);
    }

    // Set current month as default
    monthSelect.value = selectedMonth;
}

// Make sure this event listener is at the bottom of the file
document.addEventListener('DOMContentLoaded', () => {
    populateMonthDropdown();
    renderExpenses();
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('date').setAttribute('max', today);
});

// Add month change event listener
document.getElementById('month-select').addEventListener('change', (e) => {
    selectedMonth = e.target.value;
    renderExpenses();
});