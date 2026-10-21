/* Curved Loop — vanilla port of React Bits CurvedLoop (arc)
   https://www.reactbits.dev/text-animations/curved-loop */

(function (global) {
  "use strict";

  const VIEW_WIDTH = 1440;
  const VIEW_HEIGHT = 120;
  const MAX_FLING = 4000;

  const wrapOffset = (value, length) =>
    length > 0 ? (((value % length) + length) % length) - length : value;

  function mountCurvedLoop(host, options = {}) {
    if (!host) return { destroy() {} };

    const settings = {
      marqueeText: "Автоматизация",
      speed: 2,
      curveAmount: 400,
      direction: "left",
      interactive: true,
      pauseOnHover: false,
      color: "currentColor",
      fontSize: 72,
      fontWeight: 900,
      letterSpacing: 0,
      separator: "✦",
      ...options
    };

    const body = String(settings.marqueeText).replace(/\s+$/, "");
    const mark = String(settings.separator ?? "").trim();
    const unit = mark ? `${body}\u00A0${mark}\u00A0` : `${body}\u00A0`;
    const pathId = `curve-${Math.random().toString(36).slice(2, 9)}`;
    const baseline = 40;
    const curve = Number(settings.curveAmount) || 400;
    const fontPad = Number(settings.fontSize) || 72;
    const viewH = Math.max(VIEW_HEIGHT, baseline + curve + fontPad);
    const pathD = `M-100,${baseline} Q500,${baseline + curve} 1540,${baseline}`;

    const jacket = document.createElement("div");
    jacket.className = "curved-loop-jacket";
    jacket.style.cursor = settings.interactive ? "grab" : "auto";
    jacket.style.touchAction = settings.interactive ? "pan-y" : "auto";
    jacket.style.visibility = "hidden";

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("class", "curved-loop-svg");
    svg.setAttribute("viewBox", `0 0 ${VIEW_WIDTH} ${viewH}`);
    svg.setAttribute("role", "img");
    svg.setAttribute("aria-label", body);
    svg.style.fontSize = `${settings.fontSize}px`;
    svg.style.fontWeight = String(settings.fontWeight);
    svg.style.letterSpacing = settings.letterSpacing ? `${settings.letterSpacing}em` : "";
    svg.style.fill = settings.color;
    svg.style.aspectRatio = `${VIEW_WIDTH} / ${viewH}`;

    const measure = document.createElementNS("http://www.w3.org/2000/svg", "text");
    measure.setAttribute("xml:space", "preserve");
    measure.style.visibility = "hidden";
    measure.style.opacity = "0";
    measure.style.pointerEvents = "none";
    measure.textContent = unit;

    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("id", pathId);
    path.setAttribute("d", pathD);
    path.setAttribute("fill", "none");
    path.setAttribute("stroke", "transparent");
    defs.append(path);

    const visible = document.createElementNS("http://www.w3.org/2000/svg", "text");
    visible.setAttribute("xml:space", "preserve");

    svg.append(measure, defs, visible);
    jacket.append(svg);
    host.append(jacket);

    let spacing = 0;
    let pathLength = 0;
    let offset = 0;
    let velocity = 0;
    let direction = settings.direction === "right" ? 1 : -1;
    let hovering = false;
    let raf = 0;
    let last = 0;
    let onScreen = true;
    let destroyed = false;
    const textPaths = [];

    const drag = {
      active: false,
      x: 0,
      time: 0,
      scale: 1,
      velocity: 0
    };

    const applyOffset = () => {
      const value = `${offset}px`;
      textPaths.forEach((node) => node.setAttribute("startOffset", value));
    };

    const rebuild = () => {
      while (visible.firstChild) visible.removeChild(visible.firstChild);
      textPaths.length = 0;
      if (!spacing || !pathLength) return;
      const copies = Math.ceil(pathLength / spacing) + 2;
      const plain = unit.repeat(copies);
      const textPath = document.createElementNS("http://www.w3.org/2000/svg", "textPath");
      textPath.setAttribute("href", `#${pathId}`);
      textPath.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", `#${pathId}`);
      textPath.textContent = plain;
      visible.append(textPath);
      textPaths.push(textPath);
      applyOffset();
      jacket.style.visibility = "visible";
    };

    const measureNow = () => {
      spacing = measure.getComputedTextLength() || 0;
      pathLength = path.getTotalLength() || 0;
      offset = wrapOffset(offset, spacing);
      rebuild();
    };

    const tick = (now) => {
      raf = 0;
      if (destroyed || !onScreen) return;
      const dt = last ? Math.min((now - last) / 1000, 0.05) : 0;
      last = now;
      if (!drag.active && spacing > 0) {
        const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
        const halted = reduce || (settings.pauseOnHover && hovering);
        const target = halted ? 0 : direction * settings.speed * 60;
        velocity += (target - velocity) * (1 - Math.exp(-dt * 3));
        const step = velocity * dt;
        if (Math.abs(step) > 0.0001) {
          offset = wrapOffset(offset + step, spacing);
          applyOffset();
        }
      }
      raf = requestAnimationFrame(tick);
    };

    const wake = () => {
      if (!destroyed && !raf && onScreen) {
        last = 0;
        raf = requestAnimationFrame(tick);
      }
    };

    const onPointerDown = (e) => {
      if (!settings.interactive || !spacing) return;
      if (e.pointerType === "mouse" && e.button !== 0) return;
      const rect = svg.getBoundingClientRect();
      drag.active = true;
      drag.x = e.clientX;
      drag.time = performance.now();
      drag.scale = VIEW_WIDTH / (rect.width || VIEW_WIDTH);
      drag.velocity = 0;
      velocity = 0;
      jacket.style.cursor = "grabbing";
      jacket.setPointerCapture?.(e.pointerId);
    };

    const onPointerMove = (e) => {
      if (!drag.active) return;
      const now = performance.now();
      const delta = (e.clientX - drag.x) * drag.scale;
      const dt = Math.max(now - drag.time, 1) / 1000;
      drag.x = e.clientX;
      drag.time = now;
      drag.velocity = drag.velocity * 0.5 + (delta / dt) * 0.5;
      offset = wrapOffset(offset + delta, spacing);
      applyOffset();
    };

    const endDrag = () => {
      if (!drag.active) return;
      drag.active = false;
      jacket.style.cursor = settings.interactive ? "grab" : "auto";
      const fling =
        performance.now() - drag.time > 100
          ? 0
          : Math.max(-MAX_FLING, Math.min(MAX_FLING, drag.velocity));
      velocity = fling;
      if (Math.abs(fling) > 60) direction = fling > 0 ? 1 : -1;
    };

    jacket.addEventListener("pointerdown", onPointerDown);
    jacket.addEventListener("pointermove", onPointerMove);
    jacket.addEventListener("pointerup", endDrag);
    jacket.addEventListener("pointercancel", endDrag);
    jacket.addEventListener("pointerenter", () => {
      hovering = true;
    });
    jacket.addEventListener("pointerleave", () => {
      hovering = false;
      endDrag();
    });

    const fontsReady = document.fonts?.ready?.then(measureNow).catch(() => {});
    measureNow();
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(measureNow) : null;
    ro?.observe(svg);

    const io =
      typeof IntersectionObserver !== "undefined"
        ? new IntersectionObserver((entries) => {
            onScreen = entries.some((entry) => entry.isIntersecting);
            if (onScreen) wake();
          })
        : null;
    io?.observe(jacket);
    wake();

    return {
      destroy() {
        destroyed = true;
        cancelAnimationFrame(raf);
        ro?.disconnect();
        io?.disconnect();
        jacket.remove();
      }
    };
  }

  global.mountCurvedLoop = mountCurvedLoop;
})(typeof window !== "undefined" ? window : globalThis);
