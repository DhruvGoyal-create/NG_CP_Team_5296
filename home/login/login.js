document.addEventListener('DOMContentLoaded', function() {
    // Tab switching functionality
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
        
        // Clear error messages when switching tabs
        hideError('errorMessage');
        hideError('signupErrorMessage');
    }
    
    // Tab button clicks
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            switchTab(tabName);
        });
    });
    
    // Switch tab link clicks
    switchTabLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const tabName = this.getAttribute('data-tab');
            switchTab(tabName);
        });
    });
    
    // Login form functionality
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const loginBtn = loginForm.querySelector('.login-btn');
    
    // Signup form functionality
    const signupForm = document.getElementById('signupForm');
    const signupUsernameInput = document.getElementById('signupUsername');
    const signupNameInput = document.getElementById('signupName');
    const signupEmailInput = document.getElementById('signupEmail');
    const signupPhoneInput = document.getElementById('signupPhone');
    const signupPasswordInput = document.getElementById('signupPassword');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const signupBtn = signupForm.querySelector('.login-btn');
    
    // Form validation
    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    function validateUsername(username) {
        const usernameRegex = /^[a-zA-Z0-9]{3,20}$/;
        return usernameRegex.test(username);
    }
    
    function validatePhone(phone) {
        const phoneRegex = /^[6-9]\d{9}$/;
        return phoneRegex.test(phone);
    }
    
    function validatePassword(password) {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
        return passwordRegex.test(password);
    }
    
    function validateLoginForm() {
        let isValid = true;
        hideError('errorMessage');
        
        // Email/Username validation
        const email = emailInput.value.trim();
        if (!email) {
            showError('❌ Username or email is required', 'errorMessage');
            isValid = false;
        } else if (email.includes('@')) {
            // If it contains @, validate as email
            if (!validateEmail(email)) {
                showError('❌ Please enter a valid email address (e.g., user@example.com)', 'errorMessage');
                isValid = false;
            } else if (email.length > 254) {
                showError('❌ Email address is too long', 'errorMessage');
                isValid = false;
            }
        } else {
            // If no @, treat as username
            if (email.length < 3) {
                showError('❌ Username must be at least 3 characters long', 'errorMessage');
                isValid = false;
            } else if (email.length > 20) {
                showError('❌ Username must be less than 20 characters', 'errorMessage');
                isValid = false;
            }
        }
        
        // Password validation
        const password = passwordInput.value;
        if (!password) {
            showError('❌ Password is required', 'errorMessage');
            isValid = false;
        } else if (password.length < 1) {
            showError('❌ Password cannot be empty', 'errorMessage');
            isValid = false;
        }
        
        return isValid;
    }
    
    function validateSignupForm() {
        let isValid = true;
        hideError('signupErrorMessage');
        
        // Username validation
        const username = signupUsernameInput.value.trim();
        if (!username) {
            showError('❌ Username is required', 'signupErrorMessage');
            isValid = false;
        } else if (username.length < 3) {
            showError('❌ Username must be at least 3 characters long', 'signupErrorMessage');
            isValid = false;
        } else if (username.length > 20) {
            showError('❌ Username must be less than 20 characters', 'signupErrorMessage');
            isValid = false;
        } else if (!validateUsername(username)) {
            showError('❌ Username must contain only letters and numbers (no spaces or special characters)', 'signupErrorMessage');
            isValid = false;
        }
        
        // Name validation
        const name = signupNameInput.value.trim();
        if (!name) {
            showError('❌ Full name is required', 'signupErrorMessage');
            isValid = false;
        } else if (name.length < 2) {
            showError('❌ Name must be at least 2 characters long', 'signupErrorMessage');
            isValid = false;
        }
        
        // Email validation
        const email = signupEmailInput.value.trim();
        if (!email) {
            showError('❌ Email address is required', 'signupErrorMessage');
            isValid = false;
        } else if (!validateEmail(email)) {
            showError('❌ Please enter a valid email address (e.g., user@example.com)', 'signupErrorMessage');
            isValid = false;
        }
        
        // Phone validation
        const phone = signupPhoneInput.value.trim();
        if (!phone) {
            showError('❌ Phone number is required', 'signupErrorMessage');
            isValid = false;
        } else if (phone.length !== 10) {
            showError('❌ Phone number must be exactly 10 digits', 'signupErrorMessage');
            isValid = false;
        } else if (!validatePhone(phone)) {
            showError('❌ Phone number must start with 6, 7, 8, or 9 (Indian mobile format)', 'signupErrorMessage');
            isValid = false;
        } else if (!/^\d+$/.test(phone)) {
            showError('❌ Phone number must contain only digits', 'signupErrorMessage');
            isValid = false;
        }
        
        // Password validation
        const password = signupPasswordInput.value;
        if (!password) {
            showError('❌ Password is required', 'signupErrorMessage');
            isValid = false;
        } else if (password.length < 8) {
            showError('❌ Password must be at least 8 characters long', 'signupErrorMessage');
            isValid = false;
        } else if (!validatePassword(password)) {
            let missingRequirements = [];
            if (!/(?=.*[a-z])/.test(password)) missingRequirements.push('lowercase letter');
            if (!/(?=.*[A-Z])/.test(password)) missingRequirements.push('uppercase letter');
            if (!/(?=.*\d)/.test(password)) missingRequirements.push('number');
            if (!/(?=.*[@$!%*?&#])/.test(password)) missingRequirements.push('special character (@$!%*?&#)');
            
            showError(`❌ Password must contain: ${missingRequirements.join(', ')}`, 'signupErrorMessage');
            isValid = false;
        }
        
        // Confirm password validation
        const confirmPassword = confirmPasswordInput.value;
        if (!confirmPassword) {
            showError('❌ Please confirm your password', 'signupErrorMessage');
            isValid = false;
        } else if (password !== confirmPassword) {
            showError('❌ Passwords do not match', 'signupErrorMessage');
            isValid = false;
        }
        
        return isValid;
    }
    
    function showError(message, errorId) {
        const errorElement = document.getElementById(errorId);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
    }
    
    function hideError(errorId) {
        const errorElement = document.getElementById(errorId);
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.style.display = 'none';
        }
    }
    
    function showSuccess(message, errorId) {
        const errorElement = document.getElementById(errorId);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.color = '#10b981';
            errorElement.style.display = 'block';
        }
    }
    
    function setLoading(button, isLoading, originalText) {
        if (isLoading) {
            button.disabled = true;
            button.innerHTML = '<span class="loading"></span> Processing...';
        } else {
            button.disabled = false;
            button.innerHTML = originalText;
        }
    }
    
    // Handle login form submission
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        if (!validateLoginForm()) {
            return;
        }
        
        setLoading(loginBtn, true, 'Sign In');
        
        try {
            const response = await simulateLogin(emailInput.value, passwordInput.value);
            
            if (response.success) {
                showSuccess('Login successful! Redirecting...', 'errorMessage');
                
                // Use auth.js functions for login
                localStorage.setItem("isLoggedIn", "true");
                localStorage.setItem("loggedInUser", response.user.username || response.user.email);
                
                // Set login time for session management
                localStorage.setItem("loginTime", Date.now().toString());
                
                // Check if admin user and redirect accordingly
                if (response.user.role === 'admin') {
                    // Redirect to Django admin panel
                    setTimeout(() => {
                        window.location.href = 'http://127.0.0.1:8000/admin/';
                    }, 1500);
                } else {
                    // Redirect to regular user dashboard
                    setTimeout(() => {
                        window.location.href = '../user/dashboard/dashboard.html';
                    }, 1500);
                }
            } else {
                showError(response.message || 'Login failed. Please try again.', 'errorMessage');
            }
        } catch (error) {
            showError('Network error. Please check your connection and try again.', 'errorMessage');
        } finally {
            setLoading(loginBtn, false, 'Sign In');
        }
    });
    
    // Handle signup form submission
    signupForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        if (!validateSignupForm()) {
            return;
        }
        
        setLoading(signupBtn, true, 'Create Account');
        
        try {
            const response = await simulateSignup(
                signupUsernameInput.value,
                signupNameInput.value,
                signupEmailInput.value,
                signupPhoneInput.value,
                signupPasswordInput.value
            );
            
            if (response.success) {
                showSuccess('Account created successfully! Redirecting...', 'signupErrorMessage');
                
                // Use auth.js format for user data storage
                const userData = {
                    username: signupUsernameInput.value,
                    firstName: signupNameInput.value.split(' ')[0],
                    lastName: signupNameInput.value.split(' ').slice(1).join(' '),
                    email: signupEmailInput.value,
                    phone: signupPhoneInput.value,
                    password: btoa(signupPasswordInput.value)
                };
                
                localStorage.setItem("userData", JSON.stringify(userData));
                localStorage.setItem("isLoggedIn", "true");
                localStorage.setItem("loggedInUser", signupUsernameInput.value);
                
                // Set login time for session management
                localStorage.setItem("loginTime", Date.now().toString());
                
                setTimeout(() => {
                    window.location.href = '../user/dashboard/dashboard.html';
                }, 1500);
            } else {
                showError(response.message || 'Signup failed. Please try again.', 'signupErrorMessage');
            }
        } catch (error) {
            showError('Network error. Please check your connection and try again.', 'signupErrorMessage');
        } finally {
            setLoading(signupBtn, false, 'Create Account');
        }
    });
    
    // Simulate login API call
    async function simulateLogin(email, password) {
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Check if user exists in localStorage (from auth.js format)
        const storedUserData = localStorage.getItem("userData");
        if (storedUserData) {
            const userData = JSON.parse(storedUserData);
            if ((userData.email === email || userData.username === email) && userData.password === btoa(password)) {
                return {
                    success: true,
                    user: {
                        id: 1,
                        username: userData.username,
                        name: userData.firstName + ' ' + userData.lastName,
                        email: userData.email,
                        role: 'user'
                    }
                };
            }
        }
        
        // Fallback to mock credentials
        if (email === 'admin@example.com' && password === 'Admin@123') {
            return {
                success: true,
                user: {
                    id: 1,
                    username: 'admin',
                    name: 'Admin User',
                    email: 'admin@example.com',
                    role: 'admin'
                }
            };
        } else if (email === 'user@example.com' && password === 'User@123') {
            return {
                success: true,
                user: {
                    id: 2,
                    username: 'user',
                    name: 'Regular User',
                    email: 'user@example.com',
                    role: 'user'
                }
            };
        } else {
            return {
                success: false,
                message: 'Invalid username or password'
            };
        }
    }
    
    // Simulate signup API call
    async function simulateSignup(username, name, email, phone, password) {
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Check if username or email already exists
        const storedUserData = localStorage.getItem("userData");
        if (storedUserData) {
            const userData = JSON.parse(storedUserData);
            if (userData.username === username || userData.email === email) {
                return {
                    success: false,
                    message: 'Username or email already exists. Please use different credentials.'
                };
            }
        }
        
        return {
            success: true,
            user: {
                id: Date.now(),
                username: username,
                name: name,
                email: email,
                role: 'user'
            }
        };
    }
    
    // Clear errors on input
    [emailInput, passwordInput].forEach(input => {
        input.addEventListener('input', () => hideError('errorMessage'));
    });
    
    [signupUsernameInput, signupNameInput, signupEmailInput, signupPhoneInput, signupPasswordInput, confirmPasswordInput].forEach(input => {
        input.addEventListener('input', () => hideError('signupErrorMessage'));
    });
    
    // Check if user is already logged in using auth.js format
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const loggedInUser = localStorage.getItem("loggedInUser");
    
    if (isLoggedIn === "true" && loggedInUser) {
        console.log('User already logged in:', loggedInUser);
        // Optionally redirect to dashboard
        // window.location.href = '../user/dashboard.html';
    }
});
