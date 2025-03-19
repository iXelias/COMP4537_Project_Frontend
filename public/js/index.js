const backendBaseUrl = 'https://clownfish-app-mn8xw.ondigitalocean.app/COMP4537_project';

// Login
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // Clear previous errors
        document.getElementById('emailError').textContent = '';
        document.getElementById('passwordError').textContent = '';

        const response = await fetch(`${backendBaseUrl}/api/users/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();
        if (response.ok) {
            const user = data.user;
            localStorage.setItem('token', data.token);
            localStorage.setItem('isAdmin', data.isAdmin); // Store isAdmin flag
            if (data.isAdmin) {
                window.location.href = '/admin.html'; // Redirect admin users
            } else {
                window.location.href = '/story.html'; // Redirect regular users
            }
        } else {
            if (data.error.includes('password')) {
                document.getElementById('passwordError').textContent = data.error;
            } else {
                document.getElementById('emailError').textContent = data.error;
            }
        }
    });
}

// Register
const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;

        // Clear previous errors
        document.getElementById('registerEmailError').textContent = '';
        document.getElementById('registerPasswordError').textContent = '';

        const response = await fetch(`${backendBaseUrl}/api/users/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();
        if (response.ok) {
            document.getElementById('successMessage').textContent = 'Registration successful!';
            document.getElementById('registerForm').style.display = 'none'; // Hide the register form
            document.getElementById('loginForm').style.display = 'block'; // Show the login form
        } else {
            if (data.error.includes('password')) {
                document.getElementById('registerPasswordError').textContent = data.error;
            } else {
                document.getElementById('registerEmailError').textContent = data.error;
            }
        }
    });
}

// Toggle between login and register forms
const toggleLink = document.getElementById('toggleLink');
if (toggleLink) {
    toggleLink.addEventListener('click', (e) => {
        e.preventDefault();
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');
        if (loginForm.style.display === 'none') {
            loginForm.style.display = 'block';
            registerForm.style.display = 'none';
            toggleLink.innerHTML = 'Don\'t have an account? <a href="#" id="toggleForm">Register</a>';
        } else {
            loginForm.style.display = 'none';
            registerForm.style.display = 'block';
            toggleLink.innerHTML = 'Already have an account? <a href="#" id="toggleForm">Login</a>';
        }
    });
}