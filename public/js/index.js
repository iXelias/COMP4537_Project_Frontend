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

        const response = await fetch('http://localhost:5000/api/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();
        if (response.ok) {
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