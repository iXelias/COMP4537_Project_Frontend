// const backendBaseUrl = 'https://comp4537-project-backend-qnf6.onrender.com/COMP4537_project';
const backendBaseUrl = 'http://localhost:5000/COMP4537_project';

// 1. Check authentication via cookie (no direct token access)
fetch(`${backendBaseUrl}/api/users/verify-auth`, {
    method: 'GET',
    credentials: 'include' // Required for cookies
})
    .then(response => {
        console.log(response);
        if (!response.ok) {
            throw new Error('Not authenticated');
        }
        return response.json();
    })
    .then(data => {
        console.log('Auth verification:', data);

        // 2. Check admin status from the response
        if (!data.isAdmin) {
            window.location.href = '/story.html?unauthorized=true';
            return;
        }

        // 3. Fetch API usage (cookie is automatically included)
        fetch(`${backendBaseUrl}/api/stories/admin/api-usage`, {
            method: 'GET',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' }
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
                console.error('API usage fetch failed:', error);
                alert('Error loading stats: ' + error.message);
            });

        // 4. Fetch API logs (cookie is automatically included)
        fetch(`${backendBaseUrl}/api/stories/admin/endpoint-stats`, {
            credentials: 'include'
        })
            .then(response => response.json())
            .then(data => {
                const tableBody = document.querySelector('#apiLogsTable tbody');
                tableBody.innerHTML = data.stats.map(stat => `
                    <tr>
                        <td>${stat.method}</td>
                        <td>${stat.endpoint}</td>
                        <td>${stat.request_count}</td>
                    </tr>
                `).join('');
            })
            .catch(error => {
                console.error('Failed to load stats:', error);
            });
    })
    .catch(error => {
        console.error('Auth check failed:', error);
        window.location.href = '/'; // Redirect to login
    });