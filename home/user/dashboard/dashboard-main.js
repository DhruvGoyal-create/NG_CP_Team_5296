// Dashboard Main JavaScript File

// Mobile menu toggle
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('active');
}

// Close sidebar when clicking outside
document.addEventListener('click', function(event) {
    const sidebar = document.getElementById('sidebar');
    const hamburger = document.getElementById('hamburger');
    const closeSidebar = document.getElementById('closeSidebar');
    
    if (!sidebar.contains(event.target) && !hamburger.contains(event.target) && sidebar.classList.contains('active')) {
        sidebar.classList.remove('active');
    }
});

// Handle window resize
window.addEventListener('resize', function() {
    const sidebar = document.getElementById('sidebar');
    if (window.innerWidth > 768) {
        sidebar.classList.remove('active');
    }
});

// Initialize dashboard with sample data
function initializeDashboard() {
    // Get current user data
    const currentUser = getCurrentUser();
    console.log('Current user:', currentUser);
    
    // Populate summary cards with real data from shared transaction manager
    let totalExpenses = 0, monthlyExpenses = 0, transactionCount = 0;
    
    if (window.transactionManager) {
        const allTransactions = window.transactionManager.getAllTransactions();
        const expenses = allTransactions.filter(t => t.type === 'expense');
        const income = allTransactions.filter(t => t.type === 'income');
        
        totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0);
        monthlyExpenses = calculateMonthlyExpenses(allTransactions);
        transactionCount = allTransactions.length;
    }
    
    document.getElementById('total-expenses').textContent = '₹' + totalExpenses.toLocaleString('en-IN');
    document.getElementById('monthly-expenses').textContent = '₹' + monthlyExpenses.toLocaleString('en-IN');
    document.getElementById('transaction-count').textContent = transactionCount;
    
    // Populate recent transactions
    populateRecentTransactions();
    
    // Initialize charts with real data
    initializeCharts();
}

// Populate recent transactions
function populateRecentTransactions() {
    const recentTransactionsList = document.getElementById('recent-transactions-list');
    let transactions = [];
    
    if (window.transactionManager) {
        transactions = window.transactionManager.getRecentTransactions(5);
    }
    
    if (transactions.length === 0) {
        recentTransactionsList.innerHTML = '<p class="no-transactions">No recent transactions</p>';
        return;
    }
    
    recentTransactionsList.innerHTML = transactions.map(transaction => `
        <div class="transaction-item">
            <div class="transaction-info">
                <div class="transaction-icon ${transaction.type}">
                    ${transaction.type === 'income' ? '💵' : '💸'}
                </div>
                <div class="transaction-details">
                    <h4>${transaction.description}</h4>
                    <p>${getCategoryName(transaction.category)} • ${transaction.date}</p>
                </div>
            </div>
            <div class="transaction-amount ${transaction.type}">
                ${transaction.type === 'income' ? '+' : '-'}₹${Math.abs(transaction.amount).toLocaleString('en-IN')}
            </div>
        </div>
    `).join('');
}

// Helper function to get category name
function getCategoryName(categoryId) {
    const categories = {
        'food': 'Food & Dining',
        'transport': 'Transportation',
        'shopping': 'Shopping',
        'utilities': 'Utilities',
        'entertainment': 'Entertainment',
        'health': 'Healthcare',
        'education': 'Education',
        'other': 'Other',
        'salary': 'Salary',
        'freelance': 'Freelance',
        'investment': 'Investment',
        'business': 'Business',
        'other-income': 'Other Income'
    };
    return categories[categoryId] || categoryId;
}

// Calculate monthly expenses
function calculateMonthlyExpenses(transactions) {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    return transactions
        .filter(t => {
            const transactionDate = new Date(t.date);
            return t.type === 'expense' && 
                   transactionDate.getMonth() === currentMonth && 
                   transactionDate.getFullYear() === currentYear;
        })
        .reduce((sum, t) => sum + t.amount, 0);
}

