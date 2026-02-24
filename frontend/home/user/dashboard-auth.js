// Dashboard Authentication - Simple Logout
// This file handles dashboard authentication and logout

// Check authentication on page load
function checkAuth() {
    console.log('Dashboard: Checking authentication...');
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const user = localStorage.getItem('loggedInUser');
    
    console.log('Dashboard: isLoggedIn =', isLoggedIn);
    console.log('Dashboard: user =', user);

    if (isLoggedIn !== 'true' || !user) {
        console.log('Dashboard: Not authenticated, redirecting to login');
        // Redirect to login if not authenticated
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
        
        // Show logout success message
        console.log('Logged out successfully');
        
        // Redirect to landing page (home.html)
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

// Initialize dashboard authentication
document.addEventListener('DOMContentLoaded', function() {
    console.log('Dashboard authentication loaded');
    
    // Check authentication
    checkAuth();
    
    // Set login time
    setLoginTime();
    
    // Add logout event listeners to all logout buttons
    const logoutButtons = document.querySelectorAll('[onclick*="logout"]');
    logoutButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            logout();
        });
    });
});

// Export functions for global access
window.checkAuth = checkAuth;
window.logout = logout;
window.setLoginTime = setLoginTime;
window.getUserData = getUserData;
