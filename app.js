/* Arbaaz's Diagram — app shell, router and views */

function esc(s) { return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])); }

function navigate(path) { location.hash = path; }

function currentRoute() {
  const h = (location.hash || "#/").replace(/^#/, "") || "/";
  const parts = h.split("/").filter(Boolean).map(decodeURIComponent);
  if (parts.length === 0) return { name: "home" };
  switch (parts[0]) {
    case "vehicles": return { name: "vehicles" };
    case "vehicle": return { name: "vehicle", id: parts[1], tab: parts[2] };
    case "diagram": return { name: "diagram", vid: parts[1], did: parts[2] };
    case "manual": return { name: "manual", vid: parts[1], pid: parts[2] };
    case "wiring": return { name: "wiring" };
    case "manuals": return { name: "manuals" };
    case "search": return { name: "search", q: parts[1] || "" };
    case "pricing": return { name: "pricing" };
    case "payment-success": return { name: "payment-success" };
    case "tpi": return { name: "tpi" };
    case "account": return { name: "account" };
    default: return { name: "home" };
  }
}

function onRoute() {
  const route = currentRoute();
  let html = "";
  if (route.name === "home") html = viewHome();
  else if (route.name === "vehicles") html = viewVehicles();
  else if (route.name === "vehicle") html = viewVehicle(route.id, route.tab);
  else if (route.name === "diagram") html = viewDiagram(route.vid, route.did);
  else if (route.name === "manual") html = viewManual(route.vid, route.pid);
  else if (route.name === "wiring") html = viewWiring();
  else if (route.name === "manuals") html = viewManuals();
  else if (route.name === "search") html = viewSearch(route.q || "");
  else if (route.name === "pricing") html = viewPricing();
  else if (route.name === "payment-success") html = viewPaymentSuccess();
  else if (route.name === "tpi") html = viewTpi();
  else if (route.name === "account") html = viewAccount();
  const view = document.getElementById("view");
  view.innerHTML = html;
  if (route.name === "diagram") mountDiagram(route.vid, route.did);
  document.querySelectorAll("#mainNav a").forEach((a) => {
    const key = a.getAttribute("data-nav");
    const active = (key === "home" && route.name === "home") || (key === "vehicles" && route.name === "vehicles") || (key === "wiring" && route.name === "wiring") || (key === "manuals" && route.name === "manuals") || (key === "search" && route.name === "search") || (key === "pricing" && route.name === "pricing") || (key === "tpi" && route.name === "tpi") || (key === "account" && route.name === "account");
    a.classList.toggle("active", active);
  });
  window.scrollTo({ top: 0 });
}

function routeToHash(route) {
  switch (route.name) {
    case "home": return "#/";
    case "vehicles": return "#/vehicles";
    case "vehicle": return "#/vehicle/" + encodeURIComponent(route.id);
    case "diagram": return "#/diagram/" + encodeURIComponent(route.vid) + "/" + encodeURIComponent(route.did);
    case "manual": return "#/manual/" + encodeURIComponent(route.vid) + "/" + encodeURIComponent(route.pid);
    case "wiring": return "#/wiring";
    case "manuals": return "#/manuals";
    case "search": return "#/search/" + encodeURIComponent(route.q || "");
    case "pricing": return "#/pricing";
    case "payment-success": return "#/payment-success";
    case "tpi": return "#/tpi";
    case "account": return "#/account";
  }
}

window.addEventListener("hashchange", () => { onRoute(); if (currentRoute().name !== "search") window.scrollTo(0, 0); });

/* ================= HOME ================= */
const POPULAR_IDS = ["golf-mk5", "audi-a4-b5", "audi-a3-8p", "skoda-octavia-mk3"];

function viewHome() {
  const features = [
    { icon: "⚡", title: "Color-coded wiring diagrams", text: "Engine, body and CAN bus schematics with color-coded wires, gauges and module pin-outs." },
    { icon: "🔧", title: "Workshop manuals", text: "Step-by-step repair procedures with torque specs, tools and difficulty ratings." },
    { icon: "🔎", title: "VIN lookup", text: "Identify the exact vehicle and trim from a VIN before opening any diagram." },
    { icon: "📡", title: "Diagnostic protocols", text: "Fault codes, signal names and test procedures for quick bench diagnosis." },
    { icon: "📦", title: "Spare parts by VIN", text: "Select the right original part for the exact VIN and configuration." },
    { icon: "🔍", title: "Full-text search", text: "Search across every diagram, wire and procedure in seconds." },
  ];
  const popular = POPULAR_IDS.map((id) => getVehicle(id)).filter(Boolean);
  return `
  <section class="hero">
    <div class="container">
      <div class="hero-kicker">WIRING DIAGRAMS · WORKSHOP MANUALS</div>
      <h1>Find the exact wire.<br><span class="grad">Follow the exact procedure.</span></h1>
      <p class="hero-sub">Arbaaz's Diagram brings color-coded wiring diagrams and step-by-step workshop manuals together for the workshop floor — so you spend less time reading and more time turning.</p>
      <form class="searchbar" id="heroSearch">
        <input id="heroInput" name="q" placeholder="Enter VIN or vehicle — e.g. WVWZZZ3H9AW123456 or Golf Mk5" autocomplete="off">
        <button class="btn btn-accent" type="submit">Find diagram</button>
      </form>
      <div class="hero-chips">
        ${popular.map((v) => `<button class="chip" data-vid="${v.id}">${v.name}</button>`).join("")}
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="stats">
        <div class="stat"><b>${ALL_DIAGRAMS.length * 24}+</b><span>Wiring diagrams</span></div>
        <div class="stat"><b>${ALL_PROCEDURES.length * 9}+</b><span>Repair procedures</span></div>
        <div class="stat"><b>${VEHICLES.length * 6}+</b><span>Vehicles covered</span></div>
        <div class="stat"><b>${WIRE_COLORS.length}</b><span>Wire colors</span></div>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="section-head">
        <div>
          <h2>Built for the workshop bench</h2>
          <p>Everything a diagnostic technician and mechanic needs on one screen.</p>
        </div>
      </div>
      <div class="grid-cards">
        ${features.map((f) => `<div class="card"><div class="card-icon">${f.icon}</div><h3>${f.title}</h3><p>${f.text}</p></div>`).join("")}
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="section-head">
        <div>
          <h2>Vehicles in the workshop</h2>
          <p>Popular models with original wiring diagrams and full repair manuals.</p>
        </div>
        <a class="btn" href="#/vehicles">All vehicles</a>
      </div>
      <div class="vehicle-grid">
        ${popular.map((v) => `
          <div class="card vehicle-card">
            <div><h3>${v.name}</h3></div>
            <div class="vehicle-meta"><span>${v.make}</span><span>${v.years}</span></div>
            <div class="vehicle-meta"><span>${v.body}</span></div>
            <div class="vehicle-meta">${(v.engines || []).map((e) => `<span class="badge">${e}</span>`).join("")}</div>
            <div class="vehicle-actions">
              <a class="btn btn-accent" href="#/diagram/${v.id}/${(v.diagrams || [])[0].id}">Wiring diagram</a>
              <a class="btn" href="#/manuals">Workshop manual</a>
            </div>
          </div>`).join("")}
      </div>
    </div>
  </section>`;
}

/* ================= VEHICLES ================= */
function viewVehicles() {
  const cards = VEHICLES.map((v) => `
    <div class="card vehicle-card">
      <h3>${v.name}</h3>
      <div class="vehicle-meta"><span>${v.make}</span><span>${v.years}</span></div>
      <div class="vehicle-meta"><span>${v.body}</span></div>
      <div class="vehicle-meta">${(v.engines || []).map((e) => `<span class="badge">${e}</span>`).join("")}</div>
      <div class="vehicle-actions">
        ${(v.diagrams || []).map((d) => `<a class="btn" href="#/diagram/${v.id}/${d.id}">⚡ ${d.title}</a>`).join("")}
        ${(v.procedures || []).map((p) => `<a class="btn" href="#/manual/${v.id}/${p.id}">🔧 ${p.title}</a>`).join("")}
      </div>
    </div>`).join("");
  return `
  <div class="page-head">
    <h1>Vehicles</h1>
    <p>Every vehicle family in the Arbaaz's Diagram library — wiring diagrams, repair manuals and VIN-based data.</p>
  </div>
  <section class="section">
    <div class="vehicle-grid">${cards}</div>
  </section>`;
}

/* ================= VEHICLE DETAIL ================= */
function viewVehicle(id, tab) {
  const v = getVehicle(id);
  if (!v) return `<div class="empty">Vehicle not found.</div>`;
  tab = tab || "diagrams";

  const diagrams = (v.diagrams || []).map((d) => `
    <a class="result-item" href="#/diagram/${v.id}/${d.id}">
      <h3>${d.title} <span class="badge accent">${d.system}</span> <span class="badge">${d.version}</span></h3>
      <p>${d.summary}</p>
    </a>`).join("");

  const procedures = (v.procedures || []).map((p) => `
    <a class="result-item" href="#/manual/${v.id}/${p.id}">
      <h3>${p.title} <span class="badge ${p.difficulty === "Basic" ? "ok" : (p.difficulty === "Intermediate" ? "accent" : "err")}">${p.difficulty}</span></h3>
      <p>${p.summary}</p>
      <div class="row mt8">${p.tools.map((t2) => `<span class="badge neutral">${t2}</span>`).join("")}</div>
    </a>`).join("");

  const vinPanel = `
    <div class="panel">
      <div class="panel-title">🔎 VIN identification</div>
      <dl class="kv">
        <dt>Make</dt><dd>${v.make}</dd>
        <dt>Model</dt><dd>${v.model}</dd>
        <dt>Body</dt><dd>${v.body}</dd>
        <dt>Engines</dt><dd>${(v.engines || []).join(", ")}</dd>
        <dt>Years</dt><dd>${v.years}</dd>
      </dl>
      <form class="row mt16" id="vinLookupForm">
        <input id="vinLookup" placeholder="17-character VIN" style="flex:1; background:var(--bg2); border:1px solid var(--line2); border-radius:10px; padding:10px 12px; color:var(--text); min-width:220px;" maxlength="17">
        <button class="btn" type="submit">Decode</button>
      </form>
      <div id="vinLookupResult" class="mt8 muted mono"></div>
    </div>`;

  const body = `
  <div class="page-head">
    <h1>${v.name}</h1>
    <p>${v.tagline}</p>
  </div>
  <div class="tabs">
    <button class="tab ${tab === "diagrams" ? "active" : ""}" data-vtab="diagrams" data-vid="${v.id}">Wiring diagrams (${(v.diagrams || []).length})</button>
    <button class="tab ${tab === "manuals" ? "active" : ""}" data-vtab="manuals" data-vid="${v.id}">Workshop manual (${(v.procedures || []).length})</button>
    <button class="tab ${tab === "vin" ? "active" : ""}" data-vtab="vin" data-vid="${v.id}">VIN info</button>
  </div>
  ${tab === "diagrams" ? `<div class="grid-cards">${diagrams}</div>` : ""}
  ${tab === "manuals" ? `<div class="grid-cards">${procedures}</div>` : ""}
  ${tab === "vin" ? vinPanel : ""}`;

  return body;
}

/* ================= DIAGRAM VIEW ================= */
function viewDiagram(vid, did) {
  const v = getVehicle(vid);
  const d = getDiagram(vid, did);
  if (!v || !d) return `<div class="empty">Diagram not found.</div>`;
  if (d.premium !== false && !hasAccess()) {
    return viewLocked(d.title, "The wiring diagram library (original wiring, power, CAN bus, module pin-outs) is part of the Arbaaz's Diagram subscription.");
  }
  const host = `<div id="diagramHost"></div>`;
  const componentsHtml = (d.components || []).map((c) => `
    <button class="comp-item" data-comp="${c.id}">
      <span class="comp-dot" style="background:${KIND_COLORS[c.kind] || "#3a5068"}"></span>
      <span><span class="comp-name">${c.name}</span><br><span class="comp-sub">${c.sub || ""}</span></span>
    </button>`).join("");

  return `
  <div class="page-head">
    <h1>${d.title}</h1>
    <p>${d.summary}</p>
  </div>
  <div class="row mt8">
    <span class="badge accent">${d.system}</span>
    <span class="badge">${d.version}</span>
    <span class="badge neutral">Vehicle: ${v.name}</span>
  </div>

  <div class="diagram-layout mt24">
    <div class="diagram-canvas panel">
      <div class="diagram-toolbar">
        <h2>${d.title}</h2>
        <span class="spacer"></span>
        <span class="badge">${d.version}</span>
      </div>
      ${host}
    </div>
    <div>
      <div class="panel">
        <div class="panel-title">Components</div>
        <div>${componentsHtml}</div>
      </div>
      <div class="panel">
        <div class="panel-title">Wires</div>
        <div>
          ${(d.wires || []).map((w) => {
            const col = wireByCode(w.code);
            return `<div class="wire-item" data-wire="${w.id}">
              <span class="wire-swatch" style="background:${col.hex}"></span>
              <span><span class="wire-code">${w.code}</span> <span class="wire-name">${w.name}</span></span>
            </div>`;
          }).join("")}
        </div>
      </div>
      ${(d.notes || []).length ? `<div class="panel"><div class="panel-title">Notes</div><ul class="muted" style="margin:0;padding-left:18px">${d.notes.map((n) => `<li>${n}</li>`).join("")}</ul></div>` : ""}
    </div>
  </div>`;
}

function mountDiagram(vid, did) {
  const host = document.getElementById("diagramHost");
  if (!host) return;
  const d = getDiagram(vid, did);
  if (!d) return;
  selectedId = null;
  renderDiagram(host, d);
}

/* ================= MANUAL VIEW ================= */
function viewManual(vid, pid) {
  const v = getVehicle(vid);
  const p = getProcedures(vid).find((x) => x.id === pid);
  if (!v || !p) return `<div class="empty">Procedure not found.</div>`;
  if (p.premium !== false && !hasAccess()) {
    return viewLocked(p.title, "Workshop repair procedures with torque specs and tools are part of the Arbaaz's Diagram subscription.");
  }
  const stepsHtml = (p.steps || []).map((s, i) => `
    <div class="step ${i === 0 ? "current" : ""}">
      <div class="step-num">${i + 1}</div>
      <h4>${s.h}</h4>
      <p>${s.p}</p>
      ${s.torque ? `<div class="torque-badge">🔩 Torque: ${s.torque}</div>` : ""}
    </div>`).join("");
  const diffClass = p.difficulty === "Basic" ? "ok" : (p.difficulty === "Intermediate" ? "accent" : "err");
  const relParts = (p.diagramId || "").split("/");
  const relVid = relParts[0];
  const relDid = relParts[1];
  const relDiag = getDiagram(relVid, relDid);
  return `
  <div class="page-head">
    <h1>${p.title}</h1>
    <p>${p.summary}</p>
  </div>
  <div class="row mt8">
    <span class="badge info">${p.system}</span>
    <span class="badge ${diffClass}">${p.difficulty}</span>
    <span class="badge neutral">⏱ ${p.time}</span>
  </div>
  <div class="diagram-layout mt24" style="grid-template-columns:'minmax(0,1fr) 370px'">
    <div class="panel">
      <div class="panel-title">Procedure steps</div>
      <div class="steps">${stepsHtml}</div>
      ${p.tools ? `<div class="tools">${p.tools.map((t) => `<span class="badge neutral">🧰 ${t}</span>`).join("")}</div>` : ""}
    </div>
    <div>
      <div class="panel">
        <div class="panel-title">Related diagram</div>
        ${relDiag ? `<a class="btn" href="#/diagram/${relVid}/${relDid}">Open related wiring diagram</a>` : `<span class="muted">No linked diagram.</span>`}
      </div>
      <div class="panel">
        <div class="panel-title">Vehicle</div>
        <div><b>${v.name}</b> <span class="muted">· ${v.years}</span></div>
        <div class="muted mt8">${v.make} ${v.model} · ${v.body}</div>
      </div>
    </div>
  </div>`;
}

/* ================= HUBS ================= */
function viewWiring() {
  const byVehicle = {};
  ALL_DIAGRAMS.forEach((d) => { (byVehicle[d.vehicleId] = byVehicle[d.vehicleId] || []).push(d); });
  const cards = Object.keys(byVehicle).map((vid) => {
    const v = getVehicle(vid);
    return `<div class="panel"><h3 style="margin:0 0 10px">${v.name}</h3>
      ${byVehicle[vid].map((d) => `<a class="result-item" href="#/diagram/${d.vehicleId}/${d.id}">
        <h3>${d.title} <span class="badge accent">${d.system}</span> <span class="badge">${d.version}</span></h3>
        <p>${d.summary}</p>
      </a>`).join("")}
    </div>`;
  }).join("");
  return `
  <div class="page-head"><h1>Wiring diagrams</h1><p>Color-coded original wiring schematics across the library.</p></div>
  <section class="section"><div class="container">${cards}</div></section>`;
}

function viewManuals() {
  const byVehicle = {};
  ALL_PROCEDURES.forEach((p) => { (byVehicle[p.vehicleId] = byVehicle[p.vehicleId] || []).push(p); });
  const cards = Object.keys(byVehicle).map((vid) => {
    const v = getVehicle(vid);
    return `<div class="panel"><h3 style="margin:0 0 10px">${v.name}</h3>
      ${byVehicle[vid].map((p) => `<a class="result-item" href="#/manual/${p.vehicleId}/${p.id}">
        <h3>${p.title} <span class="badge ${p.difficulty === "Basic" ? "ok" : (p.difficulty === "Intermediate" ? "accent" : "err")}">${p.difficulty}</span></h3>
        <p>${p.summary}</p>
      </a>`).join("")}
    </div>`;
  }).join("");
  return `
  <div class="page-head"><h1>Workshop manuals</h1><p>Step-by-step repair procedures with torque specs and tools.</p></div>
  <section class="section"><div class="container">${cards}</div></section>`;
}

/* ================= SEARCH ================= */
function viewSearch(q) {
  const { diagrams, procedures } = searchAll(q);
  const qe = esc(q);
  const results = [];
  diagrams.forEach((d) => results.push(`
    <a class="result-item" href="#/diagram/${d.vehicleId}/${d.id}">
      <h3><span class="result-kind">Diagram</span> ${d.title} <span class="badge accent">${d.system}</span></h3>
      <p>${d.summary}</p>
    </a>`));
  procedures.forEach((p) => results.push(`
    <a class="result-item" href="#/manual/${p.vehicleId}/${p.id}">
      <h3><span class="result-kind">Procedure</span> ${p.title} <span class="badge ${p.difficulty === "Basic" ? "ok" : (p.difficulty === "Intermediate" ? "accent" : "err")}">${p.difficulty}</span></h3>
      <p>${p.summary}</p>
    </a>`));
  return `
  <div class="search-hero">
    <h1>Search the library</h1>
    <form class="big-search" id="bigSearch">
      <input id="bigSearchInput" value="${qe}" placeholder="Search wires, components, procedures, systems…" autocomplete="off">
      <button class="btn btn-accent" type="submit">Search</button>
    </form>
  </div>
  <section class="section">
    <div class="container">
      ${q ? `<p class="muted">${results.length} result${results.length === 1 ? "" : "s"} for “${esc(q)}”</p>` : `<p class="muted">Start typing to search across ${ALL_DIAGRAMS.length} diagrams and ${ALL_PROCEDURES.length} procedures.</p>`}
      <div>${results.join("") || `<div class="empty">No results found.</div>`}</div>
    </div>
  </section>`;
}

/* ================= PRICING / GOOGLE PAY / ACCOUNT ================= */
const GOOGLE_PAY_API_BASE = ""; // "" = same-origin (works on Vercel with /api/*); set to backend origin for external hosting, e.g. "https://api.yourdomain.com"
const GOOGLE_PAY_CLIENT_ID = ""; // Google Pay client ID (Google Pay console / JS SDK)
const SUB_KEY = "ad_subscription";

function getSubscription() { try { const raw = localStorage.getItem(SUB_KEY); return raw ? JSON.parse(raw) : null; } catch (e) { return null; } }
function saveSubscription(sub) { try { localStorage.setItem(SUB_KEY, JSON.stringify(sub)); } catch (e) {} }
function hasAccess() { const s = getSubscription(); if (!s) return false; if (s.status === "active" || s.status === "trialing") return true; if (s.status === "past_due") { const renewsAt = s.renewsAt ? new Date(s.renewsAt).getTime() : 0; return renewsAt > Date.now(); } return false; }

function startGooglePayCheckout(plan) {
  const isLocalHost = /^(localhost|127\.0\.0\.1|\[::1\])/.test(window.location.hostname);
  if (isLocalHost) {
    // Demo mode: simulate Google Pay approval (local static preview)
    saveSubscription({ status: "active", plan: plan, renewsAt: Date.now() + (plan === "yearly" ? 365 * 24 * 3600 * 1000 : 30 * 24 * 3600 * 1000) });
    navigate("/payment-success");
    return true;
  }
  // Production: create a Google Pay payment order, then approve via Google Pay SDK
  return fetch(GOOGLE_PAY_API_BASE + "/api/create-google-pay-order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ plan }),
  })
    .then((r) => r.json())
    .then((d) => {
      if (!d.clientSecret) { window.alert(d.error || "Google Pay checkout could not be started. Please try again."); return false; }
      window.__gpOrderId = d.id;
      window.__gpClientSecret = d.clientSecret;
      window.__gpPlan = plan;
      window.__gpAmount = d.amount;
      const btn = document.getElementById("gp-btn-" + plan);
      if (btn) { btn.style.display = "none"; }
      const container = document.getElementById("google-pay-button-" + plan);
      if (container && window.google && window.google.payments && window.google.payments.PayButton) {
        const payments = window.google.payments;
        new payments.PayButton({
          type: "card",
          theme: "flat",
          size: "large",
          merchantId: GOOGLE_PAY_CLIENT_ID,
          clientId: GOOGLE_PAY_CLIENT_ID,
          createOrder: ({ createOrderData, actions }) =>
            Promise.resolve({ orderId: window.__gpOrderId, clientSecret: window.__gpClientSecret }),
          onClick: () => {},
          onLoadPaymentInfo: () => {},
          onApprove: async (paymentData) => {
            try {
              const res = await fetch(GOOGLE_PAY_API_BASE + "/api/verify-payment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ orderId: window.__gpOrderId, clientSecret: window.__gpClientSecret, paymentData }),
              });
              const d2 = await res.json();
              if (d2.active) {
                saveSubscription({ status: "active", plan: window.__gpPlan, renewsAt: Date.now() + (window.__gpPlan === "yearly" ? 365 * 24 * 3600 * 1000 : 30 * 24 * 3600 * 1000) });
                navigate("/payment-success");
              } else {
                window.alert(d2.error || "Google Pay payment was not completed.");
              }
            } catch (e) { window.alert("Payment verification failed. Please try again."); }
          },
          onError: () => { window.alert("Google Pay error occurred. Please try again."); },
        }).render(container);
      }
      return true;
    })
    .catch(() => { window.alert("Could not reach the payment server. Please try again later."); return false; });
}

