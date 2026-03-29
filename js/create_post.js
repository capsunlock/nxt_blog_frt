lucide.createIcons();

const input = document.getElementById('markdown-input');
const output = document.getElementById('preview-content');
const titleInput = document.getElementById('post-title');
const subtitleInput = document.getElementById('post-subtitle');
const wordCount = document.getElementById('word-count');
const readTime = document.getElementById('read-time');

let selectedFileBlob = null;

function saveToLocal() {
    const postData = {
        title: titleInput.value,
        subtitle: subtitleInput.value,
        body: input.value,
        category: document.getElementById('post-category').value,
        tags: document.getElementById('post-tags').value,
        slug: document.getElementById('post-slug').value
    };
    localStorage.setItem('journal_draft', JSON.stringify(postData));
}

function loadFromLocal() {
    const saved = localStorage.getItem('journal_draft');
    if (saved) {
        const data = JSON.parse(saved);
        titleInput.value = data.title || "";
        subtitleInput.value = data.subtitle || "";
        input.value = data.body || "";
        document.getElementById('post-category').value = data.category || "";
        document.getElementById('post-tags').value = data.tags || "";
        document.getElementById('post-slug').value = data.slug || "";
        updateEditor();
    }
}

function updateEditor() {
    output.innerHTML = marked.parse(input.value);
    
    // Statistics logic
    const words = input.value.trim() ? input.value.trim().split(/\s+/).length : 0;
    const minutes = Math.max(1, Math.ceil(words / 200));
    
    wordCount.innerText = words;
    readTime.innerText = `${minutes} MIN READ`;

    [titleInput, subtitleInput, input].forEach(el => {
        el.style.height = 'auto';
        el.style.height = el.scrollHeight + 'px';
    });
}

[titleInput, subtitleInput, input, document.getElementById('post-category'), document.getElementById('post-tags'), document.getElementById('post-slug')].forEach(el => {
    el.addEventListener('input', () => {
        updateEditor();
        saveToLocal();
    });
});

// Theme Toggle
document.getElementById('theme-switcher').onclick = () => {
    const html = document.documentElement;
    const isLight = html.getAttribute('data-theme') === 'light';
    html.setAttribute('data-theme', isLight ? 'dark' : 'light');
    document.getElementById('theme-icon').setAttribute('data-lucide', isLight ? 'sun' : 'moon');
    lucide.createIcons();
    showToast(`Theme: ${isLight ? 'Dark' : 'Light'}`, isLight ? 'moon' : 'sun');
};

// Hero Image Logic
const heroInput = document.getElementById('hero-input');
document.getElementById('hero-drop-zone').onclick = () => heroInput.click();
heroInput.onchange = (e) => {
    const file = e.target.files[0];
    if(file) {
        document.getElementById('hero-preview').src = URL.createObjectURL(file);
        document.getElementById('hero-preview').style.display = 'block';
        document.getElementById('hero-placeholder').style.display = 'none';
        showToast("Hero image updated");
    }
};

// Media Modal Logic
const mediaModal = document.getElementById('media-modal');
const fileInput = document.getElementById('file-input');
const altInput = document.getElementById('alt-text-input');
const modalPreview = document.getElementById('modal-preview');

document.getElementById('btn-media').onclick = () => {
    mediaModal.style.display = 'flex';
    altInput.value = "";
    modalPreview.style.display = 'none';
};

document.getElementById('drop-zone').onclick = () => fileInput.click();

fileInput.onchange = (e) => {
    const file = e.target.files[0];
    if(file) {
        selectedFileBlob = URL.createObjectURL(file);
        modalPreview.src = selectedFileBlob;
        modalPreview.style.display = 'block';
        altInput.value = file.name.split('.')[0]; 
    }
};

document.getElementById('insert-media-btn').onclick = () => {
    if(!selectedFileBlob) {
        showToast("Choose an image first", "image");
        return;
    }

    const altText = altInput.value || "Journal Image";
    const imgStr = `\n<figure class="inline-image">\n  <img src="${selectedFileBlob}" alt="${altText}">\n  <figcaption>${altText}</figcaption>\n</figure>\n`;
    
    const start = input.selectionStart;
    input.value = input.value.substring(0, start) + imgStr + input.value.substring(input.selectionEnd);
    
    closeMediaModal();
    updateEditor();
    saveToLocal();
    showToast("Figure inserted");
};

