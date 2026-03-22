document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // Load Data
    renderDashboard();

    // Theme Toggle Logic
    const themeBtn = document.getElementById('theme-toggle');
    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            const html = document.documentElement;
            const newTheme = html.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
            html.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            lucide.createIcons(); // Refresh icons if needed
        });
    }
});

function renderDashboard() {
    const container = document.getElementById('post-list-container');
    const draftData = localStorage.getItem('journal_draft');
    
    // Stats Elements
    const wordCountEl = document.getElementById('total-word-count');
    const readTimeEl = document.getElementById('total-read-time');
    const postsCountEl = document.getElementById('total-posts-count');

    if (!draftData) {
        container.innerHTML = '<div class="empty-state">No records found in local storage.</div>';
        return;
    }

    const post = JSON.parse(draftData);
    container.innerHTML = ''; // Clear empty state

    // 1. Calculate Metrics
    const text = post.body || "";
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const minutes = Math.max(1, Math.ceil(words / 200));

    // 2. Update Stats Section
    wordCountEl.innerText = words.toLocaleString();
    readTimeEl.innerText = minutes;
    postsCountEl.innerText = "1";

    // 3. Create Post Row
    const row = document.createElement('div');
    row.className = 'post-row';
    row.innerHTML = `
        <div class="post-title-cell">
            <strong>${post.title || 'Untitled Transmission'}</strong>
            <small>/${post.slug || 'no-slug'}</small>
        </div>
        <div>
            <span class="badge badge-draft">Draft</span>
        </div>
        <div style="font-size: 0.85rem; opacity: 0.7;">
            ${words} words • ${minutes} min read
        </div>
        <div class="post-actions">
            <button class="btn btn-icon" onclick="location.href='create_post.html'" title="Edit">
                <i data-lucide="edit-3" style="width:16px"></i>
            </button>
            <button class="btn btn-icon" onclick="deleteEntry()" title="Delete">
                <i data-lucide="trash-2" style="width:16px"></i>
            </button>
        </div>
    `;

    container.appendChild(row);
    
    // Refresh icons for the newly injected HTML
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

function deleteEntry() {
    if (confirm("Permanently purge this draft from local storage?")) {
        localStorage.removeItem('journal_draft');
        window.location.reload();
    }
}