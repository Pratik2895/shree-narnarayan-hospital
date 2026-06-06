document.addEventListener('DOMContentLoaded', () => {
    const header = document.getElementById('header');
    const menuToggle = document.getElementById('menuToggle');
    const nav = document.getElementById('nav');
    const navLinks = document.querySelectorAll('.nav-link');
    const backToTop = document.getElementById('backToTop');
    const contactForm = document.getElementById('contactForm');
    const themeToggle = document.getElementById('themeToggle');
    const formStatus = document.getElementById('formStatus');

    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 50);
        backToTop.classList.toggle('visible', window.scrollY > 500);
        updateActiveNav();
    });

    menuToggle.addEventListener('click', () => {
        nav.classList.toggle('open');
        const spans = menuToggle.querySelectorAll('span');
        if (nav.classList.contains('open')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
        } else {
            spans[0].style.transform = '';
            spans[1].style.opacity = '';
            spans[2].style.transform = '';
        }
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('open');
            const spans = menuToggle.querySelectorAll('span');
            spans[0].style.transform = '';
            spans[1].style.opacity = '';
            spans[2].style.transform = '';
        });
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    function updateActiveNav() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 100;
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
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.service-card, .doctor-card, .contact-card, .feature, .about-content, .about-image, .schedule-info, .schedule-table').forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });

    function animateCounters() {
        const counters = document.querySelectorAll('.stat-number[data-count]');
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-count'));
            const duration = 2000;
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

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(contactForm);
            const name = formData.get('name');

            const btn = contactForm.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
            btn.style.background = '#10b981';
            btn.style.borderColor = '#10b981';
            btn.disabled = true;

            if (formStatus) {
                formStatus.textContent = `Message sent. Thank you, ${name || 'visitor'}.`;
            }

            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.style.background = '';
                btn.style.borderColor = '';
                btn.disabled = false;
                contactForm.reset();
                if (formStatus) formStatus.textContent = '';
            }, 3000);
        });
    }

    // Theme toggle: persist preference and apply
    function applyTheme(isDark) {
        document.body.classList.toggle('dark', isDark);
        if (themeToggle) {
            const icon = themeToggle.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-sun', isDark);
                icon.classList.toggle('fa-moon', !isDark);
            }
        }
    }

    (function initTheme() {
        try {
            const saved = localStorage.getItem('theme');
            const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
            const isDark = saved ? saved === 'dark' : prefersDark;
            applyTheme(isDark);
            if (themeToggle) {
                themeToggle.addEventListener('click', () => {
                    const nowDark = !document.body.classList.contains('dark');
                    applyTheme(nowDark);
                    localStorage.setItem('theme', nowDark ? 'dark' : 'light');
                });
            }
        } catch (e) {
            // localStorage may be unavailable; ignore
        }
    })();
});