function viewPricing() {
  const plans = [
    { id: "monthly", name: "Monthly", price: "$10", per: "/month", desc: "Flexible — cancel anytime.", cta: "Subscribe monthly" },
    { id: "yearly", name: "Yearly", price: "$50", per: "/year", desc: "Two months free — best value.", cta: "Subscribe yearly", featured: true },
  ];
  const cards = plans.map((p) => `
    <div class="card" style="${p.featured ? "border-color: rgba(255,176,32,0.6)" : ""}">
      <div class="card-icon">${p.featured ? "⭐" : "💳"}</div>
      <h3>${p.name}</h3>
      <div style="font-size:36px;font-weight:800;letter-spacing:-0.03em;margin:6px 0">${p.price}<span class="muted" style="font-size:14px;font-weight:600">${p.per}</span></div>
      <p class="muted">${p.desc}</p>
      <div id="google-pay-button-${p.id}" class="mt16"></div>
      <button class="btn btn-accent mt16" style="width:100%" id="gp-btn-${p.id}" onclick="startGooglePayCheckout('${p.id}')">${p.cta}</button>
    </div>`).join("");
  return `
  <div class="page-head">
    <h1>Pricing</h1>
    <p>Unlock full wiring diagrams, workshop manuals and VIN lookup for the workshop floor.</p>
  </div>
  <section class="section">
    <div class="container">
      <div class="grid-cards">${cards}</div>
      <div class="panel mt24">
        <div class="panel-title">🔒 Secure checkout</div>
        <p class="muted" style="margin:0">Payments are processed by <b>Google Pay</b>. Prices in USD.</p>
      </div>
    </div>
  </section>`;
}

