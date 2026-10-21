// Ihsan Mobilya - Katalog, Alt Menü (Hızlı Erişim) ve Kategori Tanımları

const CONTACT_INFO = {
    phone: "+90 554 405 51 61",
    phoneHref: "tel:+905544055161",
    whatsappHref: "https://wa.me/905544055161?text=Merhaba,%20mobilya%20modelleriniz%20hakkında%20bilgi%20almak%20istiyorum.",
    instagramHref: "https://www.instagram.com/ihsan.mobilya/",
    address: "Yükseltepe Mah. Karakeçili Cad. 12/A Keçiören/Ankara",
    mapsHref: "https://www.google.com/maps/search/?api=1&query=Y%C3%BCkseltepe+Mah.+Karake%C3%A7ili+Cad.+12%2FA+Ke%C3%A7i%C3%B6ren%2FAnkara",
    email: "info@ihsanmobilya.com"
};

const FOOTER_COLLECTIONS = [
    {
        title: "OTURMA GRUPLARI",
        slug: "oturma-gruplari",
        items: [
            { name: "Koltuk Takımları", slug: "koltuk-takimlari" },
            { name: "Köşe Takımı", slug: "kose-takimi" },
            { name: "Kanepe / Koltuk", slug: "kanepe-koltuk" },
            { name: "İkili Koltuk", slug: "ikili-koltuk" },
            { name: "Üçlü Koltuk", slug: "uclu-koltuk" },
            { name: "Tekli Koltuk & Berjer", slug: "tekli-koltuk-berjer" },
            { name: "Tv Koltuğu & Baba Koltuğu", slug: "tv-koltugu-baba-koltugu" },
            { name: "Sehpa & Sehpa Takımı", slug: "sehpa-sehpa-takimi" },
            { name: "TV Ünitesi", slug: "tv-unitesi" }
        ]
    },
    {
        title: "YEMEK ODASI",
        slug: "yemek-odasi",
        items: [
            { name: "Yemek Odası Takımı", slug: "yemek-odasi-takimi" },
            { name: "Mutfak Masa Takımı", slug: "mutfak-masa-takimi" },
            { name: "Yemek Masası", slug: "yemek-masasi" },
            { name: "Sandalye", slug: "sandalye" },
            { name: "Konsol", slug: "konsol" },
            { name: "Konsol Aynası", slug: "konsol-aynasi" },
            { name: "Vitrin", slug: "vitrin" },
            { name: "Gümüşlük", slug: "gumusluk" }
        ]
    },
    {
        title: "YATAK ODASI",
        slug: "yatak-odasi",
        items: [
            { name: "Yatak Odası Takımı", slug: "yatak-odasi-takimi" },
            { name: "Gardırop & Dolap", slug: "gardirop-dolap" },
            { name: "Karyola", slug: "karyola" },
            { name: "Şifonyer", slug: "sifonyer" },
            { name: "Komodin", slug: "komodin" },
            { name: "Makyaj Masası", slug: "makyaj-masasi" },
            { name: "Makyaj Aynası", slug: "makyaj-aynasi" }
        ]
    },
    {
        title: "YATAK VE BAZA",
        slug: "yatak-ve-baza",
        items: [
            { name: "Yataklar", slug: "yataklar" },
            { name: "Bebek Yatakları", slug: "bebek-yataklari" },
            { name: "Baza", slug: "baza" },
            { name: "Yatak Başlığı&Baza Başlığı", slug: "yatak-basligi-baza-basligi" }
        ]
    },
    {
        title: "BAHÇE MOBİLYALARI",
        slug: "bahce-mobilyalari",
        items: [
            { name: "Mini Bahçe Takımları", slug: "mini-bahce-takimlari" },
            { name: "Bahçe Masa Takımları", slug: "bahce-masa-takimlari" },
            { name: "Bahçe Masaları", slug: "bahce-masalari" },
            { name: "Bahçe Sehpaları", slug: "bahce-sehpalari" },
            { name: "Bahçe Koltukları", slug: "bahce-koltuklari" }
        ]
    }
];

// Düz liste arama yardımcısı
function findDirectoryItemBySlugOrName(val) {
    if (!val) return null;
    let clean = val.toLowerCase().trim();
    // Eski alias'ları modern katalog kimliklerine yönlendir
    const legacyAliases = {
        'salon': 'koltuk-takimlari',
        'oturma': 'kose-takimi',
        'mutfak': 'mutfak-masa-takimi',
        'yatak': 'yatak-odasi-takimi'
    };
    if (legacyAliases[clean]) clean = legacyAliases[clean];

    for (const group of FOOTER_COLLECTIONS) {
        if (group.slug === clean || group.title.toLowerCase() === clean) {
            return { isGroup: true, group, title: group.title, slug: group.slug };
        }
        for (const item of group.items) {
            if (item.slug === clean || item.name.toLowerCase() === clean) {
                return { isGroup: false, group, item, title: item.name, slug: item.slug };
            }
        }
    }
    return null;
}

