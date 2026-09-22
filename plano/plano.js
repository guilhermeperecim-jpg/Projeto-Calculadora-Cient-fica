/* ============================================
   Plano Cartesiano — Script
   Renderização do gráfico e cálculos
   ============================================ */

// === DOM Elements ===
const canvas = document.getElementById('grafico');
const ctx = canvas.getContext('2d');
const coefA = document.getElementById('coef-a');
const coefB = document.getElementById('coef-b');
const coefC = document.getElementById('coef-c');
const btnAtualizar = document.getElementById('btn-atualizar');
const btnZoomIn = document.getElementById('btn-zoom-in');
const btnZoomOut = document.getElementById('btn-zoom-out');
const btnReset = document.getElementById('btn-reset');

const resFuncao = document.getElementById('res-funcao');
const resDelta = document.getElementById('res-delta');
const resRaiz1 = document.getElementById('res-raiz1');
const resRaiz2 = document.getElementById('res-raiz2');
const resVertice = document.getElementById('res-vertice');

// === Canvas Config ===
let scale = 40; // pixels per unit
const MIN_SCALE = 10;
const MAX_SCALE = 120;
const SCALE_STEP = 10;

// === High DPI Support ===
function setupCanvas() {
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  ctx.scale(dpr, dpr);
  canvas.style.width = rect.width + 'px';
  canvas.style.height = rect.height + 'px';
}

// === Theme ===
function isDarkTheme() {
  const wrapper = document.getElementById('wrapper');
  return wrapper.classList.contains('dark');
}

function getThemeColors() {
  const dark = isDarkTheme();
  return {
    bg: dark ? '#121216' : '#fcfefd',
    grid: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
    axis: dark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.18)',
    axisText: dark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.35)',
    curve: dark ? '#ff5733' : '#108756',
    curveGlow: dark ? 'rgba(255,87,51,0.25)' : 'rgba(16,135,90,0.2)',
    vertexDot: dark ? '#ff5733' : '#108756',
    rootDot: dark ? '#ffa07a' : '#0dab6e',
  };
}

// === Drawing ===
function drawGrid() {
  const colors = getThemeColors();
  const w = canvas.getBoundingClientRect().width;
  const h = canvas.getBoundingClientRect().height;
  const cx = w / 2;
  const cy = h / 2;

  // Background
  ctx.fillStyle = colors.bg;
  ctx.fillRect(0, 0, w, h);

  // Grid lines
  ctx.strokeStyle = colors.grid;
  ctx.lineWidth = 1;

  // Vertical grid lines
  for (let x = cx % scale; x < w; x += scale) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
  }

  // Horizontal grid lines
  for (let y = cy % scale; y < h; y += scale) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }

  // Axes
  ctx.strokeStyle = colors.axis;
  ctx.lineWidth = 1.5;

  // X axis
  ctx.beginPath();
  ctx.moveTo(0, cy);
  ctx.lineTo(w, cy);
  ctx.stroke();

  // Y axis
  ctx.beginPath();
  ctx.moveTo(cx, 0);
  ctx.lineTo(cx, h);
  ctx.stroke();

  // Axis labels
  ctx.fillStyle = colors.axisText;
  ctx.font = '11px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';

  // X axis numbers
  const unitsX = Math.floor(w / (2 * scale));
  for (let i = -unitsX; i <= unitsX; i++) {
    if (i === 0) continue;
    const x = cx + i * scale;
    ctx.fillText(i, x, cy + 6);
  }

  // Y axis numbers
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';
  const unitsY = Math.floor(h / (2 * scale));
  for (let i = -unitsY; i <= unitsY; i++) {
    if (i === 0) continue;
    const y = cy - i * scale;
    ctx.fillText(i, cx - 6, y);
  }

  // Origin
  ctx.textAlign = 'right';
  ctx.textBaseline = 'top';
  ctx.fillText('0', cx - 5, cy + 5);

  // Axis letters
  ctx.font = 'bold 13px Inter, sans-serif';
  ctx.fillStyle = colors.axisText;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'bottom';
  ctx.fillText('x', w - 12, cy - 6);
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText('y', cx + 8, 14);
}

