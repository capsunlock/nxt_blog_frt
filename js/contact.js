// Contact Form Handler
document.getElementById('contactForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;
    
    const statusEl = document.getElementById('formStatus');
    
    // Validate
    if (!name || !email || !subject || !message) {
        showFormStatus('Please fill in all fields', 'error', statusEl);
        return;
    }
    
    // Simulate submission (replace with API call later)
    const formData = {
        name,
        email,
        subject,
        message,
        timestamp: new Date().toISOString()
    };
    
    // Store in localStorage for now
    const contacts = JSON.parse(localStorage.getItem('journal_contacts') || '[]');
    contacts.push(formData);
    localStorage.setItem('journal_contacts', JSON.stringify(contacts));
    
    showFormStatus('Message sent! We\'ll get back to you soon.', 'success', statusEl);
    e.target.reset();
});

function showFormStatus(message, type, element) {
    element.textContent = message;
    element.className = `form-status ${type}`;
    
    if (type === 'success') {
        setTimeout(() => {
            element.className = 'form-status';
        }, 3000);
    }
}
