document.addEventListener('DOMContentLoaded', () => {
    /* ─────────────────────────────────────────────
       CONFIGURATION
    ───────────────────────────────────────────── */
    const WHATSAPP_NUMBER      = '918866663709';
    const WHATSAPP_CRM_WIDGET_ACTIVE = false;
    // OPD sessions (IST): Morning 10 AM-1 PM, Evening 5 PM-8 PM, Mon-Sat
    const OPD_SESSIONS = [
        { open: 10, close: 13 },  // morning
        { open: 17, close: 20 }   // evening
    ];
    const TC_AUTO_INTERVAL_MS  = 4500;
    const APPT_CTA_DELAY_MS    = 8000;

    const prefersReducedMotion = window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hasIntersectionObserver = 'IntersectionObserver' in window;

    /* ─────────────────────────────────────────────
       SUPABASE REST CLIENT (small, dependency-free)
    ───────────────────────────────────────────── */
    const supabaseConfigured = Boolean(
        window.SUPABASE_URL && window.SUPABASE_ANON_KEY &&
        window.SUPABASE_URL !== 'https://your-project.supabase.co'
    );

    async function insertAppointment(payload) {
        if (!supabaseConfigured) throw new Error('Appointment service is not configured.');

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 10000);

        try {
            const response = await fetch(`${window.SUPABASE_URL}/rest/v1/appointments`, {
                method: 'POST',
                headers: {
                    apikey: window.SUPABASE_ANON_KEY,
                    Authorization: `Bearer ${window.SUPABASE_ANON_KEY}`,
                    'Content-Type': 'application/json',
                    Prefer: 'return=minimal'
                },
                body: JSON.stringify(payload),
                signal: controller.signal
            });

            if (!response.ok) {
                const details = await response.json().catch(() => ({}));
                throw new Error(details.message || `Appointment request failed (${response.status}).`);
            }
        } finally {
            clearTimeout(timeout);
        }
    }

    function getSessionId() {
        try {
            const existing = sessionStorage.getItem('hospital_analytics_session');
            if (existing) return existing;
            const created = window.crypto?.randomUUID?.();
            if (created) sessionStorage.setItem('hospital_analytics_session', created);
            return created;
        } catch (_) {
            return window.crypto?.randomUUID?.();
        }
    }

    const analyticsSessionId = getSessionId();

    function trackEvent(eventName, metadata = {}) {
        if (!supabaseConfigured || !analyticsSessionId) return;

        let referrerHost = null;
        try {
            referrerHost = document.referrer ? new URL(document.referrer).hostname : null;
        } catch (_) {
            referrerHost = null;
        }

        const width = window.innerWidth;
        const deviceType = width < 768 ? 'mobile' : width < 1100 ? 'tablet' : 'desktop';
        const payload = {
            event_name: eventName,
            session_id: analyticsSessionId,
            page_path: window.location.pathname.slice(0, 200),
            referrer_host: referrerHost?.slice(0, 200) || null,
            device_type: deviceType,
            metadata
        };

        fetch(`${window.SUPABASE_URL}/rest/v1/site_events`, {
            method: 'POST',
            headers: {
                apikey: window.SUPABASE_ANON_KEY,
                Authorization: `Bearer ${window.SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json',
                Prefer: 'return=minimal'
            },
            body: JSON.stringify(payload),
            keepalive: true
        }).catch(() => {});
    }

    trackEvent('page_view');

    window.addEventListener('load', () => {
        const navigation = performance.getEntriesByType?.('navigation')?.[0];
        if (!navigation) return;
        trackEvent('web_vitals', {
            dom_interactive_ms: Math.round(navigation.domInteractive),
            load_ms: Math.round(navigation.loadEventEnd),
            transfer_kb: Math.round((navigation.transferSize || 0) / 1024)
        });
    }, { once: true });

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

    document.querySelectorAll('.booking-cta').forEach(link => {
        link.addEventListener('click', () => {
            trackEvent('booking_cta', { placement: link.closest('section')?.id || 'floating' });
            const serviceInput = document.getElementById('service');
            const messageInput = document.getElementById('message');
            if (serviceInput && link.dataset.service) serviceInput.value = link.dataset.service;
            if (messageInput && link.dataset.message) messageInput.value = link.dataset.message;
            window.setTimeout(() => document.getElementById('name')?.focus({ preventScroll: true }), 500);
        });
    });

    function getPlacement(element) {
        const section = element.closest('section[id]');
        if (section) return section.id;
        if (element.closest('header')) return 'header';
        if (element.closest('footer')) return 'footer';
        return 'global';
    }

    document.querySelectorAll('a[href^="https://wa.me/"]').forEach(link => {
        link.addEventListener('click', () => trackEvent('whatsapp_click', {
            placement: getPlacement(link)
        }));
    });

    document.querySelectorAll('a[href^="tel:"]').forEach(link => {
        link.addEventListener('click', () => trackEvent('call_click', {
            placement: getPlacement(link)
        }));
    });

    /* ─────────────────────────────────────────────
       HEADER SCROLL + BACK-TO-TOP (rAF-throttled)
    ───────────────────────────────────────────── */
    let ticking = false;

    function onScroll() {
        if (!ticking) {
            ticking = true;
            requestAnimationFrame(() => {
                backToTop.classList.toggle('visible', window.scrollY > 500);
                updateActiveNav();
                maybeShowApptCta();
                ticking = false;
            });
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
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
       FADE-IN ON SCROLL (guarded)
    ───────────────────────────────────────────── */
    const revealTargets = document.querySelectorAll(
        '.service-card, .facility-card, .gallery-item, .doctor-card, ' +
        '.testimonial-card, .contact-card, .contact-form-wrapper, ' +
        '.feature, .about-content, .about-image, .schedule-info, ' +
        '.schedule-table, .vaccine-info, .vaccine-visual, .google-rating-summary'
    );

    if (hasIntersectionObserver) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

        revealTargets.forEach(el => {
            el.classList.add('fade-in');
            observer.observe(el);
        });
    } else {
        revealTargets.forEach(el => el.classList.add('visible'));
    }

    /* ─────────────────────────────────────────────
       ANIMATED COUNTERS (guarded)
    ───────────────────────────────────────────── */
    const counters = document.querySelectorAll('.stat-number[data-count]');

    function runCounter(counter) {
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

        update();
    }

    if (hasIntersectionObserver) {
        counters.forEach(counter => {
            new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    runCounter(counter);
                }
            }, { threshold: 0.5 }).observe(counter);
        });
    } else {
        counters.forEach(counter => {
            counter.textContent = parseInt(counter.getAttribute('data-count'), 10).toLocaleString();
        });
    }

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
        // Sunday (day 0) => OPD closed
        const day     = ist.getDay();
        let isOpen    = day !== 0;
        let nextOpen  = null;

        if (isOpen) {
            isOpen = OPD_SESSIONS.some(s => decimal >= s.open && decimal < s.close);
            for (const s of OPD_SESSIONS) {
                if (decimal < s.open) { nextOpen = s.open; break; }
            }
            if (!isOpen && nextOpen === null && decimal >= OPD_SESSIONS[1].close) {
                nextOpen = 'tomorrow';
            }
        }

        badge.className = 'opd-live-badge ' + (isOpen ? 'opd-open' : 'opd-closed');
        badge.textContent = isOpen ? 'OPD Open Now' : 'OPD Closed';
        badge.title = isOpen
            ? 'OPD: Morning 10 AM-1 PM & Evening 5-8 PM (Mon-Sat)'
            : (nextOpen === 'tomorrow'
                ? 'OPD reopens tomorrow 10:00 AM IST'
                : (day === 0
                    ? 'OPD closed today - reopens tomorrow 10:00 AM IST'
                    : `Next OPD session at ${String(nextOpen).padStart(2, '0')}:00 IST`));
    }

    updateOpdStatus();
    setInterval(updateOpdStatus, 60000);

    /* ─────────────────────────────────────────────
       TESTIMONIAL CAROUSEL (auto-rotating, pausable)
    ───────────────────────────────────────────── */
    const tcTrack  = document.getElementById('tcTrack');
    const tcPrev   = document.getElementById('tcPrev');
    const tcNext   = document.getElementById('tcNext');
    const tcDots   = document.getElementById('tcDots');
    const tcPause  = document.getElementById('tcPause');

    if (tcTrack && tcPrev && tcNext) {
        const slides       = tcTrack.querySelectorAll('.tc-slide');
        const total        = slides.length;
        let current        = 0;
        let autoInterval   = null;
        let paused         = false;
        let slidesPerView  = getSlidesPerView();

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
                if (i === current) dot.setAttribute('aria-current', 'true');
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
                if (i === current) d.setAttribute('aria-current', 'true');
                else d.removeAttribute('aria-current');
            });
        }

        function next() { goTo(current >= maxIndex() ? 0 : current + 1); }
        function prev() { goTo(current <= 0 ? maxIndex() : current - 1); }

        function startAuto() {
            if (paused || prefersReducedMotion) return;
            stopAuto();
            autoInterval = setInterval(next, TC_AUTO_INTERVAL_MS);
        }

        function stopAuto() {
            if (autoInterval) clearInterval(autoInterval);
        }

        function restartAuto() {
            if (paused || prefersReducedMotion) return;
            startAuto();
        }

        tcNext.addEventListener('click', () => { next(); restartAuto(); });
        tcPrev.addEventListener('click', () => { prev(); restartAuto(); });

        if (tcPause) {
            tcPause.addEventListener('click', () => {
                paused = !paused;
                tcPause.setAttribute('aria-pressed', String(paused));
                tcPause.setAttribute('aria-label', paused ? 'Play auto-rotation' : 'Pause auto-rotation');
                const icon = tcPause.querySelector('i');
                if (icon) {
                    icon.className = paused ? 'fas fa-play' : 'fas fa-pause';
                }
                if (paused) stopAuto();
                else restartAuto();
            });
        }

        const carousel = tcTrack.closest('.testimonial-carousel');
        carousel.addEventListener('mouseenter', stopAuto);
        carousel.addEventListener('mouseleave', restartAuto);
        carousel.addEventListener('focusin', stopAuto);
        carousel.addEventListener('focusout', restartAuto);

        let touchStartX = 0;
        tcTrack.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
        tcTrack.addEventListener('touchend', e => {
            const dx = e.changedTouches[0].clientX - touchStartX;
            if (Math.abs(dx) > 40) { dx < 0 ? next() : prev(); restartAuto(); }
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
        if (!prefersReducedMotion) startAuto();
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
       CONTACT FORM -> WHATSAPP (accessible)
    ───────────────────────────────────────────── */
    if (contactForm) {
        const nameInput  = document.getElementById('name');
        const phoneInput = document.getElementById('phone');
        const consentInput = document.getElementById('privacyConsent');
        const formError  = document.getElementById('formError');
        const submitBtn  = contactForm.querySelector('button[type="submit"]');
        const defaultSubmitLabel = submitBtn.innerHTML;
        let isSubmitting = false;

        contactForm.addEventListener('focusin', () => trackEvent('booking_start'), { once: true });

        function clearErrors() {
            [nameInput, phoneInput, consentInput].forEach(input => {
                input.classList.remove('invalid');
                input.removeAttribute('aria-invalid');
            });
            if (formError) {
                formError.textContent = '';
                formError.classList.remove('success');
            }
        }

        nameInput.addEventListener('input', clearErrors);
        phoneInput.addEventListener('input', () => {
            if (phoneInput.classList.contains('invalid')) clearErrors();
        });
        consentInput.addEventListener('change', clearErrors);

        function showErrors(message, firstInvalid) {
            if (formError) formError.textContent = message;
            firstInvalid.setAttribute('aria-invalid', 'true');
            firstInvalid.focus({ preventScroll: false });
        }

        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (isSubmitting) return;
            clearErrors();

            const fd        = new FormData(contactForm);
            const name      = fd.get('name').trim();
            const phone     = fd.get('phone').trim();
            const childName = fd.get('childName').trim();
            const childAge  = fd.get('childAge').trim();
            const service   = fd.get('service').trim();
            const message   = fd.get('message').trim();

            const digits = phone.replace(/\D/g, '');
            const phoneValid = /^[+]?[0-9][0-9\s()-]*$/.test(phone) &&
                               digits.length >= 10 && digits.length <= 15;

            if (!name) {
                nameInput.classList.add('invalid');
                showErrors('Please enter the parent\u2019s name.', nameInput);
                return;
            }

            if (!phoneValid) {
                phoneInput.classList.add('invalid');
                showErrors('Please enter a valid phone number with 10 to 15 digits.', phoneInput);
                return;
            }

            if (!consentInput.checked) {
                consentInput.classList.add('invalid');
                showErrors('Please agree to the appointment follow-up notice.', consentInput);
                return;
            }

            isSubmitting = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving request...';
            submitBtn.disabled = true;

            let appointmentId = null;
            let appointmentSaved = false;
            const reference = window.crypto?.randomUUID?.();

            if (supabaseConfigured) {
                try {
                    await insertAppointment({
                        ...(reference ? { id: reference } : {}),
                        parent_name: name,
                        phone,
                        child_name: childName || null,
                        child_age: childAge || null,
                        service: service || null,
                        message: message || null,
                        source: 'website'
                    });
                    appointmentSaved = true;
                    appointmentId = reference || null;
                    trackEvent('booking_saved', { service: service || 'not_selected' });
                } catch (err) {
                    console.error('Appointment save failed:', err);
                    trackEvent('booking_failed', { reason: err.name === 'AbortError' ? 'timeout' : 'request_error' });
                }
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
            if (appointmentId) lines.push(`Reference: ${appointmentId}`);

            const text = encodeURIComponent(lines.join('\n'));
            const url  = `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;

            if (appointmentSaved) {
                formError.classList.add('success');
                formError.textContent = `Request saved${appointmentId ? ` — reference ${appointmentId.slice(0, 8)}` : ''}. Continue in WhatsApp to notify the hospital.`;
                submitBtn.innerHTML = '<i class="fas fa-check"></i> Continue in WhatsApp';
            } else {
                formError.textContent = 'We could not save your request online. Continue in WhatsApp or call the hospital.';
                submitBtn.innerHTML = '<i class="fab fa-whatsapp"></i> Continue in WhatsApp';
            }

            const win = window.open(url, '_blank');
            if (!win) {
                window.location.assign(url);
            }

            setTimeout(() => {
                submitBtn.innerHTML = defaultSubmitLabel;
                submitBtn.disabled = false;
                isSubmitting = false;
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
    document.querySelectorAll('img[src^="images/"], img[src^="https://images.unsplash"]').forEach(img => {
        img.addEventListener('error', () => {
            const wrapper = img.closest(
                '.hero-photo, .about-img-wrapper, .vaccine-visual, .gallery-item, .doctor-photo-circle'
            );
            if (wrapper) {
                img.style.display = 'none';
                wrapper.classList.add('img-fallback');
            }
        });
    });
});
