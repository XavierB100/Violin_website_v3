document.addEventListener('DOMContentLoaded', function() {
  // Initialize EmailJS with your user ID
  emailjs.init('YOUR_EMAILJS_USER_ID');
  
  // Mobile Menu Toggle
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');
  
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
  
  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      if (this.getAttribute('href') === '#') return;
      
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: 'smooth'
        });
        
        // Update URL without jumping
        if (history.pushState) {
          history.pushState(null, null, targetId);
        } else {
          location.hash = targetId;
        }
      }
    });
  });
  
  // Form submission handling
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
  }
  
  // Form validation
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
  
  // Animation on scroll
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
  
  // Initialize sections with fade-in effect
  document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  });
  
  // Run once on load
  animateOnScroll();
  
  // Then run on scroll with debounce
  let isScrolling;
  window.addEventListener('scroll', function() {
    window.clearTimeout(isScrolling);
    isScrolling = setTimeout(function() {
      animateOnScroll();
    }, 66);
  }, false);
  
  // Lightbox functionality
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-image');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const closeLightbox = document.querySelector('.close-lightbox');
  const prevBtn = document.querySelector('.prev');
  const nextBtn = document.querySelector('.next');
  
  if (lightbox) {
    // Get all gallery items
    const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
    let currentIndex = 0;
    
    // Open lightbox
    galleryItems.forEach((item, index) => {
      item.addEventListener('click', () => {
        currentIndex = index;
        updateLightbox();
        lightbox.style.display = 'block';
        document.body.style.overflow = 'hidden';
      });
    });
    
    // Close lightbox
    closeLightbox.addEventListener('click', () => {
      lightbox.style.display = 'none';
      document.body.style.overflow = 'auto';
    });
    
    // Close when clicking outside image
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        lightbox.style.display = 'none';
        document.body.style.overflow = 'auto';
      }
    });
    
    // Navigation
    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
      updateLightbox();
    });
    
    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      currentIndex = (currentIndex + 1) % galleryItems.length;
      updateLightbox();
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (lightbox.style.display === 'block') {
        if (e.key === 'Escape') {
          lightbox.style.display = 'none';
          document.body.style.overflow = 'auto';
        } else if (e.key === 'ArrowLeft') {
          currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
          updateLightbox();
        } else if (e.key === 'ArrowRight') {
          currentIndex = (currentIndex + 1) % galleryItems.length;
          updateLightbox();
        }
      }
    });
    
    function updateLightbox() {
      const imgSrc = galleryItems[currentIndex].querySelector('img').getAttribute('data-fullsize');
      const caption = galleryItems[currentIndex].querySelector('.gallery-caption').textContent;
      
      lightboxImg.src = imgSrc;
      lightboxImg.alt = galleryItems[currentIndex].querySelector('img').alt;
      lightboxCaption.textContent = caption;
    }
  }
  
  // Lazy loading for images
  if ('loading' in HTMLImageElement.prototype) {
    // Native lazy loading is supported
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    lazyImages.forEach(img => {
      if (img.dataset.src) {
        img.src = img.dataset.src;
      }
    });
  } else {
    // Fallback for browsers without native lazy loading
    const lazyLoad = function() {
      const lazyImages = document.querySelectorAll('img[loading="lazy"]');
      
      lazyImages.forEach(img => {
        if (img.getBoundingClientRect().top < window.innerHeight + 100) {
          if (img.dataset.src) {
            img.src = img.dataset.src;
          }
          img.removeAttribute('loading');
        }
      });
    };
    
    // Run on load and scroll
    lazyLoad();
    window.addEventListener('scroll', lazyLoad);
  }
  
  // Google Analytics tracking for outbound links
  document.querySelectorAll('a[href^="http"]').forEach(link => {
    if (link.hostname !== window.location.hostname) {
      link.addEventListener('click', function(e) {
        gtag('event', 'click', {
          'event_category': 'Outbound Link',
          'event_label': this.href,
          'transport_type': 'beacon'
        });
      });
    }
  });
});
