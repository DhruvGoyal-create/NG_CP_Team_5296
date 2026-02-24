// Simple Login System - Clean and Clear
// ====================================

// Initialize login page
function initializeLoginPage() {
    console.log('Login page initialized');
    
    // Check if user is already logged in
    if (isUserLoggedIn()) {
        console.log('User already logged in, redirecting to dashboard...');
        redirectToDashboard();
        return;
    }
    
    setupTabSwitching();
    setupFormHandlers();
    console.log('Login page ready');
}

// Check if user is logged in
function isUserLoggedIn() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const loggedInUser = localStorage.getItem('loggedInUser');
    return isLoggedIn === 'true' && loggedInUser;
}

// Redirect to dashboard
function redirectToDashboard() {
    window.location.href = '../user/dashboard/dashboard.html';
}

// Setup tab switching between login and signup
function setupTabSwitching() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const switchTabLinks = document.querySelectorAll('.switch-tab');
    
    function switchTab(tabName) {
        // Remove active class from all tabs and contents
        tabBtns.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        
        // Add active class to selected tab and content
        const targetTabBtn = document.querySelector(`[data-tab="${tabName}"]`);
        const targetTabContent = document.getElementById(`${tabName}Tab`);
        
        if (targetTabBtn) targetTabBtn.classList.add('active');
        if (targetTabContent) targetTabContent.classList.add('active');
        
        // Clear error messages
        hideError('errorMessage');
        hideError('registerError');
    }
    
    // Tab button clicks
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            switchTab(tabName);
        });
    });
    
    // Switch tab links
    switchTabLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const tabName = this.getAttribute('data-tab');
            switchTab(tabName);
        });
    });
}

// Setup form handlers
function setupFormHandlers() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegistration);
    }
}

// Handle login form submission
function handleLogin(event) {
    event.preventDefault();
    
    const form = event.target;
    const username = form.querySelector('#email').value.trim();
    const password = form.querySelector('#password').value;
    const submitButton = form.querySelector('button[type="submit"]');

    // Validate inputs
    if (!username || !password) {
        showError('errorMessage', 'Please enter both username and password');
        return;
    }

    // Show loading state
    setButtonLoading(submitButton, 'Signing in...');

    // Process login
    setTimeout(() => {
        const user = findUser(username, password);
        
        if (user) {
            // Success - login user
            loginUser(user);
            showSuccess('errorMessage', 'Login successful! Redirecting to dashboard...');
            
            setTimeout(() => {
                redirectToDashboard();
            }, 1500);
        } else {
            // Failed
            showError('errorMessage', 'Invalid username or password');
            resetButton(submitButton, 'Sign In');
        }
    }, 1000);
}

// Handle registration form submission
function handleRegistration(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    const userData = extractUserData(formData);
    const submitButton = form.querySelector('button[type="submit"]');

    // Validate registration data
    const validation = validateRegistrationData(userData);
    if (!validation.isValid) {
        showError('registerError', validation.error);
        return;
    }

    // Show loading state
    setButtonLoading(submitButton, 'Creating account...');

    // Process registration
    setTimeout(() => {
        const result = registerUser(userData);
        
        if (result.success) {
            // Success - auto-login and redirect
            loginUser(result.user);
            showSuccess('registerError', 'Registration successful! Redirecting to dashboard...');
            
            setTimeout(() => {
                redirectToDashboard();
            }, 2000);
        } else {
            // Failed
            showError('registerError', result.error);
            resetButton(submitButton, 'Create Account');
        }
    }, 1000);
}

// Find user by credentials
function findUser(username, password) {
    const users = getUsers();
    return users.find(u => u.username === username && u.password === password);
}