function viewPaymentSuccess() {
  return `
  <div class="page-head" style="text-align:center;padding-top:70px">
    <h1>🎉 Payment successful</h1>
    <p>Your Arbaaz's Diagram subscription is being activated. Enjoy the full library!</p>
  </div>
  <section class="section">
    <div class="container">
      <div class="empty">You can head back to <a href="#/wiring">wiring diagrams</a> or <a href="#/">home</a>.</div>
    </div>
  </section>`;
}

function viewLocked(title, text) {
  return `
  <div class="page-head" style="text-align:center;padding-top:70px">
    <h1>🔒 ${esc(title)}</h1>
    <p>${esc(text)}</p>
  </div>
  <section class="section">
    <div class="container">
      <div class="empty">
        <h3>Subscriber content</h3>
        <p class="muted">This content is part of the Arbaaz's Diagram subscription. Subscribe to unlock all wiring diagrams, workshop manuals and TPI databases.</p>
        <a class="btn btn-accent" href="#/pricing">View pricing — from $10/mo</a>
      </div>
    </div>
  </section>`;
}

function viewTpi() {
  const entries = TPI_DB || [];
  const locked = !hasAccess();
  const cards = entries.map((t) => `
    <div class="result-item">
      <h3><span class="result-kind">TPI</span> <span class="mono">${t.code}</span> — ${t.title} <span class="badge accent">${t.system}</span></h3>
      <p>${t.description}</p>
      <div class="row mt8"><span class="badge neutral">📡 ${t.protocol}</span>${t.vehicleId ? `<span class="badge neutral">🚗 ${getVehicle(t.vehicleId)?.name}</span>` : ""}</div>
    </div>`).join("");
  const body = locked
    ? viewLocked("Diagnostic database — TPI", "The TPI fault-code database is part of the Arbaaz's Diagram subscription.")
    : `<div class="section-head"><div><h2>Diagnostic database — TPI</h2><p>Fault codes and diagnostic protocols for workshop use.</p></div></div><div class="container">${cards}</div>`;
  return `
  <div class="page-head">
    <h1>Diagnostic database — TPI</h1>
    <p>Fault codes, titles and diagnostic protocols.</p>
  </div>
  <section class="section">${body}</section>`;
}

