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
});
