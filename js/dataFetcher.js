// استدعاء مكتبات Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, collection, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// مفاتيح الربط الخاصة بمشروعك
const firebaseConfig = {
    apiKey: "AIzaSyDTZfOOSxaWFlAc_smFxGKb3Sv3HH8tEAw",
    authDomain: "napatatelhaya-98cb9.firebaseapp.com",
    projectId: "napatatelhaya-98cb9",
    storageBucket: "napatatelhaya-98cb9.firebasestorage.app",
    messagingSenderId: "794316862369",
    appId: "1:794316862369:web:592fF5ce4e867c97bc91e0"
};

// تهيئة قاعدة البيانات
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.addEventListener('DOMContentLoaded', async () => {
    const productsContainer = document.getElementById('products-container');
    if (!productsContainer) return;

    // معرفة لغة الصفحة الحالية من وسم html
    const currentLang = document.documentElement.lang || 'ar';
    const isArabic = currentLang === 'ar';

    try {
        // رسالة التحميل
        productsContainer.innerHTML = isArabic ? '<p style="text-align:center; width:100%;">جاري تحميل المنتجات... 🌿</p>' : '<p style="text-align:center; width:100%;">Loading products... 🌿</p>';

        // جلب المنتجات وترتيبها من الأحدث للأقدم
        const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);

        productsContainer.innerHTML = ''; // تفريغ رسالة التحميل

        if (querySnapshot.empty) {
            productsContainer.innerHTML = isArabic ? '<p style="text-align:center; width:100%;">لا توجد منتجات حالياً.</p>' : '<p style="text-align:center; width:100%;">No products available currently.</p>';
            return;
        }

        // بناء بطاقات المنتجات
        querySnapshot.forEach((doc) => {
            const product = doc.data();
            
            // اختيار النص بناءً على اللغة
            const productName = isArabic ? product.name.ar : product.name.en;
            const productDesc = isArabic ? product.description.ar : product.description.en;
            
            // رسالة الواتساب المجهزة باسم المنتج
            const whatsappMsg = isArabic ? `أريد الاستفسار عن منتج: ${productName}` : `I would like to inquire about: ${productName}`;
            const btnText = isArabic ? 'طلب تسعير' : 'Request Quote';

            const productCard = `
                <div class="product-card fade-up visible">
                    <div class="product-image">
                        <img src="${product.image}" alt="${productName}">
                    </div>
                    <div class="product-info">
                        <h3>${productName}</h3>
                        <p style="font-size: 14px; color: var(--text-muted); margin-bottom: 15px;">${productDesc}</p>
                        <a href="https://wa.me/201067131398?text=${encodeURIComponent(whatsappMsg)}" target="_blank" class="btn btn-outline" style="width: 100%; text-align: center; display: block;">
                            <i class="bi bi-whatsapp"></i> ${btnText}
                        </a>
                    </div>
                </div>
            `;
            productsContainer.innerHTML += productCard;
        });

    } catch (error) {
        console.error("Error fetching products:", error);
        productsContainer.innerHTML = isArabic ? '<p style="text-align:center; width:100%;">حدث خطأ في تحميل البيانات.</p>' : '<p style="text-align:center; width:100%;">Error loading data.</p>';
    }
});