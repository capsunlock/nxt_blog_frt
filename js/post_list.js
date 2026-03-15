document.addEventListener('DOMContentLoaded', () => {
    if (typeof lucide !== 'undefined') lucide.createIcons();

    const track = document.getElementById('heroTrack');
    const cards = document.querySelectorAll('.hero-card');
    const prevBtn = document.getElementById('prev-hero');
    const nextBtn = document.getElementById('next-hero');
    let currentIndex = 1;

    function updateHero() {
        if (!track || cards.length === 0 || window.innerWidth < 1024) return;

        const viewportWidth = window.innerWidth;
        const cardWidth = cards[0].offsetWidth;
        const gap = parseFloat(getComputedStyle(track).gap || 0);

        cards.forEach((card, i) => {
            card.classList.toggle('featured', i === currentIndex);
        });

        // Center calculation
        const centerOffset = (viewportWidth / 2) - (cardWidth / 2);
        const totalTranslate = centerOffset - (currentIndex * (cardWidth + gap));

        track.style.transform = `translateX(${totalTranslate}px)`;
    }

    // Navigation Events
    prevBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        if (currentIndex > 0) { currentIndex--; updateHero(); }
    });

    nextBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        if (currentIndex < cards.length - 1) { currentIndex++; updateHero(); }
    });

    cards.forEach((card, index) => {
        card.addEventListener('click', () => {
            if (index !== currentIndex) { 
                currentIndex = index; 
                updateHero(); 
            }
        });
    });

    // --- Feed Intersection Observer ---
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.scattered-item').forEach(item => revealObserver.observe(item));

    // --- Load More ---
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    loadMoreBtn?.addEventListener('click', () => {
        loadMoreBtn.innerText = "Sourcing...";
        loadMoreBtn.disabled = true;

        setTimeout(() => {
            const grid = document.getElementById('postGrid');
            for(let i=0; i<2; i++) {
                const newItem = document.createElement('article');
                newItem.className = 'post-card scattered-item';
                // Note: The template literal below ensures consistent metadata
                newItem.innerHTML = `
                    <div class="post-image"><img src="https://picsum.photos/id/${Math.floor(Math.random()*50) + 10}/800/450" alt="New Post"></div>
                    <div class="post-meta">
                        <span class="post-category">Archive</span> • Mar 2026 • 5 min
                    </div>
                    <h2 class="post-title"><a href="#">Expanding the Narrative</a></h2>
                    <div class="post-tags">
                        <a href="#">#New</a> <a href="#">#Editorial</a>
                    </div>
                    <p class="post-excerpt">Fresh insights added to the grid with dynamic metadata support.</p>
                    <a href="#" class="continue-link">Continue reading →</a>
                `;
                grid.appendChild(newItem);
                
                // Observe the new item immediately
                if (window.innerWidth >= 1024) {
                    revealObserver.observe(newItem);
                }
            }
            loadMoreBtn.innerText = "Load More Stories";
            loadMoreBtn.disabled = false;
        }, 800);
    });

    window.addEventListener('resize', updateHero);
    
    // Initial Positioning
    updateHero();
});