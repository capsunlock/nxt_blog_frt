// Author Page Handler
document.addEventListener('DOMContentLoaded', () => {
    lucide?.createIcons();
    
    const urlParams = new URLSearchParams(window.location.search);
    const authorId = urlParams.get('id');
    
    if (authorId) {
        loadAuthorProfile(authorId);
    } else {
        // Fallback: use localStorage for demo
        const authors = JSON.parse(localStorage.getItem('journal_authors') || '[]');
        if (authors.length > 0) {
            loadAuthorProfile(authors[0].id);
        }
    }
});

function loadAuthorProfile(authorId) {
    // Get author from localStorage (replace with API call later)
    const authors = JSON.parse(localStorage.getItem('journal_authors') || '[]');
    const author = authors.find(a => a.id === authorId);
    
    if (!author) {
        document.querySelector('.author-page-container').innerHTML = `
            <div class="empty-state" style="grid-column: 1/-1; text-align: center; padding: 4rem;">
                <i data-lucide="user-x"></i>
                <p>Author not found.</p>
                <a href="index.html" style="color: var(--accent-color); text-decoration: underline;">Back to Journal</a>
            </div>
        `;
        return;
    }
    
    // Update author info
    document.getElementById('authorName').textContent = author.name;
    document.getElementById('authorRole').textContent = author.role || 'Contributor';
    document.getElementById('authorBio').textContent = author.bio || '';
    document.getElementById('authorAvatar').src = author.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200';
    document.getElementById('joinDate').textContent = new Date(author.joinDate || Date.now()).getFullYear();
    
    // Load social links
    if (author.socialLinks && Object.keys(author.socialLinks).length > 0) {
        const socialHtml = Object.entries(author.socialLinks)
            .map(([platform, url]) => `
                <a href="${url}" class="social-link" target="_blank" rel="noopener">
                    <i data-lucide="${getSocialIcon(platform)}"></i>
                    ${capitalizeFirstLetter(platform)}
                </a>
            `)
            .join('');
        document.getElementById('authorSocial').innerHTML = socialHtml;
        lucide?.createIcons();
    }
    
    // Load author's posts
    loadAuthorPosts(authorId);
    loadAuthorSeries(authorId);
}

function loadAuthorPosts(authorId) {
    const posts = JSON.parse(localStorage.getItem('journal_posts') || '[]');
    const authorPosts = posts.filter(p => p.authorId === authorId);
    
    const postCountEl = document.getElementById('postCount');
    postCountEl.textContent = authorPosts.length;
    
    const grid = document.getElementById('authorPostsGrid');
    
    if (authorPosts.length === 0) {
        grid.innerHTML = `
            <div class="empty-state" style="grid-column: 1/-1;">
                <i data-lucide="file-x"></i>
                <p>No published posts yet.</p>
            </div>
        `;
        lucide?.createIcons();
        return;
    }
    
    grid.innerHTML = authorPosts
        .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
        .map(post => `
            <a href="blog_post.html?slug=${post.slug || post.title.toLowerCase().replace(/\s+/g, '-')}" 
               class="post-card">
                <h3 class="post-card-title">${post.title || 'Untitled'}</h3>
                <p class="post-card-excerpt">${post.subtitle || post.body?.substring(0, 150) || 'No description'}...</p>
                <div class="post-card-meta">
                    <span>${post.category || 'General'}</span>
                    <span>${new Date(post.publishedAt).toLocaleDateString()}</span>
                </div>
            </a>
        `)
        .join('');
    
    lucide?.createIcons();
}

function loadAuthorSeries(authorId) {
    const series = JSON.parse(localStorage.getItem('journal_series') || '[]');
    const authorSeries = series.filter(s => s.authorId === authorId);
    
    const section = document.getElementById('authorSeriesSection');
    const list = document.getElementById('authorSeriesList');
    
    if (authorSeries.length === 0) {
        section.style.display = 'none';
        return;
    }
    
    list.innerHTML = authorSeries.map(s => `
        <a href="collection_single.html?slug=${s.slug}" class="series-card">
            <h3 class="series-card-title">${s.name}</h3>
            <p class="series-card-desc">${s.description || ''}</p>
            <div class="series-card-count">${s.posts?.length || 0} parts</div>
        </a>
    `).join('');
}

// Follow author form
document.getElementById('followForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = e.target.querySelector('input[type="email"]').value;
    const authorId = new URLSearchParams(window.location.search).get('id');
    
    // Store follow/subscription (replace with API call later)
    const follows = JSON.parse(localStorage.getItem('journal_follows') || '[]');
    if (!follows.includes(email)) {
        follows.push(email);
        localStorage.setItem('journal_follows', JSON.stringify(follows));
    }
    
    // Show confirmation
    const btn = e.target.querySelector('button');
    const originalText = btn.textContent;
    btn.textContent = '✓ Following';
    btn.disabled = true;
    
    setTimeout(() => {
        btn.textContent = originalText;
        btn.disabled = false;
    }, 2000);
    
    e.target.reset();
});

function getSocialIcon(platform) {
    const iconMap = {
        twitter: 'twitter',
        facebook: 'facebook',
        linkedin: 'linkedin',
        github: 'github',
        instagram: 'instagram',
        website: 'globe',
        email: 'mail'
    };
    return iconMap[platform.toLowerCase()] || 'link';
}

function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
