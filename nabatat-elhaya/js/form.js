// form.js: Handles Contact Form validation and submission logic
// =========================================
// form.js - Form Handling & Validation
// الغرض: معالجة نموذج الاتصال والتحقق من البيانات
// يدعم: Real-time validation, Loading states, Error messages
// =========================================

const FormHandler = (() => {
  // =========================================
  // Private Variables
  // =========================================
  let contactForm;
  let submitButton;
  let isSubmitting = false;
  
  // =========================================
  // Validation Rules
  // =========================================
  const validators = {
    email: (value) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(value);
    },
    
    phone: (value) => {
      // يسمح بـ: +20 100 123 4567, 01001234567, 123-456-7890
      const phoneRegex = /^[\d\s\-\+\(\)]{10,20}$/;
      return value === '' || phoneRegex.test(value);
    },
    
    required: (value) => {
      return value.trim().length > 0;
    },
    
    minLength: (value, min = 3) => {
      return value.trim().length >= min;
    }
  };
  
  // =========================================
  // 1. Show Error Message
  // =========================================
  function showError(input, message) {
    // إزالة الرسالة القديمة إن وجدت
    const existingError = input.parentElement.querySelector('.error-message');
    if (existingError) {
      existingError.remove();
    }
    
    // إضافة border أحمر
    input.style.borderColor = '#dc2626';
    
    // إنشاء عنصر الرسالة
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.cssText = `
      color: #dc2626;
      font-size: 12px;
      margin-top: 4px;
      font-weight: 500;
    `;
    errorDiv.textContent = message;
    
    // إضافته بعد الـ input
    input.parentElement.appendChild(errorDiv);
  }
  
  // =========================================
  // 2. Clear Error Message
  // =========================================
  function clearError(input) {
    const existingError = input.parentElement.querySelector('.error-message');
    if (existingError) {
      existingError.remove();
    }
    
    input.style.borderColor = '';
  }
  
  // =========================================
  // 3. Validate Single Field
  // =========================================
  function validateField(input) {
    const value = input.value;
    const type = input.type;
    const isRequired = input.hasAttribute('required');
    
    // حقل مطلوب وفارغ
    if (isRequired && !validators.required(value)) {
      showError(input, 'This field is required');
      return false;
    }
    
    // التحقق من البريد الإلكتروني
    if (type === 'email' && value && !validators.email(value)) {
      showError(input, 'Please enter a valid email address');
      return false;
    }
    
    // التحقق من رقم الهاتف
    if (type === 'tel' && value && !validators.phone(value)) {
      showError(input, 'Please enter a valid phone number');
      return false;
    }
    
    // التحقق من الحد الأدنى للأحرف (للموضوع والرسالة)
    if ((input.name === 'subject' || input.tagName === 'TEXTAREA') && value && !validators.minLength(value, 3)) {
      showError(input, 'Please enter at least 3 characters');
      return false;
    }
    
    // كل شيء صحيح
    clearError(input);
    return true;
  }
  
  // =========================================
  // 4. Validate Entire Form
  // =========================================
  function validateForm() {
    const inputs = contactForm.querySelectorAll('input, textarea');
    let isValid = true;
    
    inputs.forEach(input => {
      if (!validateField(input)) {
        isValid = false;
      }
    });
    
    return isValid;
  }
  
  // =========================================
  // 5. Set Loading State
  // =========================================
  function setLoadingState(isLoading) {
    if (isLoading) {
      submitButton.disabled = true;
      submitButton.style.opacity = '0.6';
      submitButton.style.cursor = 'not-allowed';
      submitButton.textContent = 'Sending...';
      contactForm.style.opacity = '0.8';
      contactForm.style.pointerEvents = 'none';
    } else {
      submitButton.disabled = false;
      submitButton.style.opacity = '1';
      submitButton.style.cursor = 'pointer';
      
      // استعادة النص الأصلي بناءً على اللغة
      const currentLang = window.I18n ? window.I18n.getCurrentLang() : 'en';
      const buttonText = currentLang === 'ar' ? 'إرسال الرسالة ←' : 'Send Message →';
      submitButton.textContent = buttonText;
      
      contactForm.style.opacity = '1';
      contactForm.style.pointerEvents = 'auto';
    }
  }
  
  // =========================================
  // 6. Show Success Message
  // =========================================
  function showSuccessMessage() {
    // إنشاء عنصر النجاح
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.style.cssText = `
      background: linear-gradient(135deg, #10b981, #059669);
      color: white;
      padding: 16px;
      border-radius: 12px;
      text-align: center;
      font-weight: 600;
      margin-top: 16px;
      animation: slideIn 0.3s ease;
    `;
    
    const currentLang = window.I18n ? window.I18n.getCurrentLang() : 'en';
    successDiv.textContent = currentLang === 'ar' 
      ? '✓ تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.' 
      : '✓ Your message has been sent successfully! We will contact you soon.';
    
    // إضافته بعد النموذج
    contactForm.parentElement.appendChild(successDiv);
    
    // إخفاء الرسالة بعد 5 ثوانٍ
    setTimeout(() => {
      successDiv.style.opacity = '0';
      successDiv.style.transition = 'opacity 0.3s ease';
      setTimeout(() => successDiv.remove(), 300);
    }, 5000);
  }
  
  // =========================================
  // 7. Handle Form Submission
  // =========================================
  async function handleSubmit(e) {
    e.preventDefault();
    
    // منع الإرسال المتكرر
    if (isSubmitting) return;
    
    // التحقق من صحة البيانات
    if (!validateForm()) {
      // التمرير إلى أول خطأ
      const firstError = contactForm.querySelector('.error-message');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    
    // بدء التحميل
    isSubmitting = true;
    setLoadingState(true);
    
    try {
      // جمع البيانات
      const formData = new FormData(contactForm);
      const data = Object.fromEntries(formData.entries());
      
      // محاكاة إرسال البيانات (في الإنتاج، ستستخدم fetch API)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // في الإنتاج، ستستخدم:
      // const response = await fetch('/api/contact', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data)
      // });
      // if (!response.ok) throw new Error('Failed to send message');
      
      console.log('📧 Form data:', data);
      
      // إظهار رسالة النجاح
      showSuccessMessage();
      
      // إعادة تعيين النموذج
      contactForm.reset();
      
    } catch (error) {
      console.error('❌ Error submitting form:', error);
      
      // إظهار رسالة الخطأ
      const currentLang = window.I18n ? window.I18n.getCurrentLang() : 'en';
      const errorMessage = currentLang === 'ar' 
        ? 'حدث خطأ أثناء إرسال رسالتك. يرجى المحاولة مرة أخرى.' 
        : 'An error occurred while sending your message. Please try again.';
      
      alert(errorMessage);
      
    } finally {
      // إنهاء التحميل
      isSubmitting = false;
      setLoadingState(false);
    }
  }
  
  // =========================================
  // 8. Real-time Validation
  // =========================================
  function initRealTimeValidation() {
    const inputs = contactForm.querySelectorAll('input, textarea');
    
    inputs.forEach(input => {
      // التحقق عند فقدان التركيز
      input.addEventListener('blur', () => {
        if (input.value) {
          validateField(input);
        }
      });
      
      // إزالة الخطأ عند الكتابة
      input.addEventListener('input', () => {
        if (input.parentElement.querySelector('.error-message')) {
          validateField(input);
        }
      });
    });
  }
  
  // =========================================
  // 9. Initialize Form Handler
  // =========================================
  function initForm() {
    contactForm = document.getElementById('contactForm');
    if (!contactForm) {
      console.warn('⚠️ Contact form not found');
      return;
    }
    
    submitButton = contactForm.querySelector('.submit-btn');
    if (!submitButton) {
      console.warn('⚠️ Submit button not found');
      return;
    }
    
    // إضافة أسماء للحقول (لجمع البيانات)
    const inputs = contactForm.querySelectorAll('input, textarea');
    inputs.forEach((input, index) => {
      if (!input.name) {
        input.name = `field_${index}`;
      }
    });
    
    // ربط حدث الإرسال
    contactForm.addEventListener('submit', handleSubmit);
    
    // تفعيل التحقق الفوري
    initRealTimeValidation();
    
    console.log('✅ Form handler initialized');
  }
  
  // =========================================
  // Public API
  // =========================================
  return {
    initForm
  };
})();

// Expose to global scope for main.js
window.initForm = FormHandler.initForm;