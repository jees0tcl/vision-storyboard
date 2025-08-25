// PC 버전 전용 JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // 전역 변수
    let currentScene = 0;
    const totalScenes = 13;
    const scenes = document.querySelectorAll('.scene');
    const progressBar = document.querySelector('.progress-bar');
    const currentSceneSpan = document.querySelector('.current-scene');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    
    // 로딩 화면 제거
    setTimeout(() => {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }
    }, 2500);
    
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
        if (targetScene) {
            targetScene.style.display = 'flex';
            
            // 애니메이션을 위한 약간의 지연
            setTimeout(() => {
                targetScene.classList.add('active');
            }, 50);
        }
        
        // 진행 상태 업데이트
        updateProgress(sceneIndex);
        
        // 버튼 상태 업데이트
        updateButtonStates(sceneIndex);
        
        // 현재 씬 저장
        currentScene = sceneIndex;
        
        // URL 해시 업데이트
        window.location.hash = `scene-${sceneIndex}`;
        
        // 씬별 특수 효과
        if (sceneIndex === 7) {
            initScene7Effects();
        }
    }
    
    // 진행 상태 업데이트
    function updateProgress(sceneIndex) {
        const progressPercentage = (sceneIndex / (totalScenes - 1)) * 100;
        const progressFill = document.querySelector('.progress-fill');
        if (progressFill) {
            progressFill.style.width = progressPercentage + '%';
        }
        
        if (currentSceneSpan) {
            currentSceneSpan.textContent = `Scene ${sceneIndex}`;
        }
        
        // 네비게이션 도트 업데이트
        updateNavDots(sceneIndex);
    }
    
    // 네비게이션 도트 업데이트
    function updateNavDots(activeIndex) {
        const dots = document.querySelectorAll('.scene-dot');
        dots.forEach((dot, index) => {
            if (index === activeIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }
    
    // 버튼 상태 업데이트
    function updateButtonStates(sceneIndex) {
        if (prevBtn) {
            prevBtn.disabled = sceneIndex === 0;
            prevBtn.style.opacity = sceneIndex === 0 ? '0.3' : '1';
        }
        
        if (nextBtn) {
            nextBtn.disabled = sceneIndex === totalScenes - 1;
            nextBtn.style.opacity = sceneIndex === totalScenes - 1 ? '0.3' : '1';
        }
    }
    
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
    
    // 터치/스와이프 지원
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
    
    // Scene 7 특수 효과
    function initScene7Effects() {
        const newsItems = document.querySelectorAll('.news-item');
        if (newsItems.length > 0) {
            let currentNews = 0;
            setInterval(() => {
                newsItems.forEach(item => item.style.display = 'none');
                newsItems[currentNews].style.display = 'block';
                currentNews = (currentNews + 1) % newsItems.length;
            }, 3000);
        }
    }
    
    // 씬 도트 클릭 이벤트
    const sceneDots = document.querySelectorAll('.scene-dot');
    sceneDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showScene(index);
        });
    });
    
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
    loadSceneFromHash();
    
    // 팀 메시지 애니메이션
    const teamMessages = document.querySelectorAll('.team-message');
    teamMessages.forEach((message, index) => {
        message.style.animationDelay = `${index * 0.2}s`;
    });
    
    console.log('SuperPlat Vision PC - Initialized');
});