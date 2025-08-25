// 앱 초기화 및 인터랙티브 기능 구현
document.addEventListener('DOMContentLoaded', function() {
    // 전역 변수
    let currentScene = 0;
    const totalScenes = 13;
    const scenes = document.querySelectorAll('.scene');
    const progressBar = document.querySelector('.progress-bar');
    const currentSceneSpan = document.querySelector('.current-scene');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    
    // 로딩 화면 제거 (ID 셀렉터로 수정)
    setTimeout(() => {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }
    }, 2500); // 애니메이션 완료 후 제거
    
    // 감정 여정 그래프 그리기 (제거됨 - 공간 절약을 위해)
    function drawEmotionJourney() {
        // 감정 그래프 제거 - 불필요한 공간 절약
        return;
    }
    
    // 씬 전환 함수
    function showScene(sceneIndex) {
        // 범위 체크
        if (sceneIndex < 0 || sceneIndex >= totalScenes) return;
        
        // 모든 씬 숨기기
        scenes.forEach(scene => {
            scene.classList.remove('active');
            scene.style.display = 'none';
        });
        
        // 현재 씬 표시
        const targetScene = scenes[sceneIndex];
        targetScene.style.display = 'flex';
        
        // 애니메이션을 위한 약간의 지연
        setTimeout(() => {
            targetScene.classList.add('active');
        }, 50);
        
        // 진행 상태 업데이트
        updateProgress(sceneIndex);
        
        // 버튼 상태 업데이트
        updateNavigationButtons(sceneIndex);
        
        // 현재 씬 업데이트
        currentScene = sceneIndex;
        
        // URL 해시 업데이트
        window.location.hash = `scene-${sceneIndex}`;
    }
    
    // 진행 상태 업데이트
    function updateProgress(sceneIndex) {
        const progress = ((sceneIndex + 1) / totalScenes) * 100;
        if (progressBar) {
            progressBar.style.width = `${progress}%`;
        }
        if (currentSceneSpan) {
            currentSceneSpan.textContent = sceneIndex + 1;
        }
    }
    
    // 네비게이션 버튼 상태 업데이트
    function updateNavigationButtons(sceneIndex) {
        if (prevBtn) {
            prevBtn.disabled = sceneIndex === 0;
            prevBtn.style.opacity = sceneIndex === 0 ? '0.3' : '1';
        }
        if (nextBtn) {
            nextBtn.disabled = sceneIndex === totalScenes - 1;
            nextBtn.style.opacity = sceneIndex === totalScenes - 1 ? '0.3' : '1';
        }
    }
    
    // 시작 버튼 이벤트 리스너
    const startJourneyBtn = document.getElementById('start-journey-btn');
    if (startJourneyBtn) {
        startJourneyBtn.addEventListener('click', () => {
            showScene(1);
        });
    }
    
    // 다시보기 버튼 이벤트 리스너
    const replayBtn = document.getElementById('replay-btn');
    if (replayBtn) {
        replayBtn.addEventListener('click', () => {
            showScene(0);  // 첫 번째 씬(Scene 0)으로 이동
        });
    }
    
    // 씬 인디케이터 점들에 클릭 이벤트 추가
    const sceneDotsOriginal = document.querySelectorAll('.scene-dot');
    sceneDotsOriginal.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showScene(index);
        });
    });
    
    // 이벤트 리스너 설정
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentScene > 0) {
                showScene(currentScene - 1);
            }
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (currentScene < totalScenes - 1) {
                showScene(currentScene + 1);
            }
        });
    }
    
    // 키보드 네비게이션
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft' && currentScene > 0) {
            showScene(currentScene - 1);
        } else if (e.key === 'ArrowRight' && currentScene < totalScenes - 1) {
            showScene(currentScene + 1);
        } else if (e.key === 'Home') {
            showScene(0);
        } else if (e.key === 'End') {
            showScene(totalScenes - 1);
        }
    });
    
    // PC 버전 터치/스와이프 지원 (모바일이 아닐 때만)
    if (!document.body.classList.contains('mobile-device')) {
        let touchStartX = 0;
        let touchEndX = 0;
        
        document.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });
        
        document.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });
        
        function handleSwipe() {
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;
            
            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0 && currentScene < totalScenes - 1) {
                    // 왼쪽 스와이프 - 다음 씬
                    showScene(currentScene + 1);
                } else if (diff < 0 && currentScene > 0) {
                    // 오른쪽 스와이프 - 이전 씬
                    showScene(currentScene - 1);
                }
            }
        }
    }
    
    // 팀 기여도 호버 효과
    const contributions = document.querySelectorAll('.contribution');
    contributions.forEach(contrib => {
        contrib.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(5px)';
            this.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
        });
        
        contrib.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0)';
            this.style.backgroundColor = 'transparent';
        });
    });
    
    // 씬 인디케이터 (점 네비게이션)
    function createSceneIndicators() {
        const indicatorContainer = document.createElement('div');
        indicatorContainer.className = 'scene-indicators';
        indicatorContainer.style.cssText = `
            position: fixed;
            bottom: 80px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            gap: 10px;
            z-index: 1000;
        `;
        
        for (let i = 0; i < totalScenes; i++) {
            const dot = document.createElement('button');
            dot.className = 'scene-dot';
            dot.style.cssText = `
                width: 10px;
                height: 10px;
                border-radius: 50%;
                border: 2px solid rgba(255, 255, 255, 0.5);
                background: ${i === currentScene ? 'white' : 'transparent'};
                cursor: pointer;
                transition: all 0.3s ease;
            `;
            
            dot.addEventListener('click', () => showScene(i));
            dot.addEventListener('mouseenter', () => {
                dot.style.transform = 'scale(1.2)';
            });
            dot.addEventListener('mouseleave', () => {
                dot.style.transform = 'scale(1)';
            });
            
            indicatorContainer.appendChild(dot);
        }
        
        document.body.appendChild(indicatorContainer);
        
        // 인디케이터 업데이트 함수 (원래 인디케이터와 새로 생성된 인디케이터 모두 업데이트)
        window.updateIndicators = function(activeIndex) {
            // 새로 생성된 인디케이터 업데이트
            const dots = indicatorContainer.querySelectorAll('.scene-dot');
            dots.forEach((dot, index) => {
                dot.style.background = index === activeIndex ? 'white' : 'transparent';
            });
            
            // 원래 인디케이터도 업데이트
            const originalDots = document.querySelectorAll('.story-nav .scene-dot');
            originalDots.forEach((dot, index) => {
                if (index === activeIndex) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        };
    }
    
    // 씬 전환 시 인디케이터 업데이트
    const originalShowScene = showScene;
    showScene = function(sceneIndex) {
        originalShowScene(sceneIndex);
        if (window.updateIndicators) {
            window.updateIndicators(sceneIndex);
        }
    };
    
    // URL 해시 기반 씬 로드
    function loadSceneFromHash() {
        const hash = window.location.hash;
        if (hash) {
            const match = hash.match(/scene-(\d+)/);
            if (match) {
                const sceneIndex = parseInt(match[1]);
                if (sceneIndex >= 0 && sceneIndex < totalScenes) {
                    currentScene = sceneIndex;
                    showScene(sceneIndex);
                    return;
                }
            }
        }
        // 기본값: 첫 번째 씬
        showScene(0);
    }
    
    // 해시 변경 감지
    window.addEventListener('hashchange', loadSceneFromHash);
    
    // 초기화
    createSceneIndicators();
    loadSceneFromHash();
    
    // 윈도우 리사이즈 이벤트 (감정 그래프 제거로 불필요)
    // window.addEventListener('resize', () => {
    //     drawEmotionJourney();
    // });
    
    // 팀 메시지 애니메이션
    const teamMessages = document.querySelectorAll('.team-message');
    teamMessages.forEach((message, index) => {
        message.style.animationDelay = `${index * 0.2}s`;
    });
    
    // 민지 캐릭터 플로팅 애니메이션
    const minjiElements = document.querySelectorAll('.minji-character');
    minjiElements.forEach(minji => {
        minji.style.animation = 'float 3s ease-in-out infinite';
    });
    
    // Initialize mobile navigation if on mobile device
    if (document.body.classList.contains('mobile-device')) {
        initMobileNavigation();
    }
});