function drawCurve(a, b, c) {
  const colors = getThemeColors();
  const w = canvas.getBoundingClientRect().width;
  const h = canvas.getBoundingClientRect().height;
  const cx = w / 2;
  const cy = h / 2;

  // Glow effect
  ctx.save();
  ctx.strokeStyle = colors.curveGlow;
  ctx.lineWidth = 6;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();

  let started = false;
  for (let px = 0; px < w; px += 0.5) {
    const x = (px - cx) / scale;
    const y = a * x * x + b * x + c;
    const py = cy - y * scale;

    if (py < -100 || py > h + 100) {
      started = false;
      continue;
    }

    if (!started) {
      ctx.moveTo(px, py);
      started = true;
    } else {
      ctx.lineTo(px, py);
    }
  }
  ctx.stroke();
  ctx.restore();

  // Main curve
  ctx.save();
  ctx.strokeStyle = colors.curve;
  ctx.lineWidth = 2.5;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();

  started = false;
  for (let px = 0; px < w; px += 0.5) {
    const x = (px - cx) / scale;
    const y = a * x * x + b * x + c;
    const py = cy - y * scale;

    if (py < -100 || py > h + 100) {
      started = false;
      continue;
    }

    if (!started) {
      ctx.moveTo(px, py);
      started = true;
    } else {
      ctx.lineTo(px, py);
    }
  }
  ctx.stroke();
  ctx.restore();
}

