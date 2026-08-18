// Newsletter Handler
document.getElementById('newsletterForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = document.getElementById('newsletter-email').value;
    const statusEl = document.getElementById('newsletterStatus');
    
    if (!email) {
        showStatus('Please enter your email', 'error', statusEl);
        return;
    }
    
    // Store subscription
    const subscribers = JSON.parse(localStorage.getItem('journal_subscribers') || '[]');
    if (subscribers.includes(email)) {
        showStatus('You\'re already subscribed!', 'error', statusEl);
        return;
    }
    
    subscribers.push(email);
    localStorage.setItem('journal_subscribers', JSON.stringify(subscribers));
    
    showStatus('Welcome! Check your email to confirm.', 'success', statusEl);
    e.target.reset();
});

// Unsubscribe Handler
document.getElementById('unsubForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = document.getElementById('unsub-email').value;
    const reason = document.querySelector('input[name="reason"]:checked')?.value || 'unknown';
    
    // Log unsubscribe
    const unsubscriptions = JSON.parse(localStorage.getItem('journal_unsubscriptions') || '[]');
    unsubscriptions.push({
        email,
        reason,
        timestamp: new Date().toISOString()
    });
    localStorage.setItem('journal_unsubscriptions', JSON.stringify(unsubscriptions));
    
    // Remove from subscribers
    let subscribers = JSON.parse(localStorage.getItem('journal_subscribers') || '[]');
    subscribers = subscribers.filter(e => e !== email);
    localStorage.setItem('journal_subscribers', JSON.stringify(subscribers));
    
    // Redirect
    document.body.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100vh;"><div style="text-align: center;"><h1>Unsubscribed</h1><p>You have been removed from our newsletter.</p><a href="index.html" style="color: var(--accent-color); text-decoration: underline;">Back to Journal</a></div></div>';
});

function showStatus(message, type, element) {
    element.textContent = message;
    element.className = `form-status ${type}`;
    
    if (type === 'success') {
        setTimeout(() => {
            element.className = 'form-status';
        }, 3000);
    }
}
