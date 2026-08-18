// Password Reset Handler - 4 Stage Flow
let resetToken = null;
let resetEmail = null;

// Check if user has a token in URL (from email link)
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    resetToken = urlParams.get('token');
    
    if (resetToken) {
        // User clicked email link, show password reset form
        document.getElementById('resetStage1').classList.add('hidden');
        document.getElementById('resetStage2').classList.add('hidden');
        document.getElementById('resetStage3').classList.remove('hidden');
    }
});

// Stage 1: Request Reset
document.getElementById('resetRequestForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    resetEmail = document.getElementById('reset-email').value;
    const statusEl = document.getElementById('resetStatus');
    
    if (!resetEmail) {
        showResetStatus('Please enter your email', 'error', statusEl);
        return;
    }
    
    // Simulate sending reset link
    const token = Math.random().toString(36).substr(2, 16);
    const resetRequests = JSON.parse(localStorage.getItem('journal_reset_requests') || '[]');
    resetRequests.push({
        email: resetEmail,
        token,
        timestamp: new Date().toISOString(),
        expires: new Date(Date.now() + 3600000).toISOString()
    });
    localStorage.setItem('journal_reset_requests', JSON.stringify(resetRequests));
    
    // Transition to Stage 2
    hideAllStages();
    document.getElementById('resetStage2').classList.remove('hidden');
});

// Stage 3: Confirm New Password
document.getElementById('resetConfirmForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const password = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const statusEl = document.getElementById('confirmStatus');
    
    if (!password || !confirmPassword) {
        showResetStatus('Please fill in all fields', 'error', statusEl);
        return;
    }
    
    if (password !== confirmPassword) {
        showResetStatus('Passwords do not match', 'error', statusEl);
        return;
    }
    
    if (password.length < 8) {
        showResetStatus('Password must be at least 8 characters', 'error', statusEl);
        return;
    }
    
    // Simulate password reset (replace with API call later)
    const resetRequests = JSON.parse(localStorage.getItem('journal_reset_requests') || '[]');
    const requestIndex = resetRequests.findIndex(r => r.token === resetToken);
    
    if (requestIndex === -1) {
        showResetStatus('Invalid or expired reset link', 'error', statusEl);
        return;
    }
    
    // Store new password (in real app, hash and update database)
    const users = JSON.parse(localStorage.getItem('journal_users') || '[]');
    const userIndex = users.findIndex(u => u.email === resetRequests[requestIndex].email);
    if (userIndex !== -1) {
        users[userIndex].password = password;
        localStorage.setItem('journal_users', JSON.stringify(users));
    }
    
    // Remove used reset request
    resetRequests.splice(requestIndex, 1);
    localStorage.setItem('journal_reset_requests', JSON.stringify(resetRequests));
    
    // Show success stage
    hideAllStages();
    document.getElementById('resetStage4').classList.remove('hidden');
});

function goBackToReset() {
    hideAllStages();
    document.getElementById('resetStage1').classList.remove('hidden');
    document.getElementById('reset-email').value = '';
    document.getElementById('resetStatus').className = 'form-status';
}

function hideAllStages() {
    document.getElementById('resetStage1').classList.add('hidden');
    document.getElementById('resetStage2').classList.add('hidden');
    document.getElementById('resetStage3').classList.add('hidden');
    document.getElementById('resetStage4').classList.add('hidden');
}

function showResetStatus(message, type, element) {
    element.textContent = message;
    element.className = `form-status ${type}`;
}
