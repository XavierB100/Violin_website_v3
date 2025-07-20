/**
 * Violin Website - Enhanced Script
 * Features robust image loading and error recovery
 */

// Initialize EmailJS (replace with your actual credentials)
document.addEventListener('DOMContentLoaded', function() {
  emailjs.init('YOUR_EMAILJS_USER_ID');
  
  // ======================
  // IMAGE LOADING SYSTEM
  // ======================
  const imageLoader = {
    maxRetries: 3,
    retryDelay: 2000,
    
    init: function() {
      console.log('[ImageLoader] Initializing image monitoring');
      this.loadCriticalImages();
      this.setupLazyImages();
      this.startImageWatcher();
    },
    
    loadCriticalImages: function() {
      // Eager-load important images (hero, etc.)
      document.querySelectorAll('img[loading="eager"]').forEach(img => {
        this.ensureImageLoad(img);
      });
    },
    
    setupLazyImages: function() {
      // Lazy load images with retry capability
      const lazyImages = document.querySelectorAll('img[loading="lazy"]');
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            this.ensureImageLoad(img);
            observer.unobserve(img);
          }
        });
      }, { rootMargin: '200px' });
      
      lazyImages.forEach(img => observer.observe(img));
    },
    
    ensureImageLoad: function(img, retryCount = 0) {
      if (img.complete && img.naturalWidth !== 0) return;
      
      const originalSrc = img.src.split('?')[0];
      img.onerror = () => {
        if (retryCount < this.maxRetries) {
          console.warn(`[ImageLoader] Retrying image ${originalSrc} (attempt ${retryCount + 1})`);
          setTimeout(() => {
            img.src = `${originalSrc}?retry=${retryCount + 1}&t=${Date.now()}`;
            this.ensureImageLoad(img, retryCount + 1);
          }, this.retryDelay);
        } else {
          console.error(`[ImageLoader] Failed to load ${originalSrc} after ${this.maxRetries} attempts`);
          img.style.border = '2px dashed red';
        }
      };
      
      // Force reload if not loaded
      if (retryCount > 0 || !img.src.includes('?')) {
        img.src = `${originalSrc}?t=${Date.now()}`;
      }
    },
    
    startImageWatcher: function() {
      // Periodic check for broken images
      setInterval(() => {
        document.querySelectorAll('img').forEach(img => {
          if (!img.complete || img.naturalWidth === 0) {
            console.log('[ImageLoader] Found potentially broken image:', img.src);
            this.ensureImageLoad(img);
          }
        });
      }, 5000);
    }
  };
  
  // Start image loading system
  imageLoader.init();

  // ======================
  // MOBILE MENU TOGGLE
  // ======================
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');
  
  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', function() {
      navLinks.classList.toggle('active');
      const isExpanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', !isExpanded);
    });
    
    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-links a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ======================
  // SMOOTH SCROLLING
  // ======================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: 'smooth'
        });
      }
    });
  });

  // ======================
  // CONTACT FORM HANDLING
  // ======================
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const formStatus = document.getElementById('form-status');
      
      // Show loading state
      formStatus.textContent = 'Sending...';
      formStatus.style.color = 'var(--medium-gray)';
      
      // Send form data via EmailJS
      emailjs.sendForm('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', this)
        .then(() => {
          formStatus.textContent = 'Message sent successfully!';
          formStatus.style.color = 'green';
          contactForm.reset();
          
          // Clear status after 5 seconds
          setTimeout(() => {
            formStatus.textContent = '';
          }, 5000);
        }, (error) => {
          formStatus.textContent = 'Error sending message. Please try again.';
          formStatus.style.color = 'red';
          console.error('EmailJS Error:', error);
        });
    });
    
    // Form validation styling
    const formInputs = document.querySelectorAll('#contact-form input, #contact-form textarea, #contact-form select');
    formInputs.forEach(input => {
      input.addEventListener('blur', function() {
        if (!this.checkValidity()) {
          this.style.borderColor = 'red';
        } else {
          this.style.borderColor = '#ddd';
        }
      });
    });
  }

  // ======================
  // ANIMATIONS
  // ======================
  // Initialize sections with fade-in effect
  document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  });

  const animateOnScroll = function() {
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
      const sectionTop = section.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      
      if (sectionTop < windowHeight - 100) {
        section.style.opacity = '1';
        section.style.transform = 'translateY(0)';
      }
    });
  };

  // Run once on load
  animateOnScroll();
  
  // Then run on scroll
  window.addEventListener('scroll', animateOnScroll);

  // ======================
  // ANALYTICS
  // ======================
  // Google Analytics tracking for outbound links
  document.querySelectorAll('a[href^="http"]').forEach(link => {
    if (link.hostname !== window.location.hostname) {
      link.addEventListener('click', function(e) {
        if (typeof gtag !== 'undefined') {
          gtag('event', 'click', {
            'event_category': 'Outbound Link',
            'event_label': this.href,
            'transport_type': 'beacon'
          });
        }
      });
    }
  });

  // ======================
  // CALENDLY WIDGET FALLBACK
  // ======================
  if (document.querySelector('.calendly-inline-widget') {
    setTimeout(() => {
      if (typeof Calendly === 'undefined') {
        console.log('Loading Calendly widget fallback');
        const script = document.createElement('script');
        script.src = 'https://assets.calendly.com/assets/external/widget.js';
        script.async = true;
        document.body.appendChild(script);
      }
    }, 3000);
  }
});

// Fallback for browsers that don't support loading="lazy"
if (!('loading' in HTMLImageElement.prototype)) {
  const lazyLoad = function() {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    
    lazyImages.forEach(img => {
      if (img.getBoundingClientRect().top < window.innerHeight + 100) {
        img.src = img.dataset.src;
        img.removeAttribute('loading');
      }
    });
  };
  
  // Run on load and scroll
  window.addEventListener('load', lazyLoad);
  window.addEventListener('scroll', lazyLoad);
}
