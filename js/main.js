import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

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

async function loadSiteSettings() {
    console.clear(); // مسح الكونسول لسهولة القراءة
    console.log("=== بدء التشخيص الحاسم للوجو ===");

    // 1. اختبار بصري فوري: هل الجافاسكريبت يعمل أصلاً؟
    const testElement = document.querySelector('.logo-icon');
    if (testElement) {
        testElement.style.border = "3px solid red"; // سيظهر إطار أحمر حول مكان اللوجو إذا كان الكود يعمل
        console.log("✅ 1. عنصر .logo-icon موجود في الصفحة.");
    } else {
        console.error("❌ 1. فشل: عنصر .logo-icon غير موجود في HTML!");
        return;
    }

    try {
        // 2. جلب البيانات
        console.log("⏳ 2. جاري الاتصال بـ Firebase لجلب مستند 'settings/general'...");
        const snap = await getDoc(doc(db, 'settings', 'general'));
        
        if (!snap.exists()) {
            console.error("❌ 3. فشل: مستند 'general' غير موجود في قاعدة البيانات. هل قمت بحفظ البيانات من لوحة التحكم فعلاً؟");
            return;
        }
        
        console.log("✅ 3. تم العثور على المستند بنجاح.");
        const data = snap.data();
        console.log("📦 4. البيانات الخام المستلمة من Firebase:", data);

        // 3. التحقق من وجود اللوجو
        if (data.logo && data.logo.trim() !== "") {
            console.log("✅ 5. رابط اللوجو موجود وهو:", data.logo);
            
            // 4. حقن اللوجو مع مراقب للأخطاء (onerror)
            const imgHTML = `<img src="${data.logo}" alt="Logo" onerror="console.error('❌ 6. فشل: رابط الصورة مكسور أو محجوب!'); this.style.display='none';" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%; display: block;">`;
            
            document.querySelectorAll('.logo-icon').forEach(el => {
                el.innerHTML = imgHTML;
            });
            console.log("✅ 7. تم حقن كود الصورة في HTML بنجاح.");
        } else {
            console.error("❌ 5. فشل: حقل 'logo' فارغ أو غير موجود في البيانات المستلمة!");
            console.log("💡 الحل: اذهب للوحة التحكم > هوية الشركة > ارفع صورة > اضغط حفظ.");
        }

    } catch (error) {
        console.error("❌ حدث خطأ فادح في الاتصال:", error);
    }
    console.log("=== نهاية التشخيص ===");
}

document.addEventListener('DOMContentLoaded', async () => {
    await loadSiteSettings();
    
    // ... (باقي أكواد الهيدر والقوائم كما هي، لم أغيرها لضمان استقرار الموقع) ...
    const header = document.getElementById('mainHeader');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) header.classList.add('scrolled');
            else header.classList.remove('scrolled');
        });
    }

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
});