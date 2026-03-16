document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Index Filtering ---
    const filterButtons = document.querySelectorAll('.filter-btn');
    const indexRows = document.querySelectorAll('.index-row');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            indexRows.forEach(row => {
                if (filterValue === 'all' || row.getAttribute('data-category') === filterValue) {
                    row.style.display = 'grid';
                    setTimeout(() => row.style.opacity = '1', 10);
                } else {
                    row.style.opacity = '0';
                    setTimeout(() => row.style.display = 'none', 300);
                }
            });
        });
    });

    // --- 2. Load More Collections ---
    const loadMoreBtn = document.getElementById('load-more-series');
    const seriesGrid = document.querySelector('.series-grid');

    if (loadMoreBtn && seriesGrid) {
        loadMoreBtn.addEventListener('click', () => {
            loadMoreBtn.innerText = "Loading Series...";
            loadMoreBtn.disabled = true;

            // Simulating content fetch
            setTimeout(() => {
                const newSeries = `
                    <div class="series-card" style="opacity: 0; transform: translateY(20px); transition: all 0.6s ease;">
                        <div class="series-image">
                            <img src="https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&w=800" alt="Series">
                            <span class="series-count">4 Parts</span>
                        </div>
                        <div class="series-content">
                            <span class="series-meta">Curated Series</span>
                            <h2>The Logic of Grid Systems</h2>
                            <p>How mathematical constraints lead to creative freedom in layout design.</p>
                            <a href="collection_single.html" class="view-series">View Collection →</a>
                        </div>
                    </div>
                `;
                
                seriesGrid.insertAdjacentHTML('beforeend', newSeries);
                
                // Animate in the new card
                const lastAdded = seriesGrid.lastElementChild;
                setTimeout(() => {
                    lastAdded.style.opacity = '1';
                    lastAdded.style.transform = 'translateY(0)';
                }, 10);

                loadMoreBtn.innerText = "See More Collections";
                loadMoreBtn.disabled = false;
                
                // Re-trigger cursor events for new elements
                if (window.dispatchEvent) window.dispatchEvent(new Event('resize')); 
            }, 800);
        });
    }
});