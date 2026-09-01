import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, collection, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDTZfOOSxaWFlAc_smFxGKb3Sv3HH8tEAw",
    authDomain: "napatatelhaya-98cb9.firebaseapp.com",
    projectId: "napatatelhaya-98cb9",
    storageBucket: "napatatelhaya-98cb9.firebasestorage.app",
    messagingSenderId: "794316862369",
    appId: "1:794316862369:web:592fF5ce4e867c97bc91e0"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let allProducts = [];

document.addEventListener('DOMContentLoaded', async () => {
    const productsContainer = document.querySelector('.products-grid'); // تم التحديث ليتطابق مع الكود الخاص بك
    if (!productsContainer) return;

    const currentLang = document.documentElement.lang || 'en';
    const isArabic = currentLang === 'ar';

    try {
        productsContainer.innerHTML = isArabic ? '<p style="text-align:center; width:100%; grid-column: 1 / -1;">جاري تحميل المنتجات... 🌿</p>' : '<p style="text-align:center; width:100%; grid-column: 1 / -1;">Loading products... 🌿</p>';

        const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            productsContainer.innerHTML = isArabic ? '<p style="text-align:center; width:100%; grid-column: 1 / -1;">لا توجد منتجات حالياً.</p>' : '<p style="text-align:center; width:100%; grid-column: 1 / -1;">No products available currently.</p>';
            return;
        }

        querySnapshot.forEach((doc) => {
            allProducts.push(doc.data());
        });

        const urlParams = new URLSearchParams(window.location.search);
        const urlCategory = urlParams.get('category') || 'all';

        if (typeof window.updateActiveButton === 'function') {
            window.updateActiveButton(urlCategory);
        }

        renderProducts(urlCategory, isArabic);

    } catch (error) {
        console.error("Error fetching products:", error);
        productsContainer.innerHTML = isArabic ? '<p style="text-align:center; width:100%; grid-column: 1 / -1;">حدث خطأ في تحميل البيانات.</p>' : '<p style="text-align:center; width:100%; grid-column: 1 / -1;">Error loading data.</p>';
    }
});

function renderProducts(category, isArabic) {
    const productsContainer = document.querySelector('.products-grid');
    if (!productsContainer) return;

    productsContainer.innerHTML = '';
    
    const filteredProducts = category === 'all' 
        ? allProducts 
        : allProducts.filter(p => p.category === category);

    if (filteredProducts.length === 0) {
        productsContainer.innerHTML = isArabic ? '<p style="text-align:center; width:100%; grid-column: 1 / -1;">لا توجد منتجات في هذا القسم.</p>' : '<p style="text-align:center; width:100%; grid-column: 1 / -1;">No products in this category.</p>';
        return;
    }

    filteredProducts.forEach(product => {
        const productName = isArabic ? product.name.ar : product.name.en;
        const productDesc = isArabic ? product.description.ar : product.description.en;
        const whatsappMsg = isArabic ? `أريد الاستفسار عن منتج: ${productName}` : `I would like to inquire about: ${productName}`;
        
        // ترجمة اسم القسم
        let catName = '';
        if (product.category === 'herbs') catName = isArabic ? 'أعشاب' : 'Herbs';
        else if (product.category === 'spices') catName = isArabic ? 'توابل' : 'Spices';
        else if (product.category === 'seeds') catName = isArabic ? 'بذور' : 'Seeds';
        else catName = product.category;

        const originText = isArabic ? 'المنشأ: <strong>مصر</strong>' : 'Origin: <strong>Egypt</strong>';
        const linkText = isArabic ? 'استفسار ←' : 'Inquire →';

        // استخدام نفس هيكل HTML الخاص بك بالضبط
       // في نهاية دالة renderProducts، استبدل productCard بهذا:
const productCard = `
    <div class="product-card fade-in visible" onclick="window.location.href='product-detail.html?id=${product.id}'" style="cursor: pointer;">
        <div class="product-image">
            <img src="${product.image}" alt="${productName}">
            <div class="product-overlay">
                <span>عرض التفاصيل</span>
            </div>
        </div>
        <div class="product-info">
            <div class="product-category">${catName}</div>
            <h3 class="product-name">${productName}</h3>
            <p class="product-desc">${productDesc}</p>
            <div class="product-footer">
                <div class="product-origin">${originText}</div>
                <span class="product-link">${linkText}</span>
            </div>
        </div>
    </div>
`;
        productsContainer.innerHTML += productCard;
    });
}

window.filterProducts = function(category) {
    const isArabic = (document.documentElement.lang || 'en') === 'ar';
    renderProducts(category, isArabic);
    updateActiveButton(category);
    
    const newUrl = window.location.pathname + '?category=' + category;
    window.history.pushState({path:newUrl}, '', newUrl);
};

window.updateActiveButton = function(category) {
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    
    const activeBtn = Array.from(buttons).find(btn => btn.getAttribute('onclick') && btn.getAttribute('onclick').includes(category));
    if (activeBtn) activeBtn.classList.add('active');
};