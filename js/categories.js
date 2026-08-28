document.addEventListener('DOMContentLoaded', () => {
    const posts = JSON.parse(localStorage.getItem('journal_posts') || '[]');
    const container = document.getElementById('category-container');

    // 1. Logic to count posts per category
    const categories = {};
    posts.forEach(post => {
        const cat = post.category || 'Uncategorized';
        if (!categories[cat]) categories[cat] = 0;
        categories[cat]++;
    });

    // 2. Clear loader
    container.innerHTML = '';

    if (Object.keys(categories).length === 0) {
        container.innerHTML = '<p style="opacity:0.5">No categories found in local storage.</p>';
        return;
    }

    // 3. Render Cards
    Object.keys(categories).sort().forEach(cat => {
        const card = document.createElement('a');
        card.href = `post_list.html?filter=${encodeURIComponent(cat)}`;
        card.className = 'category-card';
        card.innerHTML = `
            <span class="count">${categories[cat]} Posts</span>
            <h2>${cat}</h2>
            <i data-lucide="arrow-right"></i>
        `;
        container.appendChild(card);
    });

    // Initialize Icons
    if (typeof lucide !== 'undefined') lucide.createIcons();
});