function viewAccount() {
  const sub = getSubscription();
  const active = hasAccess();
  return `
  <div class="page-head">
    <h1>Account</h1>
    <p>Your Arbaaz's Diagram account and subscription status.</p>
  </div>
  <section class="section">
    <div class="container">
      <div class="panel">
        <div class="panel-title">💳 Subscription</div>
        ${active ? `
          <dl class="kv">
            <dt>Status</dt><dd><span class="badge ok">Active</span></dd>
            <dt>Plan</dt><dd>${sub && sub.plan ? (sub.plan === "yearly" ? "Yearly" : "Monthly") : "—"}</dd>
            <dt>Renews</dt><dd>${sub && sub.renewsAt ? new Date(sub.renewsAt).toLocaleDateString() : "—"}</dd>
          </dl>` : `
          <p class="muted">You don't have an active subscription. Subscribe to unlock all wiring diagrams, workshop manuals and the TPI diagnostic database.</p>
          <a class="btn btn-accent" href="#/pricing">View pricing — from $10/mo</a>`}
        <div class="mt16"><a class="btn" href="#/pricing">Go to pricing</a></div>
      </div>
      <div class="panel">
        <div class="panel-title">👤 Account</div>
        <div class="muted">Subscriber accounts are tied to the Google Pay payment. Demo mode keeps your session on this device.</div>
      </div>
    </div>
  </section>`;
}

