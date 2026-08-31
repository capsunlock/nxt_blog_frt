document.addEventListener('DOMContentLoaded', () => {
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // Mobile Sidebar Logic
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    
    function toggleSidebar() {
        const isActive = sidebar.classList.toggle('active');
        menuToggle.classList.toggle('active');
    }
    
    if (menuToggle) menuToggle.addEventListener('click', toggleSidebar);
    if (overlay) overlay.addEventListener('click', toggleSidebar);
    
    document.querySelectorAll('.sidebar-link').forEach(link => {
        link.addEventListener('click', () => {
            if(window.innerWidth <= 1024) toggleSidebar();
        });
    });

    renderDashboard();
});

function renderDashboard() {
    renderAuthors();
    renderRecentPosts();
    updateStats();
}

function renderAuthors() {
    const container = document.getElementById('authors-list-container');
    if (!container) return;
    
    const authors = JSON.parse(localStorage.getItem('journal_authors') || '[]');
    const posts = JSON.parse(localStorage.getItem('journal_posts') || '[]');

    if (authors.length === 0) {
        container.innerHTML = '<div class="empty-state">No authors found in local storage.</div>';
        return;
    }

    container.innerHTML = authors.map(author => {
        const authorPosts = posts.filter(p => p.author === author.name).length;
        return `
            <div class="post-row">
                <div class="post-title-cell">
                    <strong>${author.name}</strong>
                    <small>${author.role || 'Author'}</small>
                </div>
                <div><span class="badge">Author</span></div>
                <div style="font-size: 0.85rem; opacity: 0.7;">${authorPosts} posts</div>
                <div class="post-actions">
                    <button class="btn btn-icon" onclick="location.href='author_page.html'" title="View Profile">
                        <i data-lucide="user" style="width:16px"></i>
                    </button>
                </div>
            </div>
        `;
    }).join('');

    if (typeof lucide !== 'undefined') lucide.createIcons();
}

function renderRecentPosts() {
    const container = document.getElementById('recent-posts-container');
    if (!container) return;
    
    const posts = JSON.parse(localStorage.getItem('journal_posts') || '[]');
    const draftData = localStorage.getItem('journal_draft');

    if (posts.length === 0 && !draftData) {
        container.innerHTML = '<div class="empty-state">No records found in local storage.</div>';
        return;
    }

    container.innerHTML = '';

    const allItems = [...posts];
    if (draftData) {
        const draft = JSON.parse(draftData);
        allItems.unshift({ ...draft, isDraft: true });
    }

    const recent = allItems.slice(0, 10);

    recent.forEach(post => {
        const text = post.body || '';
        const words = text.trim() ? text.trim().split(/\s+/).length : 0;
        const minutes = Math.max(1, Math.ceil(words / 200));
        const status = post.isDraft ? 'Draft' : 'Published';
        const statusClass = post.isDraft ? 'badge-draft' : 'badge-published';

        const row = document.createElement('div');
        row.className = 'post-row';
        row.innerHTML = `
            <div class="post-title-cell">
                <strong>${post.title || 'Untitled Transmission'}</strong>
                <small>/${post.slug || 'no-slug'}</small>
            </div>
            <div><span class="badge ${statusClass}">${status}</span></div>
            <div style="font-size: 0.85rem; opacity: 0.7;">
                ${words} words • ${minutes} min read
            </div>
            <div class="post-actions">
                <button class="btn btn-icon" onclick="location.href='create_post.html'" title="Edit">
                    <i data-lucide="edit-3" style="width:16px"></i>
                </button>
                ${!post.isDraft ? `<button class="btn btn-icon" onclick="location.href='blog_post.html?slug=${post.slug || post.title.toLowerCase().replace(/\\s+/g, '-')}'" title="View">
                    <i data-lucide="eye" style="width:16px"></i>
                </button>` : ''}
            </div>
        `;
        container.appendChild(row);
    });

    if (typeof lucide !== 'undefined') lucide.createIcons();
}

function updateStats() {
    const posts = JSON.parse(localStorage.getItem('journal_posts') || '[]');
    const draftData = localStorage.getItem('journal_draft');
    
    let totalWords = 0;
    let totalMinutes = 0;

    posts.forEach(post => {
        const text = post.body || '';
        const words = text.trim() ? text.trim().split(/\s+/).length : 0;
        totalWords += words;
        totalMinutes += Math.max(1, Math.ceil(words / 200));
    });

    if (draftData) {
        const draft = JSON.parse(draftData);
        const text = draft.body || '';
        const words = text.trim() ? text.trim().split(/\s+/).length : 0;
        totalWords += words;
        totalMinutes += Math.max(1, Math.ceil(words / 200));
    }

    document.getElementById('total-word-count').innerText = totalWords.toLocaleString();
    document.getElementById('total-read-time').innerText = totalMinutes;
    document.getElementById('total-posts-count').innerText = posts.length + (draftData ? 1 : 0);
}
