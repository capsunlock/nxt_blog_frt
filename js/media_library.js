lucide.createIcons();

// --- Mobile Sidebar Logic ---
const menuToggle = document.getElementById('menu-toggle');
const sidebar = document.querySelector('.sidebar');
const overlay = document.getElementById('sidebar-overlay');

function toggleMenu() {
    const isActive = sidebar.classList.toggle('active');
    menuToggle.classList.toggle('active');
}

if (menuToggle) menuToggle.addEventListener('click', toggleMenu);
if (overlay) overlay.addEventListener('click', toggleMenu);

// --- Toast Logic ---
function showToast(message, iconName = 'check') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i data-lucide="${iconName}"></i><span>${message}</span>`;
    
    container.appendChild(toast);
    lucide.createIcons();

    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
    }, 3000);
}

// --- Media Actions (Copy & Delete) ---
document.querySelector('.media-grid').addEventListener('click', (e) => {
    const btn = e.target.closest('.icon-btn');
    if (!btn) return;

    // Copy Logic
    if (btn.classList.contains('action-copy')) {
        const url = btn.getAttribute('data-url');
        navigator.clipboard.writeText(url).then(() => {
            showToast('Link Copied', 'clipboard');
        });
    }

    // Delete Logic
    if (btn.classList.contains('action-delete')) {
        if (confirm("Permanently delete this asset?")) {
            const card = btn.closest('.media-card');
            card.style.opacity = '0';
            card.style.transform = 'scale(0.9)';
            card.style.transition = '0.3s';
            
            setTimeout(() => {
                card.remove();
                showToast('File Deleted', 'trash');
            }, 300);
        }
    }
});