function closeMediaModal() {
    mediaModal.style.display = 'none';
    selectedFileBlob = null;
}

// Action Buttons
document.getElementById('btn-reset').onclick = () => {
    if (confirm("Delete current draft forever?")) {
        localStorage.removeItem('journal_draft');
        location.reload(); 
    }
};

document.getElementById('btn-draft').onclick = () => {
    saveToLocal();
    showToast("Draft Saved Locally");
};

document.getElementById('btn-publish').onclick = () => {
    showToast("Post Published!", "send");
};

function showToast(msg, icon = "check") {
    const container = document.getElementById('toast-container');
    const t = document.createElement('div');
    t.className = 'toast';
    t.innerHTML = `<i data-lucide="${icon}" style="width:16px"></i><span>${msg}</span>`;
    container.appendChild(t);
    lucide.createIcons();
    requestAnimationFrame(() => t.classList.add('show'));
    setTimeout(() => {
        t.classList.remove('show');
        setTimeout(() => t.remove(), 500);
    }, 3000);
}

window.onload = loadFromLocal;

const mobilePreviewBtn = document.getElementById('mobile-preview-toggle');
const editorContainer = document.querySelector('.editor-container');

mobilePreviewBtn.onclick = () => {
    const isPreviewing = editorContainer.classList.toggle('show-preview');

    // Toggle the icon between 'eye' and 'edit-3' (or 'pen')
    const icon = mobilePreviewBtn.querySelector('i');
    if (isPreviewing) {
    icon.setAttribute('data-lucide', 'edit-3');
    showToast("Viewing Preview", "eye");
    } else {
    icon.setAttribute('data-lucide', 'eye');
    showToast("Back to Editor", "edit-3");
    }

    lucide.createIcons();
    // Re-run the auto-expand height logic to ensure the preview/editor fits
    updateEditor(); 
    };

// ... existing variables ...
const seriesToggle = document.getElementById('is-series-toggle');
const seriesWrapper = document.getElementById('series-select-wrapper');
const seriesSelect = document.getElementById('post-series');

// Load Series Options from localStorage (Created in Series Management)
function populateSeriesDropdown() {
    const seriesList = JSON.parse(localStorage.getItem('journal_series') || '[]');
    seriesSelect.innerHTML = '<option value="">Select Series...</option>';
    
    seriesList.forEach(series => {
        const opt = document.createElement('option');
        opt.value = series.id;
        opt.textContent = series.name;
        seriesSelect.appendChild(opt);
    });
}

// Toggle Visibility
seriesToggle.onchange = () => {
    seriesWrapper.style.display = seriesToggle.checked ? 'block' : 'none';
    if(seriesToggle.checked) populateSeriesDropdown();
    saveToLocal();
};

// Update saveToLocal() to include series data
function saveToLocal() {
    const postData = {
        title: titleInput.value,
        subtitle: subtitleInput.value,
        body: input.value,
        category: document.getElementById('post-category').value,
        tags: document.getElementById('post-tags').value,
        slug: document.getElementById('post-slug').value,
        // NEW FIELDS
        isSeries: seriesToggle.checked,
        seriesId: seriesSelect.value
    };
    localStorage.setItem('journal_draft', JSON.stringify(postData));
}

// Update loadFromLocal() to restore series state
function loadFromLocal() {
    const saved = localStorage.getItem('journal_draft');
    if (saved) {
        const data = JSON.parse(saved);
        titleInput.value = data.title || "";
        subtitleInput.value = data.subtitle || "";
        input.value = data.body || "";
        document.getElementById('post-category').value = data.category || "";
        document.getElementById('post-tags').value = data.tags || "";
        document.getElementById('post-slug').value = data.slug || "";
        
        // RESTORE SERIES STATE
        seriesToggle.checked = data.isSeries || false;
        if(seriesToggle.checked) {
            seriesWrapper.style.display = 'block';
            populateSeriesDropdown();
            seriesSelect.value = data.seriesId || "";
        }

        updateEditor();
    }
}

// Add event listener for the dropdown change
seriesSelect.addEventListener('change', saveToLocal);