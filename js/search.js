// Search Page Handler
document.addEventListener('DOMContentLoaded', () => {
    lucide?.createIcons();
    
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('q') || '';
    
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.value = query;
    }
    
    if (query) {
        performSearch(query);
        document.getElementById('searchQuery').textContent = `Results for "${query}"`;
    }
});

document.getElementById('search-submit-btn')?.addEventListener('click', () => {
    const query = document.getElementById('search-input').value;
    if (query.trim()) {
        performSearch(query);
        document.getElementById('searchQuery').textContent = `Results for "${query}"`;
    }
});

document.getElementById('search-input')?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const query = e.target.value;
        if (query.trim()) {
            performSearch(query);
            document.getElementById('searchQuery').textContent = `Results for "${query}"`;
        }
    }
});

function performSearch(query) {
    const posts = JSON.parse(localStorage.getItem('journal_posts') || '[]');
    const resultsContainer = document.getElementById('searchResults');
    
    const lowerQuery = query.toLowerCase();
    const results = posts.filter(post => 
        post.title?.toLowerCase().includes(lowerQuery) ||
        post.body?.toLowerCase().includes(lowerQuery) ||
        post.category?.toLowerCase().includes(lowerQuery) ||
        (post.tags && post.tags.some(tag => tag.toLowerCase().includes(lowerQuery)))
    );
    
    if (results.length === 0) {
        resultsContainer.innerHTML = `
            <div class="empty-state" style="grid-column: 1/-1;">
                <p>No results found for "${query}"</p>
                <p style="color: var(--secondary-text); margin-top: 1rem;">Try different keywords or <a href="index.html" style="color: var(--accent-color);">browse all posts</a></p>
            </div>
        `;
        return;
    }
    
    resultsContainer.innerHTML = results.map(post => `
        <a href="blog_post.html?slug=${post.slug || post.title.toLowerCase().replace(/\s+/g, '-')}" 
           class="search-result-item" style="text-decoration: none; color: inherit;">
            <div class="search-result-title">${post.title || 'Untitled'}</div>
            <div class="search-result-excerpt">${(post.subtitle || post.body?.substring(0, 100)) || 'No description'}...</div>
            <div class="search-result-meta">
                ${post.category ? `<span>${post.category}</span> • ` : ''}
                ${post.date || 'Just now'}
            </div>
        </a>
    `).join('');
}

// Filter functionality
document.querySelectorAll('.filter-checkbox')?.forEach(checkbox => {
    checkbox.addEventListener('change', () => {
        // Implement filtering logic
        console.log('Filter changed:', checkbox.value);
    });
});
