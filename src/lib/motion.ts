export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return true;
  return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
}

export function rafThrottle<T extends (...args: any[]) => void>(fn: T): T {
  let raf = 0;
  let lastArgs: any[] | null = null;

  const wrapped = ((...args: any[]) => {
    lastArgs = args;
    if (raf) return;
    raf = requestAnimationFrame(() => {
      raf = 0;
      if (!lastArgs) return;
      fn(...(lastArgs as Parameters<T>));
      lastArgs = null;
    });
  }) as T;

  return wrapped;
}

type ObserveRevealOpts = {
  root?: ParentNode;
  selector?: string;
  threshold?: number;
  defaultStaggerMs?: number;
  once?: boolean;
};

function parseMs(value: string | null): number | null {
  if (!value) return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

/**
 * Observe elements with [data-reveal] and toggle .is-revealed.
 * Stagger model:
 * - Use [data-reveal-container] to reset counters per container.
 * - data-reveal-stagger: override stagger (ms) for elements in that container.
 * - data-reveal-delay: explicit delay (ms) per element.
 * - data-reveal-class: custom reveal class (default: "reveal").
 */
export function observeReveal(opts: ObserveRevealOpts = {}) {
  if (typeof window === "undefined") return { disconnect() {} };

  const root = opts.root ?? document;
  const selector = opts.selector ?? "[data-reveal]";

  if (prefersReducedMotion()) {
    root.querySelectorAll?.(selector)?.forEach((el) => {
      (el as HTMLElement).classList.add("is-revealed");
    });
    return { disconnect() {} };
  }

  const threshold = opts.threshold ?? 0.12;
  const defaultStaggerMs = opts.defaultStaggerMs ?? 70;
  const once = opts.once ?? true;

  const els = Array.from(root.querySelectorAll(selector)) as HTMLElement[];

  const getContainer = (el: HTMLElement) =>
    (el.closest?.("[data-reveal-container]") as HTMLElement | null) ?? null;

  const getContainerKey = (el: HTMLElement) => {
    const container = getContainer(el);
    return container?.getAttribute("data-reveal-container") ?? "__global";
  };

  const getStaggerMs = (container: HTMLElement | null) => {
    return parseMs(container?.getAttribute("data-reveal-stagger") ?? null) ?? defaultStaggerMs;
  };

  const isGridLayout = (container: HTMLElement | null) =>
    (container?.getAttribute("data-reveal-layout") ?? "") === "grid";

  const getCols = (container: HTMLElement) => {
    const css = window.getComputedStyle(container);
    const tpl = css.gridTemplateColumns;
    if (!tpl || tpl === "none") return 1;
    return tpl.split(" ").filter(Boolean).length || 1;
  };

  const getGridDelay = (container: HTMLElement, idx: number) => {
    const cols = getCols(container);
    const colStagger = parseMs(container.getAttribute("data-reveal-col-stagger")) ?? 60;
    const rowStagger = parseMs(container.getAttribute("data-reveal-row-stagger")) ?? 140;

    const row = Math.floor(idx / cols);
    const col = idx % cols;
    return row * rowStagger + col * colStagger;
  };

  // Group elements by container+group so we can do per-grid row/col staggering.
  const groups = new Map<string, { container: HTMLElement | null; items: HTMLElement[] }>();

  for (const el of els) {
    // Support custom reveal class via data-reveal-class attribute
    const revealClass = el.getAttribute("data-reveal-class") ?? "reveal";
    el.classList.add(revealClass);

    const container = getContainer(el);
    const containerKey = getContainerKey(el);
    const group = el.getAttribute("data-reveal-group") ?? "__default";
    const key = `${containerKey}::${group}`;

    const g = groups.get(key) ?? { container, items: [] };
    g.items.push(el);
    groups.set(key, g);
  }

  for (const { container, items } of groups.values()) {
    const grid = container && isGridLayout(container);
    const staggerMs = getStaggerMs(container);

    for (let i = 0; i < items.length; i++) {
      const el = items[i];

      // per-element explicit delay wins
      const explicit = parseMs(el.getAttribute("data-reveal-delay"));
      if (explicit != null) {
        el.style.setProperty("--reveal-delay", `${explicit}ms`);
        continue;
      }

      const d = grid && container ? getGridDelay(container, i) : i * staggerMs;
      el.style.setProperty("--reveal-delay", `${d}ms`);
    }
  }

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const el = entry.target as HTMLElement;
        el.classList.add("is-revealed");
        if (once) io.unobserve(el);
      }
    },
    { threshold },
  );

  for (const el of els) io.observe(el);

  return {
    disconnect() {
      io.disconnect();
    },
  };
}

// --- Scroll Parallax ---

type ParallaxItem = {
  el: HTMLElement;
  speed: number;
  direction: "up" | "down" | "left" | "right";
  scale: number;
};

