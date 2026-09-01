document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. تأثير تصغير شريط التنقل (Header) عند التمرير
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
    // 2. مراقب التمرير لإظهار العناصر بنعومة (Scroll Reveal)
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
    // 3. برمجة نموذج الاتصال لفتح تطبيق الإيميل (Mailto)
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
            
            // اختياري: إعادة تعيين النموذج بعد الإرسال
            // contactForm.reset();
        });
    }

    // ==========================================
    // 4. برمجة قائمة الجوال (Hamburger Menu) الموحدة
    // ==========================================
    const mobileToggle = document.getElementById('mobileToggle');
    const mainNav = document.getElementById('mainNav');

    if (mobileToggle && mainNav) {
        // فتح وإغلاق القائمة الرئيسية
        mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('active');
            mainNav.classList.toggle('active');
        });

        // إغلاق القائمة تلقائياً عند الضغط على أي رابط عادي (ليس قائمة منسدلة)
        const navLinks = mainNav.querySelectorAll('a:not(.dropdown-toggle)');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileToggle.classList.remove('active');
                mainNav.classList.remove('active');
            });
        });
    }

    // ==========================================
    // 5. برمجة القائمة المنسدلة (Dropdown) الذكية
    // ==========================================
    const dropdowns = document.querySelectorAll('.dropdown');
    
    dropdowns.forEach(dropdown => {
        const toggle = dropdown.querySelector('.dropdown-toggle');
        
        if (toggle) {
            toggle.addEventListener('click', function(e) {
                // تفعيل النقر للطي والفرد فقط على شاشات الهاتف والأجهزة اللوحية
                if (window.innerWidth <= 968) {
                    e.preventDefault(); // منع الانتقال للرابط في الهاتف
                    dropdown.classList.toggle('active');
                }
            });
        }
    });

    // إغلاق القائمة المنسدلة عند النقر في أي مكان خارجها
    document.addEventListener('click', function(e) {
        dropdowns.forEach(dropdown => {
            if (!dropdown.contains(e.target)) {
                dropdown.classList.remove('active');
            }
        });
    });

});