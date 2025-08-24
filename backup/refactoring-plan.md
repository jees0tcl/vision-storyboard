# Vision Storyboard 리팩토링 계획

## 현재 문제점
1. **CSS 파일 분산**: 8개의 CSS 파일이 서로 겹치고 충돌
2. **하드코딩된 레이아웃**: 특정 해상도에만 최적화
3. **중복 코드**: 각 Scene마다 반복되는 구조
4. **일관성 부족**: Scene별로 다른 레이아웃 구조
5. **반응형 대응 어려움**: !important 남발, 복잡한 미디어 쿼리

## 리팩토링 목표
1. **컴포넌트 기반 구조**: 재사용 가능한 Scene 템플릿
2. **레이아웃 시스템**: 일관된 그리드/플렉스 시스템
3. **CSS 모듈화**: BEM 방법론 적용
4. **가변 해상도 대응**: 유연한 반응형 시스템

## 새로운 구조

### 1. Scene 레이아웃 타입 정의
```
Type A: 50:50 레이아웃 (좌측 비주얼, 우측 정보)
Type B: 40:60 레이아웃 (좌측 캐릭터, 우측 스토리)
Type C: 25:25:50 레이아웃 (3단 구성)
Type D: 풀스크린 레이아웃 (Scene 0, 12)
```

### 2. 폴더 구조
```
vision-storyboard/
├── index.html
├── css/
│   ├── base/
│   │   ├── reset.css
│   │   ├── variables.css
│   │   └── typography.css
│   ├── layout/
│   │   ├── grid.css
│   │   ├── container.css
│   │   └── scene-layouts.css
│   ├── components/
│   │   ├── header.css
│   │   ├── navigation.css
│   │   ├── scene.css
│   │   └── footer.css
│   ├── scenes/
│   │   ├── scene-00.css
│   │   ├── scene-01.css
│   │   └── ...
│   └── main.css
├── js/
│   ├── core/
│   │   ├── scene-manager.js
│   │   └── navigation.js
│   ├── utils/
│   │   ├── responsive.js
│   │   └── touch.js
│   └── app.js
└── images/
```

### 3. HTML 구조 표준화
```html
<div class="scene scene--type-a" data-scene="1">
  <div class="scene__content">
    <div class="scene__visual">
      <!-- 비주얼 콘텐츠 -->
    </div>
    <div class="scene__info">
      <header class="scene__header">
        <h2 class="scene__title"></h2>
        <div class="scene__emotion"></div>
      </header>
      <div class="scene__body">
        <p class="scene__description"></p>
        <div class="scene__details"></div>
      </div>
      <footer class="scene__footer">
        <div class="scene__tech"></div>
      </footer>
    </div>
  </div>
</div>
```

### 4. CSS 변수 시스템
```css
:root {
  /* Breakpoints */
  --bp-mobile: 480px;
  --bp-tablet: 768px;
  --bp-desktop: 1024px;
  --bp-wide: 1440px;
  
  /* Spacing Scale */
  --space-xs: 0.25rem;
  --space-sm: 0.5rem;
  --space-md: 1rem;
  --space-lg: 2rem;
  --space-xl: 4rem;
  
  /* Layout Ratios */
  --ratio-50-50: 1fr 1fr;
  --ratio-40-60: 2fr 3fr;
  --ratio-25-25-50: 1fr 1fr 2fr;
  
  /* Container Widths */
  --container-mobile: 100%;
  --container-tablet: 100%;
  --container-desktop: 100%;
  --container-wide: 1440px;
}
```

### 5. 반응형 전략
```css
/* Mobile First Approach */
.scene__content {
  display: flex;
  flex-direction: column;
}

/* Tablet */
@media (min-width: 768px) {
  .scene--type-a .scene__content {
    flex-direction: row;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .scene--type-a .scene__content {
    display: grid;
    grid-template-columns: var(--ratio-50-50);
  }
}
```

### 6. JavaScript 모듈화
```javascript
// SceneManager Class
class SceneManager {
  constructor() {
    this.scenes = [];
    this.currentScene = 0;
  }
  
  init() {
    this.loadScenes();
    this.setupNavigation();
    this.setupResponsive();
  }
  
  loadScenes() {
    // Scene 로딩 로직
  }
  
  navigateTo(sceneIndex) {
    // Scene 전환 로직
  }
}

// ResponsiveManager Class
class ResponsiveManager {
  constructor() {
    this.breakpoints = {
      mobile: 480,
      tablet: 768,
      desktop: 1024
    };
  }
  
  getCurrentBreakpoint() {
    // 현재 브레이크포인트 반환
  }
  
  adjustLayout() {
    // 레이아웃 조정 로직
  }
}
```

## 구현 단계

### Phase 1: 기초 설정
1. 새로운 폴더 구조 생성
2. CSS 변수 시스템 구축
3. Reset 및 Base 스타일 정의

### Phase 2: 레이아웃 시스템
1. Grid/Flex 레이아웃 템플릿 생성
2. Scene 타입별 레이아웃 정의
3. 반응형 브레이크포인트 설정

### Phase 3: 컴포넌트화
1. 공통 컴포넌트 추출
2. Scene 컴포넌트 표준화
3. BEM 네이밍 적용

### Phase 4: Scene 마이그레이션
1. 각 Scene를 새 구조로 이전
2. Scene별 특수 스타일 모듈화
3. 이미지 및 애니메이션 최적화

### Phase 5: JavaScript 리팩토링
1. ES6 모듈 시스템 적용
2. 클래스 기반 구조로 전환
3. 이벤트 시스템 통합

### Phase 6: 최적화
1. CSS 압축 및 번들링
2. 이미지 최적화
3. 성능 테스트

## 예상 결과
- **유지보수성**: 70% 향상
- **코드 중복**: 60% 감소
- **반응형 대응**: 모든 디바이스 지원
- **성능**: 초기 로딩 30% 개선
- **확장성**: 새 Scene 추가 시간 80% 단축