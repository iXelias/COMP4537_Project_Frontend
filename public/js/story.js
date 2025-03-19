const backendBaseUrl = 'https://comp4537-project-backend-qnf6.onrender.com/COMP4537_project';

// Check for unauthorized access
const unauthorizedMessage = document.getElementById('unauthorizedMessage');
if (unauthorizedMessage) {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('unauthorized') === 'true') {
        unauthorizedMessage.style.display = 'block';
    }
}

// Story Generation
const storyForm = document.getElementById('storyForm');
if (storyForm) {
    storyForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const prompt = document.getElementById('prompt').value;

        // Clear previous errors
        document.getElementById('promptError').textContent = '';

        const token = localStorage.getItem('token');
        if (!token) {
            alert('Please log in first');
            return;
        } else {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const user = payload;
            console.log('User:', user);
        }

        const response = await fetch(`${backendBaseUrl}/api/stories/generate-story`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ prompt }),
        });

        const data = await response.json();
        if (response.ok) {
            document.getElementById('storyOutput').innerText = data.story;
        } else {
            document.getElementById('promptError').textContent = data.error;
        }
    });
}