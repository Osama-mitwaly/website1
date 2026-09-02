import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// ==========================================
// 0. تهيئة Firebase في هذا الملف (ضروري جداً للـ Modules)
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
// 1. دالة تحميل إعدادات الموقع (اللوجو والاسم)
// ==========================================
async function loadSiteSettings() {
    console.log("🔄 جاري محاولة تحميل إعدادات الموقع من Firebase...");
    try {
        const snap = await getDoc(doc(db, 'settings', 'general'));
        if (snap.exists()) {
            console.log("✅ تم العثور على الإعدادات بنجاح:", snap.data());
            const d = snap.data();
            
            // تحديث اللوجو
            const logoElements = document.querySelectorAll('.logo-icon');
            logoElements.forEach(el => {
                if (d.logo) {
                    el.innerHTML = `<img src="${d.logo}" alt="Logo" style="width:100%; height:100%; object-fit:cover; border-radius:50%;">`;
                    console.log("🖼️ تم تحديث اللوجو في الصفحة.");
                }
            });
            
            // تحديث الاسم
            const nameElements = document.querySelectorAll('.logo-text');
            nameElements.forEach(el => {
                const isAr = document.documentElement.lang === 'ar';
                const name = isAr ? d.companyNameAr : d.companyNameEn;
                if (name) {
                    const parts = name.split(' ');
                    const firstWord = parts[0];
                    const restOfWords = parts.slice(1).join(' ');
                    el.innerHTML = `${firstWord} <span>${restOfWords}</span>`;
                    console.log("📝 تم تحديث الاسم إلى:", name);
                }
            });
        } else {
            console.warn("⚠️ لم يتم العثور على مستند الإعدادات (general) في قاعدة البيانات. تأكد من حفظها من لوحة التحكم أولاً.");
        }
    } catch (error) {
        console.error("❌ خطأ فادح في تحميل إعدادات الموقع:", error);
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    
    // استدعاء دالة تحميل الإعدادات فوراً
    await loadSiteSettings();

    // ==========================================
    // 2. تأثير تصغير شريط التنقل (Header) عند التمرير
    // ==========================================
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

    // ==========================================
    // 3. مراقب التمرير لإظهار العناصر بنعومة (Scroll Reveal)
    // ==========================================
    const fadeElements = document.querySelectorAll('.fade-up');
    const observerOptions = { threshold: 0.15, rootMargin: "0px 0px -50px 0px" };
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible'); 
                observer.unobserve(entry.target);      
            }
        });
    }, observerOptions);

    fadeElements.forEach(el => observer.observe(el));

    // ==========================================
    // 4. برمجة نموذج الاتصال لفتح تطبيق الإيميل (Mailto)
    // ==========================================
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault(); 
            
            const name = document.getElementById('clientName').value;
            const email = document.getElementById('clientEmail').value;
            const message = document.getElementById('clientMessage').value;
            const receiverEmail = 'alsayed0852.as@gmail.com';
            
            const currentLang = document.documentElement.lang;
            const subjectTitle = currentLang === 'en' 
                ? 'New Inquiry from Nabatat Elhaya -' 
                : 'طلب تواصل جديد من موقع نباتات الحياة -';
            
            const subject = encodeURIComponent(`${subjectTitle} ${name}`);
            const body = encodeURIComponent(`الاسم / Name: ${name}\nالبريد / Email: ${email}\n\nالرسالة / Message:\n${message}`);
            
            window.location.href = `mailto:${receiverEmail}?subject=${subject}&body=${body}`;
        });
    }

    // ==========================================
    // 5. برمجة قائمة الجوال (Hamburger Menu) الموحدة
    // ==========================================
    const mobileToggle = document.getElementById('mobileToggle');
    const mainNav = document.getElementById('mainNav');

    if (mobileToggle && mainNav) {
        mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('active');
            mainNav.classList.toggle('active');
        });

        const navLinks = mainNav.querySelectorAll('a:not(.dropdown-toggle)');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileToggle.classList.remove('active');
                mainNav.classList.remove('active');
            });
        });
    }

    // ==========================================
    // 6. برمجة القائمة المنسدلة (Dropdown) الذكية
    // ==========================================
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(dropdown => {
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
        dropdowns.forEach(dropdown => {
            if (!dropdown.contains(e.target)) {
                dropdown.classList.remove('active');
            }
        });
    });
});