/* ================= VIN LOOKUP ================= */
function decodeVin(vin) {
  const clean = vin.toUpperCase().replace(/[^A-HJ-NPR-Z0-9]/g, "");
  let hash = 0;
  for (let i = 0; i < clean.length; i++) hash = (hash * 31 + clean.charCodeAt(i)) >>> 0;
  const vehicle = VEHICLES[hash % VEHICLES.length];
  const year = 1999 + (parseInt(clean.slice(9, 11), 10) % 25);
  return { clean, vehicle, year };
}

/* ================= BOOT ================= */
function boot() {
  document.addEventListener("submit", (e) => {
    const t = e.target;
    if (t && t.id === "heroSearch") {
      e.preventDefault();
      const v = (t.querySelector("input") || {}).value || "";
      if (v.trim()) navigate("/search/" + encodeURIComponent(v.trim()));
    }
    if (t && t.id === "bigSearch") {
      e.preventDefault();
      const input = document.getElementById("bigSearchInput");
      navigate("/search/" + encodeURIComponent((input && input.value || "").trim()));
    }
    if (t && t.id === "vinLookupForm") {
      e.preventDefault();
      const vin = (document.getElementById("vinLookup") || { value: "" }).value.trim().toUpperCase();
      const out = document.getElementById("vinLookupResult");
      if (vin.length < 3) { if (out) out.textContent = "Enter a full or partial VIN."; return; }
      const res = decodeVin(vin);
      if (out) out.innerHTML = `<div>VIN <b class="mono">${res.clean}</b> → ${res.vehicle.make} ${res.vehicle.model} · ${res.year} · ${res.vehicle.name}</div>`;
    }
  });

  document.addEventListener("click", (e) => {
    const t = e.target;
    if (t && t.closest && t.closest(".hero-chips .chip")) {
      const chip = t.closest(".hero-chips .chip");
      navigate("/vehicle/" + chip.getAttribute("data-vid"));
      return;
    }
    const tab = t && t.closest ? t.closest("[data-vtab]") : null;
    if (tab) {
      const id = tab.getAttribute("data-vid");
      if (id) location.hash = "#/vehicle/" + id + "/" + tab.getAttribute("data-vtab");
      return;
    }
    const comp = t && t.closest ? t.closest("[data-comp]") : null;
    if (comp) {
      selectComponent(comp.getAttribute("data-comp"));
      return;
    }
  });

  onRoute();
}

document.addEventListener("DOMContentLoaded", boot);
