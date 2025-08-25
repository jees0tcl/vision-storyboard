// Mobile App JavaScript for SuperPlat Vision

document.addEventListener('DOMContentLoaded', function() {
    // Scene Management
    const scenes = document.querySelectorAll('.mobile-scene');
    const navDots = document.querySelectorAll('.nav-dot');
    let currentScene = 0;

    // Navigation dot click handler
    navDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            const sceneNumber = dot.dataset.scene;
            const targetScene = document.getElementById(`mobile-scene-${sceneNumber}`);
            
            if (targetScene) {
                // Smooth scroll to scene
                targetScene.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Update active dot
                updateActiveDot(index);
            }
        });
    });

    // Update active navigation dot
    function updateActiveDot(index) {
        navDots.forEach(dot => dot.classList.remove('active'));
        if (navDots[index]) {
            navDots[index].classList.add('active');
        }
    }

    // Intersection Observer for auto-updating nav dots
    const observerOptions = {
        root: null,
        rootMargin: '-40% 0px -40% 0px',
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sceneId = entry.target.id;
                const sceneNumber = sceneId.split('-').pop();
                
                // Find corresponding nav dot
                navDots.forEach((dot, index) => {
                    if (dot.dataset.scene === sceneNumber) {
                        updateActiveDot(index);
                    }
                });
            }
        });
    }, observerOptions);

    // Observe all scenes
    scenes.forEach(scene => {
        observer.observe(scene);
    });

    // Touch Swipe Support
    let touchStartY = 0;
    let touchEndY = 0;

    document.addEventListener('touchstart', (e) => {
        touchStartY = e.changedTouches[0].screenY;
    }, false);

    document.addEventListener('touchend', (e) => {
        touchEndY = e.changedTouches[0].screenY;
        handleSwipe();
    }, false);

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartY - touchEndY;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe up - next scene
                navigateToNextScene();
            } else {
                // Swipe down - previous scene
                navigateToPrevScene();
            }
        }
    }

    function navigateToNextScene() {
        if (currentScene < navDots.length - 1) {
            currentScene++;
            navDots[currentScene].click();
        }
    }

    function navigateToPrevScene() {
        if (currentScene > 0) {
            currentScene--;
            navDots[currentScene].click();
        }
    }

    // Lazy Loading for Images
    const images = document.querySelectorAll('.scene-image img');
    
    const imageOptions = {
        threshold: 0,
        rootMargin: '0px 0px 50px 0px'
    };

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            }
        });
    }, imageOptions);

    images.forEach(img => {
        // Only use lazy loading if data-src is present
        if (img.dataset.src) {
            imageObserver.observe(img);
        }
    });

    // Add touch feedback
    scenes.forEach(scene => {
        scene.addEventListener('touchstart', () => {
            scene.style.transform = 'scale(0.98)';
        });

        scene.addEventListener('touchend', () => {
            scene.style.transform = 'scale(1)';
        });
    });

    // Handle orientation change
    window.addEventListener('orientationchange', () => {
        // Wait for orientation change to complete
        setTimeout(() => {
            const activeIndex = Array.from(navDots).findIndex(dot => 
                dot.classList.contains('active')
            );
            
            if (activeIndex >= 0) {
                navDots[activeIndex].click();
            }
        }, 300);
    });

    // Progressive Enhancement - Add loading state
    function showLoading() {
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'loading';
        loadingDiv.innerHTML = '<div class="loading-spinner"></div>';
        document.body.appendChild(loadingDiv);
    }

    function hideLoading() {
        const loading = document.querySelector('.loading');
        if (loading) {
            loading.remove();
        }
    }

    // Scene 0 Start Journey Button
    const startJourneyBtn = document.querySelector('.start-journey');
    if (startJourneyBtn) {
        startJourneyBtn.addEventListener('click', () => {
            // Scroll to Scene 1
            const scene1 = document.getElementById('mobile-scene-1');
            if (scene1) {
                scene1.scrollIntoView({ behavior: 'smooth', block: 'start' });
                // Update nav dot to Scene 1
                updateActiveDot(1);
            }
        });
    }

    // Initialize
    console.log('Mobile SuperPlat Vision initialized');
    
    // Check if all images are loaded
    let loadedImages = 0;
    const totalImages = images.length;

    images.forEach(img => {
        if (img.complete) {
            loadedImages++;
        } else {
            img.addEventListener('load', () => {
                loadedImages++;
                if (loadedImages === totalImages) {
                    console.log('All images loaded');
                }
            });
        }
    });
});

// Service Worker Registration (for PWA support)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Uncomment when service worker is ready
        // navigator.serviceWorker.register('/sw.js')
        //     .then(reg => console.log('Service Worker registered'))
        //     .catch(err => console.log('Service Worker registration failed'));
    });
}