// IhsanMobilya - Ana Sayfa Render & Yetkilendirme Motoru

const FALLBACK_CATEGORIES = [
    {
        id: "salon",
        name: "Salon",
        tag: "Koltuk Takımı",
        icon: "🛋️",
        hidden: false,
        subItems: [
            { id: 101, title: "Premium Koltuk Takımı", desc: "Kadife doku ve altın detaylar.", images: ["assets/salon_8k.png"], price: "60.000 TL", discountPrice: "52.000 TL" }
        ]
    },
    {
        id: "mutfak",
        name: "Mutfak",
        tag: "Mutfak Tasarım",
        icon: "🍳",
        hidden: false,
        subItems: [
            { id: 201, title: "Lüks Ada Mutfak", desc: "Geniş ve fonksiyonel tasarım.", images: ["assets/kitchen_8k.png"], price: "45.000 TL", discountPrice: "38.500 TL" }
        ]
    },
    {
        id: "yatak",
        name: "Yatak Odası",
        tag: "Konfor & Huzur",
        icon: "🛏️",
        hidden: false,
        subItems: [
            { id: 301, title: "Modern Yatak Takımı", desc: "Sakinleştirici renk paleti.", images: ["assets/bedroom_8k.png"], price: "32.000 TL", discountPrice: "" }
        ]
    }
];

function isAdmin() {
    return localStorage.getItem('isLoggedIn') === 'true';
}

function getCategories() {
    if (typeof getMergedCategories === 'function') {
        return getMergedCategories();
    }
    try {
        const data = JSON.parse(localStorage.getItem('ihsan_categories'));
        if (data && Array.isArray(data) && data.length > 0) return data;
    } catch(e) {}
    localStorage.setItem('ihsan_categories', JSON.stringify(FALLBACK_CATEGORIES));
    return FALLBACK_CATEGORIES;
}

function saveCategories(cats) {
    localStorage.setItem('ihsan_categories', JSON.stringify(cats));
}

let isEditMode = false;

function updateNavbar() {
    const navMenu = document.getElementById('nav-menu');
    if (!navMenu) return;

    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.protocol === 'file:';

    if (isAdmin()) {
        navMenu.innerHTML = `
            <li><a href="#tasarimlar">Koleksiyonlar</a></li>
            <li><a href="#iletisim">İletişim</a></li>
            <li><a href="https://www.instagram.com/ihsan.mobilya/" target="_blank" rel="noopener noreferrer" style="color:#e1306c; font-weight:600;">Instagram</a></li>
            <li><a href="admin.html" style="color:var(--accent-color); font-weight:700;">YÖNETİM</a></li>
            <li><button onclick="logoutAdmin()" class="nav-logout-btn">ÇIKIŞ YAP</button></li>
        `;
    } else {
        const loginLink = isLocal 
            ? `<li><a href="login.html" style="opacity:0.6; font-size:0.8rem;">🔒 Giriş</a></li>` 
            : ``;
        navMenu.innerHTML = `
            <li><a href="#tasarimlar">Koleksiyonlar</a></li>
            <li><a href="#iletisim">İletişim</a></li>
            <li><a href="https://www.instagram.com/ihsan.mobilya/" target="_blank" rel="noopener noreferrer" style="color:#e1306c; font-weight:600;">Instagram</a></li>
            ${loginLink}
        `;
    }
}

