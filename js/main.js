document.addEventListener('DOMContentLoaded', () => {
    
    // 1. تأثير تصغير شريط التنقل (Header) عند التمرير
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 2. مراقب التمرير لإظهار العناصر بنعومة (Scroll Reveal)
    const animatedElements = document.querySelectorAll('.section-header, .about-content, .about-image, .contact-info, .contact-form');
    
    animatedElements.forEach(el => el.classList.add('fade-up'));

    const observerOptions = {
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible'); 
                observer.unobserve(entry.target);      
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => observer.observe(el));

    // 3. برمجة نموذج الاتصال لفتح تطبيق الإيميل
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

    // 4. برمجة قائمة الجوال (Hamburger Menu)
    const mobileToggle = document.getElementById('mobileToggle');
    const nav = document.getElementById('nav');

    if (mobileToggle && nav) {
        mobileToggle.addEventListener('click', () => {
            nav.classList.toggle('active'); 
        });

        // إغلاق القائمة تلقائياً عند الضغط على أي رابط بداخلها
        const navLinks = document.querySelectorAll('#navMenu li a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('active');
            });
        });
    }
});