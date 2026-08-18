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

    // 1. Pull data from your local ledger
    const posts = JSON.parse(localStorage.getItem('journal_posts') || '[]');

    // 2. Check URL for filters (Category or Tag)
    const urlParams = new URLSearchParams(window.location.search);
    const categoryFilter = urlParams.get('filter');
    const tagFilter = urlParams.get('tag');

    let filteredPosts = posts;

    // 3. Apply Filtering Logic
    if (categoryFilter) {
        filteredPosts = posts.filter(p => p.category === categoryFilter);
        updateHeroContext(`Category: ${categoryFilter}`);
    } else if (tagFilter) {
        // Checks if the tag exists within the post's tag array
        filteredPosts = posts.filter(p => p.tags && p.tags.includes(tagFilter));
        updateHeroContext(`Tag: #${tagFilter}`);
    }

    // 4. Handle Empty States
    if (filteredPosts.length === 0) {
        grid.innerHTML = `
            <div class="empty-state" style="grid-column: 1/-1; text-align: center; padding: 4rem; opacity: 0.5;">
                <p>No signals found matching this criteria.</p>
                <a href="index.html" style="color: var(--accent-color); text-decoration: underline; display: block; margin-top: 1rem;">Clear all filters</a>
            </div>`;
        return;
    }

    // 5. Render the Grid
    grid.innerHTML = '';
    
    // Sort by date descending (assuming you have a 'date' field)
    filteredPosts.sort((a, b) => new Date(b.date) - new Date(a.date));

    filteredPosts.forEach(post => {
        const card = document.createElement('a');
        card.href = `blog_post.html?slug=${post.slug}`;
        card.className = 'public-post-card';
        card.innerHTML = `
            ${post.heroImage ? `<img src="${post.heroImage}" class="card-image" alt="${post.title}">` : ''}
            <div class="card-content">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                    <span class="card-category">${post.category || 'Uncategorized'}</span>
                    <span style="font-size: 0.7rem; opacity: 0.4; font-family: monospace;">${new Date(post.date).toLocaleDateString()}</span>
                </div>
                <h2 class="card-title">${post.title}</h2>
                <p style="opacity:0.6; font-size:0.9rem; margin-top:1rem; line-height: 1.4;">${post.subtitle || ''}</p>
                
                ${post.tags ? `
                    <div class="card-tags" style="margin-top: 1.5rem; display: flex; gap: 0.5rem; flex-wrap: wrap;">
                        ${post.tags.slice(0, 3).map(tag => `<span style="font-size: 0.65rem; border: 1px solid var(--border-color); padding: 2px 6px; border-radius: 4px; opacity: 0.6;">#${tag}</span>`).join('')}
                    </div>
                ` : ''}
            </div>
        `;
        grid.appendChild(card);
    });
}

// Helper to update the Hero Title when filtering
function updateHeroContext(label) {
    const heroTitle = document.getElementById('hero-title');
    const heroSubtitle = document.getElementById('hero-subtitle');
    
    if (heroTitle) heroTitle.innerText = label;
    if (heroSubtitle) {
        heroSubtitle.innerHTML = `<a href="index.html" style="color: var(--accent-color); text-decoration: none;">← Back to all posts</a>`;
    }
}