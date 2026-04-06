document.addEventListener('DOMContentLoaded', () => {
    const posts = JSON.parse(localStorage.getItem('journal_posts') || '[]');
    const container = document.getElementById('tag-container');

    // 1. Extract and count tags
    // We assume post.tags is an array: ["CSS", "WebDev"]
    const tagMap = {};
    posts.forEach(post => {
        if (post.tags && Array.isArray(post.tags)) {
            post.tags.forEach(tag => {
                tagMap[tag] = (tagMap[tag] || 0) + 1;
            });
        }
    });

    container.innerHTML = '';

    const sortedTags = Object.keys(tagMap).sort();

    if (sortedTags.length === 0) {
        container.innerHTML = '<p style="opacity:0.5">No tags found in the system ledger.</p>';
        return;
    }

    sortedTags.forEach(tag => {
        const tagEl = document.createElement('a');
        tagEl.href = `index.html?tag=${encodeURIComponent(tag)}`;
        tagEl.className = 'tag-item';
        tagEl.innerHTML = `
            #${tag}
            <span class="tag-count">${tagMap[tag]}</span>
        `;
        container.appendChild(tagEl);
    });
    // Re-run your custom cursor logic
        const cursor = document.getElementById('custom-cursor');
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });
});