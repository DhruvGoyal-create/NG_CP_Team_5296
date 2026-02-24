// Settings Main JavaScript

// Initialize settings page
function initializeSettingsPage() {
    setupNavigation();
    setupFormHandlers();
    loadUserSettings();
    setupToggleSwitches();
}

// Setup navigation
function setupNavigation() {
    const settingsLinks = document.querySelectorAll('.settings-link');
    const settingsSections = document.querySelectorAll('.settings-section');
    
    settingsLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links and sections
            settingsLinks.forEach(l => l.classList.remove('active'));
            settingsSections.forEach(s => s.classList.remove('active'));
            
            // Add active class to clicked link and corresponding section
            this.classList.add('active');
            const sectionId = this.dataset.section + '-section';
            document.getElementById(sectionId).classList.add('active');
        });
    });
}

// Setup form handlers
function setupFormHandlers() {
    // Profile form
    const profileForm = document.querySelector('#profile-section .settings-form');
    if (profileForm) {
        profileForm.addEventListener('submit', handleProfileSubmit);
    }
    
    // Account form
    const accountForm = document.querySelector('#account-section .settings-form');
    if (accountForm) {
        accountForm.addEventListener('submit', handleAccountSubmit);
        setupPasswordStrength();
    }
    
    // Budget form
    const budgetForm = document.querySelector('#budget-section .settings-form');
    if (budgetForm) {
        budgetForm.addEventListener('submit', handleBudgetSubmit);
    }
    
    // Export buttons
    setupExportButtons();
}

// Load user settings
function loadUserSettings() {
    const userData = getUserData();
    
    if (userData) {
        // Load profile data
        loadProfileData(userData);
        
        // Load preferences
        loadPreferencesData(userData);
        
        // Load budget data
        loadBudgetData(userData);
    }
}

// Load profile data
function loadProfileData(userData) {
    const fullNameInput = document.getElementById('fullName');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const bioInput = document.getElementById('bio');
    
    if (fullNameInput) fullNameInput.value = userData.firstName + ' ' + (userData.lastName || '');
    if (emailInput) emailInput.value = userData.email || '';
    if (phoneInput) phoneInput.value = userData.phone || '';
    if (bioInput) bioInput.value = userData.bio || '';
}

// Load preferences data
function loadPreferencesData(userData) {
    const languageSelect = document.getElementById('language');
    const currencySelect = document.getElementById('currency');
    const dateFormatSelect = document.getElementById('dateFormat');
    const themeRadios = document.querySelectorAll('input[name="theme"]');
    
    if (languageSelect) languageSelect.value = userData.language || 'en';
    if (currencySelect) currencySelect.value = userData.currency || 'inr';
    if (dateFormatSelect) dateFormatSelect.value = userData.dateFormat || 'dd-mm-yyyy';
    
    if (themeRadios.length > 0) {
        const userTheme = userData.theme || 'light';
        themeRadios.forEach(radio => {
            if (radio.value === userTheme) {
                radio.checked = true;
            }
        });
    }
}

// Load budget data
function loadBudgetData(userData) {
    const monthlyBudgetInput = document.querySelector('.budget-input');
    const categoryBudgets = document.querySelectorAll('.category-budget-item input');
    
    if (monthlyBudgetInput) {
        monthlyBudgetInput.value = userData.monthlyBudget || 50000;
    }
    
    if (userData.categoryBudgets) {
        categoryBudgets.forEach(input => {
            const category = input.closest('.category-budget-item').querySelector('label').textContent.toLowerCase().replace(/[^a-z]/g, '');
            if (userData.categoryBudgets[category]) {
                input.value = userData.categoryBudgets[category];
            }
        });
    }
}

// Setup toggle switches
function setupToggleSwitches() {
    const toggleSwitches = document.querySelectorAll('.toggle-switch input');
    
    toggleSwitches.forEach(toggle => {
        toggle.addEventListener('change', function() {
            const setting = this.closest('.notification-item, .privacy-item');
            const settingName = setting.querySelector('h3').textContent;
            
            console.log(`${settingName} ${this.checked ? 'enabled' : 'disabled'}`);
            
            // Save setting
            saveToggleSetting(this.id, this.checked);
        });
    });
}

