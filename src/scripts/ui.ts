/** Small progressive enhancements. The page works fully without JavaScript. */
import type { DayHours } from '../data/site';
import { initSparkles } from './sparkles';

/* ---------- Mobile navigation ---------- */
function initNav() {
  const toggle = document.querySelector<HTMLButtonElement>('[data-nav-toggle]');
  const panel = document.getElementById('nav-links');
  if (!toggle || !panel) return;
  const label = toggle.querySelector('.visually-hidden');

  const set = (open: boolean) => {
    toggle.setAttribute('aria-expanded', String(open));
    panel.classList.toggle('is-open', open);
    if (label) label.textContent = open ? 'Zapri meni' : 'Odpri meni';
  };

  toggle.addEventListener('click', () => set(toggle.getAttribute('aria-expanded') !== 'true'));
  panel.addEventListener('click', (e) => {
    if ((e.target as HTMLElement).closest('a')) set(false);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      set(false);
      toggle.focus();
    }
  });
}

/* ---------- Open / closed status ---------- */
const DAY_NAMES = ['v nedeljo', 'v ponedeljek', 'v torek', 'v sredo', 'v četrtek', 'v petek', 'v soboto'];
const toMin = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number);
  return h! * 60 + m!;
};

/** Current weekday + minutes in the restaurant's time zone (testable via ?now=2026-11-15T12:00). */
function nowInZone(tz: string): { day: number; min: number } {
  const override = new URLSearchParams(location.search).get('now');
  if (override) {
    const d = new Date(override);
    if (!Number.isNaN(d.getTime())) return { day: d.getDay(), min: d.getHours() * 60 + d.getMinutes() };
  }
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: tz,
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(new Date());
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? '';
  const day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday'));
  return { day, min: Number(get('hour')) * 60 + Number(get('minute')) };
}

function describe(hours: DayHours[], day: number, min: number): { open: boolean; text: string } {
  const byDay = new Map(hours.map((h) => [h.day, h]));
  const today = byDay.get(day);
  if (today?.open && today.close) {
    const o = toMin(today.open);
    const c = toMin(today.close);
    if (min >= o && min < c) return { open: true, text: `Odprto · do ${today.close}` };
    if (min < o) return { open: false, text: `Zaprto · odpremo danes ob ${today.open}` };
  }
  for (let i = 1; i <= 7; i++) {
    const d = (day + i) % 7;
    const next = byDay.get(d);
    if (next?.open) {
      const when = i === 1 ? 'jutri' : DAY_NAMES[d];
      return { open: false, text: `Zaprto · odpremo ${when} ob ${next.open}` };
    }
  }
  return { open: false, text: 'Zaprto' };
}

function initStatus() {
  const pills = document.querySelectorAll<HTMLElement>('[data-open-status]');
  if (!pills.length) return;
  const first = pills[0]!;
  const hours = JSON.parse(first.dataset.hours ?? '[]') as DayHours[];
  const tz = first.dataset.tz ?? 'Europe/Ljubljana';

  const update = () => {
    const { day, min } = nowInZone(tz);
    const s = describe(hours, day, min);
    pills.forEach((pill) => {
      pill.classList.toggle('status--open', s.open);
      pill.classList.toggle('status--closed', !s.open);
      const text = pill.querySelector('[data-open-status-text]');
      if (text) text.textContent = s.text;
    });
    document.querySelectorAll('tr[data-day]').forEach((row) => {
      row.classList.toggle('is-today', Number((row as HTMLElement).dataset.day) === day);
    });
  };
  update();
  setInterval(update, 60_000);
}

/* ---------- Sticky chips: shadow when stuck + active category ---------- */
function initChips() {
  const bar = document.querySelector<HTMLElement>('[data-chips]');
  const sentinel = document.querySelector('[data-chips-sentinel]');
  const list = document.querySelector<HTMLElement>('[data-chips-list]');
  if (!bar || !sentinel || !list) return;

  const navH = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 68;
  new IntersectionObserver(([entry]) => bar.classList.toggle('is-stuck', !entry!.isIntersecting), {
    rootMargin: `-${navH + 1}px 0px 0px 0px`,
  }).observe(sentinel);

  const chips = new Map<string, HTMLAnchorElement>();
  list.querySelectorAll<HTMLAnchorElement>('[data-chip]').forEach((a) => chips.set(a.dataset.chip!, a));

  let current = '';
  const activate = (id: string) => {
    if (id === current) return;
    current = id;
    chips.forEach((a, key) => a.setAttribute('aria-current', String(key === id)));
    const chip = chips.get(id);
    if (chip) {
      const left = chip.offsetLeft - (list.clientWidth - chip.offsetWidth) / 2;
      list.scrollTo({ left, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    }
  };

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) activate((e.target as HTMLElement).id);
      });
    },
    { rootMargin: '-45% 0px -50% 0px' },
  );
  document.querySelectorAll<HTMLElement>('[data-cat]').forEach((s) => io.observe(s));
}

/* ---------- Scroll reveal: [data-reveal] fades in once when it enters the viewport ---------- */
function initReveal() {
  const els = document.querySelectorAll<HTMLElement>('[data-reveal]');
  if (!els.length) return;
  if (!('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) {
    els.forEach((el) => el.classList.add('is-visible'));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add('is-visible');
        io.unobserve(e.target);
      });
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
  );
  els.forEach((el) => io.observe(el));
}

initNav();
initStatus();
initChips();
initReveal();
initSparkles();