// Varsayılan zengin kategori ve model veritabanı
const DEFAULT_INITIAL_CATEGORIES = [
    {
        id: "koltuk-takimlari",
        name: "Koltuk Takımları",
        tag: "Oturma Grupları",
        parentGroup: "oturma-gruplari",
        hidden: false,
        subItems: [
            {
                id: 101,
                title: "Yenilenmiş Salon Koltuk Takımı",
                desc: "8K Premium Estetik ve kadife doku.",
                images: [
                    "assets/salon_8k.png",
                    "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?q=80&w=1200",
                    "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=1200"
                ],
                price: "60.000 TL",
                discountPrice: "52.000 TL"
            },
            {
                id: 102,
                title: "İskandinav Koltuk Takımı",
                desc: "Sade, modern ve konforlu çizgiler.",
                images: [
                    "https://images.unsplash.com/photo-1583847268964-b28dc2f51ac9?q=80&w=1200",
                    "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=1200"
                ],
                price: "35.500 TL",
                discountPrice: ""
            },
            {
                id: 103,
                title: "Premium Deri Koltuk Takımı",
                desc: "Zarafetin simgesi lüks deri koltuklar.",
                images: [
                    "https://images.unsplash.com/photo-1540574163026-643ea20ade25?q=80&w=1200",
                    "https://images.unsplash.com/photo-1506898667547-42e22a46e125?q=80&w=1200"
                ],
                price: "72.000 TL",
                discountPrice: ""
            }
        ]
    },
    {
        id: "kose-takimi",
        name: "Köşe Takımı",
        tag: "Oturma Grupları",
        parentGroup: "oturma-gruplari",
        hidden: false,
        subItems: [
            {
                id: 401,
                title: "Modern Lüks Köşe Takımı",
                desc: "8K Premium Konfor ve leke tutmaz kumaş.",
                images: [
                    "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?q=80&w=1200",
                    "https://images.unsplash.com/photo-1524758631624-e28a909de0ad?q=80&w=1200"
                ],
                price: "28.000 TL",
                discountPrice: "24.500 TL"
            },
            {
                id: 402,
                title: "Bohem Geniş Köşe Koltuk",
                desc: "Geniş oturum ve yumuşak sünger teknolojisi.",
                images: [
                    "https://images.unsplash.com/photo-1583847268964-b28dc2f51ac9?q=80&w=1200",
                    "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?q=80&w=1200"
                ],
                price: "22.500 TL",
                discountPrice: ""
            }
        ]
    },
    {
        id: "tekli-koltuk-berjer",
        name: "Tekli Koltuk & Berjer",
        tag: "Oturma Grupları",
        parentGroup: "oturma-gruplari",
        hidden: false,
        subItems: [
            {
                id: 403,
                title: "Zarif Berjer Takımı",
                desc: "Modern berjer kombinasyonları.",
                images: [
                    "https://images.unsplash.com/photo-1567016432779-094069958ea5?q=80&w=1200",
                    "https://images.unsplash.com/photo-1594913785162-e678ac052ddd?q=80&w=1200"
                ],
                price: "18.000 TL",
                discountPrice: ""
            }
        ]
    },
    {
        id: "yemek-odasi-takimi",
        name: "Yemek Odası Takımı",
        tag: "Yemek Odası",
        parentGroup: "yemek-odasi",
        hidden: false,
        subItems: [
            {
                id: 601,
                title: "Tasarım Yemek Masası Takımı",
                desc: "Masa, 6 sandalye ve konsol takımı.",
                images: [
                    "https://images.unsplash.com/photo-1577140917170-285929fb55b7?q=80&w=1200",
                    "https://images.unsplash.com/photo-1622320147690-34907994432a?q=80&w=1200"
                ],
                price: "35.000 TL",
                discountPrice: "29.900 TL"
            }
        ]
    },
    {
        id: "yemek-masasi",
        name: "Yemek Masası",
        tag: "Yemek Odası",
        parentGroup: "yemek-odasi",
        hidden: false,
        subItems: [
            {
                id: 602,
                title: "Oval Mermer Masa",
                desc: "Lüks mermer yüzey ve metal ayak tasarımı.",
                images: [
                    "https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?q=80&w=1200",
                    "https://images.unsplash.com/photo-1617806118233-f8e187c44b5c?q=80&w=1200"
                ],
                price: "24.500 TL",
                discountPrice: ""
            },
            {
                id: 603,
                title: "Doğal Masif Ahşap Masa",
                desc: "1. sınıf meşe ağacından üretilmiştir.",
                images: [
                    "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?q=80&w=1200",
                    "https://images.unsplash.com/photo-1530099486328-e021101a494a?q=80&w=1200"
                ],
                price: "19.500 TL",
                discountPrice: ""
            }
        ]
    },
    {
        id: "sandalye",
        name: "Sandalye",
        tag: "Yemek Odası",
        parentGroup: "yemek-odasi",
        hidden: false,
        subItems: [
            {
                id: 701,
                title: "Premium Tasarım Sandalye",
                desc: "Ergonomik sırt ve leke tutmaz kumaş.",
                images: [
                    "https://images.unsplash.com/photo-1592078615290-033ee584e267?q=80&w=1200",
                    "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=1200"
                ],
                price: "4.500 TL",
                discountPrice: ""
            },
            {
                id: 702,
                title: "Modern Mutfak Sandalyesi",
                desc: "Dayanıklı metal iskelet ve şık oturum.",
                images: [
                    "https://images.unsplash.com/photo-1503602642458-232111445657?q=80&w=1200"
                ],
                price: "3.200 TL",
                discountPrice: ""
            }
        ]
    },
    {
        id: "mutfak-masa-takimi",
        name: "Mutfak Masa Takımı",
        tag: "Yemek Odası",
        parentGroup: "yemek-odasi",
        hidden: false,
        subItems: [
            {
                id: 201,
                title: "Lüks Ada Mutfak ve Masa Takımı",
                desc: "8K Premium Ada Tasarımı.",
                images: [
                    "assets/kitchen_8k.png",
                    "https://images.unsplash.com/photo-1556912177-f547c12f38a4?q=80&w=1200"
                ],
                price: "45.000 TL",
                discountPrice: "38.500 TL"
            }
        ]
    },
    {
        id: "yatak-odasi-takimi",
        name: "Yatak Odası Takımı",
        tag: "Yatak Odası",
        parentGroup: "yatak-odasi",
        hidden: false,
        subItems: [
            {
                id: 301,
                title: "Modern Yatak Odası Takımı",
                desc: "8K Premium Konfor, bazalı karyola ve dolap.",
                images: [
                    "assets/bedroom_8k.png",
                    "https://images.unsplash.com/photo-1505693419163-97206413f279?q=80&w=1200"
                ],
                price: "32.000 TL",
                discountPrice: ""
            },
            {
                id: 302,
                title: "Lüks Kadife Yatak Takımı",
                desc: "Yumuşak doku ve zarafet.",
                images: [
                    "https://images.unsplash.com/photo-1560448194-4480c897555b?q=80&w=1200"
                ],
                price: "28.500 TL",
                discountPrice: ""
            }
        ]
    }
];

