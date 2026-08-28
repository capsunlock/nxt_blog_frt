// Comments Management Handler
document.addEventListener('DOMContentLoaded', () => {
    lucide?.createIcons();
    
    // Mobile Sidebar Logic
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
    
    loadComments();
});

let comments = [];
let currentCommentId = null;

function loadComments() {
    // Load from localStorage (replace with API call later)
    comments = JSON.parse(localStorage.getItem('journal_comments') || '[]');
    renderComments();
}

function renderComments() {
    const list = document.getElementById('commentsList');
    const statusFilter = document.getElementById('statusFilter').value;
    const searchFilter = document.getElementById('searchFilter').value.toLowerCase();
    
    let filtered = comments;
    
    if (statusFilter) {
        filtered = filtered.filter(c => c.status === statusFilter);
    }
    
    if (searchFilter) {
        filtered = filtered.filter(c =>
            c.text.toLowerCase().includes(searchFilter) ||
            c.author.toLowerCase().includes(searchFilter)
        );
    }
    
    if (filtered.length === 0) {
        list.innerHTML = `
            <div class="empty-state">
                <i data-lucide="message-square"></i>
                <p>No comments found.</p>
            </div>
        `;
        return;
    }
    
    list.innerHTML = filtered.map((comment, index) => `
        <div class="comment-item" onclick="openCommentModal(${index})">
            <div>
                <div class="comment-header">
                    <span class="comment-author">${comment.author}</span>
                    <span class="comment-date">${new Date(comment.date).toLocaleDateString()}</span>
                </div>
                <div class="comment-post">
                    Posted on: <strong>${comment.postTitle}</strong>
                </div>
                <p class="comment-text">${comment.text}</p>
                <div class="comment-status status-${comment.status}">
                    ${comment.status}
                </div>
            </div>
            <div class="comment-actions">
                <button class="comment-action-btn" onclick="quickApprove(event, ${index})" title="Approve">
                    <i data-lucide="check" style="width: 16px;"></i>
                </button>
                <button class="comment-action-btn" onclick="quickReject(event, ${index})" title="Reject">
                    <i data-lucide="x" style="width: 16px;"></i>
                </button>
            </div>
        </div>
    `).join('');
    
    lucide?.createIcons();
}

function openCommentModal(index) {
    currentCommentId = index;
    const comment = comments[index];
    
    const detail = document.getElementById('commentDetail');
    detail.innerHTML = `
        <div class="detail-header">
            <div class="detail-author">${comment.author}</div>
            <div class="detail-meta">
                <span>Email: ${comment.email}</span>
                <span>${new Date(comment.date).toLocaleString()}</span>
            </div>
            <div class="detail-post">
                <strong>On post:</strong> <a href="blog_post.html">${comment.postTitle}</a>
            </div>
        </div>
        <div class="detail-status">
            <label>Current Status:</label>
            <strong class="status-${comment.status}">${comment.status.toUpperCase()}</strong>
        </div>
        <div class="detail-text">${comment.text}</div>
    `;
    
    document.getElementById('commentModal').classList.add('active');
    lucide?.createIcons();
}

function closeCommentModal() {
    document.getElementById('commentModal').classList.remove('active');
    currentCommentId = null;
}

function approveComment() {
    if (currentCommentId !== null) {
        comments[currentCommentId].status = 'approved';
        saveComments();
        closeCommentModal();
        renderComments();
    }
}

function rejectComment() {
    if (currentCommentId !== null) {
        comments[currentCommentId].status = 'rejected';
        saveComments();
        closeCommentModal();
        renderComments();
    }
}

function markSpam() {
    if (currentCommentId !== null && confirm('Mark this comment as spam?')) {
        comments[currentCommentId].status = 'spam';
        saveComments();
        closeCommentModal();
        renderComments();
    }
}

function quickApprove(e, index) {
    e.stopPropagation();
    comments[index].status = 'approved';
    saveComments();
    renderComments();
}

function quickReject(e, index) {
    e.stopPropagation();
    comments[index].status = 'rejected';
    saveComments();
    renderComments();
}

function saveComments() {
    localStorage.setItem('journal_comments', JSON.stringify(comments));
}

// Filter handlers
document.getElementById('statusFilter')?.addEventListener('change', renderComments);
document.getElementById('searchFilter')?.addEventListener('input', renderComments);

// Close modal when clicking overlay
document.getElementById('commentModal')?.addEventListener('click', (e) => {
    if (e.target.id === 'commentModal') {
        closeCommentModal();
    }
});
