// Logout
const logoutButton = document.getElementById('logout');
if (logoutButton) {
    logoutButton.addEventListener('click', async () => {
        try {
            await fetch(`${backendBaseUrl}/api/users/logout`, {
                method: 'POST',
                credentials: 'include'
            });
            window.location.href = '/';
        } catch (error) {
            console.error('Logout failed:', error);
        }
    });
}