export function observeParallax(selector = "[data-parallax]") {
  if (typeof window === "undefined") return { disconnect() {} };
  if (prefersReducedMotion()) return { disconnect() {} };

  const items: ParallaxItem[] = [];
  const els = document.querySelectorAll<HTMLElement>(selector);

  for (const el of els) {
    items.push({
      el,
      speed: parseFloat(el.getAttribute("data-parallax-speed") ?? "0.08"),
      direction: (el.getAttribute("data-parallax-dir") ?? "up") as ParallaxItem["direction"],
      scale: parseFloat(el.getAttribute("data-parallax-scale") ?? "1"),
    });
  }

  if (items.length === 0) return { disconnect() {} };

  let active = !document.hidden;
  let raf = 0;

  const tick = () => {
    raf = 0;
    if (!active) return;

    const scrollY = window.scrollY;
    const vh = window.innerHeight;

    for (const item of items) {
      const rect = item.el.getBoundingClientRect();
      const center = rect.top + rect.height / 2;
      const progress = (center - vh / 2) / vh; // -0.5 to 0.5 when in view

      let tx = 0,
        ty = 0;
      const offset = progress * item.speed * 100;

      switch (item.direction) {
        case "up":
          ty = -offset;
          break;
        case "down":
          ty = offset;
          break;
        case "left":
          tx = -offset;
          break;
        case "right":
          tx = offset;
          break;
      }

      const s = 1 + (1 - item.scale) * progress;

      item.el.style.transform = `translate3d(${tx}px, ${ty}px, 0) scale(${s})`;
    }
  };

  const onScroll = () => {
    if (!active || raf) return;
    raf = requestAnimationFrame(tick);
  };

  const onVis = () => {
    active = !document.hidden;
    if (active) onScroll();
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  document.addEventListener("visibilitychange", onVis);
  tick();

  return {
    disconnect() {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVis);
      if (raf) cancelAnimationFrame(raf);
    },
  };
}

// --- Scroll Progress Bar ---

export function observeScrollProgress(el: HTMLElement | null) {
  if (!el || typeof window === "undefined") return { disconnect() {} };
  if (prefersReducedMotion()) {
    el.style.display = "none";
    return { disconnect() {} };
  }

  let raf = 0;

  const tick = () => {
    raf = 0;
    const scrollY = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const pct = maxScroll > 0 ? Math.min(1, scrollY / maxScroll) : 0;
    el.style.transform = `scaleX(${pct})`;
  };

  const onScroll = () => {
    if (raf) return;
    raf = requestAnimationFrame(tick);
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  tick();

  return {
    disconnect() {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    },
  };
}

// --- Card 3D Tilt ---

export function initCardTilt(selector = ".card-tilt") {
  if (typeof window === "undefined") return;
  if (prefersReducedMotion()) return;

  const canHover = window.matchMedia?.("(hover: hover)")?.matches;
  const finePointer = window.matchMedia?.("(pointer: fine)")?.matches;
  if (!canHover || !finePointer) return;

  for (const el of document.querySelectorAll<HTMLElement>(selector)) {
    let raf = 0;

    const onMove = (ev: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const x = (ev.clientX - rect.left) / rect.width;
      const y = (ev.clientY - rect.top) / rect.height;

      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const rotateY = (x - 0.5) * 12; // ±6deg
        const rotateX = (0.5 - y) * 8; // ±4deg
        el.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translate3d(0, -2px, 0)`;
        el.style.setProperty("--glow-x", `${x * 100}%`);
        el.style.setProperty("--glow-y", `${y * 100}%`);
      });
    };

    const onLeave = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.transform = "perspective(600px) rotateX(0) rotateY(0) translate3d(0, 0, 0)";
        el.style.setProperty("--glow-x", `50%`);
        el.style.setProperty("--glow-y", `50%`);
      });
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
  }
}

// --- Hero Scroll Fade ---

export function initHeroScrollFade(selector = ".hero") {
  if (typeof window === "undefined") return;
  if (prefersReducedMotion()) return;

  const hero = document.querySelector<HTMLElement>(selector);
  if (!hero) return;

  const inner = hero.querySelector<HTMLElement>(".heroInner");
  if (!inner) return;

  let raf = 0;

  const tick = () => {
    raf = 0;
    const scrollY = window.scrollY;
    const heroH = hero.offsetHeight;
    const progress = Math.min(1, scrollY / (heroH * 0.6));

    inner.style.opacity = String(1 - progress * 0.8);
    inner.style.transform = `translate3d(0, ${scrollY * 0.15}px, 0) scale(${1 - progress * 0.05})`;
  };

  const onScroll = () => {
    if (raf) return;
    raf = requestAnimationFrame(tick);
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  tick();
}