// Mobile Navigation Functions
function initMobileNavigation() {
    console.log('Initializing mobile navigation...');
    
    // Scene Management
    const mobileScenes = document.querySelectorAll('.mobile-scene');
    const navDots = document.querySelectorAll('.nav-dot');
    let currentMobileScene = 0;

    console.log('Found mobile scenes:', mobileScenes.length);
    console.log('Found nav dots:', navDots.length);

    // Navigation dot click handler
    navDots.forEach((dot, index) => {
        dot.addEventListener('click', (e) => {
            e.preventDefault();
            const sceneNumber = dot.dataset.scene;
            const targetScene = document.getElementById(`mobile-scene-${sceneNumber}`);
            
            console.log('Dot clicked:', sceneNumber, 'Target scene:', targetScene);
            
            if (targetScene) {
                // Smooth scroll to scene
                targetScene.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Update active dot
                updateActiveDot(index);
                currentMobileScene = index;
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
                        currentMobileScene = index;
                    }
                });
            }
        });
    }, observerOptions);

    // Observe all mobile scenes
    mobileScenes.forEach(scene => {
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
        if (currentMobileScene < navDots.length - 1) {
            currentMobileScene++;
            navDots[currentMobileScene].click();
        }
    }

    function navigateToPrevScene() {
        if (currentMobileScene > 0) {
            currentMobileScene--;
            navDots[currentMobileScene].click();
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
                currentMobileScene = 1;
            }
        });
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
    mobileScenes.forEach(scene => {
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

    console.log('Mobile navigation initialized successfully');
}