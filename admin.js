// Admin Dashboard Logic - Enhanced CMS
document.addEventListener('DOMContentLoaded', () => {
    refreshAdminUI();

    // -- Form Listeners --

    // Category Form
    const categoryForm = document.getElementById('category-form');
    if (categoryForm) {
        categoryForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('cat-name').value;
            const icon = document.getElementById('cat-icon').value;
            const tag = document.getElementById('cat-tag').value;
            
            const newCat = {
                id: name.toLowerCase().replace(/\s+/g, '-'),
                name,
                icon,
                tag,
                subItems: []
            };

            const categories = getCategories();
            categories.push(newCat);
            saveCategories(categories);
            
            categoryForm.reset();
            refreshAdminUI();
            showNotification('Kategori başarıyla oluşturuldu!');
        });
    }

    const imageInput = document.getElementById('desc-image-file');
    const imageBase64 = document.getElementById('desc-image-base64');
    const fileLabelText = document.getElementById('file-label-text');
    const previewContainer = document.getElementById('upload-preview-container');

    if (imageInput) {
        imageInput.addEventListener('change', async (e) => {
            const files = Array.from(e.target.files);
            if (files.length > 0) {
                const results = [];
                previewContainer.innerHTML = '';
                fileLabelText.innerHTML = `<span>⏳ ${files.length} Dosya İşleniyor...</span>`;

                for (const file of files) {
                    const base64 = await new Promise((resolve) => {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                            const img = new Image();
                            img.onload = () => {
                                const canvas = document.createElement('canvas');
                                const MAX_WIDTH = 800;
                                const scaleSize = MAX_WIDTH / img.width;
                                canvas.width = MAX_WIDTH;
                                canvas.height = img.height * scaleSize;
                                const ctx = canvas.getContext('2d');
                                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                                resolve(canvas.toDataURL('image/jpeg', 0.7));
                            };
                            img.src = event.target.result;
                        };
                        reader.readAsDataURL(file);
                    });
                    results.push(base64);
                    
                    const thumb = document.createElement('img');
                    thumb.src = base64;
                    thumb.className = 'preview-thumb';
                    previewContainer.appendChild(thumb);
                }

                imageBase64.value = JSON.stringify(results);
                fileLabelText.innerHTML = `<span>✅ ${files.length} Fotoğraf Hazır</span>`;
            }
        });
    }

    // Design (Product) Form
    const designForm = document.getElementById('design-form');
    if (designForm) {
        designForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const catId = document.getElementById('parent-category').value;
            let images = ['assets/hero.png'];
            try {
                if (imageBase64.value) {
                    const parsed = JSON.parse(imageBase64.value);
                    if (Array.isArray(parsed) && parsed.length > 0) {
                        images = parsed;
                    }
                }
            } catch (e) {
                if (imageBase64.value) images = [imageBase64.value];
            }

            const newItem = {
                id: Date.now(),
                title: document.getElementById('desc-title').value,
                desc: document.getElementById('desc-text').value,
                price: document.getElementById('desc-price').value,
                discountPrice: document.getElementById('desc-discount').value,
                images: images
            };

            const categories = getCategories();
            const catIndex = categories.findIndex(c => c.id === catId);
            
            if (catIndex !== -1) {
                categories[catIndex].subItems.push(newItem);
                saveCategories(categories);
                designForm.reset();
                imageBase64.value = '';
                previewContainer.innerHTML = '';
                fileLabelText.innerHTML = '<span>📁 Resim Seç veya Sürükle...</span>';
                refreshAdminUI();
                showNotification('Tasarım eklendi!');
            }
        });
    }

    // Campaign Form
    const campaignForm = document.getElementById('campaign-form');
    if (campaignForm) {
        campaignForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const newCamp = {
                id: Date.now(),
                title: document.getElementById('campaign-title').value,
                badge: document.getElementById('campaign-badge').value,
                desc: document.getElementById('campaign-desc').value
            };
            const campaigns = JSON.parse(localStorage.getItem('campaigns')) || [];
            campaigns.push(newCamp);
            localStorage.setItem('campaigns', JSON.stringify(campaigns));
            campaignForm.reset();
            refreshAdminUI();
            showNotification('Kampanya yayınlandı!');
        });
    }

    // Edit Modal Form
    const editForm = document.getElementById('edit-form');
    if (editForm) {
        editForm.addEventListener('submit', (e) => {
            e.preventDefault();
            saveEdit();
        });
    }
});

// -- Core Functions --

function refreshAdminUI() {
    populateCategorySelects();
    renderAdminContent();
}

function getCategories() {
    if (typeof getMergedCategories === 'function') {
        return getMergedCategories();
    }
    return JSON.parse(localStorage.getItem('ihsan_categories')) || [];
}

function saveCategories(data) {
    localStorage.setItem('ihsan_categories', JSON.stringify(data));
}

