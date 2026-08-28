document.addEventListener('DOMContentLoaded', () => {
    if (typeof lucide !== 'undefined') lucide.createIcons();
    renderSeries();
});

function renderSeries() {
    const container = document.getElementById('series-container');

    const series = [
        {
            title: 'The Brutalist Digital',
            desc: 'Exploring how 20th-century concrete architecture shaped the modern web\'s logic.',
            count: '5 Parts',
            image: 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=800',
            href: 'collection_single.html'
        },
        {
            title: 'The Typography of Silence',
            desc: 'How variable fonts and fluid rhythm create psychological breathing room in design.',
            count: '3 Parts',
            image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800',
            href: 'collection_single.html'
        }
    ];

    container.innerHTML = '';

    series.forEach(s => {
        const card = document.createElement('a');
        card.href = s.href;
        card.className = 'series-card';
        card.innerHTML = `
            <div class="series-image">
                <img src="${s.image}" alt="${s.title}">
                <span class="series-count">${s.count}</span>
            </div>
            <div class="series-content">
                <span class="series-meta">Curated Series</span>
                <h2>${s.title}</h2>
                <p>${s.desc}</p>
                <span class="view-series">View Series →</span>
            </div>
        `;
        container.appendChild(card);
    });
}