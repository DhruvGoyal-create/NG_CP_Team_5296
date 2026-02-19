function checkAuth() {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const user = localStorage.getItem("loggedInUser");

    if (isLoggedIn !== "true" || !user) {
        window.location.href = "../login/login.html";
    }
}

function logout() {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("loggedInUser");
    window.location.href = "../main/home.html";
}

console.log(
    document.getElementById("username"),
    document.getElementById("firstName"),
    document.getElementById("lastName"),
    document.getElementById("password"),
    document.getElementById("email"),
    document.getElementById("phone"),
);

function validateAndLogin() {   
    const username = document.getElementById("username").value.trim();
    const firstName = document.getElementById("firstName").value.trim();
    const lastName = document.getElementById("lastName").value.trim();
    const password = document.getElementById("password").value;
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const errorEl = document.getElementById("registerError");
    
    // Clear previous errors
    errorEl.textContent = "";
    
    // Field-by-field validation with specific error messages
    if (!username) {
        errorEl.textContent = "Username is required.";
        document.getElementById("username").focus();
        return;
    }
    
    const usernameRegex = /^[a-zA-Z0-9]{3,20}$/;
    if (!usernameRegex.test(username)) {
        errorEl.textContent = "Username must be 3-20 characters, letters and numbers only (no spaces).";
        document.getElementById("username").focus();
        return;
    }

    if (!firstName) {
        errorEl.textContent = "First name is required.";
        document.getElementById("firstName").focus();
        return;
    }
    
    if (!lastName) {
        errorEl.textContent = "Last name is required.";
        document.getElementById("lastName").focus();
        return;
    }
    
    const nameRegex = /^[A-Za-z]{2,30}$/;
    if (!nameRegex.test(firstName)) {
        errorEl.textContent = "First name must be 2-30 letters only.";
        document.getElementById("firstName").focus();
        return;
    }
    
    if (!nameRegex.test(lastName)) {
        errorEl.textContent = "Last name must be 2-30 letters only.";
        document.getElementById("lastName").focus();
        return;
    }

    if (!email) {
        errorEl.textContent = "Email is required.";
        document.getElementById("email").focus();
        return;
    }
    
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
        errorEl.textContent = "Please enter a valid email address (e.g., user@example.com).";
        document.getElementById("email").focus();
        return;
    }

    if (!phone) {
        errorEl.textContent = "Phone number is required.";
        document.getElementById("phone").focus();
        return;
    }
    
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
        errorEl.textContent = "Phone number must be 10 digits starting with 6-9 (Indian format).";
        document.getElementById("phone").focus();
        return;
    }

    if (!password) {
        errorEl.textContent = "Password is required.";
        document.getElementById("password").focus();
        return;
    }
    
    if (password.length < 8) {
        errorEl.textContent = "Password must be at least 8 characters long.";
        document.getElementById("password").focus();
        return;
    }
    
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
    if (!passwordRegex.test(password)) {
        errorEl.textContent = "Password must contain: uppercase, lowercase, number, and special character (@$!%*?&#).";
        document.getElementById("password").focus();
        return;
    }
    
    // Store user data
    const userData = {
        username,
        firstName,
        lastName,
        email,
        phone,
        password: btoa(password) // Basic encoding for storage
    };
    
    localStorage.setItem("userData", JSON.stringify(userData));
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("loggedInUser", username);

    // Auto logout after 30 minutes
    setTimeout(logout, 30 * 60 * 1000);

    // Redirect to dashboard
    window.location.href = "../user/et.html";
}