function populateCategorySelects() {
    const parentSelect = document.getElementById('parent-category');
    if (!parentSelect) return;
    const categories = getCategories();

    // Gruplara göre düzenli optgroup yap
    const groups = {};
    categories.forEach(c => {
        const groupName = c.tag || 'Diğer Koleksiyonlar';
        if (!groups[groupName]) groups[groupName] = [];
        groups[groupName].push(c);
    });

    let html = '';
    for (const [groupName, cats] of Object.entries(groups)) {
        html += `<optgroup label="${groupName.toUpperCase()}">`;
        cats.forEach(c => {
            const count = (c.subItems && c.subItems.length > 0) ? ` (${c.subItems.length} model)` : ' (boş)';
            html += `<option value="${c.id}">${c.name}${count}</option>`;
        });
        html += `</optgroup>`;
    }

    parentSelect.innerHTML = html;
}

function renderAdminContent() {
    const hierarchicalList = document.getElementById('hierarchical-list');
    const adminCampaignList = document.getElementById('admin-campaign-list');
    const categories = getCategories();
    const campaigns = JSON.parse(localStorage.getItem('campaigns')) || [];

    if (hierarchicalList) {
        hierarchicalList.innerHTML = '';
        categories.forEach((cat, cIdx) => {
            const catCard = document.createElement('div');
            catCard.className = 'admin-cat-card';
            catCard.innerHTML = `
                <div class="admin-cat-header">
                    <div class="admin-cat-info">
                        <h4>${cat.icon} ${cat.name}</h4>
                        <span>${cat.tag} | ${cat.subItems.length} Ürün</span>
                    </div>
                    <div class="admin-actions">
                        <button class="icon-btn" onclick="moveCat(${cIdx}, -1)">↑</button>
                        <button class="icon-btn" onclick="moveCat(${cIdx}, 1)">↓</button>
                        <button class="icon-btn edit" onclick="openEditModal('category', '${cat.id}')">✎</button>
                        <button class="icon-btn delete" onclick="deleteCategory('${cat.id}')">×</button>
                    </div>
                </div>
                <div class="admin-item-list">
                    ${cat.subItems.map(item => `
                        <div class="admin-product-card">
                            <div class="product-info">
                                <img src="${item.images[0]}" class="product-thumb">
                                <div class="product-text">
                                    <h5>${item.title}</h5>
                                    <p>${item.price} ${item.discountPrice ? `(İndirim: ${item.discountPrice})` : ''}</p>
                                </div>
                            </div>
                            <div class="admin-actions">
                                <button class="icon-btn edit" onclick="openEditModal('product', '${cat.id}', ${item.id})">✎</button>
                                <button class="icon-btn delete" onclick="deleteSubItem('${cat.id}', ${item.id})">×</button>
                            </div>
                        </div>
                    `).join('')}
                    ${cat.subItems.length === 0 ? '<p style="opacity:0.3; font-size:0.8rem; text-align:center;">Henüz tasarım yok.</p>' : ''}
                </div>
            `;
            hierarchicalList.appendChild(catCard);
        });
    }

    if (adminCampaignList) {
        adminCampaignList.innerHTML = '';
        campaigns.forEach(c => {
            const div = document.createElement('div');
            div.className = 'admin-product-card';
            div.innerHTML = `
                <div class="product-text">
                    <h5>${c.title}</h5>
                    <p>${c.badge}</p>
                </div>
                <button class="icon-btn delete" onclick="deleteCampaign(${c.id})">×</button>
            `;
            adminCampaignList.appendChild(div);
        });
    }
}

// -- Operations --

window.deleteCategory = (id) => {
    if (!confirm('Kategoriyi ve içindeki tüm tasarımları silmek istediğinize emin misiniz?')) return;
    const categories = getCategories().filter(c => c.id !== id);
    saveCategories(categories);
    refreshAdminUI();
};

window.deleteSubItem = (catId, itemId) => {
    const categories = getCategories();
    const cat = categories.find(c => c.id === catId);
    if (cat) {
        cat.subItems = cat.subItems.filter(i => i.id !== itemId);
        saveCategories(categories);
        refreshAdminUI();
    }
};

window.deleteCampaign = (id) => {
    const campaigns = JSON.parse(localStorage.getItem('campaigns')) || [];
    const filtered = campaigns.filter(c => c.id !== id);
    localStorage.setItem('campaigns', JSON.stringify(filtered));
    refreshAdminUI();
};

window.moveCat = (index, dir) => {
    const categories = getCategories();
    const newIdx = index + dir;
    if (newIdx >= 0 && newIdx < categories.length) {
        const temp = categories[index];
        categories[index] = categories[newIdx];
        categories[newIdx] = temp;
        saveCategories(categories);
        refreshAdminUI();
    }
};

// -- Modal Logic --
let currentEditImages = [];

