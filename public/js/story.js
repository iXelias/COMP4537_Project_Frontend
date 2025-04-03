const backendBaseUrl = 'https://comp4537-project-backend-qnf6.onrender.com/COMP4537_project';
// const backendBaseUrl = 'http://localhost:5000/COMP4537_project'; // Localhost
const datalimit = 20;

// Load stories on page load
document.addEventListener('DOMContentLoaded', fetchStories);

// Display API usage on page load
document.addEventListener('DOMContentLoaded', displayApiUsage);

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
        document.getElementById('promptError').textContent = '';

        try {
            // 1. Generate story
            const genResponse = await fetch(`${backendBaseUrl}/api/stories/generate-story`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt })
            });

            if (!genResponse.ok) {
                throw new Error('Generation failed');
            }
            const { story } = await genResponse.json();

            // 2. Save to database
            const saveResponse = await fetch(`${backendBaseUrl}/api/stories`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: `Story ${new Date().toLocaleString()}`,
                    content: story,
                    prompt
                })
            });

            if (!saveResponse.ok) {
                throw new Error('Failed to save story');
            }

            // 3. Display result
            document.getElementById('storyOutput').innerHTML = `
                <h3>Your Story:</h3>
                <p>${story}</p>
            `;

            fetchStories(); // Refresh list
            displayApiUsage(); // Refresh API usage

        } catch (error) {
            console.error('Error:', error);
            document.getElementById('promptError').textContent = error.message;

            // Redirect to login if unauthorized
            if (error.message.includes('log in')) {
                window.location.href = '/';
            }
        }
    });
}

// Fetch all stories for the logged-in user
async function fetchStories() {
    document.getElementById('promptError').textContent = '';
    try {
        const response = await fetch(`${backendBaseUrl}/api/stories`, {
            method: 'GET',
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error('Failed to load stories');

        }
        const stories = await response.json();
        renderStories(stories);
    } catch (error) {
        document.getElementById('promptError').textContent = error.message;
    }
}

// Render stories list with edit/delete buttons
function renderStories(stories) {
    const container = document.getElementById('stories-list');
    container.innerHTML = stories.map(story => `
      <div class="story-card" data-id="${story.id}">
        <h3>${story.title}</h3>
        <p>${story.content.substring(0, 100)}...</p>
        <div class="story-actions">
          <button class="edit-btn">Edit</button>
          <button class="delete-btn">Delete</button>
        </div>
        <div class="edit-form" style="display: none;">
          <textarea class="edit-content">${story.content}</textarea>
          <button class="save-btn">Save</button>
          <button class="cancel-btn">Cancel</button>
        </div>
      </div>
    `).join('');

    // Add event listeners
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', showEditForm);
    });

    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', deleteStory);
    });

    document.querySelectorAll('.save-btn').forEach(btn => {
        btn.addEventListener('click', updateStory);
    });

    document.querySelectorAll('.cancel-btn').forEach(btn => {
        btn.addEventListener('click', hideEditForm);
    });
}


// Show edit form
function showEditForm(e) {
    const card = e.target.closest('.story-card');
    card.querySelector('.edit-form').style.display = 'block';
    card.querySelector('.story-actions').style.display = 'none';
}

// Hide edit form
function hideEditForm(e) {
    const card = e.target.closest('.story-card');
    card.querySelector('.edit-form').style.display = 'none';
    card.querySelector('.story-actions').style.display = 'flex';
}

// Update story (PUT)
async function updateStory(e) {
    const card = e.target.closest('.story-card');
    const storyId = card.dataset.id;
    const newContent = card.querySelector('.edit-content').value;

    try {
        const response = await fetch(`${backendBaseUrl}/api/stories/${storyId}`, {
            method: 'PUT',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title: `Story ${new Date().toLocaleString()}`,
                content: newContent
            })
        });

        if (!response.ok) {
            throw new Error('Update failed');
        }

        hideEditForm(e);
        fetchStories(); // Refresh list
    } catch (error) {
        alert(error.message);
    }
}

// Delete story (DELETE)
async function deleteStory(e) {
    if (!confirm('Are you sure you want to delete this story?')) return;

    const card = e.target.closest('.story-card');
    const storyId = card.dataset.id;

    try {
        const response = await fetch(`${backendBaseUrl}/api/stories/${storyId}`, {
            method: 'DELETE',
            credentials: 'include'
        });

        if (response.status !== 204) {
            throw new Error('Deletion failed');
        }
        card.remove(); // Remove from UI
    } catch (error) {
        alert(error.message);
    }
}

// Display the amount of API usage of the logged-in user
async function displayApiUsage() {
    fetch(`${backendBaseUrl}/api/stories/usage`, {
        credentials: 'include'
    })
        .then(response => response.json())
        .then(data => {
            console.log(data.used);
            document.getElementById('api-usage').innerHTML = `
            <div class="usage-meter">
                <div class="usage-bar" style="width: ${(data.used / datalimit) * 100}%"></div>
            </div>
            <p>${data.used}/${datalimit} API calls used</p>
        `;
        })
        .catch(error => {
            console.error('Failed to load usage:', error);
        });
}