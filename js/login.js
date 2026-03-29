document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('.enter-btn');
    btn.innerText = "Verifying...";
    
    // Simulation of dashboard entry
    setTimeout(() => {
        document.body.classList.add('logging-in');
        setTimeout(() => {
            window.location.href = 'dashboard_home.html';
        }, 600);
    }, 1000);
});