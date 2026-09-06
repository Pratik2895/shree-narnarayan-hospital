document.addEventListener('DOMContentLoaded', () => {
    /* ─────────────────────────────────────────────
       CONFIGURATION
    ───────────────────────────────────────────── */
    const WHATSAPP_NUMBER      = '918530731365';
    const WHATSAPP_CRM_WIDGET_ACTIVE = false;
    const OPD_OPEN_HOUR        = 9;   // 9 AM IST
    const OPD_CLOSE_HOUR       = 17;  // 5 PM IST
    const TC_AUTO_INTERVAL_MS  = 4500;
    const APPT_CTA_DELAY_MS    = 8000;

    /* ─────────────────────────────────────────────
       WhatsApp CRM widget toggle
    ───────────────────────────────────────────── */
    if (WHATSAPP_CRM_WIDGET_ACTIVE) {
        const floatWA = document.querySelector('.float-whatsapp');
        if (floatWA) floatWA.style.display = 'none';
    }

    /* ─────────────────────────────────────────────
       ELEMENT REFS
    ───────────────────────────────────────────── */
    const header      = document.getElementById('header');
    const menuToggle  = document.getElementById('menuToggle');
    const nav         = document.getElementById('nav');
    const navLinks    = document.querySelectorAll('.nav-link');
    const backToTop   = document.getElementById('backToTop');
    const contactForm = document.getElementById('contactForm');

    /* ─────────────────────────────────────────────
       HEADER SCROLL + BACK-TO-TOP
    ───────────────────────────────────────────── */
    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 10);
        backToTop.classList.toggle('visible', window.scrollY > 500);
        updateActiveNav();
        maybeShowApptCta();
    }, { passive: true });

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    /* ─────────────────────────────────────────────
       MOBILE MENU
    ───────────────────────────────────────────── */
    menuToggle.addEventListener('click', () => {
        const open = nav.classList.toggle('open');
        menuToggle.setAttribute('aria-expanded', String(open));
        const spans = menuToggle.querySelectorAll('span');
        if (open) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity   = '0';
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
        spans[1].style.opacity   = '';
        spans[2].style.transform = '';
    }

    /* ─────────────────────────────────────────────
       SCROLL SPY
    ───────────────────────────────────────────── */
    function updateActiveNav() {
        const sections  = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 140;
        sections.forEach(section => {
            const top    = section.offsetTop;
            const height = section.offsetHeight;
            const id     = section.getAttribute('id');
            const link   = document.querySelector(`.nav-link[href="#${id}"]`);
            if (link) {
                link.classList.toggle('active', scrollPos >= top && scrollPos < top + height);
            }
        });
    }

    /* ─────────────────────────────────────────────
       FADE-IN ON SCROLL
    ───────────────────────────────────────────── */
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll(
        '.service-card, .facility-card, .gallery-item, .doctor-card, ' +
        '.testimonial-card, .contact-card, .contact-form-wrapper, ' +
        '.feature, .about-content, .about-image, .schedule-info, ' +
        '.schedule-table, .vaccine-info, .vaccine-visual, .google-rating-summary'
    ).forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });

    /* ─────────────────────────────────────────────
       ANIMATED COUNTERS
    ───────────────────────────────────────────── */
    document.querySelectorAll('.stat-number[data-count]').forEach(counter => {
        const target   = parseInt(counter.getAttribute('data-count'), 10);
        const duration = 1800;
        const step     = target / (duration / 16);
        let current    = 0;

        const update = () => {
            current += step;
            if (current < target) {
                counter.textContent = Math.floor(current).toLocaleString();
                requestAnimationFrame(update);
            } else {
                counter.textContent = target.toLocaleString();
            }
        };

        new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                update();
            }
        }, { threshold: 0.5 }).observe(counter);
    });

    /* ─────────────────────────────────────────────
       FAQ ACCORDION
    ───────────────────────────────────────────── */
    document.querySelectorAll('.faq-item').forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer   = item.querySelector('.faq-answer');
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

    /* ─────────────────────────────────────────────
       FAQ SEARCH
    ───────────────────────────────────────────── */
    const faqSearchInput = document.getElementById('faqSearch');
    const faqList        = document.getElementById('faqList');

    if (faqSearchInput && faqList) {
        let noResultsEl = document.querySelector('.faq-no-results');
        if (!noResultsEl) {
            noResultsEl = document.createElement('p');
            noResultsEl.className = 'faq-no-results';
            noResultsEl.textContent = 'No matching questions found. Try a different keyword.';
            faqList.after(noResultsEl);
        }

        faqSearchInput.addEventListener('input', () => {
            const q       = faqSearchInput.value.trim().toLowerCase();
            const items   = faqList.querySelectorAll('.faq-item');
            let visible   = 0;

            items.forEach(item => {
                const text    = item.textContent.toLowerCase();
                const matches = !q || text.includes(q);
                item.classList.toggle('faq-hidden', !matches);
                if (matches) visible++;
            });

            noResultsEl.classList.toggle('visible', visible === 0);
        });
    }

    /* ─────────────────────────────────────────────
       LIVE OPD STATUS BADGE
    ───────────────────────────────────────────── */
    function updateOpdStatus() {
        const badge = document.getElementById('opdLiveBadge');
        if (!badge) return;

        // Convert current time to IST (UTC+5:30)
        const now     = new Date();
        const utcMs   = now.getTime() + (now.getTimezoneOffset() * 60000);
        const istMs   = utcMs + (5.5 * 3600000);
        const ist     = new Date(istMs);
        const hour    = ist.getHours();
        const minute  = ist.getMinutes();
        const decimal = hour + minute / 60;
        const isOpen  = decimal >= OPD_OPEN_HOUR && decimal < OPD_CLOSE_HOUR;

        badge.className = 'opd-live-badge ' + (isOpen ? 'opd-open' : 'opd-closed');
        badge.textContent = isOpen ? 'OPD Open Now' : 'OPD Closed';
        badge.title = isOpen
            ? `OPD is open until ${OPD_CLOSE_HOUR}:00 IST`
            : `OPD opens at ${OPD_OPEN_HOUR}:00 AM IST`;
    }

    updateOpdStatus();
    setInterval(updateOpdStatus, 60000);

    /* ─────────────────────────────────────────────
       TESTIMONIAL CAROUSEL (auto-rotating)
    ───────────────────────────────────────────── */
    const tcTrack  = document.getElementById('tcTrack');
    const tcPrev   = document.getElementById('tcPrev');
    const tcNext   = document.getElementById('tcNext');
    const tcDots   = document.getElementById('tcDots');

    if (tcTrack && tcPrev && tcNext) {
        const slides     = tcTrack.querySelectorAll('.tc-slide');
        const total      = slides.length;
        let current      = 0;
        let autoInterval = null;
        let slidesPerView = getSlidesPerView();

        function getSlidesPerView() {
            if (window.innerWidth <= 860) return 1;
            if (window.innerWidth <= 1080) return 2;
            return 3;
        }

        function maxIndex() {
            return Math.max(0, total - slidesPerView);
        }

        function buildDots() {
            tcDots.innerHTML = '';
            const dotCount = maxIndex() + 1;
            for (let i = 0; i < dotCount; i++) {
                const dot = document.createElement('button');
                dot.className = 'tc-dot' + (i === current ? ' active' : '');
                dot.setAttribute('aria-label', `Go to review ${i + 1}`);
                dot.addEventListener('click', () => goTo(i));
                tcDots.appendChild(dot);
            }
        }

        function goTo(idx) {
            current = Math.max(0, Math.min(idx, maxIndex()));
            const slideWidth    = slides[0].offsetWidth + 28;
            tcTrack.style.transform = `translateX(-${current * slideWidth}px)`;
            tcDots.querySelectorAll('.tc-dot').forEach((d, i) => {
                d.classList.toggle('active', i === current);
            });
        }

        function next() { goTo(current >= maxIndex() ? 0 : current + 1); }
        function prev() { goTo(current <= 0 ? maxIndex() : current - 1); }

        function startAuto() {
            stopAuto();
            autoInterval = setInterval(next, TC_AUTO_INTERVAL_MS);
        }

        function stopAuto() {
            if (autoInterval) clearInterval(autoInterval);
        }

        tcNext.addEventListener('click', () => { next(); startAuto(); });
        tcPrev.addEventListener('click', () => { prev(); startAuto(); });

        const carousel = tcTrack.closest('.testimonial-carousel');
        carousel.addEventListener('mouseenter', stopAuto);
        carousel.addEventListener('mouseleave', startAuto);

        let touchStartX = 0;
        tcTrack.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
        tcTrack.addEventListener('touchend', e => {
            const dx = e.changedTouches[0].clientX - touchStartX;
            if (Math.abs(dx) > 40) { dx < 0 ? next() : prev(); startAuto(); }
        }, { passive: true });

        window.addEventListener('resize', () => {
            const newSpv = getSlidesPerView();
            if (newSpv !== slidesPerView) {
                slidesPerView = newSpv;
                current = 0;
                buildDots();
                goTo(0);
            } else {
                goTo(current);
            }
        }, { passive: true });

        buildDots();
        goTo(0);
        startAuto();
    }

    /* ─────────────────────────────────────────────
       FLOATING APPOINTMENT CTA
    ───────────────────────────────────────────── */
    const floatApptCta   = document.getElementById('floatApptCta');
    const floatApptClose = document.getElementById('floatApptClose');
    let apptCtaShown     = false;
    let apptCtaDismissed = false;

    function maybeShowApptCta() {
        if (apptCtaDismissed || apptCtaShown || !floatApptCta) return;
        const scrollPct = window.scrollY / (document.body.scrollHeight - window.innerHeight);
        if (scrollPct > 0.4) showApptCta();
    }

    function showApptCta() {
        if (apptCtaShown || apptCtaDismissed || !floatApptCta) return;
        apptCtaShown = true;
        floatApptCta.classList.add('visible');
    }

    setTimeout(() => { if (!apptCtaDismissed) showApptCta(); }, APPT_CTA_DELAY_MS);

    if (floatApptClose) {
        floatApptClose.addEventListener('click', () => {
            apptCtaDismissed = true;
            floatApptCta.classList.remove('visible');
        });
    }

    /* ─────────────────────────────────────────────
       CONTACT FORM -> WHATSAPP
    ───────────────────────────────────────────── */
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const fd        = new FormData(contactForm);
            const name      = fd.get('name').trim();
            const phone     = fd.get('phone').trim();
            const childName = fd.get('childName').trim();
            const childAge  = fd.get('childAge').trim();
            const service   = fd.get('service').trim();
            const message   = fd.get('message').trim();

            const phoneInput = document.getElementById('phone');
            const nameInput  = document.getElementById('name');
            let valid = true;

            if (!name) { nameInput.classList.add('invalid'); valid = false; }
            else { nameInput.classList.remove('invalid'); }

            if (!/^[0-9+\-\s]{10,15}$/.test(phone)) { phoneInput.classList.add('invalid'); valid = false; }
            else { phoneInput.classList.remove('invalid'); }

            if (!valid) {
                const btn = contactForm.querySelector('button[type="submit"]');
                btn.innerHTML = '<i class="fas fa-exclamation-circle"></i> Please fill required fields';
                btn.disabled  = true;
                setTimeout(() => {
                    btn.innerHTML = '<i class="fab fa-whatsapp"></i> Send via WhatsApp';
                    btn.disabled  = false;
                }, 2500);
                return;
            }

            const lines = [
                'Hello Shree NarNarayan Children Hospital,',
                `Parent: ${name}`,
                `Phone: ${phone}`
            ];
            if (childName) lines.push(`Child's Name: ${childName}`);
            if (childAge)  lines.push(`Child's Age: ${childAge}`);
            if (service)   lines.push(`Service: ${service}`);
            if (message)   lines.push(`Details: ${message}`);

            const text = encodeURIComponent(lines.join('\n'));
            const url  = `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            submitBtn.innerHTML    = '<i class="fas fa-check"></i> Opening WhatsApp...';
            submitBtn.disabled     = true;
            submitBtn.style.background   = '#10b981';
            submitBtn.style.borderColor  = '#10b981';

            window.open(url, '_blank', 'noopener');

            setTimeout(() => {
                submitBtn.innerHTML  = '<i class="fab fa-whatsapp"></i> Send via WhatsApp';
                submitBtn.style.background  = '';
                submitBtn.style.borderColor = '';
                submitBtn.disabled   = false;
                contactForm.reset();
            }, 4000);
        });
    }

    /* ─────────────────────────────────────────────
       DYNAMIC YEAR
    ───────────────────────────────────────────── */
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    /* ─────────────────────────────────────────────
       IMAGE ERROR FALLBACK
    ───────────────────────────────────────────── */
    document.querySelectorAll('img[src^="https://images.unsplash"]').forEach(img => {
        img.addEventListener('error', () => {
            const wrapper = img.closest('.hero-photo, .about-img-wrapper, .vaccine-visual, .doctor-photo-circle');
            if (wrapper) {
                img.style.display = 'none';
                wrapper.classList.add('img-fallback');
            }
        });
    });
});
