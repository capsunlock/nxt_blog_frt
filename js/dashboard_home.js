// 1. Icon Initialization
if (typeof lucide !== 'undefined') lucide.createIcons();

// 2. Profile Edit Logic
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
