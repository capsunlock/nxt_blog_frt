document.addEventListener('DOMContentLoaded', () => {
    // --- Search Overlay Logic ---
    const searchBtn = document.getElementById('search-btn');
    const searchOverlay = document.getElementById('search-overlay');
    const closeSearch = document.getElementById('close-search');
    const searchInput = document.getElementById('search-input');

    if (searchBtn && searchOverlay) {
        searchBtn.addEventListener('click', () => {
            searchOverlay.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent scroll
            setTimeout(() => searchInput.focus(), 100); // Auto-focus input
        });

        const hideSearch = () => {
            searchOverlay.classList.remove('active');
            document.body.style.overflow = '';
            searchInput.value = ''; // Clear input on close
        };

        closeSearch.addEventListener('click', hideSearch);

        // Close on Escape key
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && searchOverlay.classList.contains('active')) {
                hideSearch();
            }
        });
    }

    // --- Theme Logic ---
    const themeToggle = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;

    const currentStoredTheme = localStorage.getItem('theme') || htmlElement.getAttribute('data-theme') || 'light';
    htmlElement.setAttribute('data-theme', currentStoredTheme);

    themeToggle.addEventListener('click', () => {
        const oldTheme = htmlElement.getAttribute('data-theme');
        const newTheme = oldTheme === 'light' ? 'dark' : 'light';
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });

    // --- Mobile Menu Logic ---
    const mobileMenuBtn = document.getElementById('mobile-menu');
    const navLinks = document.getElementById('navLinks');

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenuBtn.classList.toggle('active');
            navLinks.classList.toggle('active');
            
            // Prevent scrolling when menu is open
            document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
        });

        // Close menu when clicking a link
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuBtn.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }
});
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
});