// Register new user
function registerUser(userData) {
    const users = getUsers();
    
    // Check if username already exists
    if (users.find(u => u.username === userData.username)) {
        return { success: false, error: 'Username already exists' };
    }
    
    // Check if email already exists
    if (users.find(u => u.email === userData.email)) {
        return { success: false, error: 'Email already exists' };
    }
    
    // Create new user
    const newUser = {
        id: Date.now(),
        username: userData.username,
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        phone: userData.phone,
        password: userData.password,
        createdAt: new Date().toISOString()
    };
    
    // Save user
    users.push(newUser);
    saveUsers(users);
    
    return { success: true, user: newUser };
}

// Login user (set session)
function loginUser(user) {
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('loggedInUser', user.username);
    localStorage.setItem('currentUser', JSON.stringify(user));
    console.log('User logged in:', user.username);
}

// Get all users from storage
function getUsers() {
    return JSON.parse(localStorage.getItem('users') || '[]');
}

// Save users to storage
function saveUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
}

// Extract user data from form
function extractUserData(formData) {
    return {
        username: formData.get('username')?.trim(),
        firstName: formData.get('firstName')?.trim(),
        lastName: formData.get('lastName')?.trim(),
        email: formData.get('email')?.trim(),
        phone: formData.get('phone')?.trim(),
        password: formData.get('password'),
        password2: formData.get('password2')
    };
}

// Validate registration data
function validateRegistrationData(userData) {
    if (!userData.username || userData.username.length < 2) {
        return { isValid: false, error: 'Username required (min 2 characters)' };
    }
    
    if (!userData.firstName || userData.firstName.length < 2) {
        return { isValid: false, error: 'First name required (min 2 characters)' };
    }
    
    if (!userData.lastName || userData.lastName.length < 2) {
        return { isValid: false, error: 'Last name required (min 2 characters)' };
    }
    
    if (!userData.email || !isValidEmail(userData.email)) {
        return { isValid: false, error: 'Valid email required' };
    }
    
    if (!userData.password || userData.password.length < 4) {
        return { isValid: false, error: 'Password required (min 4 characters)' };
    }
    
    if (userData.password !== userData.password2) {
        return { isValid: false, error: 'Passwords do not match' };
    }
    
    return { isValid: true };
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// UI Helper Functions
// ===================

// Show error message
function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        errorElement.style.color = '#dc3545';
    }
}

// Show success message
function showSuccess(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        errorElement.style.color = '#28a745';
    }
}

// Hide error message
function hideError(elementId) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.style.display = 'none';
        errorElement.textContent = '';
    }
}

// Set button to loading state
function setButtonLoading(button, text) {
    button.disabled = true;
    button.textContent = text;
}

// Reset button to normal state
function resetButton(button, text) {
    button.disabled = false;
    button.textContent = text;
}

// Dashboard Authentication Functions
// =================================

// Check authentication for dashboard pages
function checkAuth() {
    console.log('Dashboard: Checking authentication...');
    
    if (!isUserLoggedIn()) {
        console.log('Dashboard: Not authenticated, redirecting to login');
        window.location.href = '../login/login.html';
        return false;
    }
    
    console.log('Dashboard: Authentication successful');
    return true;
}

// Logout function
function logout() {
    try {
        // Clear all auth data
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('loggedInUser');
        localStorage.removeItem('currentUser');
        localStorage.removeItem('loginTime');
        
        console.log('Logged out successfully');
        
        // Redirect to home page
        window.location.href = '../../main/home.html';
    } catch (error) {
        console.error('Logout error:', error);
        // Fallback redirect
        window.location.href = '../../main/home.html';
    }
}

// Set login time for session tracking
function setLoginTime() {
    localStorage.setItem('loginTime', new Date().toISOString());
}

// Get current user data
function getUserData() {
    const userData = localStorage.getItem('currentUser');
    return userData ? JSON.parse(userData) : null;
}

// Export functions for global access
window.checkAuth = checkAuth;
window.logout = logout;
window.setLoginTime = setLoginTime;
window.getUserData = getUserData;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    if (typeof initializeLoginPage === 'function') {
        initializeLoginPage();
    }
});
