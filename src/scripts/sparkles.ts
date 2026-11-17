/**
 * Fairy-dust sparkles for the hero (DESIGN.md §7).
 * - ambient stars and dots in the logo colours slowly drift up and twinkle
 * - the pointer leaves a short trail of falling fairy dust
 * - the fairy's wand tip ([data-wand-tip]) keeps sprinkling sparkles
 * Pure canvas, no libraries. Paused while the hero is off-screen or the tab is hidden;
 * not started at all when the visitor prefers reduced motion.
 */

type Kind = 'star' | 'dot';
interface P {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  color: string;
  kind: Kind;
  life: number; // remaining frames; Infinity for ambient particles
  max: number;
  phase: number;
  spin: number;
  angle: number;
  gravity: number;
}

const COLORS = ['#ffffff', '#ffffff', '#5cc6f2', '#1ba1df', '#ff5ca8', '#e0177f'];
const pick = <T>(a: T[]) => a[Math.floor(Math.random() * a.length)]!;
const rand = (a: number, b: number) => a + Math.random() * (b - a);

function drawStar(ctx: CanvasRenderingContext2D, r: number) {
  // four-pointed sparkle
  ctx.beginPath();
  for (let i = 0; i < 8; i++) {
    const rad = i % 2 === 0 ? r : r * 0.32;
    const a = (i * Math.PI) / 4;
    ctx.lineTo(Math.cos(a) * rad, Math.sin(a) * rad);
  }
  ctx.closePath();
  ctx.fill();
}

export function initSparkles() {
  const canvas = document.querySelector<HTMLCanvasElement>('[data-sparkles]');
  const hero = document.querySelector<HTMLElement>('[data-hero]');
  if (!canvas || !hero) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const tip = hero.querySelector<HTMLElement>('[data-wand-tip]');
  const particles: P[] = [];
  let w = 0;
  let h = 0;
  let running = false;
  let visible = true;
  let frame = 0;
  let raf = 0;

  const ambient = (y?: number): P => ({
    x: rand(0, w),
    y: y ?? rand(0, h),
    vx: rand(-0.08, 0.08),
    vy: rand(-0.25, -0.06),
    r: Math.random() < 0.35 ? rand(2.5, 5) : rand(0.8, 1.8),
    color: pick(COLORS),
    kind: Math.random() < 0.35 ? 'star' : 'dot',
    life: Infinity,
    max: Infinity,
    phase: rand(0, Math.PI * 2),
    spin: rand(-0.01, 0.01),
    angle: rand(0, Math.PI),
    gravity: 0,
  });

  const dust = (x: number, y: number, spread: number, speed = 1): P => {
    const max = Math.round(rand(40, 80));
    return {
      x: x + rand(-spread, spread),
      y: y + rand(-spread, spread),
      vx: rand(-0.6, 0.6) * speed,
      vy: rand(-0.9, 0.2) * speed,
      r: Math.random() < 0.5 ? rand(2.5, 4.5) : rand(1, 2),
      color: pick(COLORS),
      kind: Math.random() < 0.55 ? 'star' : 'dot',
      life: max,
      max,
      phase: rand(0, Math.PI * 2),
      spin: rand(-0.08, 0.08),
      angle: rand(0, Math.PI),
      gravity: 0.025,
    };
  };

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = hero!.getBoundingClientRect();
    w = rect.width;
    h = rect.height;
    canvas!.width = Math.round(w * dpr);
    canvas!.height = Math.round(h * dpr);
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    // keep ambient density proportional to the area (≈ 1 per 9 000 px², capped)
    const target = Math.min(140, Math.round((w * h) / 9000));
    const amb = particles.filter((p) => p.life === Infinity);
    for (let i = amb.length; i < target; i++) particles.push(ambient());
    for (let i = amb.length; i > target; i--) particles.splice(particles.indexOf(amb[i - 1]!), 1);
  }

  function tick() {
    frame++;
    ctx!.clearRect(0, 0, w, h);

    // wand sprinkle
    if (tip && frame % 3 === 0) {
      const t = tip.getBoundingClientRect();
      const hr = hero!.getBoundingClientRect();
      const x = t.left + t.width / 2 - hr.left;
      const y = t.top + t.height / 2 - hr.top;
      if (x > 0 && y > 0) particles.push(dust(x, y, 4, 0.7));
    }

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i]!;
      p.vy += p.gravity;
      p.x += p.vx;
      p.y += p.vy;
      p.angle += p.spin;
      p.phase += 0.045;

      let alpha: number;
      if (p.life === Infinity) {
        alpha = 0.25 + 0.6 * (0.5 + 0.5 * Math.sin(p.phase));
        if (p.y < -10) Object.assign(p, ambient(h + 10));
        if (p.x < -10) p.x = w + 10;
        else if (p.x > w + 10) p.x = -10;
      } else {
        p.life--;
        if (p.life <= 0 || p.y > h + 10) {
          particles.splice(i, 1);
          continue;
        }
        alpha = (p.life / p.max) * (0.7 + 0.3 * Math.sin(p.phase * 3));
      }

      ctx!.save();
      ctx!.globalAlpha = alpha;
      ctx!.fillStyle = p.color;
      ctx!.translate(p.x, p.y);
      ctx!.rotate(p.angle);
      if (p.kind === 'star') {
        ctx!.shadowColor = p.color;
        ctx!.shadowBlur = p.r * 3;
        drawStar(ctx!, p.r);
      } else {
        ctx!.beginPath();
        ctx!.arc(0, 0, p.r, 0, Math.PI * 2);
        ctx!.fill();
      }
      ctx!.restore();
    }

    raf = requestAnimationFrame(tick);
  }

  const start = () => {
    if (running || !visible || document.hidden) return;
    running = true;
    raf = requestAnimationFrame(tick);
  };
  const stop = () => {
    running = false;
    cancelAnimationFrame(raf);
  };

  // pointer trail (mouse + pen; touch would fire while scrolling, so skip it)
  let last = 0;
  hero.addEventListener('pointermove', (e) => {
    if (e.pointerType === 'touch') return;
    const now = performance.now();
    if (now - last < 16) return;
    last = now;
    const hr = hero.getBoundingClientRect();
    for (let i = 0; i < 2; i++) particles.push(dust(e.clientX - hr.left, e.clientY - hr.top, 6));
  });
  // a little burst on tap / click
  hero.addEventListener('pointerdown', (e) => {
    const hr = hero.getBoundingClientRect();
    for (let i = 0; i < 18; i++) particles.push(dust(e.clientX - hr.left, e.clientY - hr.top, 4, 2.4));
  });

  new ResizeObserver(resize).observe(hero);
  new IntersectionObserver(([entry]) => {
    visible = entry!.isIntersecting;
    if (visible) start();
    else stop();
  }).observe(hero);
  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));

  resize();
  start();
}