// Initialize charts
function initializeCharts() {
    if (!window.transactionManager) {
        console.log('Transaction manager not available, using default data');
        initializeDefaultCharts();
        return;
    }
    
    const allTransactions = window.transactionManager.getAllTransactions();
    const categorySpending = calculateCategorySpending(allTransactions);
    const monthlyTrend = calculateMonthlyTrend(allTransactions);
    
    // Prepare category chart data
    const categoryLabels = Object.keys(categorySpending);
    const categoryData = Object.values(categorySpending);
    
    // Prepare monthly trend data
    const trendLabels = monthlyTrend.map(t => t.month);
    const trendData = monthlyTrend.map(t => t.expenses);
    
    // Initialize category chart using modular system
    if (window.dashboardCharts) {
        try {
            if (categoryLabels.length > 0 && categoryData.length > 0) {
                dashboardCharts.initializeCategoryChart('categoryChart', {
                    labels: categoryLabels,
                    datasets: [{
                        data: categoryData,
                        backgroundColor: ['#f5576c', '#4facfe', '#f093fb', '#43e97b', '#fa709a', '#fee140', '#667eea', '#764ba2'],
                        borderWidth: 0
                    }]
                });
            }
            
            if (trendLabels.length > 0 && trendData.length > 0) {
                dashboardCharts.initializeMonthlyChart('monthlyChart', {
                    labels: trendLabels,
                    datasets: [{
                        label: 'Monthly Expenses',
                        data: trendData,
                        borderColor: '#667eea',
                        backgroundColor: 'rgba(102, 126, 234, 0.1)',
                        tension: 0.4,
                        fill: true,
                        pointBackgroundColor: '#667eea',
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2,
                        pointRadius: 5,
                        pointHoverRadius: 7
                    }]
                });
            }
        } catch (error) {
            console.error('Error initializing charts:', error);
            initializeDefaultCharts();
        }
    } else {
        console.log('Dashboard charts not available, using Chart.js directly');
        initializeDefaultCharts();
    }
}

// Initialize default charts with sample data
function initializeDefaultCharts() {
    try {
        if (window.Chart && window.dashboardCharts) {
            // Use default data from dashboard-charts.js
            dashboardCharts.initializeCategoryChart('categoryChart');
            dashboardCharts.initializeMonthlyChart('monthlyChart');
        }
    } catch (error) {
        console.error('Error initializing default charts:', error);
    }
}

// Calculate category spending
function calculateCategorySpending(transactions) {
    const spending = {};
    
    transactions
        .filter(t => t.type === 'expense')
        .forEach(transaction => {
            if (!spending[transaction.category]) {
                spending[transaction.category] = 0;
            }
            spending[transaction.category] += transaction.amount;
        });
    
    return spending;
}

// Calculate monthly trend
function calculateMonthlyTrend(transactions, months = 6) {
    const trend = [];
    const currentDate = new Date();
    
    for (let i = months - 1; i >= 0; i--) {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
        const monthName = date.toLocaleDateString('en-US', { month: 'short' });
        const expenses = transactions
            .filter(t => {
                const transactionDate = new Date(t.date);
                return t.type === 'expense' && 
                       transactionDate.getMonth() === date.getMonth() && 
                       transactionDate.getFullYear() === date.getFullYear();
            })
            .reduce((sum, t) => sum + t.amount, 0);
        
        trend.push({
            month: monthName,
            expenses: expenses
        });
    }
    
    return trend;
}

// Initialize dashboard on DOM content loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication first
    if (checkAuth()) {
        // Set login time for session management
        setLoginTime();
        
        // Initialize dashboard
        initializeDashboard();
        
        // Setup mobile menu toggle
        const hamburger = document.getElementById('hamburger');
        const closeSidebar = document.getElementById('closeSidebar');
        
        if (hamburger) {
            hamburger.addEventListener('click', toggleSidebar);
        }
        
        if (closeSidebar) {
            closeSidebar.addEventListener('click', function() {
                const sidebar = document.getElementById('sidebar');
                sidebar.classList.remove('active');
            });
        }
    }
});
