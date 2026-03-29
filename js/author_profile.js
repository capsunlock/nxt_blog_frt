 // Specific logic for Author Load More
document.getElementById('author-load-more')?.addEventListener('click', function() {
    const btn = this;
    btn.innerText = "Sourcing Archives...";
    
    setTimeout(() => {
        const biblioList = document.getElementById('author-biblio-list');
        const newRow = `
            <a href="post_single.html" class="index-row" style="opacity: 0; transform: translateY(10px); transition: all 0.4s ease;">
                <span class="index-date">Dec 20</span>
                <span class="index-title">The Digital Stoic</span>
                <span class="index-cat">Editorial</span>
            </a>
        `;
        biblioList.insertAdjacentHTML('beforeend', newRow);
        
        const lastAdded = biblioList.lastElementChild;
        setTimeout(() => {
            lastAdded.style.opacity = '1';
            lastAdded.style.transform = 'translateY(0)';
        }, 10);

        btn.innerText = "See More Work";
    }, 800);
});