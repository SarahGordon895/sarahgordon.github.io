/**
 * FitStage — keep the desktop layout on every device.
 * TechMorah Solution LTD (https://techmorahsolutionltd.org)
 *
 * Default mode "canvas": the page is laid out at the PC design width,
 * then scaled to the phone/tablet screen so placement matches the computer.
 * Optional mode "reflow": classic stacked mobile layout.
 */
(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.FitStage = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  var STORAGE = "fitstage-mode";
  var DEFAULTS = {
    design: 1280,
    minScale: 0.28,
    maxScale: 1,
    mode: "canvas",
    labelCanvas: "PC layout",
    labelReflow: "Readable",
    hint: "Same placement as desktop"
  };

  function cfgFromScript() {
    var script = document.currentScript;
    var out = {};
    if (!script) return out;
    if (script.getAttribute("data-design")) out.design = parseInt(script.getAttribute("data-design"), 10);
    if (script.getAttribute("data-min-scale")) out.minScale = parseFloat(script.getAttribute("data-min-scale"));
    if (script.getAttribute("data-mode")) out.mode = script.getAttribute("data-mode");
    if (script.getAttribute("data-label-canvas")) out.labelCanvas = script.getAttribute("data-label-canvas");
    if (script.getAttribute("data-label-reflow")) out.labelReflow = script.getAttribute("data-label-reflow");
    return out;
  }

  function merge(a, b) {
    var o = {};
    var k;
    for (k in DEFAULTS) o[k] = DEFAULTS[k];
    for (k in a) if (a[k] != null) o[k] = a[k];
    for (k in b) if (b[k] != null) o[k] = b[k];
    return o;
  }

  function viewportMeta() {
    var meta = document.querySelector('meta[name="viewport"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "viewport");
      document.head.insertBefore(meta, document.head.firstChild);
    }
    if (!meta.getAttribute("data-fitstage-origin")) {
      meta.setAttribute("data-fitstage-origin", meta.getAttribute("content") || "width=device-width, initial-scale=1");
    }
    return meta;
  }

  function screenCssWidth() {
    var w = window.screen && window.screen.width ? window.screen.width : 0;
    var iw = window.innerWidth || w;
    if (!w) return iw;
    return Math.min(w, iw) || w;
  }

  function storedMode(fallback) {
    try {
      var v = localStorage.getItem(STORAGE);
      if (v === "canvas" || v === "reflow") return v;
    } catch (e) {}
    return fallback;
  }

  function storeMode(mode) {
    try {
      localStorage.setItem(STORAGE, mode);
    } catch (e) {}
  }

  function applyViewport(opts) {
    var meta = viewportMeta();
    var mode = storedMode(opts.mode);
    var html = document.documentElement;
    html.setAttribute("data-fitstage", mode);
    html.classList.toggle("fitstage-canvas", mode === "canvas");
    html.classList.toggle("fitstage-reflow", mode === "reflow");

    if (mode !== "canvas") {
      meta.setAttribute("content", meta.getAttribute("data-fitstage-origin"));
      html.style.removeProperty("--fitstage-scale");
      html.style.removeProperty("--fitstage-ui");
      return { mode: mode, scale: 1, active: false };
    }

    var view = screenCssWidth();
    if (view >= opts.design) {
      meta.setAttribute("content", meta.getAttribute("data-fitstage-origin"));
      html.style.removeProperty("--fitstage-scale");
      html.style.removeProperty("--fitstage-ui");
      html.classList.remove("fitstage-canvas");
      return { mode: mode, scale: 1, active: false };
    }

    var scale = Math.max(opts.minScale, Math.min(opts.maxScale, view / opts.design));
    html.style.setProperty("--fitstage-scale", String(scale));
    html.style.setProperty("--fitstage-ui", String(1 / scale));
    meta.setAttribute(
      "content",
      "width=" +
        opts.design +
        ", initial-scale=" +
        scale.toFixed(4) +
        ", minimum-scale=" +
        opts.minScale +
        ", maximum-scale=5, user-scalable=yes, viewport-fit=cover"
    );
    return { mode: mode, scale: scale, active: true };
  }

  function injectCss() {
    if (document.getElementById("fitstage-css")) return;
    var css = document.createElement("style");
    css.id = "fitstage-css";
    css.textContent =
      ".fitstage-dock{position:fixed;z-index:2147483000;left:calc(12px * var(--fitstage-ui,1));bottom:calc(12px * var(--fitstage-ui,1));display:flex;gap:6px;align-items:center;padding:6px;border-radius:999px;background:rgba(5,10,24,.92);color:#fff;border:1px solid rgba(255,255,255,.18);box-shadow:0 10px 28px rgba(5,10,24,.35);font:600 12px/1.2 system-ui,-apple-system,Segoe UI,sans-serif;transform:scale(var(--fitstage-ui,1));transform-origin:bottom left}" +
      ".fitstage-dock[hidden]{display:none!important}" +
      ".fitstage-dock button{appearance:none;border:0;border-radius:999px;padding:8px 12px;min-height:36px;background:transparent;color:rgba(255,255,255,.78);font:inherit;cursor:pointer}" +
      ".fitstage-dock button.is-on{background:#00aeef;color:#041018}" +
      ".fitstage-dock__hint{display:none;padding:0 8px 0 4px;color:rgba(255,255,255,.55);font-weight:500;white-space:nowrap}" +
      "@media (min-width:720px){.fitstage-dock__hint{display:inline}}";
    document.head.appendChild(css);
  }

  function mountDock(opts, state) {
    if (document.getElementById("fitstage-dock")) return;
    injectCss();
    var dock = document.createElement("div");
    dock.id = "fitstage-dock";
    dock.className = "fitstage-dock";
    dock.setAttribute("data-fitstage-chrome", "true");
    dock.innerHTML =
      '<button type="button" data-mode="canvas">' +
      opts.labelCanvas +
      "</button>" +
      '<button type="button" data-mode="reflow">' +
      opts.labelReflow +
      "</button>" +
      '<span class="fitstage-dock__hint">' +
      opts.hint +
      "</span>";
    document.body.appendChild(dock);

    function paint() {
      var mode = storedMode(opts.mode);
      var buttons = dock.querySelectorAll("button");
      for (var i = 0; i < buttons.length; i++) {
        buttons[i].classList.toggle("is-on", buttons[i].getAttribute("data-mode") === mode);
      }
      dock.hidden = screenCssWidth() >= opts.design && mode === "canvas";
    }

    dock.addEventListener("click", function (e) {
      var btn = e.target.closest("button[data-mode]");
      if (!btn) return;
      var next = btn.getAttribute("data-mode");
      storeMode(next);
      applyViewport(opts);
      paint();
      window.location.reload();
    });

    paint();
    if (!state.active && storedMode(opts.mode) === "canvas") dock.hidden = true;
  }

  function boot(user) {
    var opts = merge(cfgFromScript(), user || {});
    var state = applyViewport(opts);
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", function () {
        mountDock(opts, state);
      });
    } else {
      mountDock(opts, state);
    }
    window.addEventListener("orientationchange", function () {
      setTimeout(function () {
        applyViewport(opts);
        window.location.reload();
      }, 250);
    });
    return state;
  }

  var auto = boot();

  return {
    boot: boot,
    apply: applyViewport,
    defaults: DEFAULTS,
    state: auto
  };
});
