window.onscroll = function() { 
    updateProgressBar();
    handleBackToTop();
};

function updateProgressBar() {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    
    const bar = document.getElementById("myBar");
    if (bar) bar.style.width = scrolled + "%";
}

function handleBackToTop() {
    const btn = document.getElementById("backToTop");
    const threshold = document.documentElement.scrollHeight / 3;
    
    if (window.scrollY > threshold) {
        btn.classList.add("visible");
    } else {
        btn.classList.remove("visible");
    }
}

document.getElementById("backToTop")?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
});

document.addEventListener('DOMContentLoaded', () => {
    if (typeof lucide !== 'undefined') lucide.createIcons();
});