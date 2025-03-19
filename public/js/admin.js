const token = localStorage.getItem('token');
if (!token) {
    window.location.href = '/';
} else {
    const payload = JSON.parse(atob(token.split('.')[1]));
    console.log('Token Payload:', payload); // Log the token payload

    if (!payload.isAdmin) {
        window.location.href = '/story.html?unauthorized=true';
    } else {
        // Fetch API usage statistics
        fetch('http://localhost:5000/api/stories/api-usage', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        })
            .then(response => response.json())
            .then(data => {
                console.log('API Usage Data:', data); // Log the response

                // Handle errors from the backend
                if (data.error) {
                    throw new Error(data.error);
                }

                // Ensure `data.users` is an array
                if (!data.users || !Array.isArray(data.users)) {
                    throw new Error('Invalid response format: users property missing or not an array');
                }

                // Populate the table
                const tableBody = document.querySelector('#apiUsageTable tbody');
                tableBody.innerHTML = ''; // Clear existing rows

                data.users.forEach(user => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                    <td>${user.email}</td>
                    <td>${user.api_calls_used}</td>
                `;
                    tableBody.appendChild(row);
                });
            })
            .catch(error => {
                console.error('Error fetching API usage data:', error);
                alert('Failed to fetch API usage data: ' + error.message);
            });
    }
}