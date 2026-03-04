import Matter from "matter-js";

let isGravityActive = false;

export function startGravity() {
  if (isGravityActive || typeof window === "undefined") return;
  isGravityActive = true;

  // Aliases
  const Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    Composite = Matter.Composite,
    MouseConstraint = Matter.MouseConstraint,
    Mouse = Matter.Mouse;

  const engine = Engine.create();
  const world = engine.world;

  // We don't render the canvas visibly, we just use the physics engine coordinates
  // to update the DOM elements!
  const render = Render.create({
    element: document.body,
    engine: engine,
    options: {
      width: window.innerWidth,
      height: window.innerHeight,
      wireframes: false,
      background: "transparent",
    },
  });

  // Hide the debug canvas
  render.canvas.style.position = "fixed";
  render.canvas.style.top = "0";
  render.canvas.style.left = "0";
  render.canvas.style.pointerEvents = "none";
  render.canvas.style.zIndex = "9998"; // Below the real DOM elements we interact with
  render.canvas.style.opacity = "0"; // strictly for debug if needed

  // Create boundaries (walls)
  const wallOptions = { isStatic: true, render: { visible: false } };
  const ground = Bodies.rectangle(
    window.innerWidth / 2,
    window.innerHeight + 50,
    window.innerWidth * 2,
    100,
    wallOptions,
  );
  const leftWall = Bodies.rectangle(
    -50,
    window.innerHeight / 2,
    100,
    window.innerHeight * 2,
    wallOptions,
  );
  const rightWall = Bodies.rectangle(
    window.innerWidth + 50,
    window.innerHeight / 2,
    100,
    window.innerHeight * 2,
    wallOptions,
  );
  const ceiling = Bodies.rectangle(
    window.innerWidth / 2,
    -1000,
    window.innerWidth * 2,
    100,
    wallOptions,
  );

  Composite.add(world, [ground, leftWall, rightWall, ceiling]);

  // Find DOM elements to turn into physics bodies
  // We'll grab cards, buttons, tags, chips
  const selectors = [
    ".projectCard",
    ".button",
    ".tag",
    ".navLink",
    ".cvLink",
    ".proof li",
    ".statCard", // if it exists
    ".brand",
  ];

  const elements = document.querySelectorAll(selectors.join(", "));
  const domBodies: { el: HTMLElement; body: Matter.Body }[] = [];

  elements.forEach((el) => {
    const htmlEl = el as HTMLElement;
    const rect = htmlEl.getBoundingClientRect();

    // Skip hidden elements
    if (rect.width === 0 || rect.height === 0) return;

    // Create a physics body matching the exact size and position
    const body = Bodies.rectangle(
      rect.left + rect.width / 2,
      rect.top + rect.height / 2,
      rect.width,
      rect.height,
      {
        restitution: 0.6, // bounciness
        friction: 0.1,
        density: 0.001,
      },
    );

    // Prepare DOM element for absolute positioning
    htmlEl.style.position = "fixed";
    htmlEl.style.margin = "0";
    htmlEl.style.top = "0"; // Base top for transform
    htmlEl.style.left = "0";
    htmlEl.style.width = `${rect.width}px`;
    htmlEl.style.height = `${rect.height}px`;
    htmlEl.style.zIndex = "9999";
    htmlEl.style.transition = "none"; // crucial for smooth physics

    domBodies.push({ el: htmlEl, body });
    Composite.add(world, body);
  });

  // Add mouse interaction!
  const mouse = Mouse.create(document.body);
  const mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
      stiffness: 0.2,
      render: { visible: false },
    },
  });

  Composite.add(world, mouseConstraint);
  render.mouse = mouse; // Keep render mouse in sync

  // Update DOM elements on every engine tick
  Matter.Events.on(engine, "afterUpdate", () => {
    domBodies.forEach(({ el, body }) => {
      // Sync DOM transforms to physics body coordinates
      const { x, y } = body.position;
      const angle = body.angle;
      // Subtract width/height half because transform is top-left based but body is center based
      el.style.transform = `translate(${x - el.offsetWidth / 2}px, ${y - el.offsetHeight / 2}px) rotate(${angle}rad)`;
    });
  });

  // Run the physics engine
  Render.run(render);
  const runner = Runner.create();
  Runner.run(runner, engine);

  // Resize handler for floor/walls
  window.addEventListener("resize", () => {
    render.canvas.width = window.innerWidth;
    render.canvas.height = window.innerHeight;

    Matter.Body.setPosition(ground, { x: window.innerWidth / 2, y: window.innerHeight + 50 });
    Matter.Body.setPosition(rightWall, { x: window.innerWidth + 50, y: window.innerHeight / 2 });
  });
}
