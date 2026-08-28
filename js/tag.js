document.addEventListener('DOMContentLoaded', () => {
    const posts = JSON.parse(localStorage.getItem('journal_posts') || '[]');
    const container = document.getElementById('tag-container');
    const filteredView = document.getElementById('filtered-view');
    const urlParams = new URLSearchParams(window.location.search);
    const tagFilter = urlParams.get('tag');

    if (tagFilter) {
        if (container) container.style.display = 'none';
        if (filteredView) filteredView.style.display = 'block';
        renderFilteredPosts(tagFilter, posts);
    } else {
        renderTagCloud(posts, container);
    }
});

function renderTagCloud(posts, container) {
    const tagMap = {};
    posts.forEach(post => {
        if (post.tags && Array.isArray(post.tags)) {
            post.tags.forEach(tag => {
                tagMap[tag] = (tagMap[tag] || 0) + 1;
            });
        }
    });

    if (container) container.innerHTML = '';

    const sortedTags = Object.keys(tagMap).sort();

    if (sortedTags.length === 0) {
        if (container) container.innerHTML = '<p style="opacity:0.5">No tags found in the system ledger.</p>';
        return;
    }

    sortedTags.forEach(tag => {
        const tagEl = document.createElement('a');
        tagEl.href = `tag.html?tag=${encodeURIComponent(tag)}`;
        tagEl.className = 'tag-item';
        tagEl.innerHTML = `
            #${tag}
            <span class="tag-count">${tagMap[tag]}</span>
        `;
        if (container) container.appendChild(tagEl);
    });
}

function renderFilteredPosts(tag, posts) {
    const tagPostsGrid = document.getElementById('tagPostsGrid');
    const relatedTagsList = document.getElementById('relatedTagsList');
    const tagBadge = document.getElementById('tagBadge');
    const tagTitle = document.getElementById('tagTitle');
    const tagDescription = document.getElementById('tagDescription');

    if (tagBadge) tagBadge.textContent = '#' + tag;
    if (tagTitle) tagTitle.textContent = '#' + tag;
    if (tagDescription) tagDescription.textContent = 'Posts tagged with';

    const filtered = posts.filter(p => p.tags && p.tags.includes(tag));

    if (tagPostsGrid) {
        if (filtered.length === 0) {
            tagPostsGrid.innerHTML = '<div class="empty-state">No posts found for this tag.</div>';
        } else {
            tagPostsGrid.innerHTML = filtered.map(post => `
                <a href="blog_post.html?slug=${post.slug || post.title.toLowerCase().replace(/\s+/g, '-')}" class="post-card">
                    <h3 class="post-card-title">${post.title || 'Untitled'}</h3>
                    <p class="post-card-excerpt">${post.subtitle || post.body?.substring(0, 150) || 'No description'}...</p>
                    <div class="post-card-meta">
                        <span>${post.category || 'General'}</span>
                        <span>${post.date || 'Just now'}</span>
                    </div>
                </a>
            `).join('');
        }
    }

    if (relatedTagsList) {
        const allTags = {};
        posts.forEach(post => {
            if (post.tags && Array.isArray(post.tags)) {
                post.tags.forEach(t => {
                    if (t !== tag) allTags[t] = (allTags[t] || 0) + 1;
                });
            }
        });
        const related = Object.keys(allTags).sort().slice(0, 10);
        if (related.length === 0) {
            relatedTagsList.innerHTML = '<p style="opacity:0.5">No related tags.</p>';
        } else {
            relatedTagsList.innerHTML = related.map(t => `
                <a href="tag.html?tag=${encodeURIComponent(t)}" class="tag-item">#${t} <span class="tag-count">${allTags[t]}</span></a>
            `).join('');
        }
    }
}