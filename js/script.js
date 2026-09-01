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
    const searchInput = searchOverlay?.querySelector('input[type="text"]');
    const searchSuggestions = document.getElementById('search-suggestions');

    if (searchBtn && searchOverlay) {
        searchBtn.addEventListener('click', () => {
            searchOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
            setTimeout(() => searchInput?.focus(), 100);
        });

        const hideSearch = () => {
            searchOverlay.classList.remove('active');
            document.body.style.overflow = '';
            if (searchInput) searchInput.value = '';
            if (searchSuggestions) {
                searchSuggestions.innerHTML = '';
                searchSuggestions.style.display = 'none';
            }
        };

        closeSearch.addEventListener('click', hideSearch);
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && searchOverlay.classList.contains('active')) hideSearch();
        });

        searchInput?.addEventListener('input', (e) => {
            const query = e.target.value.trim();
            if (!query || !searchSuggestions) {
                if (searchSuggestions) {
                    searchSuggestions.innerHTML = '';
                    searchSuggestions.style.display = 'none';
                }
                return;
            }

            const posts = JSON.parse(localStorage.getItem('journal_posts') || '[]');
            const lowerQuery = query.toLowerCase();
            const matches = posts.filter(post => 
                post.title?.toLowerCase().includes(lowerQuery) ||
                post.category?.toLowerCase().includes(lowerQuery) ||
                (post.tags && post.tags.some(tag => tag.toLowerCase().includes(lowerQuery)))
            ).slice(0, 5);

            if (matches.length === 0) {
                searchSuggestions.innerHTML = '<div class="suggestion-item">No results found</div>';
            } else {
                searchSuggestions.innerHTML = matches.map(post => {
                    const slug = post.slug || post.title.toLowerCase().replace(/\s+/g, '-');
                    return `<a href="blog_post.html?slug=${slug}" class="suggestion-item" data-close-search>
                        <div class="suggestion-title">${post.title || 'Untitled'}</div>
                        <div class="suggestion-meta">${post.category || ''} ${post.date || ''}</div>
                    </a>`;
                }).join('');
            }
            searchSuggestions.style.display = 'block';
        });

        searchSuggestions?.addEventListener('click', (e) => {
            if (e.target.closest('[data-close-search]')) {
                hideSearch();
            }
        });

        searchInput?.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const query = e.target.value.trim();
                if (query) {
                    hideSearch();
                    window.location.href = `search.html?q=${encodeURIComponent(query)}`;
                }
            }
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

    if (navLinks && mobileMenuBtn) {
        const navOverlay = document.createElement('div');
        navOverlay.className = 'nav-overlay';
        document.body.appendChild(navOverlay);

        function openMenu() {
            mobileMenuBtn.classList.add('active');
            navLinks.classList.add('active');
            navOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        function closeMenu() {
            mobileMenuBtn.classList.remove('active');
            navLinks.classList.remove('active');
            navOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }

        mobileMenuBtn.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        navOverlay.addEventListener('click', closeMenu);

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                closeMenu();
            });
        });
    }
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

(function initDemoData() {
    if (!localStorage.getItem('journal_posts')) {
        const demoPosts = [
            {
                slug: 'minimalist-structures',
                title: 'Minimalist Structures & The Digital Void',
                subtitle: 'Exploring how brutalist physical forms influence the architecture of our modern digital interfaces.',
                body: '<p>The intersection of physical space and digital boundaries has never been more blurred. As we navigate through environments designed to minimize friction, we find ourselves echoing the sentiments of the mid-century modernists.</p><p>Architecture is not just about the walls that hold a roof, but the space created between them. In web design, we often refer to this as "negative space," yet it serves the exact same purpose: to provide the eye with a place to rest.</p>',
                category: 'Architecture',
                tags: ['Brutalism', 'Design', 'Architecture'],
                date: '2026-03-14',
                heroImage: 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1600',
                author: 'Elena Vance'
            },
            {
                slug: 'art-of-less',
                title: 'The Art of Less: Why Simplification Wins',
                subtitle: 'Why users value room to breathe over features.',
                body: '<p>In a world of infinite features, the bravest design choice is often to remove. Simplification is not about deprivation—it is about intention. Every element that remains must earn its place.</p>',
                category: 'Strategy',
                tags: ['Minimalism', 'UX', 'Design'],
                date: '2026-03-10',
                heroImage: 'https://images.unsplash.com/photo-1512446813987-060361ca11bc?auto=format&fit=crop&w=1600',
                author: 'Elena Vance'
            },
            {
                slug: 'typography-rhythm',
                title: 'Typography Rhythm in Modern Layouts',
                subtitle: 'How font choices shape user perception.',
                body: '<p>Typography is not just about readability—it is about rhythm. The space between letters, the weight of strokes, the flow from one line to the next: all of these create a tempo that guides the reader through the content.</p>',
                category: 'Typography',
                tags: ['Typography', 'Design', 'CSS'],
                date: '2026-03-05',
                heroImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600',
                author: 'Elena Vance'
            }
        ];
        localStorage.setItem('journal_posts', JSON.stringify(demoPosts));
    }

    if (!localStorage.getItem('journal_authors')) {
        const demoAuthors = [
            { id: 1, name: 'Elena Vance', role: 'Design Editor', bio: 'Design Editor & Architectural Historian based in Berlin. Exploring the tension between brutalist heritage and digital futures.', avatar: 'https://i.pravatar.cc/150?u=editor' }
        ];
        localStorage.setItem('journal_authors', JSON.stringify(demoAuthors));
    }

    if (!localStorage.getItem('journal_series')) {
        const demoSeries = [
            { id: 1, name: 'Minimalist Structures', desc: 'A deep dive into brutalism and digital design.', postCount: 2 },
            { id: 2, name: 'Design Philosophy', desc: 'Exploring the why behind great design.', postCount: 1 }
        ];
        localStorage.setItem('journal_series', JSON.stringify(demoSeries));
    }

    if (!localStorage.getItem('journal_comments')) {
        const demoComments = [
            { id: 1, postTitle: 'Minimalist Structures & The Digital Void', author: 'Reader One', text: 'Beautifully written. This resonated deeply.', status: 'approved', date: '2026-03-15' },
            { id: 2, postTitle: 'The Art of Less: Why Simplification Wins', author: 'Designer X', text: 'Would love to see a follow-up on color theory.', status: 'pending', date: '2026-03-11' }
        ];
        localStorage.setItem('journal_comments', JSON.stringify(demoComments));
    }
})();