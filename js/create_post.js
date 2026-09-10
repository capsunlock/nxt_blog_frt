lucide.createIcons();

const input = document.getElementById('markdown-input');
const output = document.getElementById('preview-content');
const titleInput = document.getElementById('post-title');
const subtitleInput = document.getElementById('post-subtitle');
const wordCount = document.getElementById('word-count');
const readTime = document.getElementById('read-time');
const btnDraft = document.getElementById('btn-draft');
const btnPublish = document.getElementById('btn-publish');
const seriesSelect = document.getElementById('post-series');
const categorySelect = document.getElementById('post-category');
const categoryCreateWrapper = document.getElementById('category-create-wrapper');
const newCategoryInput = document.getElementById('new-category-name');

let selectedFileBlob = null;

function validateForm() {
    const hasTitle = titleInput.value.trim().length > 0;
    const hasBody = input.value.trim().length > 0;
    const hasCategory = document.getElementById('post-category').value.trim().length > 0;
    const hasSlug = document.getElementById('post-slug').value.trim().length > 0;
    const isValid = hasTitle && hasBody && hasCategory && hasSlug;
    btnDraft.disabled = !isValid;
    btnPublish.disabled = !isValid;
    if (!isValid) {
        btnDraft.style.opacity = '0.4';
        btnPublish.style.opacity = '0.4';
    } else {
        btnDraft.style.opacity = '1';
        btnPublish.style.opacity = '1';
    }
}

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
        validateForm();
    });
});

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
const confirmModal = document.getElementById('confirm-modal');
const confirmDelete = document.getElementById('confirm-delete');
const confirmCancel = document.getElementById('confirm-cancel');

document.getElementById('btn-reset').onclick = () => {
    confirmModal.style.display = 'flex';
};

confirmCancel.onclick = () => {
    confirmModal.style.display = 'none';
};

confirmDelete.onclick = () => {
    localStorage.removeItem('journal_draft');
    confirmModal.style.display = 'none';
    location.reload();
};

btnDraft.onclick = () => {
    if (btnDraft.disabled) return;
    saveToLocal();
    showToast("Draft Saved Locally");
};

btnPublish.onclick = () => {
    if (btnPublish.disabled) return;
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

window.onload = () => {
    loadFromLocal();
    populateCategoryDropdown();
    populateSeriesDropdown();
    validateForm();
};

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
    
    const createOpt = document.createElement('option');
    createOpt.value = '__create__';
    createOpt.textContent = '+ Create new series...';
    seriesSelect.appendChild(createOpt);
}

seriesSelect.addEventListener('change', () => {
    const createWrapper = document.getElementById('series-create-wrapper');
    const newSeriesInput = document.getElementById('new-series-name');
    
    if (seriesSelect.value === '__create__') {
        createWrapper.style.display = 'flex';
        newSeriesInput.value = '';
        newSeriesInput.focus();
    } else {
        createWrapper.style.display = 'none';
        saveToLocal();
    }
});

document.getElementById('save-new-series').addEventListener('click', () => {
    const name = document.getElementById('new-series-name').value.trim();
    if (name) {
        const seriesList = JSON.parse(localStorage.getItem('journal_series') || '[]');
        const newSeries = {
            id: Date.now().toString(),
            name: name,
            desc: '',
            postCount: 0
        };
        seriesList.push(newSeries);
        localStorage.setItem('journal_series', JSON.stringify(seriesList));
        populateSeriesDropdown();
        seriesSelect.value = newSeries.id;
        document.getElementById('series-create-wrapper').style.display = 'none';
        showToast('Series created');
        saveToLocal();
    }
});

document.getElementById('new-series-name').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        document.getElementById('save-new-series').click();
    } else if (e.key === 'Escape') {
        seriesSelect.value = '';
        document.getElementById('series-create-wrapper').style.display = 'none';
        saveToLocal();
    }
});

function populateCategoryDropdown() {
    const posts = JSON.parse(localStorage.getItem('journal_posts') || '[]');
    const categorySet = new Set();
    
    posts.forEach(post => {
        if (post.category && post.category.trim()) {
            categorySet.add(post.category.trim());
        }
    });
    
    const currentValue = categorySelect.value;
    categorySelect.innerHTML = '<option value="">Select Category...</option>';
    
    Array.from(categorySet).sort().forEach(cat => {
        const opt = document.createElement('option');
        opt.value = cat;
        opt.textContent = cat;
        categorySelect.appendChild(opt);
    });
    
    const createOpt = document.createElement('option');
    createOpt.value = '__create__';
    createOpt.textContent = '+ Create new category...';
    categorySelect.appendChild(createOpt);
    
    categorySelect.value = currentValue;
}

categorySelect.addEventListener('change', () => {
    if (categorySelect.value === '__create__') {
        categoryCreateWrapper.style.display = 'flex';
        newCategoryInput.value = '';
        newCategoryInput.focus();
    } else {
        categoryCreateWrapper.style.display = 'none';
        saveToLocal();
    }
});

document.getElementById('save-new-category').addEventListener('click', () => {
    const name = newCategoryInput.value.trim();
    if (name) {
        const posts = JSON.parse(localStorage.getItem('journal_posts') || '[]');
        if (posts.length > 0) {
            posts[0].category = name;
            localStorage.setItem('journal_posts', JSON.stringify(posts));
        }
        populateCategoryDropdown();
        categorySelect.value = name;
        categoryCreateWrapper.style.display = 'none';
        showToast('Category created');
        saveToLocal();
    }
});

newCategoryInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        document.getElementById('save-new-category').click();
    } else if (e.key === 'Escape') {
        categorySelect.value = '';
        categoryCreateWrapper.style.display = 'none';
        saveToLocal();
    }
});

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

validateForm();