// Tüm alt menü kategorilerinin hazır olmasını ve tekilleştirilmesini garantileyen fonksiyon
function getMergedCategories() {
    let cats = [];
    try {
        const stored = JSON.parse(localStorage.getItem('ihsan_categories'));
        if (stored && Array.isArray(stored) && stored.length > 0) {
            cats = stored;
        }
    } catch(e) {}

    if (cats.length === 0) {
        cats = JSON.parse(JSON.stringify(DEFAULT_INITIAL_CATEGORIES));
    }

    // Yardımcı: Eski kategorideki ürünleri hedef modern kategoriye aktar ve eski kategoriyi sil
    const migrateAndRemoveLegacy = (legacyId, targetId, targetMeta) => {
        const legacyIdx = cats.findIndex(c => c.id === legacyId);
        if (legacyIdx !== -1) {
            const legacyCat = cats[legacyIdx];
            let targetCat = cats.find(c => c.id === targetId);
            if (!targetCat) {
                targetCat = {
                    id: targetId,
                    name: targetMeta.name,
                    tag: targetMeta.tag,
                    parentGroup: targetMeta.parentGroup,
                    hidden: false,
                    subItems: []
                };
                cats.push(targetCat);
            }
            if (!targetCat.subItems) targetCat.subItems = [];

            // Eski kategorideki modelleri hedefe aktar (mükerrer ID veya başlığı önle)
            if (legacyCat.subItems && legacyCat.subItems.length > 0) {
                legacyCat.subItems.forEach(item => {
                    const alreadyExists = targetCat.subItems.some(existing => 
                        existing.id === item.id || (existing.title && item.title && existing.title.trim().toLowerCase() === item.title.trim().toLowerCase())
                    );
                    if (!alreadyExists) {
                        targetCat.subItems.push(item);
                    }
                });
            }

            // Eski kategoriyi diziden tamamen kaldır (böylece sayfada çift kart görünmez)
            cats.splice(legacyIdx, 1);
        }
    };

    migrateAndRemoveLegacy('salon', 'koltuk-takimlari', {
        name: 'Koltuk Takımları',
        tag: 'Oturma Grupları',
        parentGroup: 'oturma-gruplari'
    });

    migrateAndRemoveLegacy('oturma', 'kose-takimi', {
        name: 'Köşe Takımı',
        tag: 'Oturma Grupları',
        parentGroup: 'oturma-gruplari'
    });

    migrateAndRemoveLegacy('mutfak', 'mutfak-masa-takimi', {
        name: 'Mutfak Masa Takımı',
        tag: 'Yemek Odası',
        parentGroup: 'yemek-odasi'
    });

    migrateAndRemoveLegacy('yatak', 'yatak-odasi-takimi', {
        name: 'Yatak Odası Takımı',
        tag: 'Yatak Odası',
        parentGroup: 'yatak-odasi'
    });

    // Menüdeki tüm kategorilerin sistemde bir karşılığı olduğundan emin ol (Boş olsa bile)
    FOOTER_COLLECTIONS.forEach(group => {
        group.items.forEach(item => {
            const exists = cats.find(c => c.id === item.slug || (c.name && c.name.toLowerCase() === item.name.toLowerCase()));
            if (!exists) {
                cats.push({
                    id: item.slug,
                    name: item.name,
                    tag: group.title,
                    parentGroup: group.slug,
                    hidden: false,
                    subItems: []
                });
            } else {
                if (!exists.parentGroup) exists.parentGroup = group.slug;
                if (!exists.tag) exists.tag = group.title;
            }
        });
    });

    // Her kategorideki olası mükerrer modelleri ID veya başlığa göre temizle ("2 sinde beraber gorunmesin")
    cats.forEach(c => {
        if (c.subItems && c.subItems.length > 1) {
            const seen = new Set();
            c.subItems = c.subItems.filter(item => {
                const key = item.id ? String(item.id) : (item.title ? item.title.trim().toLowerCase() : Math.random());
                if (seen.has(key)) return false;
                seen.add(key);
                return true;
            });
        }
    });

    try {
        localStorage.setItem('ihsan_categories', JSON.stringify(cats));
    } catch(e) {}
    return cats;
}

