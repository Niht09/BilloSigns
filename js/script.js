// =============================================
// BILL O SIGNS - SCRIPT.JS
// Premium Interactive Functionality
// =============================================

document.addEventListener('DOMContentLoaded', () => {
    
    // ==================== HAMBURGER MENU ====================
    const hamBtn = document.getElementById('hamBtn');
    const mobileNav = document.getElementById('mobileNav');

    if (hamBtn && mobileNav) {
        hamBtn.addEventListener('click', () => {
            hamBtn.classList.toggle('open');
            mobileNav.classList.toggle('open');
        });

        // Close mobile menu when clicking links
        document.querySelectorAll('.mobile-nav a').forEach(link => {
            link.addEventListener('click', () => {
                hamBtn.classList.remove('open');
                mobileNav.classList.remove('open');
            });
        });
    }

    // ==================== SMOOTH SCROLLING ====================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.scrollY - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ==================== FAQ ACCORDION ====================
    const faqQuestions = document.querySelectorAll('.faq-q');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const answer = question.nextElementSibling;
            const isOpen = question.classList.contains('open');

            // Close all other FAQs
            faqQuestions.forEach(q => {
                q.classList.remove('open');
                if (q.nextElementSibling) {
                    q.nextElementSibling.classList.remove('open');
                }
            });

            // Toggle current FAQ
            if (!isOpen) {
                question.classList.add('open');
                if (answer) answer.classList.add('open');
            }
        });
    });

    // ==================== QUOTE FORM (Web3Forms) ====================
    const quoteForm = document.getElementById('quoteForm');
    
    if (quoteForm) {
        quoteForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = quoteForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            
            // Show loading state
            submitBtn.innerHTML = `
                <span style="display: inline-block; animation: spin 1s linear infinite;">⟳</span> 
                Sending Request...
            `;
            submitBtn.disabled = true;

            try {
                const formData = new FormData(quoteForm);
                
                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    body: formData
                });

                const result = await response.json();

                if (result.success) {
                    // Success state
                    showSuccessMessage(quoteForm);
                } else {
                    alert('Something went wrong. Please try again or message us on WhatsApp.');
                }
            } catch (error) {
                console.error('Form submission error:', error);
                alert('Unable to send request. Please try WhatsApp or call us directly.');
            } finally {
                // Reset button
                setTimeout(() => {
                    submitBtn.innerHTML = originalBtnText;
                    submitBtn.disabled = false;
                }, 1500);
            }
        });
    }

    function showSuccessMessage(form) {
        const successHTML = `
            <div style="text-align: center; padding: 3rem 1.5rem; background: #F0FDF4; border-radius: 12px; border: 2px solid #86EFAC;">
                <div style="font-size: 3.5rem; margin-bottom: 1rem;">✅</div>
                <h3 style="font-family: 'Montserrat', sans-serif; font-size: 1.75rem; margin-bottom: 0.75rem; color: #166534;">
                    Quote Request Received!
                </h3>
                <p style="color: #166534; font-size: 1.1rem; max-width: 420px; margin: 0 auto 1.5rem;">
                    Thank you! We'll contact you within 24 hours with clear pricing and next steps.
                </p>
                <a href="https://wa.me/17801234567" 
                   target="_blank" 
                   style="display: inline-flex; align-items: center; gap: 10px; background: #25D366; color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600;">
                    📲 Also Message Us on WhatsApp
                </a>
            </div>
        `;

        form.innerHTML = successHTML;
        
        // Scroll to success message
        setTimeout(() => {
            form.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
    }

    // ==================== SCROLL ANIMATIONS (Intersection Observer) ====================
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.service-card, .switch-card, .step-card, .testi-card, .portfolio-item');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        });

        elements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'all 0.6s cubic-bezier(0.25, 0.1, 0.25, 1)';
            observer.observe(el);
        });
    };

    // Run animations after load
    setTimeout(animateOnScroll, 800);

    // ==================== STICKY HEADER ENHANCEMENT ====================
    let lastScroll = 0;
    const header = document.querySelector('.header');

    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;
        
        if (currentScroll > lastScroll && currentScroll > 200) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        lastScroll = currentScroll;
    });

    // ==================== KEYBOARD SUPPORT & ACCESSIBILITY ====================
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileNav.classList.contains('open')) {
            hamBtn.classList.remove('open');
            mobileNav.classList.remove('open');
        }
    });

    // ==================== WHATSAPP BUTTON TRACKING (Optional Analytics) ====================
    const waButtons = document.querySelectorAll('a[href*="wa.me"]');
    waButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            console.log('%cWhatsApp clicked from Billo Signs', 'color: #25D366; font-weight: bold');
            // You can add Google Analytics / Meta Pixel here later
        });
    });

    console.log('%c✅ Billo Signs website scripts loaded successfully', 
        'color: #B8962E; font-family: monospace; font-size: 13px;');
});