document.addEventListener('DOMContentLoaded', () => {
    if (typeof lucide !== 'undefined') lucide.createIcons();

    const track = document.getElementById('heroTrack');
    const cards = document.querySelectorAll('.hero-card');
    const prevBtn = document.getElementById('prev-hero');
    const nextBtn = document.getElementById('next-hero');
    let currentIndex = 1;

    function updateHero() {
        if (!track || cards.length === 0) return;

        const viewportWidth = window.innerWidth;
        const cardWidth = cards[0].offsetWidth;
        const gap = parseFloat(getComputedStyle(track).gap || 0);

        // 1. Force the active class BEFORE moving to prevent visual lag
        cards.forEach((card, i) => {
            card.classList.toggle('featured', i === currentIndex);
        });

        // 2. Calculate the center point based on the index
        // This math bypasses getBoundingClientRect for the move itself to ensure instant response
        const centerOffset = (viewportWidth / 2) - (cardWidth / 2);
        const totalTranslate = centerOffset - (currentIndex * (cardWidth + gap));

        track.style.transform = `translateX(${totalTranslate}px)`;
    }

    // Explicitly update focus on arrow clicks
    prevBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        if (currentIndex > 0) {
            currentIndex--;
            updateHero();
        }
    });

    nextBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        if (currentIndex < cards.length - 1) {
            currentIndex++;
            updateHero();
        }
    });

    // Handle clicks directly on cards
    cards.forEach((card, index) => {
        card.addEventListener('click', () => {
            if (index !== currentIndex) {
                currentIndex = index;
                updateHero();
            }
        });
    });

    // --- Intersection Observer for Feed ---
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll('.scattered-item').forEach(item => revealObserver.observe(item));

    // --- Load More Simulation ---
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    loadMoreBtn?.addEventListener('click', () => {
        loadMoreBtn.innerText = "Sourcing...";
        setTimeout(() => {
            const grid = document.getElementById('postGrid');
            for(let i=0; i<2; i++) {
                const newItem = document.createElement('article');
                newItem.className = 'post-card scattered-item';
                newItem.innerHTML = `
                    <div class="post-image"><img src="https://picsum.photos/id/${Math.floor(Math.random()*50)}/800/450" alt=""></div>
                    <div class="post-meta">Mar 2026 • 5 min</div>
                    <h2 class="post-title"><a href="#">New Content</a></h2>
                    <p class="post-excerpt">Dynamic entry added to grid.</p>
                `;
                grid.appendChild(newItem);
                revealObserver.observe(newItem);
            }
            loadMoreBtn.innerText = "Load More Stories";
        }, 600);
    });

    // Adjust on window resize
    window.addEventListener('resize', updateHero);
    
    // Initial call to set starting position
    updateHero();
});