function renderHomeContent() {
    updateNavbar();
    const categories = getCategories();
    const grid = document.getElementById('calendar-grid');
    const adminBar = document.getElementById('admin-bar');

    // Admin bar SADECE giriş yapılmışsa görünür
    if (adminBar) {
        if (isAdmin()) {
            adminBar.style.display = 'flex';
        } else {
            adminBar.style.display = 'none';
            isEditMode = false;
        }
    }

    // Kolay Erişim Bölmelerini (Footer Directory) Render Et
    if (typeof renderFooterDirectory === 'function') {
        renderFooterDirectory('footer-directory');
    }

    if (!grid) return;
    grid.innerHTML = '';

    // Ziyaretçiler sadece gizlenmemiş ve modelleri olan (veya düzenleme modunda tümünü) görür
    const visible = (isAdmin() && isEditMode) 
        ? categories 
        : categories.filter(c => !c.hidden && c.subItems && c.subItems.length > 0);

    if (visible.length === 0) {
        grid.innerHTML = '<p style="grid-column:1/-1; text-align:center; padding:5rem; opacity:0.3; font-size:1rem; letter-spacing:2px;">Görüntülenecek koleksiyon bulunamadı.</p>';
        return;
    }

    visible.forEach((cat) => {
        // İlk ürün görseli veya varsayılan
        const bgImg = (cat.subItems && cat.subItems.length > 0 && cat.subItems[0].images && cat.subItems[0].images[0])
                      ? cat.subItems[0].images[0]
                      : 'assets/hero.png';

        const realIdx = categories.findIndex(c => c.id === cat.id);
        const card = document.createElement('div');
        card.className = 'category-card' + (cat.hidden ? ' cat-hidden-overlay' : '');

        // Tıklayınca detay sayfasına git (admin butonlarına basılmadığı sürece)
        card.onclick = (e) => {
            if (e.target.closest('.admin-overlay')) return;
            const targetId = cat.id || cat.name.toLowerCase().replace(/\s+/g, '-');
            window.location.href = `detail.html?cat=${encodeURIComponent(targetId)}`;
        };

        const itemCount = cat.subItems ? cat.subItems.length : 0;

        card.innerHTML = `
            <img src="${bgImg}" alt="${cat.name}" onerror="this.src='assets/hero.png'">
            <div class="cat-gradient"></div>
            <div class="category-info">
                <span>${cat.tag || 'ÖZEL TASARIM'}</span>
                <h3>${cat.name}</h3>
                <p class="cat-count">${itemCount} Model</p>
            </div>
            ${(isAdmin() && isEditMode) ? `
            <div class="admin-overlay">
                <button class="icon-btn" title="Yukarı" onclick="moveCat(${realIdx}, -1)">↑</button>
                <button class="icon-btn" title="Aşağı" onclick="moveCat(${realIdx}, 1)">↓</button>
                <button class="icon-btn ${cat.hidden ? 'btn-show' : 'btn-hide'}" title="${cat.hidden ? 'Yayınla (Göster)' : 'Gizle'}" onclick="toggleHide(${realIdx})">
                    ${cat.hidden ? '👁' : '🚫'}
                </button>
                <button class="icon-btn icon-btn-del" title="Sil" onclick="deleteCat(${realIdx})">×</button>
            </div>` : ''}
            ${cat.hidden ? '<div class="hidden-badge">GİZLİ</div>' : ''}
        `;
        grid.appendChild(card);
    });
}

// ─── Admin İşlemleri ─────────────────────────────────────────

window.logoutAdmin = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('rememberMe');
    isEditMode = false;
    alert('Yönetim modundan çıkış yapıldı.');
    renderHomeContent();
};

window.moveCat = (idx, dir) => {
    if (!isAdmin()) return;
    const cats = getCategories();
    const newIdx = idx + dir;
    if (newIdx < 0 || newIdx >= cats.length) return;
    [cats[idx], cats[newIdx]] = [cats[newIdx], cats[idx]];
    saveCategories(cats);
    renderHomeContent();
};

window.toggleHide = (idx) => {
    if (!isAdmin()) return;
    const cats = getCategories();
    cats[idx].hidden = !cats[idx].hidden;
    saveCategories(cats);
    renderHomeContent();
};

window.deleteCat = (idx) => {
    if (!isAdmin()) return;
    if (!confirm('Bu kategoriyi ve tüm modellerini silmek istediğinize emin misiniz?')) return;
    const cats = getCategories();
    cats.splice(idx, 1);
    saveCategories(cats);
    renderHomeContent();
};

window.toggleEditMode = () => {
    if (!isAdmin()) return;
    isEditMode = !isEditMode;
    const btn = document.getElementById('edit-mode-toggle');
    if (btn) {
        btn.innerText = isEditMode ? 'DÜZENLEMEYİ KAPAT' : 'DÜZENLEMEYİ AÇ';
        btn.style.background = isEditMode ? '#D4AF37' : '#222';
        btn.style.color = isEditMode ? '#000' : '#fff';
    }
    renderHomeContent();
};

document.addEventListener('DOMContentLoaded', renderHomeContent);
