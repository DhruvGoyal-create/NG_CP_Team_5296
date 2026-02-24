// Analytics Main JavaScript

// Initialize analytics page
function initializeAnalyticsPage() {
    setupPeriodSelector();
    loadAnalyticsData();
    setupEventListeners();
    setupRealTimeUpdates();
}

// Setup real-time update listeners
function setupRealTimeUpdates() {
    // Listen for transaction changes
    transactionManager.onTransactionEvent('transactionAdded', function(transaction) {
        console.log('New transaction added, updating analytics:', transaction);
        loadAnalyticsData();
        showNotification('New transaction added - Analytics updated!', 'success');
    });
    
    transactionManager.onTransactionEvent('transactionUpdated', function(transaction) {
        console.log('Transaction updated, refreshing analytics:', transaction);
        loadAnalyticsData();
        showNotification('Transaction updated - Analytics refreshed!', 'info');
    });
    
    transactionManager.onTransactionEvent('transactionDeleted', function(transactionId) {
        console.log('Transaction deleted, updating analytics:', transactionId);
        loadAnalyticsData();
        showNotification('Transaction deleted - Analytics updated!', 'warning');
    });
}

// Setup period selector
function setupPeriodSelector() {
    const periodButtons = document.querySelectorAll('.period-btn');
    periodButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            periodButtons.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            // Update analytics for selected period
            updateAnalyticsForPeriod(this.dataset.period);
        });
    });
}

// Load analytics data
function loadAnalyticsData() {
    updateMetrics();
    initializeCharts();
    populateInsights();
    populateTables();
}

// Update metrics
function updateMetrics() {
    const analyticsData = getAnalyticsData();
    
    document.getElementById('totalSpent').textContent = '₹' + analyticsData.totalSpent.toLocaleString('en-IN');
    document.getElementById('avgDaily').textContent = '₹' + analyticsData.avgDaily.toLocaleString('en-IN');
    document.getElementById('topCategory').textContent = analyticsData.topCategory;
    document.getElementById('transactionCount').textContent = analyticsData.transactionCount;
}

// Get analytics data (using real data)
function getAnalyticsData() {
    const transactions = transactionManager.getAllTransactions();
    const stats = transactionManager.getCategoryBreakdown();
    const monthlyData = transactionManager.getMonthlyData();
    
    // Calculate totals
    const totalExpenses = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    
    const totalIncome = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
    
    // Find top category
    let topCategory = 'Other';
    let maxAmount = 0;
    for (const [category, data] of Object.entries(stats)) {
        if (data.total > maxAmount) {
            maxAmount = data.total;
            topCategory = getCategoryName(category);
        }
    }
    
    // Generate spending trend
    const spendingTrend = [];
    for (let i = 5; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const monthStr = date.toISOString().substring(0, 7);
        
        const monthTransactions = transactions.filter(t => 
            t.date.startsWith(monthStr) && t.type === 'expense'
        );
        
        const monthTotal = monthTransactions.reduce((sum, t) => sum + Math.abs(t.amount), 0);
        
        spendingTrend.unshift({
            month: date.toLocaleDateString('en-US', { month: 'short' }),
            amount: monthTotal
        });
    }
    
    // Prepare category data for charts
    const categoryData = Object.entries(stats).map(([category, data]) => ({
        name: getCategoryName(category),
        amount: data.total,
        percentage: Math.round((data.total / totalExpenses) * 100)
    }));
    
    // Prepare payment method data
    const paymentMethods = {};
    transactions.forEach(t => {
        if (!paymentMethods[t.paymentMethod]) {
            paymentMethods[t.paymentMethod] = { count: 0, total: 0 };
        }
        paymentMethods[t.paymentMethod].count++;
        paymentMethods[t.paymentMethod].total += Math.abs(t.amount);
    });
    
    const paymentData = Object.entries(paymentMethods).map(([method, data]) => ({
        name: getPaymentMethodLabel(method),
        amount: data.total,
        count: data.count
    }));
    
    // Prepare monthly comparison data
    const comparisonData = Object.entries(monthlyData).map(([month, data]) => ({
        month: new Date(month + '-01').toLocaleDateString('en-US', { month: 'short' }),
        income: data.income,
        expenses: data.expenses,
        net: data.income - data.expenses
    }));
    
    return {
        totalSpent: totalExpenses,
        avgDaily: Math.round(totalExpenses / 30),
        topCategory: topCategory,
        transactionCount: transactions.length,
        spending: spendingTrend,
        categories: categoryData,
        paymentMethods: paymentData,
        monthlyData: comparisonData
    };
}

// Initialize charts
function initializeCharts() {
    const data = getAnalyticsData();
    
    // Spending Trend Chart
    createSpendingTrendChart(data.spending);
    
    // Category Breakdown Chart
    createCategoryChart(data.categories);
    
    // Payment Methods Chart
    createPaymentChart(data.paymentMethods);
    
    // Monthly Comparison Chart
    createMonthlyComparisonChart(data.monthlyData);
}

// Create spending trend chart
function createSpendingTrendChart(spendingData) {
    const ctx = document.getElementById('spendingTrendChart').getContext('2d');
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: spendingData.map(d => d.month),
            datasets: [{
                label: 'Monthly Spending',
                data: spendingData.map(d => d.amount),
                borderColor: '#667eea',
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '₹' + value.toLocaleString('en-IN');
                        }
                    }
                }
            }
        }
    });
}

