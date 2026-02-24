// Dashboard Charts Configuration and Management

// Chart instances storage
let charts = {
    category: null,
    monthly: null
};

// Chart color palette
const chartColors = {
    primary: '#667eea',
    secondary: '#764ba2',
    accent1: '#f093fb',
    accent2: '#f5576c',
    accent3: '#4facfe',
    accent4: '#43e97b',
    accent5: '#fa709a',
    accent6: '#fee140'
};

// Default chart options
const defaultChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'bottom',
            labels: {
                color: '#333',
                padding: 15,
                font: {
                    size: 12
                }
            }
        }
    }
};

// Initialize category distribution chart
function initializeCategoryChart(canvasId, data = null) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    
    const defaultData = {
        labels: ['Food & Dining', 'Transportation', 'Shopping', 'Utilities', 'Entertainment', 'Others'],
        datasets: [{
            data: [8500, 4500, 3200, 2800, 2100, 1500],
            backgroundColor: [
                chartColors.primary,
                chartColors.secondary,
                chartColors.accent1,
                chartColors.accent2,
                chartColors.accent3,
                chartColors.accent4
            ],
            borderWidth: 0
        }]
    };
    
    charts.category = new Chart(ctx, {
        type: 'doughnut',
        data: data || defaultData,
        options: {
            ...defaultChartOptions,
            plugins: {
                ...defaultChartOptions.plugins,
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.parsed || 0;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((value / total) * 100).toFixed(1);
                            return `${label}: ₹${value.toLocaleString('en-IN')} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
    
    return charts.category;
}

// Initialize monthly trend chart
function initializeMonthlyChart(canvasId, data = null) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    
    const defaultData = {
        labels: ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'],
        datasets: [{
            label: 'Monthly Expenses',
            data: [35000, 42000, 38000, 45000, 41000, 45000],
            borderColor: chartColors.primary,
            backgroundColor: 'rgba(102, 126, 234, 0.1)',
            tension: 0.4,
            fill: true,
            pointBackgroundColor: chartColors.primary,
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointRadius: 5,
            pointHoverRadius: 7
        }]
    };
    
    charts.monthly = new Chart(ctx, {
        type: 'line',
        data: data || defaultData,
        options: {
            ...defaultChartOptions,
            plugins: {
                ...defaultChartOptions.plugins,
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: ₹${context.parsed.y.toLocaleString('en-IN')}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    },
                    ticks: {
                        color: '#333',
                        callback: function(value) {
                            return '₹' + value.toLocaleString('en-IN');
                        }
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    },
                    ticks: {
                        color: '#333'
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            }
        }
    });
    
    return charts.monthly;
}

// Update chart data
function updateChartData(chartType, newData) {
    if (charts[chartType]) {
        charts[chartType].data = newData;
        charts[chartType].update();
    }
}

// Update chart type (e.g., change from doughnut to pie)
function updateChartType(canvasId, newType) {
    const chart = charts.category || charts.monthly;
    if (chart) {
        chart.config.type = newType;
        chart.update();
    }
}

// Destroy all charts
function destroyAllCharts() {
    Object.values(charts).forEach(chart => {
        if (chart) {
            chart.destroy();
        }
    });
    charts = { category: null, monthly: null };
}

// Export chart as image
function exportChartAsImage(chartType, filename = 'chart.png') {
    const chart = charts[chartType];
    if (chart) {
        const url = chart.toBase64Image();
        const link = document.createElement('a');
        link.download = filename;
        link.href = url;
        link.click();
    }
}

// Responsive chart handling
function handleChartResize() {
    Object.values(charts).forEach(chart => {
        if (chart) {
            chart.resize();
        }
    });
}

// Add resize listener
window.addEventListener('resize', handleChartResize);

// Export functions for use in other scripts
window.dashboardCharts = {
    initializeCategoryChart,
    initializeMonthlyChart,
    updateChartData,
    updateChartType,
    destroyAllCharts,
    exportChartAsImage,
    chartColors
};
