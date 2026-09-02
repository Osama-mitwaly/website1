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
// ==========================================
// 1. دالة تحميل إعدادات الموقع (اللوجو والاسم) - نسخة محسّنة
// ==========================================
async function loadSiteSettings() {
    console.log("🔄 [LOGO] جاري تحميل الإعدادات...");
    console.log(" [LOGO] عدد عناصر اللوجو الموجودة:", document.querySelectorAll('.logo-icon').length);
    
    try {
        const snap = await getDoc(doc(db, 'settings', 'general'));
        
        if (!snap.exists()) {
            console.warn("⚠️ [LOGO] لم يتم العثور على مستند 'general' في Firestore");
            console.log("📋 [LOGO] جميع المستندات المتاحة في settings:", (await getDocs(collection(db, 'settings'))).docs.map(d => d.id));
            return;
        }
        
        const d = snap.data();
        console.log("✅ [LOGO] تم جلب البيانات:", d);
        
        // تحديث اللوجو - طريقة أكثر قوة
        if (d.logo) {
            const logoContainers = document.querySelectorAll('.logo-icon');
            console.log("🖼️ [LOGO] عدد الحاويات التي تم تحديثها:", logoContainers.length);
            
            logoContainers.forEach((el, index) => {
                console.log(` [LOGO] تحديث اللوجو #${index + 1}`);
                el.innerHTML = `<img src="${d.logo}" alt="Logo" style="width:100%; height:100%; object-fit:cover; border-radius:50%; display:block;">`;
            });
        } else {
            console.warn("⚠️ [LOGO] حقل اللوجو فارغ في قاعدة البيانات");
        }
        
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
            }
        });
        
    } catch (error) {
        console.error("❌ [LOGO] خطأ في تحميل الإعدادات:", error);
        console.error(" [LOGO] تفاصيل الخطأ:", error.code, error.message);
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