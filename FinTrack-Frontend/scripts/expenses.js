import { setBudget, trackExpense } from './budget.js';

// Expense page logic using localStorage

function getAllExpenses() {
    return JSON.parse(localStorage.getItem('expenses') || '{}');
}

function getMonthKeys() {
    return Object.keys(getAllExpenses()).sort().reverse();
}

function getExpenses(monthKey) {
    const all = getAllExpenses();
    return all[monthKey] || [];
}

function saveExpenses(monthKey, expenses) {
    const all = getAllExpenses();
    all[monthKey] = expenses;
    localStorage.setItem('expenses', JSON.stringify(all));
}

function getBudget() {
    return Number(localStorage.getItem('budget') || 0);
}

function getCurrentMonthKey() {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

function getEarliestMonthKey() {
    const keys = getMonthKeys();
    if (keys.length === 0) return getCurrentMonthKey();
    return keys[keys.length - 1];
}

function getMonthRange(startKey, endKey) {
    const result = [];
    let [startYear, startMonth] = startKey.split('-').map(Number);
    const [endYear, endMonth] = endKey.split('-').map(Number);

    while (startYear < endYear || (startYear === endYear && startMonth <= endMonth)) {
        result.push(`${startYear}-${String(startMonth).padStart(2, '0')}`);
        startMonth++;
        if (startMonth > 12) {
            startMonth = 1;
            startYear++;
        }
    }
    return result;
}

// Populate month dropdown
function populateMonthDropdown() {
    const select = document.getElementById('month-select');
    const keys = getMonthKeys();
    const current = getCurrentMonthKey();
    select.innerHTML = '';
    keys.forEach(key => {
        const option = document.createElement('option');
        option.value = key;
        option.textContent = new Date(key + '-01').toLocaleString('default', { month: 'long', year: 'numeric' });
        select.appendChild(option);
    });
    // Add current month if not present
    if (!keys.includes(current)) {
        const option = document.createElement('option');
        option.value = current;
        option.textContent = new Date(current + '-01').toLocaleString('default', { month: 'long', year: 'numeric' });
        select.insertBefore(option, select.firstChild);
    }
    select.value = current;
}

let selectedMonth = getCurrentMonthKey();

function renderExpenses() {
    const expenses = getExpenses(selectedMonth);
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
    // Update budget balance
    const budget = getBudget();
    const balance = budget - total;
    const balanceElem = document.getElementById('balance-amount');
    balanceElem.textContent = `$${balance.toFixed(2)}`;
    balanceElem.className = balance < 0 ? 'negative' : 'positive';
    // Update current month label
    document.getElementById('current-month').textContent =
        new Date(selectedMonth + '-01').toLocaleString('default', { month: 'long', year: 'numeric' });
}

document.getElementById('expense-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const amount = document.getElementById('amount').value;
    const category = document.getElementById('category').value;
    const date = document.getElementById('date').value;
    const description = document.getElementById('description').value;
    if (!amount || !category || !date) return;
    const expenses = getExpenses(selectedMonth);
    expenses.push({ amount, category, date, description });
    saveExpenses(selectedMonth, expenses);
    trackExpense(amount); // <-- Use the imported function
    renderExpenses();
    this.reset();
    document.getElementById('category').selectedIndex = 0;
});

document.getElementById('expenses-list').addEventListener('click', function(e) {
    if (e.target.classList.contains('remove-btn')) {
        const idx = e.target.getAttribute('data-idx');
        const expenses = getExpenses(selectedMonth);
        expenses.splice(idx, 1);
        saveExpenses(selectedMonth, expenses);
        renderExpenses();
    }
});

document.getElementById('month-select').addEventListener('change', function() {
    selectedMonth = this.value;
    renderExpenses();
});

document.addEventListener('DOMContentLoaded', function() {
    // Set max date for date input to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('date').setAttribute('max', today);
});

populateMonthDropdown();
renderExpenses();