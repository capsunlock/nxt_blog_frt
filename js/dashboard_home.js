// 1. Icon Initialization
if (typeof lucide !== 'undefined') lucide.createIcons();

// 2. Sidebar Navigation Logic
const menuToggle = document.getElementById('menu-toggle');
const sidebar = document.querySelector('.sidebar');
const overlay = document.getElementById('sidebar-overlay');

function toggleSidebar() {
    const isActive = sidebar.classList.toggle('active');
    const icon = menuToggle.querySelector('i');
    icon.setAttribute('data-lucide', isActive ? 'x' : 'menu');
    lucide.createIcons();
}

if (menuToggle) menuToggle.addEventListener('click', toggleSidebar);
if (overlay) overlay.addEventListener('click', toggleSidebar);

document.querySelectorAll('.sidebar-link').forEach(link => {
    link.addEventListener('click', () => {
        if(window.innerWidth <= 1024) toggleSidebar();
    });
});

// 3. Profile Edit Logic
function toggleEditMode() {
    document.getElementById('profile-header').classList.toggle('edit-mode');
    lucide.createIcons();
}

function saveProfile() {
    const newName = document.getElementById('input-name').value;
    const newBio = document.getElementById('input-bio').value;
    const newLinks = document.getElementById('input-links').value;

    document.getElementById('display-name').innerText = newName;
    document.getElementById('display-bio').innerText = newBio;
    
    const linkHTML = newLinks.split(',').map(l => `<a href="#">${l.trim()}</a>`).join(' / ');
    document.getElementById('display-links').innerHTML = linkHTML;

    toggleEditMode();
}