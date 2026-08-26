// =========================================
// main.js - Application Entry Point
// =========================================
// =========================================
// main.js - Application Entry Point
// الغرض: تهيئة التطبيق وتشغيل الوحدات
// =========================================

// انتظار تحميل DOM بالكامل قبل تشغيل أي كود
document.addEventListener('DOMContentLoaded', () => {
  console.log('✅ DOM Loaded Successfully');
  
  // =========================================
  // 1. Initialize i18n (Language System)
  // يجب أن يكون أول شيء يتم تحميله لضمان عرض النصوص الصحيحة
  // =========================================
  if (typeof initI18n === 'function') {
    initI18n();
    console.log('✅ i18n System Initialized');
  } else {
    console.warn('⚠️ i18n System Not Found');
  }
  
  // =========================================
  // 2. Initialize UI Components
  // Header, Mobile Menu, Dropdowns, Scroll Animations
  // =========================================
  if (typeof initUI === 'function') {
    initUI();
    console.log('✅ UI Components Initialized');
  } else {
    console.warn('⚠️ UI Components Not Found');
  }
  
  // =========================================
  // 3. Initialize Form Handling
  // Contact Form Validation and Submission
  // =========================================
  if (typeof initForm === 'function') {
    initForm();
    console.log('✅ Form Handling Initialized');
  } else {
    console.warn('⚠️ Form Handling Not Found');
  }
  
  // =========================================
  // 4. Application Ready
  // =========================================
  console.log('🚀 Nabatat Elhaya Application Ready');
  console.log('📱 Mobile-First Design Active');
  console.log('🌍 Bilingual Support: EN / AR');
});

// =========================================
// Global Error Handler (Optional)
// =========================================
window.addEventListener('error', (event) => {
  console.error('❌ Global Error:', event.error);
});

// =========================================
// Performance Monitoring (Optional)
// =========================================
window.addEventListener('load', () => {
  const perfData = performance.getEntriesByType('navigation')[0];
  console.log('📊 Page Load Time:', Math.round(perfData.loadEventEnd - perfData.startTime), 'ms');
});
// Import or initialize modules here when ready
// import { initI18n } from './i18n.js';
// import { initUI } from './ui.js';
// import { initForm } from './form.js';
