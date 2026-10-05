// 🦖 공룡 게임
// 담당: (여기에 이름)
// 브랜치: feat/dino
//
// 만들 것: 스페이스바로 점프해서 선인장을 피하는 크롬 공룡 스타일 게임
//
// 규칙
//  - 이 파일만 수정하세요. index.html, style.css, 다른 기능 파일은 건드리지 않습니다.
//  - 결과는 dino-area 안에만 그립니다.
//  - 버튼을 누를 때마다 startDino()이 호출됩니다.

// 이전 게임을 정리하기 위한 함수 (버튼을 여러 번 눌러도 루프/리스너가 쌓이지 않게 함)
let stopDino = null;

function startDino() {
  const area = document.getElementById('dino-area');
  if (!area) return;

  // 이전 게임이 있으면 정리
  if (stopDino) stopDino();
  area.innerHTML = '';

  // 버튼에 포커스가 남아 있으면 스페이스바가 버튼 클릭으로 처리되므로 해제
  if (document.activeElement && document.activeElement.blur) {
    document.activeElement.blur();
  }

  // ---------- 화면 구성 (dino-area 안에만 그림) ----------
  const canvas = document.createElement('canvas');
  canvas.width = 800;
  canvas.height = 300;
  Object.assign(canvas.style, {
    display: 'block',
    width: '100%',
    maxWidth: '800px',
    background: '#fff',
    border: '2px solid #535353',
    borderRadius: '6px',
    boxSizing: 'border-box',
  });

  const help = document.createElement('p');
  help.textContent = '스페이스바(또는 화면 터치)로 점프 · ↓키로 웅크리기 · 게임오버 후 스페이스바로 재시작';
  help.style.cssText = 'margin:8px 0 0;font-size:14px;color:#535353';

  area.append(canvas, help);

  // ---------- 게임 설정 ----------
  const ctx = canvas.getContext('2d');
  const W = canvas.width;
  const H = canvas.height;
  const GROUND_Y = 250;

  const GRAVITY = 0.7;
  const JUMP_POWER = -13.5;

  const START_SPEED = 3.5;   // 시작 속도 (느리게)
  const MAX_SPEED = 14;      // 최대 속도
  const ACCEL = 0.007;       // 점수 1점당 속도 증가량 (작을수록 천천히 빨라짐)
  const BIRD_SCORE = 600;    // 이 점수부터 새가 등장
  const STAND_H = 44;        // 서 있을 때 높이
  const DUCK_H = 26;         // 웅크렸을 때 높이

  let ducking = false;       // ↓키를 누르고 있는지
  let running = true;        // 루프 실행 여부
  let rafId = 0;

  let dino, cacti, birds, clouds, score, speed, frame, state, nextCactusIn, groundOffset;
  let highScore = 0;
  try {
    highScore = Number(localStorage.getItem('dinoHighScore') || 0);
  } catch (e) {}

  function reset() {
    dino = { x: 60, y: GROUND_Y - STAND_H, w: 40, h: STAND_H, vy: 0, onGround: true };
    cacti = [];
    birds = [];
    clouds = [
      { x: 200, y: 60 },
      { x: 520, y: 90 },
      { x: 740, y: 50 },
    ];
    score = 0;
    speed = START_SPEED;
    groundOffset = 0;
    frame = 0;
    nextCactusIn = 60;
    state = 'playing';
  }

  function jump() {
    if (state === 'gameover') {
      reset();
      return;
    }
    if (dino.onGround) {
      // 웅크린 상태에서 점프해도 땅에 파묻히지 않도록 크기를 원래대로 복구
      dino.h = STAND_H;
      dino.w = 40;
      dino.y = GROUND_Y - STAND_H;
      dino.vy = JUMP_POWER;
      dino.onGround = false;
    }
  }

  // ---------- 입력 ----------
  function onKeyDown(e) {
    if (e.code === 'Space' || e.code === 'ArrowUp') {
      e.preventDefault();
      if (!e.repeat) jump();
    } else if (e.code === 'ArrowDown') {
      e.preventDefault();
      ducking = true;
    }
  }
  function onKeyUp(e) {
    if (e.code === 'ArrowDown') ducking = false;
    // 스페이스바 keyup이 버튼 클릭으로 처리되는 것을 방지
    if (e.code === 'Space') e.preventDefault();
  }
  function onBlur() {
    ducking = false;
  }

  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('keyup', onKeyUp);
  window.addEventListener('blur', onBlur);
  canvas.addEventListener('pointerdown', jump);

  // 다음에 startDino()가 호출되면 이 게임을 정리
  stopDino = () => {
    running = false;
    cancelAnimationFrame(rafId);
    window.removeEventListener('keydown', onKeyDown);
    window.removeEventListener('keyup', onKeyUp);
    window.removeEventListener('blur', onBlur);
    stopDino = null;
  };

  // ----------