// Add Transaction Main JavaScript

// Initialize add transaction page
function initializeAddTransactionPage() {
    setupFormValidation();
    setupEventListeners();
    loadRecentTransactions();
    setupCategoryIcons();
    
    // Set today's date and prevent future dates
    setTodaysDate();
}

// Set today's date as default and prevent future dates
function setTodaysDate() {
    const dateInput = document.getElementById('date');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.value = today;
        dateInput.max = today; // Prevent future dates
    }
}

// Setup form validation
function setupFormValidation() {
    const form = document.getElementById('transactionForm');
    const inputs = form.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            clearFieldError(this);
        });
    });
}

// Validate individual field
function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    switch(field.id) {
        case 'description':
            if (!value) {
                isValid = false;
                errorMessage = 'Description is required';
            } else if (value.length < 3) {
                isValid = false;
                errorMessage = 'Description must be at least 3 characters';
            }
            break;
            
        case 'amount':
            if (!value) {
                isValid = false;
                errorMessage = 'Amount is required';
            } else if (isNaN(value) || parseFloat(value) <= 0) {
                isValid = false;
                errorMessage = 'Amount must be a positive number';
            }
            break;
            
        case 'date':
            if (!value) {
                isValid = false;
                errorMessage = 'Date is required';
            } else {
                const selectedDate = new Date(value);
                const today = new Date();
                today.setHours(23, 59, 59, 999); // End of today
                if (selectedDate > today) {
                    isValid = false;
                    errorMessage = 'Date cannot be in the future. Only today or past dates allowed.';
                }
            }
            break;
            
        case 'category':
            if (!value) {
                isValid = false;
                errorMessage = 'Category is required';
            }
            break;
    }
    
    if (!isValid) {
        showFieldError(field, errorMessage);
    }
    
    return isValid;
}

// Show field error
function showFieldError(field, message) {
    clearFieldError(field);
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    
    field.parentNode.appendChild(errorDiv);
    field.classList.add('error');
}

// Clear field error
function clearFieldError(field) {
    const errorDiv = field.parentNode.querySelector('.field-error');
    if (errorDiv) {
        errorDiv.remove();
    }
    field.classList.remove('error');
}

// Setup event listeners
function setupEventListeners() {
    const form = document.getElementById('transactionForm');
    
    // Form submission
    form.addEventListener('submit', handleFormSubmit);
    
    // Transaction type toggle
    const typeRadios = document.querySelectorAll('input[name="transactionType"]');
    typeRadios.forEach(radio => {
        radio.addEventListener('change', updateTransactionTypeUI);
    });
    
    // Clear button
    const clearBtn = document.querySelector('.btn-secondary');
    if (clearBtn) {
        clearBtn.addEventListener('click', resetForm);
    }
    
    // Amount input formatting
    const amountInput = document.getElementById('amount');
    if (amountInput) {
        amountInput.addEventListener('input', formatAmountInput);
    }
}

// Handle form submission
function handleFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    
    // Validate all required fields
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    if (!isValid) {
        showNotification('Please fix the errors before submitting', 'error');
        return;
    }
    
    // Create transaction object
    const transaction = {
        description: formData.get('description'),
        amount: parseFloat(formData.get('amount')),
        category: formData.get('category'),
        type: formData.get('transactionType'),
        date: formData.get('date'),
        paymentMethod: formData.get('paymentMethod'),
        notes: formData.get('notes')
    };
    
    // Add transaction
    addNewTransaction(transaction);
    
    // Show success message
    showNotification('Transaction added successfully!', 'success');
    
    // Reset form
    resetForm();
    
    // Update recent transactions preview
    loadRecentTransactions();
}

// Add new transaction
function addNewTransaction(transaction) {
    // Add transaction using shared data manager
    transactionManager.addTransaction(transaction);
    
    // Show success message
    showNotification('Transaction added successfully!', 'success');
    
    // Reset form
    resetForm();
    
    // Update recent transactions preview
    loadRecentTransactions();
}

// Reset form
function resetForm() {
    const form = document.getElementById('transactionForm');
    form.reset();
    
    // Clear all field errors
    const errorFields = form.querySelectorAll('.error');
    errorFields.forEach(field => {
        field.classList.remove('error');
        const errorDiv = field.parentNode.querySelector('.field-error');
        if (errorDiv) {
            errorDiv.remove();
        }
    });
    
    // Reset to default transaction type
    updateTransactionTypeUI();
}

// Update UI based on transaction type
function updateTransactionTypeUI() {
    const typeRadios = document.querySelectorAll('input[name="transactionType"]');
    const selectedType = document.querySelector('input[name="transactionType"]:checked').value;
    
    // Update category options based on type
    const categorySelect = document.getElementById('category');
    if (categorySelect) {
        updateCategoryOptions(selectedType);
    }
    
    // Update form styling
    const form = document.getElementById('transactionForm');
    form.className = `transaction-form ${selectedType}-form`;
}

// Update category options based on transaction type
function updateCategoryOptions(type) {
    const categorySelect = document.getElementById('category');
    
    const expenseCategories = [
        { value: 'food', label: '🍔 Food & Dining' },
        { value: 'transport', label: '🚗 Transportation' },
        { value: 'shopping', label: '🛍️ Shopping' },
        { value: 'utilities', label: '⚡ Utilities' },
        { value: 'entertainment', label: '🎬 Entertainment' },
        { value: 'health', label: '🏥 Healthcare' },
        { value: 'education', label: '📚 Education' },
        { value: 'other', label: '📦 Other' }
    ];
    
    const incomeCategories = [
        { value: 'salary', label: '💼 Salary' },
        { value: 'freelance', label: '💻 Freelance' },
        { value: 'investment', label: '📈 Investment' },
        { value: 'other', label: '📦 Other' }
    ];
    
    const categories = type === 'expense' ? expenseCategories : incomeCategories;
    
    categorySelect.innerHTML = categories.map(cat => 
        `<option value="${cat.value}">${cat.label}</option>`
    ).join('');
}

// Format amount input
function formatAmountInput(e) {
    let value = e.target.value.replace(/[^\d.]/g, '');
    
    // Ensure only one decimal point
    const parts = value.split('.');
    if (parts.length > 2) {
        value = parts[0] + '.' + parts[1];
    }
    
    // Limit decimal places to 2
    if (parts[1] && parts[1].length > 2) {
        value = parts[0] + '.' + parts[1].substring(0, 2);
    }
    
    e.target.value = value;
}

// Load recent transactions for preview
function loadRecentTransactions() {
    const previewContainer = document.getElementById('recentTransactionsList');
    if (!previewContainer) return;
    
    const transactions = transactionManager.getRecentTransactions(3);
    
    if (transactions.length === 0) {
        previewContainer.innerHTML = '<p class="no-transactions">No recent transactions</p>';
        return;
    }
    
    previewContainer.innerHTML = transactions.map(t => `
        <div class="transaction-item">
            <div class="transaction-info">
                <div class="transaction-icon ${t.type}">
                    ${t.type === 'income' ? '💵' : '💸'}
                </div>
                <div class="transaction-details">
                    <h4>${t.description}</h4>
                    <p>${t.category} • ${t.date}</p>
                </div>
            </div>
            <div class="transaction-amount ${t.type}">
                ${t.type === 'income' ? '+' : '-'}₹${t.amount.toLocaleString('en-IN')}
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

// Setup category icons
function setupCategoryIcons() {
    const categorySelect = document.getElementById('category');
    if (categorySelect) {
        updateCategoryOptions('expense');
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
        initializeAddTransactionPage();
    }
});
