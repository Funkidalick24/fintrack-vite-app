export const storageKeys = {
    BUDGET: 'fullBudget',
    EXPENSES: 'expenses',
    BUDGET_ITEMS: 'budgetItems',
    BUDGET_LIMITS: 'budgetLimits'
};

export const budgetStorage = {
    getBudget() {
        return parseFloat(localStorage.getItem(storageKeys.BUDGET)) || 0;
    },
    
    setBudget(amount) {
        localStorage.setItem(storageKeys.BUDGET, amount.toString());
    },

    getBudgetItems() {
        return JSON.parse(localStorage.getItem(storageKeys.BUDGET_ITEMS) || '[]');
    },

    saveBudgetItems(items) {
        localStorage.setItem(storageKeys.BUDGET_ITEMS, JSON.stringify(items));
    },

    getBudgetLimits() {
        return JSON.parse(localStorage.getItem(storageKeys.BUDGET_LIMITS) || '{}');
    },

    setBudgetLimits(limits) {
        localStorage.setItem(storageKeys.BUDGET_LIMITS, JSON.stringify(limits));
    }
};

export const expenseStorage = {
    getAllExpenses() {
        return JSON.parse(localStorage.getItem(storageKeys.EXPENSES) || '{}');
    },
    
    saveExpenses(monthKey, expenses) {
        const all = this.getAllExpenses();
        all[monthKey] = expenses;
        localStorage.setItem(storageKeys.EXPENSES, JSON.stringify(all));
    },
    
    getMonthlyExpenses(monthKey) {
        const all = this.getAllExpenses();
        return all[monthKey] || [];
    }
};

export const dateUtils = {
    getCurrentMonthKey() {
        const now = new Date();
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    }
};