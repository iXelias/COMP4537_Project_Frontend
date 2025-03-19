// Check if the user is an admin
const token = localStorage.getItem('token');
if (!token) {
    // Redirect to login if no token is found
    window.location.href = '/';
} else {
    // Decode the token to check if the user is an admin
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (!payload.isAdmin) {
        // Redirect to story.html with unauthorized flag
        window.location.href = '/story.html?unauthorized=true';
    }
}