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

  // counter is per-container + group
  const counters = new Map<string, number>();

  const getContainerKey = (el: HTMLElement) => {
    const container = el.closest?.("[data-reveal-container]") as HTMLElement | null;
    return container?.getAttribute("data-reveal-container") ?? "__global";
  };

  const getStaggerMs = (el: HTMLElement) => {
    const container = el.closest?.("[data-reveal-container]") as HTMLElement | null;
    return (
      parseMs(container?.getAttribute("data-reveal-stagger") ?? null) ??
      defaultStaggerMs
    );
  };

  for (const el of els) {
    el.classList.add("reveal");

    // per-element explicit delay wins
    const explicit = parseMs(el.getAttribute("data-reveal-delay"));
    if (explicit != null) {
      el.style.setProperty("--reveal-delay", `${explicit}ms`);
      continue;
    }

    const containerKey = getContainerKey(el);
    const group = el.getAttribute("data-reveal-group") ?? "__default";
    const key = `${containerKey}::${group}`;

    const idx = counters.get(key) ?? 0;
    counters.set(key, idx + 1);

    const staggerMs = getStaggerMs(el);
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
