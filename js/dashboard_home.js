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
    const twitter = document.getElementById('input-twitter').value;
    const newsletter = document.getElementById('input-newsletter').value;
    const rss = document.getElementById('input-rss').value;

    document.getElementById('display-name').innerText = newName;
    document.getElementById('display-bio').innerText = newBio;

    const linkHTML = `<a href="${twitter}" target="_blank">Twitter</a> / <a href="${newsletter}" target="_blank">Newsletter</a> / <a href="${rss}" target="_blank">RSS</a>`;
    document.getElementById('display-links').innerHTML = linkHTML;

    toggleEditMode();
}
