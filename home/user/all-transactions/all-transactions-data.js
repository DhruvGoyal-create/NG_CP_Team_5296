// All Transactions Data Management

// Sample transaction data
let transactions = [
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

// Pagination variables
let currentPage = 1;
const itemsPerPage = 10;

// Get all transactions
function getAllTransactions() {
    return [...transactions];
}

// Get filtered transactions
function getFilteredTransactions() {
    const searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || '';
    const typeFilter = document.getElementById('typeFilter')?.value || '';
    const categoryFilter = document.getElementById('categoryFilter')?.value || '';
    const dateFilter = document.getElementById('dateFilter')?.value || '';
    
    let filtered = [...transactions];
    
    // Apply search filter
    if (searchTerm) {
        filtered = filtered.filter(t => 
            t.description.toLowerCase().includes(searchTerm)
        );
    }
    
    // Apply type filter
    if (typeFilter) {
        filtered = filtered.filter(t => t.type === typeFilter);
    }
    
    // Apply category filter
    if (categoryFilter) {
        filtered = filtered.filter(t => t.category === categoryFilter);
    }
    
    // Apply date filter
    if (dateFilter) {
        filtered = filtered.filter(t => t.date === dateFilter);
    }
    
    return filtered;
}

// Get paginated transactions
function getPaginatedTransactions() {
    const filtered = getFilteredTransactions();
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filtered.slice(start, end);
}

// Add new transaction
function addTransaction(transaction) {
    const newTransaction = {
        id: Date.now(),
        date: transaction.date || new Date().toISOString().split('T')[0],
        description: transaction.description,
        category: transaction.category,
        type: transaction.type,
        amount: transaction.amount,
        paymentMethod: transaction.paymentMethod
    };
    
    transactions.unshift(newTransaction);
    return newTransaction;
}

// Update transaction
function updateTransaction(id, updates) {
    const index = transactions.findIndex(t => t.id === id);
    if (index > -1) {
        transactions[index] = { ...transactions[index], ...updates };
        return transactions[index];
    }
    return null;
}

// Delete transaction
function deleteTransaction(id) {
    const index = transactions.findIndex(t => t.id === id);
    if (index > -1) {
        transactions.splice(index, 1);
        return true;
    }
    return false;
}

// Get transaction summary
function getTransactionSummary() {
    const filtered = getFilteredTransactions();
    const income = filtered.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const expenses = filtered.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    
    return {
        totalIncome: income,
        totalExpenses: expenses,
        netBalance: income - expenses,
        transactionCount: filtered.length
    };
}

// Get category breakdown
function getCategoryBreakdown() {
    const filtered = getFilteredTransactions();
    const breakdown = {};
    
    filtered.forEach(transaction => {
        if (!breakdown[transaction.category]) {
            breakdown[transaction.category] = {
                count: 0,
                total: 0,
                type: transaction.type
            };
        }
        
        breakdown[transaction.category].count++;
        breakdown[transaction.category].total += transaction.amount;
    });
    
    return breakdown;
}

// Get payment method breakdown
function getPaymentMethodBreakdown() {
    const filtered = getFilteredTransactions();
    const breakdown = {};
    
    filtered.forEach(transaction => {
        if (!breakdown[transaction.paymentMethod]) {
            breakdown[transaction.paymentMethod] = {
                count: 0,
                total: 0
            };
        }
        
        breakdown[transaction.paymentMethod].count++;
        breakdown[transaction.paymentMethod].total += transaction.amount;
    });
    
    return breakdown;
}

// Export transactions to CSV
function exportToCSV() {
    const filtered = getFilteredTransactions();
    const headers = ['Date', 'Description', 'Category', 'Type', 'Payment Method', 'Amount'];
    const rows = filtered.map(t => [
        t.date,
        t.description,
        t.category,
        t.type,
        t.paymentMethod,
        t.amount
    ]);
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
}

// Import transactions from CSV
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
    
    return transactions.length;
}

// Get monthly statistics
function getMonthlyStatistics() {
    const filtered = getFilteredTransactions();
    const monthlyData = {};
    
    filtered.forEach(transaction => {
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

// Export functions for use in other scripts
window.transactionsData = {
    getAllTransactions,
    getFilteredTransactions,
    getPaginatedTransactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    getTransactionSummary,
    getCategoryBreakdown,
    getPaymentMethodBreakdown,
    exportToCSV,
    importFromCSV,
    getMonthlyStatistics
};
