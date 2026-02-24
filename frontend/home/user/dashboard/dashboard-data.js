// Dashboard Data Management

// Sample data storage
let dashboardData = {
    transactions: [],
    categories: [],
    budgets: {},
    userPreferences: {}
};

// Initialize sample data
function initializeSampleData() {
    // Sample transactions
    dashboardData.transactions = [
        { id: 1, date: '2024-01-15', description: 'Grocery Store', category: 'food', amount: -2500, type: 'expense', icon: '🛒' },
        { id: 2, date: '2024-01-14', description: 'Monthly Salary', category: 'salary', amount: 50000, type: 'income', icon: '💵' },
        { id: 3, date: '2024-01-13', description: 'Electric Bill', category: 'utilities', amount: -1200, type: 'expense', icon: '⚡' },
        { id: 4, date: '2024-01-12', description: 'Restaurant', category: 'food', amount: -800, type: 'expense', icon: '🍽️' },
        { id: 5, date: '2024-01-11', description: 'Fuel Station', category: 'transport', amount: -2000, type: 'expense', icon: '⛽' },
        { id: 6, date: '2024-01-10', description: 'Freelance Project', category: 'freelance', amount: 15000, type: 'income', icon: '💻' },
        { id: 7, date: '2024-01-09', description: 'Movie Tickets', category: 'entertainment', amount: -600, type: 'expense', icon: '🎬' },
        { id: 8, date: '2024-01-08', description: 'Internet Bill', category: 'utilities', amount: -999, type: 'expense', icon: '🌐' }
    ];
    
    // Categories with icons and colors
    dashboardData.categories = [
        { id: 'food', name: 'Food & Dining', icon: '🍔', color: '#f5576c' },
        { id: 'transport', name: 'Transportation', icon: '🚗', color: '#4facfe' },
        { id: 'shopping', name: 'Shopping', icon: '🛍️', color: '#f093fb' },
        { id: 'utilities', name: 'Utilities', icon: '⚡', color: '#43e97b' },
        { id: 'entertainment', name: 'Entertainment', icon: '🎬', color: '#fa709a' },
        { id: 'health', name: 'Healthcare', icon: '🏥', color: '#fee140' },
        { id: 'education', name: 'Education', icon: '📚', color: '#667eea' },
        { id: 'salary', name: 'Salary', icon: '💼', color: '#43e97b' },
        { id: 'freelance', name: 'Freelance', icon: '💻', color: '#764ba2' },
        { id: 'investment', name: 'Investment', icon: '📈', color: '#4facfe' },
        { id: 'other', name: 'Other', icon: '📦', color: '#64748b' }
    ];
    
    // Budget limits
    dashboardData.budgets = {
        monthly: 50000,
        categories: {
            food: 15000,
            transport: 8000,
            shopping: 10000,
            utilities: 5000,
            entertainment: 2500
        }
    };
}

// Get all transactions
function getAllTransactions() {
    return dashboardData.transactions;
}

// Get transactions by category
function getTransactionsByCategory(categoryId) {
    return dashboardData.transactions.filter(t => t.category === categoryId);
}

// Get transactions by date range
function getTransactionsByDateRange(startDate, endDate) {
    return dashboardData.transactions.filter(t => {
        const transactionDate = new Date(t.date);
        return transactionDate >= new Date(startDate) && transactionDate <= new Date(endDate);
    });
}

// Get recent transactions (last 5)
function getRecentTransactions(limit = 5) {
    return dashboardData.transactions
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, limit);
}

// Calculate total expenses
function getTotalExpenses() {
    return dashboardData.transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);
}

// Calculate total income
function getTotalIncome() {
    return dashboardData.transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
}

// Calculate monthly expenses
function getMonthlyExpenses(month = new Date().getMonth(), year = new Date().getFullYear()) {
    return dashboardData.transactions
        .filter(t => {
            const transactionDate = new Date(t.date);
            return t.type === 'expense' && 
                   transactionDate.getMonth() === month && 
                   transactionDate.getFullYear() === year;
        })
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);
}

