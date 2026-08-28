window.onscroll = function() { 
    updateProgressBar();
    handleBackToTop();
};

function updateProgressBar() {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    
    const bar = document.getElementById("myBar");
    if (bar) bar.style.width = scrolled + "%";
}

function handleBackToTop() {
    const btn = document.getElementById("backToTop");
    const threshold = document.documentElement.scrollHeight / 3;
    
    if (window.scrollY > threshold) {
        btn.classList.add("visible");
    } else {
        btn.classList.remove("visible");
    }
}

document.getElementById("backToTop")?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
});

document.addEventListener('DOMContentLoaded', () => {
    if (typeof lucide !== 'undefined') lucide.createIcons();

    const urlParams = new URLSearchParams(window.location.search);
    const slug = urlParams.get('slug');
    
    if (slug) {
        const posts = JSON.parse(localStorage.getItem('journal_posts') || '[]');
        const post = posts.find(p => p.slug === slug);
        
        if (post) {
            const titleEl = document.querySelector('.post-full-title');
            const catEl = document.querySelector('.post-category');
            const subtitleEl = document.querySelector('.post-subtitle');
            const bodyEl = document.querySelector('.post-body');
            const tagsEl = document.querySelector('.post-tags');
            const heroEl = document.querySelector('.post-hero-image');
            
            if (titleEl) titleEl.textContent = post.title;
            if (catEl) catEl.textContent = post.category || 'Uncategorized';
            if (subtitleEl) subtitleEl.textContent = post.subtitle || '';
            if (bodyEl) bodyEl.innerHTML = post.body || '<p>No content available.</p>';
            
            if (post.tags && tagsEl) {
                tagsEl.innerHTML = post.tags.map(t => `<a href="tag.html?tag=${encodeURIComponent(t)}">#${t}</a>`).join(' ');
            }
            
            if (post.heroImage && heroEl) {
                heroEl.innerHTML = `<img src="${post.heroImage}" alt="Hero Image">`;
            }
            
            document.title = `${post.title} — Journal`;
        }
    }
});