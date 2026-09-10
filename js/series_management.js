// Series Management Handler
document.addEventListener('DOMContentLoaded', () => {
    lucide?.createIcons();
    
    loadSeries();
});

function loadSeries() {
    const series = JSON.parse(localStorage.getItem('journal_series') || '[]');
    const grid = document.getElementById('seriesGrid');
    
    if (series.length === 0) {
        grid.innerHTML = `
            <div class="empty-state">
                <i data-lucide="layers"></i>
                <p>No series yet. Create one to organize related posts.</p>
            </div>
        `;
        return;
    }
    
    grid.innerHTML = series.map(s => `
        <div class="series-card">
            <div class="series-card-title">${s.name}</div>
            <div class="series-card-desc">${s.description || 'No description'}</div>
            <div class="series-card-meta">
                <span>${s.posts?.length || 0} posts</span>
                <span>${new Date(s.created).toLocaleDateString()}</span>
            </div>
            <div class="series-card-actions">
                <button onclick="editSeries('${s.slug}')">Edit</button>
                <button onclick="deleteSeries('${s.slug}')">Delete</button>
            </div>
        </div>
    `).join('');
    
    lucide?.createIcons();
}

document.getElementById('newSeriesBtn')?.addEventListener('click', () => {
    document.getElementById('modalTitle').textContent = 'New Series';
    document.getElementById('seriesForm').reset();
    document.getElementById('seriesForm').dataset.edit = '';
    document.getElementById('seriesModal').classList.add('active');
});

document.getElementById('seriesForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('series-name').value;
    const description = document.getElementById('series-desc').value;
    const slug = document.getElementById('series-slug').value;
    
    let series = JSON.parse(localStorage.getItem('journal_series') || '[]');
    const isEdit = document.getElementById('seriesForm').dataset.edit;
    
    if (isEdit) {
        const index = series.findIndex(s => s.slug === isEdit);
        series[index] = { ...series[index], name, description, slug };
    } else {
        series.push({
            slug,
            name,
            description,
            posts: [],
            created: new Date().toISOString()
        });
    }
    
    localStorage.setItem('journal_series', JSON.stringify(series));
    closeSeriesModal();
    loadSeries();
});

function editSeries(slug) {
    const series = JSON.parse(localStorage.getItem('journal_series') || '[]');
    const s = series.find(x => x.slug === slug);
    
    if (!s) return;
    
    document.getElementById('modalTitle').textContent = 'Edit Series';
    document.getElementById('series-name').value = s.name;
    document.getElementById('series-desc').value = s.description || '';
    document.getElementById('series-slug').value = s.slug;
    document.getElementById('seriesForm').dataset.edit = slug;
    document.getElementById('seriesModal').classList.add('active');
}

function deleteSeries(slug) {
    if (!confirm('Are you sure you want to delete this series?')) return;
    
    let series = JSON.parse(localStorage.getItem('journal_series') || '[]');
    series = series.filter(s => s.slug !== slug);
    localStorage.setItem('journal_series', JSON.stringify(series));
    loadSeries();
}

function closeSeriesModal() {
    document.getElementById('seriesModal').classList.remove('active');
}