window.openEditModal = (type, catId, itemId = null) => {
    const modal = document.getElementById('edit-modal');
    const fields = document.getElementById('edit-fields');
    const typeInput = document.getElementById('edit-type');
    const catIdInput = document.getElementById('edit-cat-id');
    const itemIdInput = document.getElementById('edit-item-id');

    typeInput.value = type;
    catIdInput.value = catId;
    itemIdInput.value = itemId || '';
    currentEditImages = [];

    const categories = getCategories();
    const cat = categories.find(c => c.id === catId);

    if (type === 'category') {
        document.getElementById('modal-title').innerText = 'Kategoriyi Düzenle';
        fields.innerHTML = `
            <div class="form-group">
                <label>Kategori Adı</label>
                <input type="text" id="edit-name" class="admin-input" value="${cat.name}">
            </div>
            <div class="form-group">
                <label>İkon</label>
                <input type="text" id="edit-icon" class="admin-input" value="${cat.icon}">
            </div>
            <div class="form-group">
                <label>Etiket</label>
                <input type="text" id="edit-tag" class="admin-input" value="${cat.tag}">
            </div>
        `;
    } else {
        const item = cat.subItems.find(i => i.id == itemId);
        currentEditImages = [...(item.images || [])];
        document.getElementById('modal-title').innerText = 'Tasarımı Düzenle';
        fields.innerHTML = `
            <div class="form-group">
                <label>Tasarım Adı</label>
                <input type="text" id="edit-title" class="admin-input" value="${item.title}">
            </div>
             <div class="form-group">
                <label>Açıklama</label>
                <textarea id="edit-desc" class="admin-input" rows="3">${item.desc}</textarea>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Normal Fiyat</label>
                    <input type="text" id="edit-price" class="admin-input" value="${item.price}">
                </div>
                <div class="form-group">
                    <label>İndirimli Fiyat</label>
                    <input type="text" id="edit-discount" class="admin-input" value="${item.discountPrice || ''}">
                </div>
            </div>
            <div class="form-group">
                <label>Mevcut Fotoğraflar (Tıklayarak Silebilirsiniz)</label>
                <div id="edit-preview-container" class="upload-preview-grid"></div>
            </div>
            <div class="form-group">
                <label>Yeni Fotoğraf Ekle</label>
                <div class="file-upload-wrapper">
                    <label for="edit-image-file" class="file-upload-label">
                        <span>📁 Yeni Fotoğrafları Seç...</span>
                    </label>
                    <input type="file" id="edit-image-file" accept="image/*" multiple onchange="handleEditFileUpload(this)">
                </div>
            </div>
        `;
        renderEditPreviews();
    }

    modal.style.display = 'flex';
};

window.renderEditPreviews = () => {
    const container = document.getElementById('edit-preview-container');
    if (!container) return;
    container.innerHTML = '';
    currentEditImages.forEach((src, idx) => {
        const wrapper = document.createElement('div');
        wrapper.style.position = 'relative';
        wrapper.innerHTML = `
            <img src="${src}" class="preview-thumb">
            <button onclick="removeEditPhoto(${idx})" style="position:absolute; top:-5px; right:-5px; background:red; color:white; border:none; border-radius:50%; width:20px; height:20px; cursor:pointer; font-size:12px;">×</button>
        `;
        container.appendChild(wrapper);
    });
};

window.removeEditPhoto = (idx) => {
    currentEditImages.splice(idx, 1);
    renderEditPreviews();
};

window.handleEditFileUpload = async (input) => {
    const files = Array.from(input.files);
    for (const file of files) {
        const base64 = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const MAX_WIDTH = 800;
                    const scaleSize = MAX_WIDTH / img.width;
                    canvas.width = MAX_WIDTH;
                    canvas.height = img.height * scaleSize;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                    resolve(canvas.toDataURL('image/jpeg', 0.7));
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        });
        currentEditImages.push(base64);
    }
    renderEditPreviews();
    input.value = ''; // Reset input
};

window.closeEditModal = () => {
    document.getElementById('edit-modal').style.display = 'none';
};

function saveEdit() {
    const type = document.getElementById('edit-type').value;
    const catId = document.getElementById('edit-cat-id').value;
    const itemId = document.getElementById('edit-item-id').value;

    const categories = getCategories();
    const catIndex = categories.findIndex(c => c.id === catId);

    if (type === 'category') {
        categories[catIndex].name = document.getElementById('edit-name').value;
        categories[catIndex].icon = document.getElementById('edit-icon').value;
        categories[catIndex].tag = document.getElementById('edit-tag').value;
    } else {
        const itemIndex = categories[catIndex].subItems.findIndex(i => i.id == itemId);
        const item = categories[catIndex].subItems[itemIndex];
        item.title = document.getElementById('edit-title').value;
        item.desc = document.getElementById('edit-desc').value;
        item.price = document.getElementById('edit-price').value;
        item.discountPrice = document.getElementById('edit-discount').value;
        item.images = currentEditImages.length > 0 ? currentEditImages : (item.images || ['assets/hero.png']);
    }

    saveCategories(categories);
    closeEditModal();
    refreshAdminUI();
    showNotification('Değişiklikler kaydedildi!');
}

function showNotification(msg) {
    alert(msg);
}
