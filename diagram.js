/* Arbaaz's Diagram — SVG wiring diagram renderer */

const KIND_COLORS = {
  ecu: "#2c3f63", battery: "#5b3f8c", ground: "#3a4150", igswitch: "#8c6d3b",
  abs: "#7a2e2e", airbag: "#8a6d1f", fuel: "#2e6b4f", sensor: "#2f6b8c",
  relay: "#5d6472", bcm: "#4c3a8c", module: "#3a5068",
};

const GAUGE_WIDTH = { "0.25": 0.8, "0.5": 1.3, "0.75": 1.9, "1.0": 2.6 };

let currentDiagram = null;
let currentContainer = null;
let selectedId = null;

function pinPos(ep) {
  if (typeof ep !== "string") return null;
  const idx = ep.lastIndexOf(":");
  const cid = ep.slice(0, idx);
  const pk = ep.slice(idx + 1);
  const pins = (currentDiagram && currentDiagram.pins) || {};
  const p = pins[cid] && pins[cid][pk];
  if (p) return p;
  const c = (currentDiagram && currentDiagram.components || []).find((x) => x.id === cid);
  return (c && c.pins && c.pins[pk]) || null;
}

function wireEndsOn(w, compId) {
  return w.from.split(":")[0] === compId || w.to.split(":")[0] === compId;
}

function renderDiagram(container, diagram) {
  currentDiagram = diagram;
  currentContainer = container;
  const NS = "http://www.w3.org/2000/svg";
  const w = diagram.canvas.w;
  const h = diagram.canvas.h;

  container.innerHTML = "";
  const svg = document.createElementNS(NS, "svg");
  svg.setAttribute("viewBox", "0 0 " + w + " " + h);
  svg.setAttribute("class", "diagram-svg");

  const defs = document.createElementNS(NS, "defs");
  const grid = document.createElementNS(NS, "pattern");
  grid.setAttribute("id", "adgrid");
  grid.setAttribute("width", "20");
  grid.setAttribute("height", "20");
  const gp = document.createElementNS(NS, "path");
  gp.setAttribute("d", "M 20 0 L 0 0 0 20");
  gp.setAttribute("stroke", "#141b28");
  gp.setAttribute("stroke-width", "1");
  grid.appendChild(gp);
  defs.appendChild(grid);
  svg.appendChild(defs);

  const bg = document.createElementNS(NS, "rect");
  bg.setAttribute("x", "0"); bg.setAttribute("y", "0");
  bg.setAttribute("width", String(w)); bg.setAttribute("height", String(h));
  bg.setAttribute("fill", "#0d121a");
  svg.appendChild(bg);

  const wiresG = document.createElementNS(NS, "g");
  wiresG.setAttribute("class", "wires");
  svg.appendChild(wiresG);

  const compsG = document.createElementNS(NS, "g");
  compsG.setAttribute("class", "comps");
  svg.appendChild(compsG);

  diagram.wires.forEach((w) => {
    const a = pinPos(w.from);
    const b = pinPos(w.to);
    const color = wireByCode(w.code).hex;
    const line = document.createElementNS(NS, "line");
    line.setAttribute("x1", String(a.x)); line.setAttribute("y1", String(a.y));
    line.setAttribute("x2", String(b.x)); line.setAttribute("y2", String(b.y));
    line.setAttribute("class", "wire-line" + (selectedId && wireEndsOn(w, selectedId) ? " hot" : ""));
    line.setAttribute("stroke", color);
    line.setAttribute("stroke-width", String(GAUGE_WIDTH[w.gauge] || 1.3));
    line.setAttribute("stroke-linecap", "round");
    wiresG.appendChild(line);
  });

  diagram.components.forEach((c) => {
    const g = document.createElementNS(NS, "g");
    g.setAttribute("class", "comp" + (c.id === selectedId ? " selected" : ""));
    g.setAttribute("data-comp", c.id);

    const rect = document.createElementNS(NS, "rect");
    rect.setAttribute("x", String(c.x)); rect.setAttribute("y", String(c.y));
    rect.setAttribute("width", String(c.w)); rect.setAttribute("height", String(c.h));
    rect.setAttribute("rx", "8");
    rect.setAttribute("class", "comp-rect");
    rect.setAttribute("fill", KIND_COLORS[c.kind] || "#232c3e");
    rect.setAttribute("stroke", c.id === selectedId ? "#ffb020" : "#3a4a66");
    rect.setAttribute("stroke-width", c.id === selectedId ? "2" : "1.5");
    g.appendChild(rect);

    const label = document.createElementNS(NS, "text");
    label.setAttribute("x", String(c.x + c.w / 2));
    label.setAttribute("y", String(c.y + c.h / 2 + 4));
    label.setAttribute("class", "comp-label");
    label.textContent = c.name;
    g.appendChild(label);

    const sub = document.createElementNS(NS, "text");
    sub.setAttribute("x", String(c.x + c.w / 2));
    sub.setAttribute("y", String(c.y + c.h / 2 + 17));
    sub.setAttribute("class", "comp-sub");
    sub.textContent = c.sub || "";
    g.appendChild(sub);

    if (c.id === selectedId) {
      const pins = diagram.pins || {};
      Object.keys(pins[c.id] || {}).forEach((pk) => {
        const p = pins[c.id][pk];
        const dot = document.createElementNS(NS, "circle");
        dot.setAttribute("cx", String(p.x)); dot.setAttribute("cy", String(p.y));
        dot.setAttribute("r", "3.4"); dot.setAttribute("class", "pin-dot");
        g.appendChild(dot);
      });
    }

    compsG.appendChild(g);
  });

  container.appendChild(svg);
}

function selectComponent(id) {
  if (!currentDiagram) return;
  selectedId = id;
  if (currentContainer) renderDiagram(currentContainer, currentDiagram);
  document.querySelectorAll("#view [data-comp].comp-item").forEach((el) => {
    el.classList.toggle("active", el.getAttribute("data-comp") === id);
  });
}

function clearSelection() { selectedId = null; if (currentContainer) renderDiagram(currentContainer, currentDiagram); }

function selectedComponent() {
  if (!currentDiagram) return null;
  return currentDiagram.components.find((c) => c.id === selectedId) || null;
}

function legendFor(diagram) {
  const seen = [];
  (diagram.wires || []).forEach((w) => {
    const col = wireByCode(w.code);
    if (!seen.some((s) => s.code === col.code)) seen.push(col);
  });
  return seen;
}

function gaugeWidthValue(gauge) { return GAUGE_WIDTH[gauge] || 1.3; }
