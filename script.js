document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('section, .sub-section');
    const navLinks = document.querySelectorAll('.nav-link, .sub-link');
    const mainSections = document.querySelectorAll('.main-section');

    // Mobile Side Drawer Toggle
    const sidebar = document.getElementById('sidebar');
    const backdrop = document.getElementById('sidebar-backdrop');
    const mobileHamburger = document.getElementById('mobile-hamburger-btn');
    const sidebarHamburger = document.getElementById('hamburger-btn');

    function openSidebar() {
        if (sidebar) sidebar.classList.add('nav-open');
        if (backdrop) backdrop.classList.add('active');
    }

    function closeSidebar() {
        if (sidebar) sidebar.classList.remove('nav-open');
        if (backdrop) backdrop.classList.remove('active');
    }

    // Mobile header hamburger opens the drawer
    if (mobileHamburger) {
        mobileHamburger.addEventListener('click', openSidebar);
    }

    // In-sidebar hamburger (X) closes the drawer
    if (sidebarHamburger) {
        sidebarHamburger.addEventListener('click', closeSidebar);
    }

    // Backdrop click closes the drawer
    if (backdrop) {
        backdrop.addEventListener('click', closeSidebar);
    }

    // Auto-close drawer when a sub-link or non-submenu link is clicked (mobile UX)
    document.querySelectorAll('.nav-links .sub-link').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                closeSidebar();
            }
        });
    });

    // Non-submenu nav-links: close drawer and navigate immediately
    document.querySelectorAll('.nav-item:not(.has-submenu) > .nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                closeSidebar();
            }
        });
    });

    // Intersection Observer for Scroll Spy
    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -60% 0px', // Trigger when section is near the top
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');

                // Remove active class from all links
                // We don't want to clear everything immediately, we want to be smart about it
                // But for simplicity, let's clear and re-apply based on current view

                // Find the link corresponding to this section
                const activeLink = document.querySelector(`a[href="#${id}"]`);

                if (activeLink) {
                    // If it's a sub-link, activate parent too
                    if (activeLink.classList.contains('sub-link')) {
                        // Clear other sub-links in the same group
                        const parentNavItem = activeLink.closest('.nav-item');
                        parentNavItem.querySelectorAll('.sub-link').forEach(link => link.classList.remove('active'));

                        activeLink.classList.add('active');

                        // Activate parent main link
                        const parentLink = parentNavItem.querySelector('.nav-link');
                        document.querySelectorAll('.nav-link').forEach(link => {
                            if (link !== parentLink) link.classList.remove('active');
                        });
                        parentLink.classList.add('active');
                        parentNavItem.classList.add('active');
                    } else {
                        // It's a main link
                        document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
                        document.querySelectorAll('.sub-link').forEach(link => link.classList.remove('active'));
                        document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));

                        activeLink.classList.add('active');
                        activeLink.closest('.nav-item').classList.add('active');
                    }
                }
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });

    // Intersection Observer for Entrance Animations
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: Stop observing once visible
                // fadeObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    mainSections.forEach(section => {
        fadeObserver.observe(section);
    });

    // Smooth scroll handling (optional enhancement to CSS scroll-behavior)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
    // Diagram Carousel Functionality
    const track = document.querySelector('.carousel-track');
    const cards = document.querySelectorAll('.carousel-card');
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    const dots = document.querySelectorAll('.dot');
    const modal = document.getElementById('diagram-modal');
    const modalIframe = document.getElementById('modal-iframe');
    const modalClose = document.querySelector('.modal-close');

    let currentIndex = 3; // Start at GCP LLD Sample 1 (index 3)

    function updateCarousel() {
        if (!track) return;

        // Cards are 100% width, so offset = currentIndex * container width
        const containerWidth = track.parentElement.offsetWidth;
        const offset = currentIndex * containerWidth;
        track.style.transform = `translateX(-${offset}px)`;

        // Update active class on cards
        cards.forEach((card, i) => {
            card.classList.toggle('active', i === currentIndex);
        });

        // Update dots
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
        });
    }

    // Initialize carousel at default position
    if (track) {
        updateCarousel();
    }

    // Navigation arrows
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentIndex > 0) {
                currentIndex--;
                updateCarousel();
            }
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (currentIndex < cards.length - 1) {
                currentIndex++;
                updateCarousel();
            }
        });
    }

    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentIndex = index;
            updateCarousel();
        });
    });

    // Recalculate on window resize
    window.addEventListener('resize', () => {
        updateCarousel();
    });

    // Modal close handlers
    if (modalClose) {
        modalClose.addEventListener('click', () => {
            modal.classList.remove('active');
            modalIframe.src = '';
            document.body.style.overflow = '';
        });
    }

    // Close modal on ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
            modal.classList.remove('active');
            modalIframe.src = '';
            document.body.style.overflow = '';
        }
    });

    // Close modal on backdrop click
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
                modalIframe.src = '';
                document.body.style.overflow = '';
            }
        });
    }

    // Scroll-driven Zoom Animation for Carousel Container
    const carouselContainer = document.querySelector('.carousel-container');
    if (carouselContainer) {
        window.addEventListener('scroll', () => {
            const rect = carouselContainer.getBoundingClientRect();
            const windowHeight = window.innerHeight;

            // Distance from the bottom of the viewport
            const distanceFromBottom = windowHeight - rect.top;

            // Animate over 60% of viewport height
            const range = windowHeight * 0.6;

            let progress = distanceFromBottom / range;

            // Clamp progress between 0 and 1
            progress = Math.min(Math.max(progress, 0), 1);

            // Calculate scale: 0.25 -> 1.0
            const scale = 0.25 + (0.75 * progress);

            // Calculate opacity: 0 -> 1 (appear faster to avoid ghost)
            const opacity = Math.min(progress * 1.5, 1);

            carouselContainer.style.transform = `scale(${scale})`;
            carouselContainer.style.opacity = opacity;
        });

        window.dispatchEvent(new Event('scroll'));
    }

    // Sidebar Toggle Logic
    const submenuToggles = document.querySelectorAll('.has-submenu > .nav-link');
    submenuToggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            const navItem = toggle.parentElement;
            const wasExpanded = navItem.classList.contains('expanded');
            const isMobile = window.innerWidth <= 768;

            // Accordion behavior: Close all other submenus
            document.querySelectorAll('.nav-item.has-submenu').forEach(item => {
                if (item !== navItem) {
                    item.classList.remove('expanded');
                }
            });

            if (isMobile) {
                if (!wasExpanded) {
                    // First tap on mobile: expand submenu, prevent navigation
                    e.preventDefault();
                    navItem.classList.add('expanded');
                } else {
                    // Second tap on mobile: navigate and close drawer
                    navItem.classList.remove('expanded');
                    closeSidebar();
                }
            } else {
                // Desktop: just toggle expanded, always allow navigation
                if (wasExpanded) {
                    navItem.classList.remove('expanded');
                } else {
                    navItem.classList.add('expanded');
                }
            }
        });
    });
});
