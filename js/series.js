document.addEventListener('DOMContentLoaded', () => {
    if (typeof lucide !== 'undefined') lucide.createIcons();
    renderSeries();

    const modal = document.getElementById('series-modal');
    
    document.getElementById('open-series-modal').onclick = () => modal.style.display = 'flex';
    document.getElementById('close-modal').onclick = () => modal.style.display = 'none';

    document.getElementById('save-series').onclick = () => {
        const name = document.getElementById('series-name').value;
        const desc = document.getElementById('series-desc').value;

        if(!name) return alert("Name required.");

        const seriesList = JSON.parse(localStorage.getItem('journal_series') || '[]');
        seriesList.push({
            id: Date.now(),
            name: name,
            desc: desc,
            postCount: 0
        });

        localStorage.setItem('journal_series', JSON.stringify(seriesList));
        modal.style.display = 'none';
        renderSeries();
    };
});

function renderSeries() {
    const container = document.getElementById('series-container');
    const seriesList = JSON.parse(localStorage.getItem('journal_series') || '[]');

    if (seriesList.length === 0) return;

    container.innerHTML = '';
    seriesList.forEach(s => {
        const card = document.createElement('div');
        card.className = 'series-card';
        card.innerHTML = `
            <div>
                <h3>${s.name}</h3>
                <p>${s.desc}</p>
            </div>
            <div class="series-meta">
                <span>Posts: ${s.postCount}</span>
                <a href="#" onclick="deleteSeries(${s.id})" style="color:red; text-decoration:none;">Purge</a>
            </div>
        `;
        container.appendChild(card);
    });
}

function deleteSeries(id) {
    if(confirm("Delete this series? Posts won't be deleted, but they will be unlinked.")) {
        let seriesList = JSON.parse(localStorage.getItem('journal_series') || '[]');
        seriesList = seriesList.filter(s => s.id !== id);
        localStorage.setItem('journal_series', JSON.stringify(seriesList));
        renderSeries();
    }
}