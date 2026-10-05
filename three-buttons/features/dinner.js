// 🍲 저녁 메뉴 룰렛
// 담당: 선종하
// 브랜치: feat/dinner
//
// 만들 것: 버튼을 누르면 룰렛이 돌아가며 오늘 저녁 메뉴를 골라주는 프로그램
//
// 규칙
// - 이 파일만 수정하세요. index.html, style.css, 다른 기능 파일은 건드리지 않습니다.
// - 결과는 dinner-area 안에만 그립니다.
// - 버튼을 누를 때마다 startDinner()이 호출됩니다.

// 룰렛 중복 실행을 막기 위한 상태 변수
let isSpinning = false;

function startDinner() {
    // 이미 룰렛이 돌아가고 있다면 무시 (버튼 연타 방지)
    if (isSpinning) return;
    isSpinning = true;

    const area = document.getElementById('dinner-area');
    
    // 저녁 메뉴 후보 배열
    const menus = [
        '치킨 🍗', '피자 🍕', '삼겹살 🥓', '초밥 🍣', 
        '짜장면 🍜', '국밥 🍲', '떡볶이 🥘', '마라탕 🌶️', 
        '햄버거 🍔', '돈까스 🥩', '샐러드 🥗', '파스타 🍝'
    ];
    
    // 기존 placeholder를 지우고 룰렛 UI를 그림 (인라인 스타일 활용)
    area.innerHTML = `
        <div style="text-align: center; padding: 2rem 0; font-family: sans-serif;">
            <h3 style="margin-bottom: 1rem; color: #555;">오늘 저녁은 무엇을 먹을까요?</h3>
            <div id="roulette-display" style="font-size: 2.5rem; font-weight: bold; color: #3498db; min-height: 60px; transition: transform 0.1s;">
                룰렛 돌아가는 중...
            </div>
        </div>
    `;

    const display = document.getElementById('roulette-display');
    let spinCount = 0;
    const maxSpins = 40; // 메뉴가 바뀌는 총 횟수

    // 0.05초(50ms)마다 메뉴를 무작위로 변경하며 애니메이션 효과 부여
    const spinInterval = setInterval(() => {
        const randomIndex = Math.floor(Math.random() * menus.length);
        display.textContent = menus[randomIndex];
        
        spinCount++;

        // 지정된 횟수만큼 돌아가면 정지
        if (spinCount >= maxSpins) {
            clearInterval(spinInterval);
            
            // 최종 결과 선택 및 강조
            const finalIndex = Math.floor(Math.random() * menus.length);
            display.innerHTML = `🎉 <strong>${menus[finalIndex]}</strong> 당첨! 🎉`;
            display.style.color = '#e74c3c';
            display.style.transform = 'scale(1.1)'; // 살짝 커지는 효과
            
            // 룰렛 상태 초기화
            isSpinning = false;
        }
    }, 50);
}