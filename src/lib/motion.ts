export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return true;
  return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
}

export function observeScrollProgress(el: HTMLElement | null) {
  if (!el || typeof window === "undefined") return { disconnect() {} };

  if (prefersReducedMotion()) {
    el.style.display = "none";
    return { disconnect() {} };
  }

  let raf = 0;

  const update = () => {
    raf = 0;
    const maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 0);
    const pct = maxScroll > 0 ? Math.min(window.scrollY / maxScroll, 1) : 0;

    el.style.transform = `scaleX(${pct})`;
    el.style.opacity = maxScroll > 0 ? "1" : "0";
  };

  const queueUpdate = () => {
    if (raf) return;
    raf = requestAnimationFrame(update);
  };

  window.addEventListener("scroll", queueUpdate, { passive: true });
  window.addEventListener("resize", queueUpdate, { passive: true });
  queueUpdate();

  return {
    disconnect() {
      window.removeEventListener("scroll", queueUpdate);
      window.removeEventListener("resize", queueUpdate);
      if (raf) cancelAnimationFrame(raf);
    },
  };
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
