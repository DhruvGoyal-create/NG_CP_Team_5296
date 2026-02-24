// All Transactions Main JavaScript

// Initialize transactions page
function initializeTransactionsPage() {
    loadTransactions();
    setupEventListeners();
    updateSummary();
    setupRealTimeUpdates();
}

// Setup real-time update listeners
function setupRealTimeUpdates() {
    // Listen for transaction changes
    transactionManager.onTransactionEvent('transactionAdded', function(transaction) {
        console.log('New transaction added, refreshing table:', transaction);
        loadTransactions();
        updateSummary();
        showNotification('New transaction added!', 'success');
    });
    
    transactionManager.onTransactionEvent('transactionUpdated', function(transaction) {
        console.log('Transaction updated, refreshing table:', transaction);
        loadTransactions();
        updateSummary();
        showNotification('Transaction updated!', 'info');
    });
    
    transactionManager.onTransactionEvent('transactionDeleted', function(transactionId) {
        console.log('Transaction deleted, refreshing table:', transactionId);
        loadTransactions();
        updateSummary();
        showNotification('Transaction deleted!', 'warning');
    });
}

// Load transactions into table
function loadTransactions() {
    const tbody = document.getElementById('transactionsTableBody');
    const transactions = transactionManager.getRecentTransactions(50); // Get all transactions
    
    tbody.innerHTML = transactions.map(transaction => `
        <tr>
            <td>${formatDate(transaction.date)}</td>
            <td>${transaction.description}</td>
            <td><span class="category-badge ${transaction.category}">${getCategoryLabel(transaction.category)}</span></td>
            <td><span class="type-badge ${transaction.type}">${transaction.type === 'income' ? '💵' : '💸'} ${transaction.type}</span></td>
            <td>${getPaymentMethodLabel(transaction.paymentMethod)}</td>
            <td class="amount ${transaction.type}">${transaction.type === 'income' ? '+' : '-'}₹${transaction.amount.toLocaleString('en-IN')}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn-icon edit-btn" onclick="editTransaction(${transaction.id})" title="Edit">✏️</button>
                    <button class="btn-icon delete-btn" onclick="deleteTransaction(${transaction.id})" title="Delete">🗑️</button>
                </div>
            </td>
        </tr>
    `).join('');
    
    updatePagination();
}

// Get filtered transactions
function getFilteredTransactions() {
    const searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || '';
    const typeFilter = document.getElementById('typeFilter')?.value || '';
    const categoryFilter = document.getElementById('categoryFilter')?.value || '';
    const dateFilter = document.getElementById('dateFilter')?.value || '';
    
    let transactions = transactionManager.getAllTransactions();
    
    // Apply filters
    if (searchTerm) {
        transactions = transactionManager.searchTransactions(searchTerm);
    }
    
    if (typeFilter) {
        transactions = transactionManager.getTransactionsByType(typeFilter);
    }
    
    if (categoryFilter) {
        transactions = transactionManager.getTransactionsByCategory(categoryFilter);
    }
    
    if (dateFilter) {
        transactions = transactionManager.getTransactionsByDateRange(dateFilter, dateFilter);
    }
    
    return transactions;
}

// Setup event listeners
function setupEventListeners() {
    // Search input
    document.getElementById('searchInput').addEventListener('input', loadTransactions);
    
    // Filter dropdowns
    document.getElementById('typeFilter').addEventListener('change', loadTransactions);
    document.getElementById('categoryFilter').addEventListener('change', loadTransactions);
    document.getElementById('dateFilter').addEventListener('change', loadTransactions);
    
    // Export button
    document.querySelector('.export-btn')?.addEventListener('click', exportTransactions);
    
    // Print button
    document.querySelector('.print-btn')?.addEventListener('click', printTransactions);
}

// Update summary cards
function updateSummary() {
    const transactions = getFilteredTransactions();
    const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const netBalance = totalIncome - totalExpenses;
    
    document.getElementById('totalIncome').textContent = '₹' + totalIncome.toLocaleString('en-IN');
    document.getElementById('totalExpenses').textContent = '₹' + totalExpenses.toLocaleString('en-IN');
    document.getElementById('netBalance').textContent = '₹' + netBalance.toLocaleString('en-IN');
    document.getElementById('transactionCount').textContent = transactions.length;
}

// Update pagination
function updatePagination() {
    const transactions = getFilteredTransactions();
    const totalPages = Math.ceil(transactions.length / itemsPerPage);
    
    document.getElementById('currentPage').textContent = currentPage;
    document.getElementById('totalPages').textContent = totalPages;
    
    // Enable/disable pagination buttons
    document.querySelector('.pagination-btn:first-child').disabled = currentPage <= 1;
    document.querySelector('.pagination-btn:last-child').disabled = currentPage >= totalPages;
}

// Pagination functions
function previousPage() {
    if (currentPage > 1) {
        currentPage--;
        loadTransactions();
    }
}

function nextPage() {
    const totalPages = Math.ceil(getFilteredTransactions().length / itemsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        loadTransactions();
    }
}

// Export transactions
function exportTransactions() {
    const transactions = getFilteredTransactions();
    const csv = convertToCSV(transactions);
    downloadCSV(csv, 'transactions.csv');
}

// Print transactions
function printTransactions() {
    window.print();
}

// Utility functions
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function getCategoryLabel(category) {
    const labels = {
        food: '🍔 Food',
        transport: '🚗 Transport',
        shopping: '🛍️ Shopping',
        utilities: '⚡ Utilities',
        entertainment: '🎬 Entertainment',
        health: '🏥 Health',
        education: '📚 Education',
        salary: '💼 Salary',
        freelance: '💻 Freelance',
        investment: '📈 Investment',
        other: '📦 Other'
    };
    return labels[category] || category;
}

function getPaymentMethodLabel(method) {
    const labels = {
        cash: '💵 Cash',
        debit: '💳 Debit',
        credit: '💳 Credit',
        upi: '📱 UPI',
        bank: '🏦 Bank',
        other: '🔄 Other'
    };
    return labels[method] || method;
}

// Edit transaction
function editTransaction(id) {
    const transaction = transactionManager.getAllTransactions().find(t => t.id === id);
    if (transaction) {
        // Show edit modal (you can implement this as needed)
        console.log('Editing transaction:', transaction);
        showNotification('Edit functionality coming soon!', 'info');
    }
}

// Delete transaction
function deleteTransaction(id) {
    if (confirm('Are you sure you want to delete this transaction?')) {
        const success = transactionManager.deleteTransaction(id);
        if (success) {
            loadTransactions(); // Reload the table
            updateSummary(); // Update summary
            showNotification('Transaction deleted successfully!', 'success');
        } else {
            showNotification('Failed to delete transaction', 'error');
        }
    }
}

function convertToCSV(data) {
    const headers = ['Date', 'Description', 'Category', 'Type', 'Payment Method', 'Amount'];
    const rows = data.map(t => [
        t.date,
        t.description,
        getCategoryLabel(t.category),
        t.type,
        getPaymentMethodLabel(t.paymentMethod),
        t.amount
    ]);
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
}

function downloadCSV(csv, filename) {
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
}

// Initialize page on DOM load
document.addEventListener('DOMContentLoaded', function() {
    if (checkAuth()) {
        setLoginTime();
        initializeTransactionsPage();
    }
});
