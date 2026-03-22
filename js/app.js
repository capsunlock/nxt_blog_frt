document.addEventListener('DOMContentLoaded', () => {
    if (typeof lucide !== 'undefined') lucide.createIcons();
    
    applySettings();
    renderPublicPosts();
});

function applySettings() {
    const config = JSON.parse(localStorage.getItem('journal_config') || '{}');
    if (config.title) {
        document.title = config.title;
        const logo = document.getElementById('site-logo');
        const heroTitle = document.getElementById('hero-title');
        if (logo) logo.innerText = config.title;
        if (heroTitle) heroTitle.innerText = config.title;
    }
}

function renderPublicPosts() {
    const grid = document.getElementById('public-post-grid');
    if (!grid) return;

    // We assume 'journal_posts' is where published posts go
    const posts = JSON.parse(localStorage.getItem('journal_posts') || '[]');

    if (posts.length === 0) {
        grid.innerHTML = '<div class="empty-state">No signals broadcasted yet.</div>';
        return;
    }

    grid.innerHTML = '';
    posts.forEach(post => {
        const card = document.createElement('a');
        card.href = `post.html?slug=${post.slug}`;
        card.className = 'public-post-card';
        card.innerHTML = `
            ${post.heroImage ? `<img src="${post.heroImage}" class="card-image">` : ''}
            <div class="card-content">
                <span class="card-category">${post.category || 'Uncategorized'}</span>
                <h2 class="card-title">${post.title}</h2>
                <p style="opacity:0.6; font-size:0.9rem; margin-top:1rem;">${post.subtitle || ''}</p>
            </div>
        `;
        grid.appendChild(card);
    });
}