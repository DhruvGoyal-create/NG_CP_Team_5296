// Authentication System for Smart Spend

// Check if user is logged in
function checkAuth() {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const loggedInUser = localStorage.getItem("loggedInUser");
    
    if (isLoggedIn !== "true" || !loggedInUser) {
        // Redirect to login page if not logged in
        window.location.href = "../login/login.html";
        return false;
    }
    
    // Update user info on page if elements exist
    updateUserInfo();
    return true;
}

// Update user information on the page
function updateUserInfo() {
    const userData = getUserData();
    const userNameElement = document.getElementById("userName");
    const userEmailElement = document.getElementById("userEmail");
    const userAvatarElement = document.getElementById("userAvatar");
    
    if (userData) {
        if (userNameElement) {
            userNameElement.textContent = userData.firstName || userData.username || 'User';
        }
        if (userEmailElement) {
            userEmailElement.textContent = userData.email || 'user@example.com';
        }
        if (userAvatarElement && userData.avatar) {
            userAvatarElement.src = userData.avatar;
        }
    }
}

// Get user data from localStorage
function getUserData() {
    const userData = localStorage.getItem("userData");
    return userData ? JSON.parse(userData) : null;
}

// Logout function
function logout() {
    // Clear authentication data
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("userData");
    
    // Redirect to login page
    window.location.href = "../login/login.html";
}

// Check if user has specific role
function hasRole(role) {
    const userData = getUserData();
    return userData && userData.role === role;
}

// Check if user is admin
function isAdmin() {
    return hasRole('admin');
}

// Get current user
function getCurrentUser() {
    const loggedInUser = localStorage.getItem("loggedInUser");
    const userData = getUserData();
    
    return {
        username: loggedInUser,
        ...userData
    };
}

// Update user data
function updateUserData(userData) {
    localStorage.setItem("userData", JSON.stringify(userData));
    updateUserInfo();
}

// Session timeout check (optional)
function checkSessionTimeout() {
    const loginTime = localStorage.getItem("loginTime");
    const sessionDuration = 30 * 60 * 1000; // 30 minutes
    
    if (loginTime && Date.now() - parseInt(loginTime) > sessionDuration) {
        logout();
        return false;
    }
    
    return true;
}

// Set login time
function setLoginTime() {
    localStorage.setItem("loginTime", Date.now().toString());
}

// Auto-logout on page visibility change (optional security feature)
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        // Page is hidden, could set a flag or check session
    } else {
        // Page is visible again, check session
        checkSessionTimeout();
    }
});

// Export functions for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        checkAuth,
        getUserData,
        logout,
        hasRole,
        isAdmin,
        getCurrentUser,
        updateUserData,
        checkSessionTimeout,
        setLoginTime
    };
}
