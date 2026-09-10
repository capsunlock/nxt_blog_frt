 lucide.createIcons();

// Filter toggle visual logic
document.querySelectorAll('.filter-item').forEach(item => {
    item.addEventListener('click', function() {
        document.querySelector('.filter-item.active').classList.remove('active');
        this.classList.add('active');
    });
});