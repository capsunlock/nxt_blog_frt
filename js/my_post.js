 lucide.createIcons();

// Mobile Sidebar Logic
const menuToggle = document.getElementById('menu-toggle');
const sidebar = document.querySelector('.sidebar');
const overlay = document.getElementById('sidebar-overlay');

function toggleMenu() {
    const isActive = sidebar.classList.toggle('active');
    const icon = menuToggle.querySelector('i');
    icon.setAttribute('data-lucide', isActive ? 'x' : 'menu');
    lucide.createIcons();
}

if (menuToggle) menuToggle.addEventListener('click', toggleMenu);
if (overlay) overlay.addEventListener('click', toggleMenu);

// Filter toggle visual logic
document.querySelectorAll('.filter-item').forEach(item => {
    item.addEventListener('click', function() {
        document.querySelector('.filter-item.active').classList.remove('active');
        this.classList.add('active');
    });
});