// Get category-wise spending
function getCategorySpending() {
    const spending = {};
    
    dashboardData.categories.forEach(category => {
        const categoryTransactions = getTransactionsByCategory(category.id);
        const total = categoryTransactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + Math.abs(t.amount), 0);
        
        if (total > 0) {
            spending[category.id] = {
                name: category.name,
                amount: total,
                icon: category.icon,
                color: category.color
            };
        }
    });
    
    return spending;
}

// Get monthly trend data
function getMonthlyTrend(months = 6) {
    const trend = [];
    const currentDate = new Date();
    
    for (let i = months - 1; i >= 0; i--) {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
        const monthName = date.toLocaleDateString('en-US', { month: 'short' });
        const expenses = getMonthlyExpenses(date.getMonth(), date.getFullYear());
        
        trend.push({
            month: monthName,
            expenses: expenses
        });
    }
    
    return trend;
}

// Add new transaction
function addTransaction(transaction) {
    const newTransaction = {
        id: Date.now(),
        date: transaction.date || new Date().toISOString().split('T')[0],
        description: transaction.description,
        category: transaction.category,
        amount: transaction.amount,
        type: transaction.type,
        icon: getCategoryIcon(transaction.category)
    };
    
    dashboardData.transactions.push(newTransaction);
    return newTransaction;
}

// Delete transaction
function deleteTransaction(transactionId) {
    const index = dashboardData.transactions.findIndex(t => t.id === transactionId);
    if (index > -1) {
        dashboardData.transactions.splice(index, 1);
        return true;
    }
    return false;
}

// Update transaction
function updateTransaction(transactionId, updates) {
    const index = dashboardData.transactions.findIndex(t => t.id === transactionId);
    if (index > -1) {
        dashboardData.transactions[index] = { ...dashboardData.transactions[index], ...updates };
        return dashboardData.transactions[index];
    }
    return null;
}

// Get category icon
function getCategoryIcon(categoryId) {
    const category = dashboardData.categories.find(c => c.id === categoryId);
    return category ? category.icon : '📦';
}

// Get category color
function getCategoryColor(categoryId) {
    const category = dashboardData.categories.find(c => c.id === categoryId);
    return category ? category.color : '#64748b';
}

// Get budget status
function getBudgetStatus() {
    const monthlyExpenses = getMonthlyExpenses();
    const monthlyBudget = dashboardData.budgets.monthly;
    const percentageUsed = (monthlyExpenses / monthlyBudget) * 100;
    
    return {
        budget: monthlyBudget,
        spent: monthlyExpenses,
        remaining: monthlyBudget - monthlyExpenses,
        percentageUsed: percentageUsed,
        isOverBudget: percentageUsed > 100
    };
}

// Get category budget status
function getCategoryBudgetStatus() {
    const status = {};
    
    Object.entries(dashboardData.budgets.categories).forEach(([categoryId, budget]) => {
        const spent = getTransactionsByCategory(categoryId)
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + Math.abs(t.amount), 0);
        
        status[categoryId] = {
            budget: budget,
            spent: spent,
            remaining: budget - spent,
            percentageUsed: (spent / budget) * 100,
            isOverBudget: spent > budget
        };
    });
    
    return status;
}

// Export data to JSON
function exportData() {
    return JSON.stringify(dashboardData, null, 2);
}

// Import data from JSON
function importData(jsonData) {
    try {
        dashboardData = JSON.parse(jsonData);
        return true;
    } catch (error) {
        console.error('Error importing data:', error);
        return false;
    }
}

// Initialize data on load
initializeSampleData();

// Export functions for use in other scripts
window.dashboardData = {
    getAllTransactions,
    getTransactionsByCategory,
    getTransactionsByDateRange,
    getRecentTransactions,
    getTotalExpenses,
    getTotalIncome,
    getMonthlyExpenses,
    getCategorySpending,
    getMonthlyTrend,
    addTransaction,
    deleteTransaction,
    updateTransaction,
    getCategoryIcon,
    getCategoryColor,
    getBudgetStatus,
    getCategoryBudgetStatus,
    exportData,
    importData
};
