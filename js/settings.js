document.addEventListener('DOMContentLoaded', () => {
    if (typeof lucide !== 'undefined') lucide.createIcons();
    
    // Load existing settings
    const savedConfig = localStorage.getItem('journal_config');
    if (savedConfig) {
        const config = JSON.parse(savedConfig);
        document.getElementById('site-title').value = config.title || '';
        document.getElementById('author-name').value = config.author || '';
        document.getElementById('social-x').value = config.socialX || '';
        document.getElementById('social-github').value = config.socialGithub || '';
    }

    // Save Logic
    document.getElementById('save-settings').addEventListener('click', () => {
        const config = {
            title: document.getElementById('site-title').value,
            author: document.getElementById('author-name').value,
            socialX: document.getElementById('social-x').value,
            socialGithub: document.getElementById('social-github').value
        };

        localStorage.setItem('journal_config', JSON.stringify(config));
        
        // Visual Feedback
        const btn = document.getElementById('save-settings');
        const originalText = btn.innerText;
        btn.innerText = "SAVED!";
        btn.style.background = "#2a9d8f";
        
        setTimeout(() => {
            btn.innerText = originalText;
            btn.style.background = "";
        }, 2000);
    });
});