// Setup password strength indicator
function setupPasswordStrength() {
    const newPasswordInput = document.getElementById('newPassword');
    if (newPasswordInput) {
        newPasswordInput.addEventListener('input', updatePasswordStrength);
    }
}

// Update password strength
function updatePasswordStrength() {
    const password = document.getElementById('newPassword').value;
    const strengthBar = document.querySelector('.strength-fill');
    const strengthText = document.querySelector('.strength-text');
    
    if (!strengthBar || !strengthText) return;
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
    if (password.match(/[0-9]/)) strength++;
    if (password.match(/[^a-zA-Z0-9]/)) strength++;
    
    const strengthPercent = (strength / 4) * 100;
    strengthBar.style.width = strengthPercent + '%';
    
    if (strength <= 1) {
        strengthBar.style.background = '#f5576c';
        strengthText.textContent = 'Weak password';
    } else if (strength <= 2) {
        strengthBar.style.background = '#f093fb';
        strengthText.textContent = 'Fair password';
    } else if (strength <= 3) {
        strengthBar.style.background = '#4facfe';
        strengthText.textContent = 'Good password';
    } else {
        strengthBar.style.background = '#43e97b';
        strengthText.textContent = 'Strong password';
    }
}

// Handle profile form submission
function handleProfileSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const userData = getUserData() || {};
    
    // Update user data
    userData.firstName = formData.get('fullName').split(' ')[0];
    userData.lastName = formData.get('fullName').split(' ').slice(1).join(' ');
    userData.email = formData.get('email');
    userData.phone = formData.get('phone');
    userData.bio = formData.get('bio');
    
    // Save to localStorage
    localStorage.setItem('userData', JSON.stringify(userData));
    
    showNotification('Profile updated successfully!', 'success');
}

// Handle account form submission
function handleAccountSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const currentPassword = formData.get('currentPassword');
    const newPassword = formData.get('newPassword');
    const confirmPassword = formData.get('confirmPassword');
    
    // Validate passwords
    if (newPassword !== confirmPassword) {
        showNotification('Passwords do not match!', 'error');
        return;
    }
    
    if (newPassword.length < 8) {
        showNotification('Password must be at least 8 characters!', 'error');
        return;
    }
    
    // Update password (in real app, this would be sent to backend)
    const userData = getUserData() || {};
    userData.password = btoa(newPassword);
    localStorage.setItem('userData', JSON.stringify(userData));
    
    showNotification('Password updated successfully!', 'success');
    
    // Reset form
    e.target.reset();
}

// Handle budget form submission
function handleBudgetSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const userData = getUserData() || {};
    
    // Update budget data
    userData.monthlyBudget = parseFloat(formData.get('monthlyBudget'));
    
    const categoryBudgets = {};
    const categoryInputs = document.querySelectorAll('.category-budget-item input');
    categoryInputs.forEach(input => {
        const category = input.closest('.category-budget-item').querySelector('label').textContent.toLowerCase().replace(/[^a-z]/g, '');
        categoryBudgets[category] = parseFloat(input.value);
    });
    
    userData.categoryBudgets = categoryBudgets;
    
    // Save to localStorage
    localStorage.setItem('userData', JSON.stringify(userData));
    
    showNotification('Budget settings saved successfully!', 'success');
}

// Setup export buttons
function setupExportButtons() {
    const exportButtons = document.querySelectorAll('.export-formats .btn');
    
    exportButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const format = this.textContent.trim();
            handleExport(format);
        });
    });
}

// Handle export
function handleExport(format) {
    showNotification(`Exporting as ${format}...`, 'info');
    
    // In real app, this would generate and download the file
    setTimeout(() => {
        showNotification(`${format} export completed!`, 'success');
    }, 1500);
}

// Save toggle setting
function saveToggleSetting(settingId, value) {
    const userData = getUserData() || {};
    
    if (!userData.settings) {
        userData.settings = {};
    }
    
    userData.settings[settingId] = value;
    localStorage.setItem('userData', JSON.stringify(userData));
}

// Clear chat function (for assistant settings)
function clearChat() {
    if (confirm('Are you sure you want to clear all messages?')) {
        localStorage.removeItem('chatMessages');
        showNotification('Chat cleared successfully!', 'success');
    }
}

// Toggle settings modal
function toggleSettings() {
    showNotification('Assistant settings coming soon!', 'info');
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
        initializeSettingsPage();
    }
});
