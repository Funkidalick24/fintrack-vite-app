import { budgetStorage } from './utils.js';

let budgetLimits = budgetStorage.getBudgetLimits();
const expenseTracker = [];

// Function to set budget limit for a category
function setBudget(category, limit) {
    budgetLimits[category] = limit;
    budgetStorage.setBudgetLimits(budgetLimits);
    updateBudgetDisplay();
}

// Function to track expenses and check against budget
function trackExpense(category, amount) {
    if (!budgetLimits[category]) {
        console.warn(`No budget set for category: ${category}`);
        return;
    }

    expenseTracker.push({ category, amount });
    checkBudget(category, amount);
}

// Function to check if the budget is exceeded
function checkBudget(category, amount) {
    const totalSpent = expenseTracker
        .filter(expense => expense.category === category)
        .reduce((total, expense) => total + expense.amount, 0);

    if (totalSpent > budgetLimits[category]) {
        alert(`Warning: You have exceeded your budget for ${category}!`);
    } else if (totalSpent >= budgetLimits[category] * 0.8) {
        alert(`Alert: You are nearing your budget limit for ${category}.`);
    }
}


function getBudgetItems() {
    return JSON.parse(localStorage.getItem('budgetItems') || '[]');
}
function saveBudgetItems(items) {
    localStorage.setItem('budgetItems', JSON.stringify(items));
}
function renderBudget() {
    const items = budgetStorage.getBudgetItems();
    const tbody = document.getElementById('budget-list');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    let balance = 0;
    
    items.forEach((item, idx) => {
        if (item.type === 'income') balance += Number(item.amount);
        else balance -= Number(item.amount);
        
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td style="text-transform:capitalize;">${item.type}</td>
            <td>${item.type === 'income' ? '+' : '-'}$${Number(item.amount).toFixed(2)}</td>
            <td>${item.description || ''}</td>
            <td><button data-idx="${idx}" class="remove-btn">Remove</button></td>
        `;
        tbody.appendChild(tr);
    });

    const balanceElem = document.getElementById('expected-balance-amount');
    if (balanceElem) {
        balanceElem.textContent = `$${balance.toFixed(2)}`;
        balanceElem.className = balance < 0 ? 'negative' : 'positive';
    }

    // Update the full budget in storage
    budgetStorage.setBudget(Math.max(0, balance));
}

// Update form event listener
const budgetForm = document.getElementById('budget-form');
if (budgetForm) {
    budgetForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const type = document.getElementById('type').value;
        const amount = document.getElementById('amount').value;
        const description = document.getElementById('description').value;
        
        if (!type || !amount) return;
        
        const items = budgetStorage.getBudgetItems();
        items.push({ type, amount, description });
        budgetStorage.saveBudgetItems(items);
        renderBudget();
        
        this.reset();
        document.getElementById('type').selectedIndex = 0;
    });
}

// Update remove button event listener
const budgetList = document.getElementById('budget-list');
if (budgetList) {
    budgetList.addEventListener('click', function(e) {
        if (e.target.classList.contains('remove-btn')) {
            const idx = e.target.getAttribute('data-idx');
            const items = budgetStorage.getBudgetItems();
            items.splice(idx, 1);
            budgetStorage.saveBudgetItems(items);
            renderBudget();
        }
    });
}

// Initialize the budget display
renderBudget();

// Add this after renderBudget() and before export
async function loadExampleBudget() {
    const res = await fetch('/json/budget.json');
    const data = await res.json();

    // Add income
    const items = [];
    if (data.income) {
        items.push({ type: 'income', amount: data.income, description: 'Example Income' });
    }
    // Add expected expenses
    if (data.expectedExpenses) {
        for (const [desc, amount] of Object.entries(data.expectedExpenses)) {
            items.push({ type: 'expense', amount, description: desc.charAt(0).toUpperCase() + desc.slice(1) });
        }
    }
    budgetStorage.saveBudgetItems(items);
    renderBudget();
}

// Attach event listener after DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('load-example-btn');
    if (btn) {
        btn.onclick = loadExampleBudget;
    }
});

let budgetChartInstance = null;

document.getElementById('showBudgetChartBtn').onclick = function() {
    // Gather budget data
    const items = budgetStorage.getBudgetItems ? budgetStorage.getBudgetItems() : JSON.parse(localStorage.getItem('budgetItems')) || [];
    const income = items.filter(i => i.type === 'income').reduce((sum, i) => sum + Number(i.amount), 0);
    const expenses = items.filter(i => i.type === 'expense');

    // Prepare data for pie chart
    const labels = expenses.map(e => e.description || 'Expense');
    const data = expenses.map(e => Number(e.amount));
    const backgroundColors = [
        '#ef4444', '#f59e42', '#fbbf24', '#10b981', '#3b82f6', '#a78bfa', '#f472b6', '#6366f1', '#facc15'
    ];

    // Add the remaining income as "Unallocated"
    const totalExpenses = data.reduce((a, b) => a + b, 0);
    if (income - totalExpenses > 0) {
        labels.push('Unallocated Income');
        data.push(income - totalExpenses);
        backgroundColors.push('#22c55e');
    }

    document.getElementById('budgetChartModal').style.display = 'flex';

    const ctx = document.getElementById('budgetPieChart').getContext('2d');
    if (budgetChartInstance) budgetChartInstance.destroy();
    budgetChartInstance = new Chart(ctx, {
        type: 'pie',
        data: {
            labels,
            datasets: [{
                data,
                backgroundColor: backgroundColors
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: true }
            }
        }
    });
};

document.getElementById('closeBudgetChartModal').onclick = function() {
    document.getElementById('budgetChartModal').style.display = 'none';
};

// Export necessary functions
export { setBudget, trackExpense };

