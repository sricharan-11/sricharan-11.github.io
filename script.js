document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('section, .sub-section');
    const navLinks = document.querySelectorAll('.nav-link, .sub-link');
    const mainSections = document.querySelectorAll('.main-section');

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
    // Scroll-driven Zoom Animation for Diagram
    const diagramContainer = document.querySelector('.diagram-container');
    if (diagramContainer) {
        window.addEventListener('scroll', () => {
            const rect = diagramContainer.getBoundingClientRect();
            const windowHeight = window.innerHeight;

            // Calculate visibility ratio
            // Start becoming visible when the top enters the viewport
            // Reach full size when the top is at 20% of the viewport (near top)

            // Distance from the bottom of the viewport
            const distanceFromBottom = windowHeight - rect.top;

            // Define the scroll distance over which the animation happens
            // Animate from entry (rect.top = windowHeight) until rect.top = windowHeight * 0.4
            const range = windowHeight * 0.6;

            let progress = distanceFromBottom / range;

            // Clamp progress between 0 and 1
            progress = Math.min(Math.max(progress, 0), 1);

            // Calculate scale: 0.25 -> 1.0
            const scale = 0.25 + (0.75 * progress);

            // Calculate opacity: 0 -> 1
            // Make opacity appear a bit faster to avoid seeing 25% ghost too long
            const opacity = Math.min(progress * 1.5, 1);

            diagramContainer.style.transform = `scale(${scale})`;
            diagramContainer.style.opacity = opacity;
        });

        // Trigger once on load in case it's already in view
        window.dispatchEvent(new Event('scroll'));
    }
});
