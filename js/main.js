// ==========================================
// 1. الاستيراد الصحيح والكامل (تم إصلاح الخطأ هنا)
// ==========================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, doc, getDoc, getDocs, collection } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// ==========================================
// 2. تهيئة Firebase
// ==========================================
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

// ==========================================
// 3. دالة تحميل الإعدادات (اللوجو والاسم)
// ==========================================
async function loadSiteSettings() {
    console.log("🔄 [LOGO] بدء عملية تحميل الإعدادات...");
    
    try {
        // محاولة جلب البيانات
        const snap = await getDoc(doc(db, 'settings', 'general'));
        
        if (!snap.exists()) {
            console.warn("⚠️ [LOGO] لم يتم العثور على مستند 'general'. تأكد من حفظ البيانات من لوحة التحكم أولاً.");
            return;
        }
        
        const data = snap.data();
        console.log("✅ [LOGO] تم جلب البيانات بنجاح:", data);
        
        // أ: تحديث اللوجو
        if (data.logo && data.logo.trim() !== "") {
            const logoContainers = document.querySelectorAll('.logo-icon');
            console.log(`🖼️ [LOGO] جاري تحديث ${logoContainers.length} عنصر لوجو...`);
            
            logoContainers.forEach(el => {
                // نستخدم innerHTML لاستبدال الأيقونة النصية بالصورة
                el.innerHTML = `<img src="${data.logo}" alt="Logo" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%; display: block;">`;
            });
            console.log("✅ [LOGO] تم تحديث اللوجو بنجاح.");
        } else {
            console.warn("⚠️ [LOGO] حقل اللوجو فارغ في قاعدة البيانات.");
        }
        
        // ب: تحديث الاسم
        const nameElements = document.querySelectorAll('.logo-text');
        const isAr = document.documentElement.lang === 'ar';
        const name = isAr ? data.companyNameAr : data.companyNameEn;
        
        if (name && name.trim() !== "") {
            nameElements.forEach(el => {
                const parts = name.trim().split(' ');
                const firstWord = parts[0];
                const restOfWords = parts.slice(1).join(' ');
                el.innerHTML = `${firstWord} <span>${restOfWords}</span>`;
            });
            console.log("✅ [LOGO] تم تحديث الاسم بنجاح.");
        }
        
    } catch (error) {
        console.error("❌ [LOGO] حدث خطأ فادح أثناء تحميل الإعدادات:", error);
    }
}

// ==========================================
// 4. تشغيل الكود عند جاهزية الصفحة
// ==========================================
document.addEventListener('DOMContentLoaded', async () => {
    // 1. استدعاء دالة الإعدادات فوراً
    await loadSiteSettings();

    // 2. تأثير تصغير الهيدر
    const header = document.getElementById('mainHeader');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // 3. Scroll Reveal
    const fadeElements = document.querySelectorAll('.fade-up');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible'); 
                observer.unobserve(entry.target);      
            }
        });
    }, { threshold: 0.15, rootMargin: "0px 0px -50px 0px" });

    fadeElements.forEach(el => observer.observe(el));

    // 4. نموذج الاتصال (Mailto)
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault(); 
            const name = document.getElementById('clientName').value;
            const email = document.getElementById('clientEmail').value;
            const message = document.getElementById('clientMessage').value;
            const receiverEmail = 'alsayed0852.as@gmail.com';
            const currentLang = document.documentElement.lang;
            const subjectTitle = currentLang === 'en' ? 'New Inquiry from Nabatat Elhaya -' : 'طلب تواصل جديد من موقع نباتات الحياة -';
            
            const subject = encodeURIComponent(`${subjectTitle} ${name}`);
            const body = encodeURIComponent(`الاسم / Name: ${name}\nالبريد / Email: ${email}\n\nالرسالة / Message:\n${message}`);
            window.location.href = `mailto:${receiverEmail}?subject=${subject}&body=${body}`;
        });
    }

    // 5. قائمة الجوال
    const mobileToggle = document.getElementById('mobileToggle');
    const mainNav = document.getElementById('mainNav');

    if (mobileToggle && mainNav) {
        mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('active');
            mainNav.classList.toggle('active');
        });

        mainNav.querySelectorAll('a:not(.dropdown-toggle)').forEach(link => {
            link.addEventListener('click', () => {
                mobileToggle.classList.remove('active');
                mainNav.classList.remove('active');
            });
        });
    }

    // 6. القائمة المنسدلة
    document.querySelectorAll('.dropdown').forEach(dropdown => {
        const toggle = dropdown.querySelector('.dropdown-toggle');
        if (toggle) {
            toggle.addEventListener('click', function(e) {
                if (window.innerWidth <= 968) {
                    e.preventDefault(); 
                    dropdown.classList.toggle('active');
                }
            });
        }
    });

    document.addEventListener('click', function(e) {
        document.querySelectorAll('.dropdown').forEach(dropdown => {
            if (!dropdown.contains(e.target)) {
                dropdown.classList.remove('active');
            }
        });
    });
});