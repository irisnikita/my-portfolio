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
  staggerMs?: number;
  once?: boolean;
};

/**
 * Observe elements with [data-reveal] and toggle .is-revealed.
 * Supports simple staggering by group: set data-reveal-group on elements to share an index.
 */
export function observeReveal(opts: ObserveRevealOpts = {}) {
  if (typeof window === "undefined") return { disconnect() {} };

  if (prefersReducedMotion()) {
    const root = opts.root ?? document;
    root.querySelectorAll?.(opts.selector ?? "[data-reveal]")?.forEach((el) => {
      (el as HTMLElement).classList.add("is-revealed");
    });
    return { disconnect() {} };
  }

  const root = opts.root ?? document;
  const selector = opts.selector ?? "[data-reveal]";
  const threshold = opts.threshold ?? 0.12;
  const staggerMs = opts.staggerMs ?? 70;
  const once = opts.once ?? true;

  const els = Array.from(root.querySelectorAll(selector)) as HTMLElement[];
  const groupCounters = new Map<string, number>();

  for (const el of els) {
    el.classList.add("reveal");

    const group = el.getAttribute("data-reveal-group") ?? "__default";
    const idx = groupCounters.get(group) ?? 0;
    groupCounters.set(group, idx + 1);

    el.style.setProperty("--reveal-delay", `${idx * staggerMs}ms`);
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
    { threshold }
  );

  for (const el of els) io.observe(el);

  return {
    disconnect() {
      io.disconnect();
    },
  };
}
