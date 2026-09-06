document.addEventListener('DOMContentLoaded', () => {
    const WHATSAPP_CRM_WIDGET_ACTIVE = false;

    if (WHATSAPP_CRM_WIDGET_ACTIVE) {
        const ours = document.querySelector('.float-whatsapp');
        if (ours) ours.style.display = 'none';
    }

    const header = document.getElementById('header');
    const menuToggle = document.getElementById('menuToggle');
    const nav = document.getElementById('nav');
    const navLinks = document.querySelectorAll('.nav-link');
    const backToTop = document.getElementById('backToTop');
    const contactForm = document.getElementById('contactForm');

    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 10);
        backToTop.classList.toggle('visible', window.scrollY > 500);
        updateActiveNav();
    }, { passive: true });

    menuToggle.addEventListener('click', () => {
        const open = nav.classList.toggle('open');
        menuToggle.setAttribute('aria-expanded', String(open));
        const spans = menuToggle.querySelectorAll('span');
        if (open) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
        } else {
            resetToggle(spans);
        }
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('open');
            menuToggle.setAttribute('aria-expanded', 'false');
            resetToggle(menuToggle.querySelectorAll('span'));
        });
    });

    function resetToggle(spans) {
        spans[0].style.transform = '';
        spans[1].style.opacity = '';
        spans[2].style.transform = '';
    }

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    function updateActiveNav() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 140;
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            const link = document.querySelector(`.nav-link[href="#${id}"]`);
            if (link) {
                link.classList.toggle('active', scrollPos >= top && scrollPos < top + height);
            }
        });
    }

    const observerOptions = {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.service-card, .facility-card, .gallery-item, .doctor-card, .testimonial-card, .contact-card, .contact-form-wrapper, .feature, .about-content, .about-image, .schedule-info, .schedule-table, .vaccine-info, .vaccine-visual')
        .forEach(el => {
            el.classList.add('fade-in');
            observer.observe(el);
        });

    function animateCounters() {
        const counters = document.querySelectorAll('.stat-number[data-count]');
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-count'), 10);
            const duration = 1800;
            const step = target / (duration / 16);
            let current = 0;

            const update = () => {
                current += step;
                if (current < target) {
                    counter.textContent = Math.floor(current).toLocaleString();
                    requestAnimationFrame(update);
                } else {
                    counter.textContent = target.toLocaleString();
                }
            };

            const counterObserver = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    update();
                    counterObserver.unobserve(counter);
                }
            }, { threshold: 0.5 });

            counterObserver.observe(counter);
        });
    }

    animateCounters();

    document.querySelectorAll('.faq-item').forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        question.addEventListener('click', () => {
            const isOpen = item.classList.contains('open');
            document.querySelectorAll('.faq-item.open').forEach(openItem => {
                openItem.classList.remove('open');
                openItem.querySelector('.faq-answer').style.maxHeight = null;
                openItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
            });
            if (!isOpen) {
                item.classList.add('open');
                answer.style.maxHeight = answer.scrollHeight + 'px';
                question.setAttribute('aria-expanded', 'true');
            }
        });
    });

    const WHATSAPP_NUMBER = '918530731365';

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(contactForm);
            const name = formData.get('name').trim();
            const phone = formData.get('phone').trim();
            const childName = formData.get('childName').trim();
            const childAge = formData.get('childAge').trim();
            const service = formData.get('service').trim();
            const message = formData.get('message').trim();

            const phoneInput = document.getElementById('phone');
            const nameInput = document.getElementById('name');
            let valid = true;

            if (!name) {
                nameInput.classList.add('invalid');
                valid = false;
            } else {
                nameInput.classList.remove('invalid');
            }

            if (!/^[0-9+\-\s]{10,15}$/.test(phone)) {
                phoneInput.classList.add('invalid');
                valid = false;
            } else {
                phoneInput.classList.remove('invalid');
            }

            if (!valid) {
                const btn = contactForm.querySelector('button[type="submit"]');
                btn.innerHTML = '<i class="fas fa-exclamation-circle"></i> Please fill required fields';
                btn.disabled = true;
                setTimeout(() => {
                    btn.innerHTML = '<i class="fab fa-whatsapp"></i> Send via WhatsApp';
                    btn.disabled = false;
                }, 2500);
                return;
            }

            const lines = [
                'Hello Shree NarNarayan Children Hospital,',
                `Parent: ${name}`,
                `Phone: ${phone}`
            ];
            if (childName) lines.push(`Child's Name: ${childName}`);
            if (childAge) lines.push(`Child's Age: ${childAge}`);
            if (service) lines.push(`Service: ${service}`);
            if (message) lines.push(`Details: ${message}`);

            const text = encodeURIComponent(lines.join('\n'));
            const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            submitBtn.innerHTML = '<i class="fas fa-check"></i> Opening WhatsApp...';
            submitBtn.disabled = true;
            submitBtn.style.background = '#10b981';
            submitBtn.style.borderColor = '#10b981';

            window.open(url, '_blank', 'noopener');

            setTimeout(() => {
                submitBtn.innerHTML = '<i class="fab fa-whatsapp"></i> Send via WhatsApp';
                submitBtn.style.background = '';
                submitBtn.style.borderColor = '';
                submitBtn.disabled = false;
                contactForm.reset();
            }, 4000);
        });
    }

    const yearEl = document.getElementById('year');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }

    document.querySelectorAll('img[src^="https://images.unsplash"]').forEach(img => {
        img.addEventListener('error', () => {
            const wrapper = img.closest('.hero-photo, .about-img-wrapper, .vaccine-visual, .doctor-image');
            if (wrapper) {
                img.style.display = 'none';
                wrapper.classList.add('img-fallback');
            }
        });
    });
});