// Create category chart
function createCategoryChart(categoryData) {
    const ctx = document.getElementById('categoryChart').getContext('2d');
    
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: categoryData.map(c => c.name),
            datasets: [{
                data: categoryData.map(c => c.amount),
                backgroundColor: [
                    '#667eea', '#764ba2', '#f093fb', '#f5576c',
                    '#4facfe', '#43e97b', '#fa709a', '#fee140'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { padding: 15 }
                }
            }
        }
    });
}

// Create payment methods chart
function createPaymentChart(paymentData) {
    const ctx = document.getElementById('paymentChart').getContext('2d');
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: paymentData.map(p => p.name),
            datasets: [{
                data: paymentData.map(p => p.amount),
                backgroundColor: [
                    '#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { padding: 15 }
                }
            }
        }
    });
}

// Create monthly comparison chart
function createMonthlyComparisonChart(monthlyData) {
    const ctx = document.getElementById('monthlyComparisonChart').getContext('2d');
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: monthlyData.map(d => new Date(d.month).toLocaleDateString('en-US', { month: 'short' })),
            datasets: [
                {
                    label: 'Income',
                    data: monthlyData.map(d => d.income),
                    backgroundColor: '#43e97b'
                },
                {
                    label: 'Expenses',
                    data: monthlyData.map(d => d.expenses),
                    backgroundColor: '#f5576c'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '₹' + value.toLocaleString('en-IN');
                        }
                    }
                }
            }
        }
    });
}

// Populate insights
function populateInsights() {
    const insights = [
        {
            icon: '🚨',
            title: 'High Spending Alert',
            description: 'Your dining expenses increased by 45% this month. Consider setting a budget for this category.',
            type: 'warning'
        },
        {
            icon: '🎉',
            title: 'Saving Opportunity',
            description: 'You saved 20% on transportation this month by using public transport more often.',
            type: 'success'
        },
        {
            icon: '📊',
            title: 'Spending Pattern',
            description: 'You tend to spend more on weekends. Plan your purchases to avoid impulse buying.',
            type: 'info'
        },
        {
            icon: '💡',
            title: 'Budget Tip',
            description: 'Based on your spending history, a monthly budget of ₹45,000 would be appropriate.',
            type: 'tip'
        }
    ];
    
    const insightsGrid = document.querySelector('.insights-grid');
    if (insightsGrid) {
        insightsGrid.innerHTML = insights.map(insight => `
            <div class="insight-card">
                <div class="insight-icon">${insight.icon}</div>
                <div class="insight-content">
                    <h4>${insight.title}</h4>
                    <p>${insight.description}</p>
                </div>
            </div>
        `).join('');
    }
}

// Populate tables
function populateTables() {
    const data = getAnalyticsData();
    
    // Category table
    populateCategoryTable(data.categories);
    
    // Monthly table
    populateMonthlyTable(data.monthlyData);
}

// Populate category table
function populateCategoryTable(categories) {
    const tbody = document.getElementById('categoryTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = categories.map(cat => `
        <tr>
            <td>${cat.name}</td>
            <td>₹${cat.amount.toLocaleString('en-IN')}</td>
            <td>${cat.percentage}%</td>
            <td>${Math.floor(Math.random() * 20) + 5}</td>
            <td>₹${Math.round(cat.amount / 10).toLocaleString('en-IN')}</td>
            <td><span class="trend ${Math.random() > 0.5 ? 'up' : 'down'}">${Math.random() > 0.5 ? '↑' : '↓'} ${Math.floor(Math.random() * 20) + 5}%</span></td>
        </tr>
    `).join('');
}

// Populate monthly table
function populateMonthlyTable(monthlyData) {
    const tbody = document.getElementById('monthlyTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = monthlyData.map(month => {
        const savingsRate = ((month.net / month.income) * 100).toFixed(1);
        const growth = month.net > 0 ? 'positive' : 'negative';
        
        return `
            <tr>
                <td>${new Date(month.month).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</td>
                <td class="income">₹${month.income.toLocaleString('en-IN')}</td>
                <td class="expense">₹${month.expenses.toLocaleString('en-IN')}</td>
                <td class="${growth}">₹${month.net.toLocaleString('en-IN')}</td>
                <td>${savingsRate}%</td>
                <td><span class="trend up">↑ ${Math.floor(Math.random() * 15) + 5}%</span></td>
            </tr>
        `;
    }).join('');
}

// Update analytics for period
function updateAnalyticsForPeriod(period) {
    console.log('Updating analytics for period:', period);
    
    // Here you would typically fetch new data based on period
    // For now, just show notification
    showNotification(`Analytics updated for ${period}`, 'info');
    
    // Reload data
    loadAnalyticsData();
}

// Setup event listeners
function setupEventListeners() {
    // Chart options
    document.querySelectorAll('.chart-option').forEach(btn => {
        btn.addEventListener('click', function() {
            const parent = this.closest('.chart-options');
            parent.querySelectorAll('.chart-option').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Update chart view
            updateChartView(this.closest('.chart-container'));
        });
    });
    
    // Date range
    const applyBtn = document.querySelector('.apply-btn');
    if (applyBtn) {
        applyBtn.addEventListener('click', applyDateRange);
    }
}

// Update chart view
function updateChartView(container) {
    console.log('Updating chart view');
    // Here you would update chart type based on selected option
}

// Apply date range
function applyDateRange() {
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    
    if (startDate && endDate) {
        showNotification(`Date range applied: ${startDate} to ${endDate}`, 'success');
        // Here you would fetch and update data for the selected date range
    }
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Initialize page on DOM load
document.addEventListener('DOMContentLoaded', function() {
    if (checkAuth()) {
        setLoginTime();
        initializeAnalyticsPage();
    }
});