// Tasarım Düzenleme ve Ekleme modalında kategorileri optgroup ile dolduran yardımcı
function populateCategoryDropdown(selectEl, selectedId) {
    if (!selectEl) return;
    let html = '';
    const cleanSel = (selectedId || '').toLowerCase().trim();
    FOOTER_COLLECTIONS.forEach(group => {
        html += `<optgroup label="${group.title}">`;
        group.items.forEach(item => {
            const isSel = (item.slug === cleanSel || item.name.toLowerCase() === cleanSel) ? 'selected' : '';
            html += `<option value="${item.slug}" ${isSel}>${item.name}</option>`;
        });
        html += `</optgroup>`;
    });
    selectEl.innerHTML = html;
}

// Kolay Erişim Bölmelerini (Footer Directory) Ekrana Basan Fonksiyon
function renderFooterDirectory(containerId = 'footer-directory') {
    const el = document.getElementById(containerId);
    if (!el) return;

    const cats = getMergedCategories();

    let html = `
        <div class="footer-dir-wrapper">
            <div class="footer-dir-container">
    `;

    FOOTER_COLLECTIONS.forEach(group => {
        html += `
            <div class="footer-dir-col">
                <h4 class="footer-dir-title">
                    <a href="detail.html?cat=${encodeURIComponent(group.slug)}">${group.title}</a>
                </h4>
                <ul class="footer-dir-list">
        `;

        group.items.forEach(item => {
            const catObj = cats.find(c => c.id === item.slug || (c.name && c.name.toLowerCase() === item.name.toLowerCase()));
            const count = (catObj && catObj.subItems) ? catObj.subItems.length : 0;
            const badgeHtml = count > 0 ? `<span class="footer-item-badge">${count}</span>` : '';

            html += `
                <li>
                    <a href="detail.html?cat=${encodeURIComponent(item.slug)}" class="footer-dir-link" title="${item.name}">
                        <span>${item.name}</span>
                        ${badgeHtml}
                    </a>
                </li>
            `;
        });

        html += `
                </ul>
            </div>
        `;
    });

    html += `
            </div>
        </div>
    `;

    el.innerHTML = html;
}

if (typeof window !== 'undefined') {
    window.CONTACT_INFO = CONTACT_INFO;
    window.FOOTER_COLLECTIONS = FOOTER_COLLECTIONS;
    window.findDirectoryItemBySlugOrName = findDirectoryItemBySlugOrName;
    window.getMergedCategories = getMergedCategories;
    window.populateCategoryDropdown = populateCategoryDropdown;
    window.renderFooterDirectory = renderFooterDirectory;
}
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CONTACT_INFO, FOOTER_COLLECTIONS, findDirectoryItemBySlugOrName, getMergedCategories, populateCategoryDropdown, renderFooterDirectory };
}
