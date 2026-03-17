document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Page Lifecycle & Transitions ---
    document.body.classList.add('page-loaded');
    if (typeof lucide !== 'undefined') lucide.createIcons();

    const transitionOverlay = document.createElement('div');
    transitionOverlay.className = 'page-transition-overlay';
    document.body.appendChild(transitionOverlay);

    // Intercept Links for Transitions
    document.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href && !href.startsWith('#') && !href.startsWith('mailto') && link.target !== '_blank') {
                e.preventDefault();
                transitionOverlay.classList.add('active');
                setTimeout(() => { window.location.href = href; }, 400);
            }
        });
    });

// --- 2. Custom Cursor ---
    const cursor = document.createElement('div');
    cursor.id = 'custom-cursor';
    document.body.appendChild(cursor);

    document.addEventListener('mousemove', (e) => {
        // Use requestAnimationFrame for smoother performance
        requestAnimationFrame(() => {
            cursor.style.left = `${e.clientX}px`;
            cursor.style.top = `${e.clientY}px`;
        });
    });

    const updateHoverEvents = () => {
        const hoverables = document.querySelectorAll('a, button, .series-card, .index-row');
        hoverables.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.style.transform = 'translate(-50%, -50%) scale(2.5)';
                cursor.style.backgroundColor = 'var(--text-color)'; // Fills in solid
                cursor.style.opacity = '1';
            });
            el.addEventListener('mouseleave', () => {
                cursor.style.transform = 'translate(-50%, -50%) scale(1)';
                cursor.style.backgroundColor = 'rgba(0, 0, 0, 0.05)'; // Back to hollow
            });
        });
    };
    updateHoverEvents();

    // --- 3. Search Overlay ---
    const searchBtn = document.getElementById('search-btn');
    const searchOverlay = document.getElementById('search-overlay');
    const closeSearch = document.getElementById('close-search');
    const searchInput = document.getElementById('search-input');

    if (searchBtn && searchOverlay) {
        searchBtn.addEventListener('click', () => {
            searchOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
            setTimeout(() => searchInput.focus(), 100);
        });

        const hideSearch = () => {
            searchOverlay.classList.remove('active');
            document.body.style.overflow = '';
        };

        closeSearch.addEventListener('click', hideSearch);
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && searchOverlay.classList.contains('active')) hideSearch();
        });
    }

    // --- 4. Theme Logic ---
    const themeToggle = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;
    const currentStoredTheme = localStorage.getItem('theme') || 'light';
    htmlElement.setAttribute('data-theme', currentStoredTheme);

    themeToggle?.addEventListener('click', () => {
        const newTheme = htmlElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });

    // --- 5. Mobile Menu ---
    const mobileMenuBtn = document.getElementById('mobile-menu');
    const navLinks = document.getElementById('navLinks');

    mobileMenuBtn?.addEventListener('click', () => {
        mobileMenuBtn.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });
});

// --- Scroll Performance ---
window.onscroll = function() { 
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    
    const bar = document.getElementById("myBar");
    if (bar) bar.style.width = scrolled + "%";

    const btt = document.getElementById("backToTop");
    if (btt) {
        if (window.scrollY > 500) btt.classList.add("visible");
        else btt.classList.remove("visible");
    }
};

document.getElementById("backToTop")?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
});