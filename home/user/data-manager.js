// Shared Data Manager for All User Pages

// Transaction storage
let transactions = [];

// Initialize with sample data if no data exists
function initializeData() {
    const storedTransactions = localStorage.getItem('transactions');
    if (storedTransactions) {
        transactions = JSON.parse(storedTransactions);
    } else {
        // Start with empty data for new users
        transactions = [];
        saveTransactions();
        
        // Optional: Show welcome message or tutorial for new users
        if (transactions.length === 0) {
            console.log('Welcome! Start by adding your first transaction.');
        }
    }
}

// Save transactions to localStorage
function saveTransactions() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Get all transactions
function getAllTransactions() {
    return [...transactions];
}

// Add new transaction
function addTransaction(transaction) {
    const newTransaction = {
        id: Date.now(),
        date: transaction.date || new Date().toISOString().split('T')[0],
        description: transaction.description,
        category: transaction.category,
        type: transaction.type,
        amount: parseFloat(transaction.amount),
        paymentMethod: transaction.paymentMethod || 'cash'
    };
    
    transactions.unshift(newTransaction);
    saveTransactions();
    return newTransaction;
}

// Update transaction
function updateTransaction(id, updates) {
    const index = transactions.findIndex(t => t.id === id);
    if (index > -1) {
        transactions[index] = { ...transactions[index], ...updates };
        saveTransactions();
        return transactions[index];
    }
    return null;
}

// Delete transaction
function deleteTransaction(id) {
    const index = transactions.findIndex(t => t.id === id);
    if (index > -1) {
        transactions.splice(index, 1);
        saveTransactions();
        return true;
    }
    return false;
}

// Add function to load sample data (optional for demo purposes)
function loadSampleData() {
    transactions = [
        { id: 1, date: '2024-01-15', description: 'Grocery Shopping', category: 'food', type: 'expense', amount: 2500, paymentMethod: 'debit' },
        { id: 2, date: '2024-01-14', description: 'Monthly Salary', category: 'salary', type: 'income', amount: 50000, paymentMethod: 'bank' },
        { id: 3, date: '2024-01-13', description: 'Electric Bill', category: 'utilities', type: 'expense', amount: 1200, paymentMethod: 'upi' },
        { id: 4, date: '2024-01-12', description: 'Restaurant', category: 'food', type: 'expense', amount: 800, paymentMethod: 'cash' },
        { id: 5, date: '2024-01-11', description: 'Fuel Station', category: 'transport', type: 'expense', amount: 2000, paymentMethod: 'credit' },
        { id: 6, date: '2024-01-10', description: 'Freelance Project', category: 'freelance', type: 'income', amount: 15000, paymentMethod: 'bank' },
        { id: 7, date: '2024-01-09', description: 'Movie Tickets', category: 'entertainment', type: 'expense', amount: 600, paymentMethod: 'upi' },
        { id: 8, date: '2024-01-08', description: 'Internet Bill', category: 'utilities', type: 'expense', amount: 999, paymentMethod: 'debit' },
        { id: 9, date: '2024-01-07', description: 'Medical Checkup', category: 'health', type: 'expense', amount: 1500, paymentMethod: 'cash' },
        { id: 10, date: '2024-01-06', description: 'Online Course', category: 'education', type: 'expense', amount: 2000, paymentMethod: 'upi' },
        { id: 11, date: '2024-01-05', description: 'Investment Returns', category: 'investment', type: 'income', amount: 3000, paymentMethod: 'bank' },
        { id: 12, date: '2024-01-04', description: 'Shopping Mall', category: 'shopping', type: 'expense', amount: 3500, paymentMethod: 'credit' }
    ];
    saveTransactions();
}

// Get transactions by category
function getTransactionsByCategory(category) {
    return transactions.filter(t => t.category === category);
}

// Get transactions by type
function getTransactionsByType(type) {
    return transactions.filter(t => t.type === type);
}

// Get transactions by date range
function getTransactionsByDateRange(startDate, endDate) {
    return transactions.filter(t => {
        const transactionDate = new Date(t.date);
        return transactionDate >= new Date(startDate) && transactionDate <= new Date(endDate);
    });
}

// Get recent transactions
function getRecentTransactions(limit = 5) {
    return transactions
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, limit);
}

// Search transactions
function searchTransactions(query) {
    if (!query) return getAllTransactions();
    
    const searchTerm = query.toLowerCase();
    return transactions.filter(t => 
        t.description.toLowerCase().includes(searchTerm) ||
        t.category.toLowerCase().includes(searchTerm) ||
        t.paymentMethod.toLowerCase().includes(searchTerm)
    );
}

// Get transaction statistics
function getTransactionStats() {
    const income = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const expenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    
    return {
        totalTransactions: transactions.length,
        totalIncome: income,
        totalExpenses: expenses,
        netBalance: income - expenses,
        averageTransaction: transactions.length > 0 ? (income + expenses) / transactions.length : 0
    };
}

// Get category breakdown
function getCategoryBreakdown() {
    const breakdown = {};
    
    transactions.forEach(transaction => {
        if (!breakdown[transaction.category]) {
            breakdown[transaction.category] = {
                count: 0,
                total: 0,
                type: transaction.type
            };
        }
        
        breakdown[transaction.category].count++;
        breakdown[transaction.category].total += Math.abs(transaction.amount);
    });
    
    return breakdown;
}

// Get monthly data
function getMonthlyData() {
    const monthlyData = {};
    
    transactions.forEach(transaction => {
        const month = transaction.date.substring(0, 7); // YYYY-MM
        
        if (!monthlyData[month]) {
            monthlyData[month] = {
                income: 0,
                expenses: 0,
                count: 0
            };
        }
        
        if (transaction.type === 'income') {
            monthlyData[month].income += transaction.amount;
        } else {
            monthlyData[month].expenses += transaction.amount;
        }
        
        monthlyData[month].count++;
    });
    
    return monthlyData;
}

// Export to CSV
function exportToCSV(transactionList = null) {
    const dataToExport = transactionList || transactions;
    const headers = ['Date', 'Description', 'Category', 'Type', 'Payment Method', 'Amount'];
    const rows = dataToExport.map(t => [
        t.date,
        t.description,
        t.category,
        t.type,
        t.paymentMethod,
        t.amount
    ]);
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
}

// Import from CSV
function importFromCSV(csvData) {
    const lines = csvData.split('\n');
    const headers = lines[0].split(',');
    
    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',');
        if (values.length === headers.length) {
            const transaction = {
                id: Date.now() + i,
                date: values[0],
                description: values[1],
                category: values[2],
                type: values[3],
                paymentMethod: values[4],
                amount: parseFloat(values[5])
            };
            
            transactions.push(transaction);
        }
    }
    
    saveTransactions();
    return transactions.length;
}

// Clear all data
function clearAllData() {
    transactions = [];
    localStorage.removeItem('transactions');
}

// Initialize data on load
document.addEventListener('DOMContentLoaded', function() {
    initializeData();
});

// Export functions for use in other scripts
window.transactionManager = {
    getAllTransactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    getTransactionsByCategory,
    getTransactionsByType,
    getTransactionsByDateRange,
    getRecentTransactions,
    searchTransactions,
    getTransactionStats,
    getCategoryBreakdown,
    getMonthlyData,
    exportToCSV,
    importFromCSV,
    clearAllData
};
