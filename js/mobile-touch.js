// ==========================================
// Mobile Touch & Gesture Support
// ==========================================

(function() {
    'use strict';

    // Touch event variables
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;
    let isSwiping = false;
    let swipeThreshold = 50; // Minimum distance for swipe
    let swipeTimeout = 300; // Maximum time for swipe gesture

    // Check if device is mobile
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    // Initialize touch support
    function initTouchSupport() {
        if (!hasTouch) return;

        const storyContainer = document.querySelector('.story-container');
        if (!storyContainer) return;

        // Add touch event listeners
        storyContainer.addEventListener('touchstart', handleTouchStart, { passive: true });
        storyContainer.addEventListener('touchmove', handleTouchMove, { passive: false });
        storyContainer.addEventListener('touchend', handleTouchEnd, { passive: true });

        // Add swipe indicators for mobile
        if (isMobile) {
            addSwipeIndicators();
        }

        // Improve button touch responsiveness
        improveTouchButtons();

        // Handle orientation changes
        handleOrientationChange();
    }

    // Handle touch start
    function handleTouchStart(e) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        isSwiping = true;
    }

    // Handle touch move
    function handleTouchMove(e) {
        if (!isSwiping) return;

        touchEndX = e.touches[0].clientX;
        touchEndY = e.touches[0].clientY;

        // Calculate swipe distance
        const deltaX = Math.abs(touchEndX - touchStartX);
        const deltaY = Math.abs(touchEndY - touchStartY);

        // Prevent vertical scroll if horizontal swipe is detected
        if (deltaX > deltaY && deltaX > 10) {
            e.preventDefault();
        }
    }

    // Handle touch end
    function handleTouchEnd(e) {
        if (!isSwiping) return;

        isSwiping = false;
        handleSwipeGesture();
    }

    // Process swipe gesture
    function handleSwipeGesture() {
        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;
        const absDeltaX = Math.abs(deltaX);
        const absDeltaY = Math.abs(deltaY);

        // Check if swipe is horizontal and meets threshold
        if (absDeltaX > swipeThreshold && absDeltaX > absDeltaY) {
            if (deltaX > 0) {
                // Swipe right - go to previous scene
                navigateToPreviousScene();
            } else {
                // Swipe left - go to next scene
                navigateToNextScene();
            }
        }
    }

    // Navigate to previous scene
    function navigateToPreviousScene() {
        if (typeof window.currentScene !== 'undefined' && window.currentScene > 0) {
            window.showScene(window.currentScene - 1);
            showSwipeFeedback('previous');
        }
    }

    // Navigate to next scene
    function navigateToNextScene() {
        const totalScenes = document.querySelectorAll('.scene').length;
        if (typeof window.currentScene !== 'undefined' && window.currentScene < totalScenes - 1) {
            window.showScene(window.currentScene + 1);
            showSwipeFeedback('next');
        }
    }

    // Show swipe feedback animation
    function showSwipeFeedback(direction) {
        const feedback = document.createElement('div');
        feedback.className = `swipe-feedback swipe-${direction}`;
        feedback.innerHTML = direction === 'next' ? '→' : '←';
        
        // Style the feedback
        Object.assign(feedback.style, {
            position: 'fixed',
            top: '50%',
            [direction === 'next' ? 'right' : 'left']: '20px',
            transform: 'translateY(-50%)',
            fontSize: '30px',
            color: 'rgba(255, 255, 255, 0.8)',
            zIndex: '9999',
            animation: 'swipeFeedback 0.5s ease-out',
            pointerEvents: 'none'
        });

        document.body.appendChild(feedback);

        // Remove feedback after animation
        setTimeout(() => {
            feedback.remove();
        }, 500);
    }

    // Add swipe indicators for mobile
    function addSwipeIndicators() {
        const indicator = document.createElement('div');
        indicator.className = 'swipe-indicator';
        indicator.innerHTML = `
            <div class="swipe-hint">
                <span class="swipe-arrow left">‹</span>
                <span class="swipe-text">스와이프하여 이동</span>
                <span class="swipe-arrow right">›</span>
            </div>
        `;

        // Style the indicator
        const style = document.createElement('style');
        style.textContent = `
            .swipe-indicator {
                position: fixed;
                bottom: 60px;
                left: 50%;
                transform: translateX(-50%);
                z-index: 100;
                opacity: 0;
                animation: fadeInOut 3s ease-in-out;
                pointer-events: none;
            }

            .swipe-hint {
                display: flex;
                align-items: center;
                gap: 10px;
                padding: 8px 16px;
                background: rgba(0, 0, 0, 0.6);
                border-radius: 20px;
                color: white;
                font-size: 12px;
            }

            .swipe-arrow {
                font-size: 16px;
                animation: swipeArrow 1s ease-in-out infinite;
            }

            .swipe-arrow.left {
                animation-delay: 0s;
            }

            .swipe-arrow.right {
                animation-delay: 0.5s;
            }

            @keyframes fadeInOut {
                0%, 100% { opacity: 0; }
                20%, 80% { opacity: 1; }
            }

            @keyframes swipeArrow {
                0%, 100% { transform: translateX(0); }
                50% { transform: translateX(3px); }
            }

            @keyframes swipeFeedback {
                0% { 
                    opacity: 0;
                    transform: translateY(-50%) scale(0.5);
                }
                50% { 
                    opacity: 1;
                    transform: translateY(-50%) scale(1.2);
                }
                100% { 
                    opacity: 0;
                    transform: translateY(-50%) scale(1);
                }
            }
        `;

        document.head.appendChild(style);
        document.body.appendChild(indicator);

        // Show indicator periodically
        setInterval(() => {
            indicator.style.animation = 'none';
            setTimeout(() => {
                indicator.style.animation = 'fadeInOut 3s ease-in-out';
            }, 10);
        }, 10000);
    }

    // Improve touch responsiveness for buttons
    function improveTouchButtons() {
        const buttons = document.querySelectorAll('button, .nav-btn, .scene-dot');
        
        buttons.forEach(button => {
            // Add touch feedback
            button.addEventListener('touchstart', function() {
                this.style.transform = 'scale(0.95)';
                this.style.opacity = '0.8';
            }, { passive: true });

            button.addEventListener('touchend', function() {
                this.style.transform = '';
                this.style.opacity = '';
            }, { passive: true });

            // Prevent double tap zoom
            button.addEventListener('touchend', function(e) {
                e.preventDefault();
                e.target.click();
            });
        });
    }

    // Handle orientation changes
    function handleOrientationChange() {
        let orientation = window.orientation || 0;

        window.addEventListener('orientationchange', () => {
            const newOrientation = window.orientation || 0;
            
            if (Math.abs(newOrientation - orientation) === 90) {
                // Orientation changed by 90 degrees
                adjustLayoutForOrientation();
            }
            
            orientation = newOrientation;
        });

        // Initial adjustment
        adjustLayoutForOrientation();
    }

    // Adjust layout based on orientation
    function adjustLayoutForOrientation() {
        const isLandscape = window.innerWidth > window.innerHeight;
        const body = document.body;

        if (isLandscape) {
            body.classList.add('landscape-mode');
            body.classList.remove('portrait-mode');
        } else {
            body.classList.add('portrait-mode');
            body.classList.remove('landscape-mode');
        }

        // Adjust viewport height for mobile browsers
        adjustViewportHeight();
    }

    // Fix viewport height for mobile browsers
    function adjustViewportHeight() {
        // Calculate actual viewport height
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);

        // Update on resize
        window.addEventListener('resize', () => {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        });
    }

    // Prevent pull-to-refresh on mobile
    function preventPullToRefresh() {
        let lastY = 0;

        document.addEventListener('touchstart', (e) => {
            lastY = e.touches[0].clientY;
        }, { passive: false });

        document.addEventListener('touchmove', (e) => {
            const y = e.touches[0].clientY;
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

            // Prevent overscroll when at the top
            if (scrollTop === 0 && y > lastY) {
                e.preventDefault();
            }
        }, { passive: false });
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            initTouchSupport();
            preventPullToRefresh();
        });
    } else {
        initTouchSupport();
        preventPullToRefresh();
    }

    // Export functions for external use
    window.mobileTouch = {
        init: initTouchSupport,
        isMobile: isMobile,
        hasTouch: hasTouch
    };

})();