function drawPoint(x, y, color, label) {
  const colors = getThemeColors();
  const w = canvas.getBoundingClientRect().width;
  const h = canvas.getBoundingClientRect().height;
  const cx = w / 2;
  const cy = h / 2;

  const px = cx + x * scale;
  const py = cy - y * scale;

  // Check if point is visible
  if (px < -20 || px > w + 20 || py < -20 || py > h + 20) return;

  // Outer glow
  ctx.beginPath();
  ctx.arc(px, py, 8, 0, Math.PI * 2);
  ctx.fillStyle = color + '33';
  ctx.fill();

  // Point
  ctx.beginPath();
  ctx.arc(px, py, 4, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();

  // Label
  if (label) {
    ctx.font = '11px Inter, sans-serif';
    ctx.fillStyle = colors.axisText;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillText(label, px, py - 12);
  }
}

// === Math Calculations ===
function formatNumber(n) {
  if (Number.isNaN(n) || !Number.isFinite(n)) return '—';
  return parseFloat(n.toFixed(4)).toString();
}

function buildFunctionString(a, b, c) {
  let parts = [];

  if (a !== 0) {
    if (a === 1) parts.push('x²');
    else if (a === -1) parts.push('-x²');
    else parts.push(a + 'x²');
  }

  if (b !== 0) {
    if (b === 1) parts.push(parts.length ? '+ x' : 'x');
    else if (b === -1) parts.push('- x');
    else if (b > 0 && parts.length) parts.push('+ ' + b + 'x');
    else parts.push(b + 'x');
  }

  if (c !== 0) {
    if (c > 0 && parts.length) parts.push('+ ' + c);
    else parts.push(c.toString());
  }

  if (parts.length === 0) return '0';
  return parts.join(' ');
}

function calcularEAtualizar() {
  const a = parseFloat(coefA.value) || 0;
  const b = parseFloat(coefB.value) || 0;
  const c = parseFloat(coefC.value) || 0;

  // Delta
  const delta = b * b - 4 * a * c;

  // Raízes
  let raiz1 = '—';
  let raiz2 = '—';
  let r1 = null;
  let r2 = null;

  if (a !== 0) {
    if (delta >= 0) {
      r1 = (-b + Math.sqrt(delta)) / (2 * a);
      r2 = (-b - Math.sqrt(delta)) / (2 * a);
      raiz1 = formatNumber(r1);
      raiz2 = formatNumber(r2);
    } else {
      const realPart = formatNumber(-b / (2 * a));
      const imagPart = formatNumber(Math.sqrt(-delta) / (2 * a));
      raiz1 = realPart + ' + ' + imagPart + 'i';
      raiz2 = realPart + ' - ' + imagPart + 'i';
    }
  } else if (b !== 0) {
    // Linear: bx + c = 0
    r1 = -c / b;
    raiz1 = formatNumber(r1);
    raiz2 = '—';
  }

  // Vértice
  let vx = 0, vy = 0;
  if (a !== 0) {
    vx = -b / (2 * a);
    vy = -(delta) / (4 * a);
  }

  // Update results
  resFuncao.textContent = 'f(x) = ' + buildFunctionString(a, b, c);
  resDelta.textContent = a !== 0 ? formatNumber(delta) : '—';
  resRaiz1.textContent = raiz1;
  resRaiz2.textContent = raiz2;
  resVertice.textContent = a !== 0 ? '(' + formatNumber(vx) + ', ' + formatNumber(vy) + ')' : '—';

  // Draw
  setupCanvas();
  drawGrid();

  if (a !== 0 || b !== 0) {
    drawCurve(a, b, c);

    // Draw vertex
    if (a !== 0) {
      const colors = getThemeColors();
      drawPoint(vx, vy, colors.vertexDot, 'V');
    }

    // Draw roots
    if (delta >= 0) {
      const colors = getThemeColors();
      if (r1 !== null) drawPoint(r1, 0, colors.rootDot, 'R₁');
      if (r2 !== null && r2 !== r1) drawPoint(r2, 0, colors.rootDot, 'R₂');
    }
  }
}

// === Theme Toggle ===
function changeThemePlano() {
  const wrapper = document.getElementById('wrapper');
  const toastEl = document.getElementById('toast');
  const themeIconEl = document.getElementById('theme-icon');
  const githubIconEl = document.getElementById('github-icon');
  const calculatorEl = document.getElementById('calculator');

  const caminho = '../';

  if (wrapper.classList.contains('light')) {
    themeIconEl.setAttribute('src', caminho + 'assets/SunIcon.svg');
    githubIconEl.setAttribute('src', caminho + 'assets/GitHubLight.svg');
    if (calculatorEl) calculatorEl.setAttribute('src', caminho + 'assets/calculator.ico.png');
    toastEl.innerHTML = 'Modo Escuro 🌙';
  } else {
    themeIconEl.setAttribute('src', caminho + 'assets/MoonIcon.svg');
    githubIconEl.setAttribute('src', caminho + 'assets/GitHubDark.svg');
    if (calculatorEl) calculatorEl.setAttribute('src', caminho + 'assets/calculator.icon.branco.png');
    toastEl.innerHTML = 'Modo Claro ☀️';
  }

  wrapper.classList.toggle('light');
  wrapper.classList.toggle('dark');

  toastEl.classList.add('toast-active');

  setTimeout(() => {
    toastEl.innerHTML = 'Plano Cartesiano';
    toastEl.classList.remove('toast-active');
  }, 1500);

  // Redraw with new theme colors
  calcularEAtualizar();
}

// === Events ===
btnAtualizar.addEventListener('click', calcularEAtualizar);

btnZoomIn.addEventListener('click', () => {
  if (scale < MAX_SCALE) {
    scale += SCALE_STEP;
    calcularEAtualizar();
  }
});

btnZoomOut.addEventListener('click', () => {
  if (scale > MIN_SCALE) {
    scale -= SCALE_STEP;
    calcularEAtualizar();
  }
});

btnReset.addEventListener('click', () => {
  scale = 40;
  calcularEAtualizar();
});

// Live update on input change
[coefA, coefB, coefC].forEach(input => {
  input.addEventListener('input', calcularEAtualizar);
});

// Enter key trigger
[coefA, coefB, coefC].forEach(input => {
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      calcularEAtualizar();
    }
  });
});

// Resize handler
window.addEventListener('resize', () => {
  calcularEAtualizar();
});

// === Initial Render ===
calcularEAtualizar();
