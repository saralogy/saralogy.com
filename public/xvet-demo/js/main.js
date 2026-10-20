import { createMap, REGION_COLORS } from "./map.js";
import { CLUSTERS } from "./data.js";
import { renderPlan } from "./plan.js";

const { gsap, ScrollTrigger, Lenis } = window;
gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const byId = Object.fromEntries(CLUSTERS.map((c) => [c.cluster_id, c]));
const fmt = (n) => Number(n).toLocaleString("en-US");
const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const t2 = (en, tr) => `<span class="en">${en}</span><span class="tr">${tr}</span>`;
const SVGNS = "http://www.w3.org/2000/svg";
const svgEl = (tag, attrs = {}) => {
  const e = document.createElementNS(SVGNS, tag);
  for (const k in attrs) e.setAttribute(k, attrs[k]);
  return e;
};

/* ------------------------------------------------------------------ language */
function setLang(lang) {
  document.documentElement.dataset.lang = lang;
  document.documentElement.lang = lang;
  $$("[data-set-lang]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.setLang === lang)));
  try { localStorage.setItem("xvet-vn-lang", lang); } catch (_) { /* storage blocked */ }
  ScrollTrigger.refresh();
}
$$("[data-set-lang]").forEach((b) => b.addEventListener("click", () => setLang(b.dataset.setLang)));
try {
  const saved = localStorage.getItem("xvet-vn-lang");
  if (saved === "tr" || saved === "en") document.documentElement.dataset.lang = saved;
} catch (_) { /* storage blocked */ }
$$("[data-set-lang]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.setLang === document.documentElement.dataset.lang)));
document.documentElement.lang = document.documentElement.dataset.lang;

/* ------------------------------------------------------------- data blocks */
const MONTHS_EN = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MONTHS_TR = ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"];
const heatWindow = (c) => {
  const m = c.heat_window_months.split(" ");
  return m.length === 12 ? t2("all year", "tüm yıl") : `${m[0]}–${m[m.length - 1]}`;
};

const REGIONS = [
  { idx: 1, id: "VN-1", en: "North · Red River Delta", tr: "Kuzey · Kızıl Nehir Deltası", lon: 105.4, lat: 21.2 },
  { idx: 2, id: "VN-4", en: "North-Central · Thanh Hóa–Nghệ An", tr: "Kuzey-Orta · Thanh Hóa–Nghệ An", lon: 105.6, lat: 18.9 },
  { idx: 3, id: null, en: "Central coast & Highlands", tr: "Orta kıyı ve Yaylalar", lon: 108.0, lat: 14.0 },
  { idx: 4, id: "VN-2", en: "Southeast · Đồng Nai–Bình Dương–Long An", tr: "Güneydoğu · Đồng Nai–Bình Dương–Long An", lon: 106.8, lat: 11.1 },
  { idx: 5, id: "VN-3", en: "Mekong Delta", tr: "Mekong Deltası", lon: 105.6, lat: 10.0 },
];

function regionCards() {
  const root = $("#region-cards");
  root.innerHTML = REGIONS.map((r) => {
    const c = r.id && byId[r.id];
    const color = REGION_COLORS[r.idx];
    if (!c) {
      return `<article class="rc" data-region="${r.idx}" style="--c:${color}">
        <header><i></i><b>${t2(r.en, r.tr)}</b><small>${r.idx}/5</small></header>
        <ul><li style="grid-column:1/-1">${t2("Not modelled yet. Next research wave.", "Henüz modellenmedi. Sonraki araştırma dalgası.")}</li></ul>
      </article>`;
    }
    return `<article class="rc" data-region="${r.idx}" style="--c:${color}">
      <header><i></i><b>${t2(r.en, r.tr)}</b><small>${r.idx}/5 · ${c.cluster_id}</small></header>
      <ul>
        <li>${t2("Heat", "Sıcak")}: <b>${fmt(c.hours_thi_ge28)} h</b></li>
        <li>${t2("When", "Ne zaman")}: <b>${heatWindow(c)}</b></li>
        <li>${t2("Humidity", "Nem")}: <b>${c.humidity_class.replace("_", " ")}</b></li>
        <li>${t2("Birds", "Kuş")}: <b>${c.poultry_focus}</b></li>
      </ul>
    </article>`;
  }).join("");
}

const METRICS = [
  { k: "score_heat_0to5", en: "Heat", tr: "Sıcak", c: "#ff2e6e" },
  { k: "score_agp_0to5", en: "AGP", tr: "AGP", c: "#8a6cff" },
  { k: "score_proof_0to5", en: "Proof", tr: "Kanıt", c: "#b6ff3b" },
  { k: "score_access_0to5", en: "Access", tr: "Erişim", c: "#00e0c6" },
  { k: "score_payment_0to5", en: "Pay", tr: "Ödeme", c: "#ffb000" },
  { k: "score_scale_0to5", en: "Scale", tr: "Ölçek", c: "#f4f1ea" },
];

function icpCompare() {
  const cards = [["VN-2", "#00e0c6", true], ["VN-3", "#b6ff3b", false]].map(([id, color, hero]) => {
    const c = byId[id];
    const name = id === "VN-2" ? t2("Southeast", "Güneydoğu") : t2("Mekong Delta", "Mekong Deltası");
    const line = id === "VN-2"
      ? t2("Biggest and hottest. Start here.", "En büyük ve en sıcak. Buradan başla.")
      : t2("Same heat, smaller. Step two.", "Aynı sıcak, daha küçük. İkinci adım.");
    return `<article class="icp ${hero ? "hero" : ""}" style="--c:${color}">
      <header><b>${c.cluster_id}</b><span>${name}</span><span class="tier">TIER ${c.tier}</span></header>
      <div class="score">${c.score_full_0to100}<small>/100 ${t2("ICP fit", "ICP uyumu")}</small></div>
      <div class="bars">${METRICS.map((m) => `<div><span style="--v:${c[m.k]};--bc:${m.c}"></span><label>${t2(m.en, m.tr)} ${c[m.k]}</label></div>`).join("")}</div>
      <p>${line}</p>
    </article>`;
  });
  $("#icp-compare").innerHTML = cards.join("");
}

function personaStats() {
  const c = byId["VN-2"];
  const rows = [
    [t2("Heat pain", "Sıcak sorunu"), c.score_heat_0to5, "#ff2e6e"],
    [t2("No-antibiotic push", "Antibiyotiksiz baskı"), c.score_agp_0to5, "#8a6cff"],
    [t2("Scale", "Ölçek"), c.score_scale_0to5, "#f4f1ea"],
    [t2("Reachable", "Ulaşılabilir"), c.score_access_0to5, "#00e0c6"],
    [t2("Pays on time", "Zamanında öder"), c.score_payment_0to5, "#ffb000"],
    [t2("Our proof today", "Bugünkü kanıtımız"), c.score_proof_0to5, "#b6ff3b"],
  ];
  $("#persona-stats").innerHTML = rows.map(([label, v, color]) => `
    <div class="stat" style="--c:${color}"><span>${label}</span><b>${v}/5</b>
      <div class="meter">${[1, 2, 3, 4, 5].map((i) => `<i class="${i <= v ? "on" : ""}"></i>`).join("")}</div></div>`).join("");
}

function calendar() {
  const c = byId["VN-2"];
  const hrs = c.monthly_hours_thi28;
  const max = Math.max(...hrs);
  const bars = hrs.map((h, i) => `<div class="cal-bar" style="--h:${(h / max) * 100};--i:${i}">
      <span></span><em>${Math.round(h)}</em><small>${t2(MONTHS_EN[i], MONTHS_TR[i])}</small></div>`).join("");
  const marks = [
    { col: 1, span: 1, c: "var(--violet)", b: t2("Jan", "Oca"), p: t2("Prep", "Hazırlık") },
    { col: 2, span: 3, c: "var(--amber)", b: t2("Feb → Apr", "Şub → Nis"), p: t2("Launch + demos", "Lansman + demolar") },
    { col: 5, span: 3, c: "var(--cyan)", b: t2("May → Jul", "May → Tem"), p: t2("Results, first orders", "Sonuçlar, ilk siparişler") },
    { col: 10, span: 2, c: "var(--lime)", b: "Vietstock", p: t2("Oct, HCMC", "Eki, HCMC") },
  ];
  $("#calendar").innerHTML = `<div class="cal-bars">${bars}</div>
    <div class="cal-marks">${marks.map((m) => `<div class="cal-mark" style="--col:${m.col};--span:${m.span};--c:${m.c}"><b>${m.b}</b>${m.p}</div>`).join("")}</div>
    <p class="note">${t2("NASA POWER hourly, 2021–23 average.", "NASA POWER saatlik, 2021–23 ortalaması.")}</p>`;
}

function economics() {
  const c = byId["VN-2"];
  const lo = +c.econ_broiler_benefit_eur_per_1000_birds_low, mid = +c.econ_broiler_benefit_eur_per_1000_birds_central, hi = +c.econ_broiler_benefit_eur_per_1000_birds_high;
  const max = 100, pct = (v) => `${(v / max) * 100}%`;
  const half = (mid / 2).toFixed(1);
  $("#econ").innerHTML = `
    <div class="econ-scale">
      <div class="econ-track"></div>
      <div class="econ-pt" style="left:${pct(lo)}"><b>€${lo}</b><small>${t2("low", "düşük")}</small></div>
      <div class="econ-pt" style="left:${pct(mid)}"><b style="color:var(--amber)">€${mid}</b><small>${t2("central", "merkez")}</small></div>
      <div class="econ-pt" style="left:${pct(hi)}"><b style="color:var(--lime)">€${hi}</b><small>${t2("high", "yüksek")}</small></div>
      <div class="econ-note" style="left:${pct(+half)}">${t2(`price ≤ €${half} → 1:2`, `fiyat ≤ €${half} → 1:2`)}</div>
    </div>
    <div class="econ-card"><b>≤ €${half}</b><p>${t2("Max programme cost per 1,000 birds for a 1:2 return.", "1:2 getiri için 1.000 kuş başına azami program maliyeti.")}</p>
    <p class="note">${t2("Modeled, not trial results.", "Modellenmiş; deneme sonucu değil.")}</p></div>`;
}

/* ------------------------------------------------------------------- farm */
function farm() {
  const trees = $("#tree-row");
  for (let x = -20; x < 1640; x += 46) {
    const y = 600 + Math.sin(x * 0.05) * 6, h = 80 + (x * 7) % 30;
    const g = svgEl("g", { fill: "#3d1650" });
    g.append(svgEl("rect", { x: x - 3, y: y - h, width: 6, height: h + 20 }));
    g.append(svgEl("ellipse", { cx: x, cy: y - h, rx: 26, ry: 30 }));
    g.append(svgEl("ellipse", { cx: x - 14, cy: y - h + 14, rx: 18, ry: 20 }));
    g.append(svgEl("ellipse", { cx: x + 14, cy: y - h + 12, rx: 18, ry: 20 }));
    trees.append(g);
  }
  const houses = $("#house-row");
  [[60, 640, 600], [720, 655, 640], [1150, 630, 520]].forEach(([x, y, w], n) => {
    const g = svgEl("g");
    g.append(svgEl("rect", { x, y, width: w, height: 70, fill: "#e8e2d6" }));
    for (let i = 0; i < w; i += 24) g.append(svgEl("rect", { x: x + i + 6, y: y + 18, width: 12, height: 34, fill: "#bdb3a2" }));
    g.append(svgEl("path", { d: `M${x - 14} ${y} L${x + w / 2} ${y - 34} L${x + w + 14} ${y} Z`, fill: "url(#roof)" }));
    g.append(svgEl("rect", { x: x + w - 4, y: y + 6, width: 46, height: 64, fill: "#2c2f3a" }));
    for (let f = 0; f < 2; f++) {
      const cx = x + w + 19, cy = y + 22 + f * 30;
      const fan = svgEl("g", { class: "fan", style: `transform-origin:${cx}px ${cy}px;animation:spin ${0.6 + n * 0.1}s linear infinite` });
      fan.append(svgEl("circle", { cx, cy, r: 12, fill: "#4a4f60" }));
      fan.append(svgEl("path", { d: `M${cx} ${cy - 11} L${cx + 3} ${cy} L${cx - 3} ${cy} Z M${cx + 11} ${cy} L${cx} ${cy + 3} L${cx} ${cy - 3} Z M${cx} ${cy + 11} L${cx - 3} ${cy} L${cx + 3} ${cy} Z M${cx - 11} ${cy} L${cx} ${cy - 3} L${cx} ${cy + 3} Z`, fill: "#d9dde8" }));
      g.append(fan);
    }
    houses.append(g);
  });
  const flock = $("#flock");
  for (let i = 0; i < 16; i++) {
    const x = 80 + i * 96 + (i % 3) * 18, y = 800 + (i % 4) * 18, s = 0.55 + (i % 4) * 0.08, flip = i % 2 ? -1 : 1;
    const g = svgEl("g", { transform: `translate(${x} ${y}) scale(${s * flip} ${s})`, class: "hen" });
    g.innerHTML = `<ellipse cx="0" cy="0" rx="40" ry="30" fill="#f6f2ea"/><circle cx="34" cy="-30" r="16" fill="#f6f2ea"/>
      <path d="M28 -46 q4 -12 10 -2 q6 -10 10 2 Z" fill="#e8213b"/><path d="M48 -32 l12 4 l-12 4 Z" fill="#ffb000"/>
      <circle cx="38" cy="-33" r="2.6" fill="#14171f"/><path d="M-6 28 v16 M8 28 v16" stroke="#ffb000" stroke-width="4"/>`;
    flock.append(g);
  }
}

/* --------------------------------------------------------------- gut scene */
const GUT_STATES = [
  `<i style="--c:#ff8fb0"></i>${t2("Healthy villi", "Sağlıklı villuslar")}`,
  `<i style="--c:#ffb37a"></i>${t2("Heat stress: villi shrink", "Isı stresi: villuslar kısalır")}`,
  `<i style="--c:#b6ff3b"></i>${t2("With essential oils", "Esansiyel yağlarla")}`,
];
const gut = { h: 330, sick: 0, heal: 0, leak: 0, absorb: 1 };
const villi = [];
function buildGut() {
  const root = $("#villi");
  let x = -10;
  for (let i = 0; i < 19; i++) {
    const w = 34 + ((i * 53) % 17);
    const p = svgEl("path", { fill: "url(#villusG)", stroke: "#ffb3c8", "stroke-width": 2.5, "stroke-linejoin": "round" });
    const core = svgEl("path", { fill: "none", stroke: "#ff2e6e", "stroke-width": 3, opacity: 0.55, "stroke-linecap": "round" });
    root.append(p, core);
    villi.push({ p, core, x, w, j: 0.78 + ((i * 37) % 10) / 28, lean: ((i * 29) % 7 - 3) * 3 });
    x += w + 8 + ((i * 13) % 9);
  }
  drawVilli();
}
function drawVilli() {
  villi.forEach((v) => {
    const h = gut.h * v.j, base = 566, top = base - h, x0 = v.x, x1 = v.x + v.w;
    const lean = v.lean * (h / 300), neck = v.w * (0.12 + gut.sick * 0.12), rag = gut.sick * 7;
    const tx = (x0 + x1) / 2 + lean;
    v.p.setAttribute("d", `M${x0 - 6} ${base} C${x0 + neck} ${base - h * 0.3}, ${x0 + lean - 2} ${top + h * 0.35}, ${x0 + lean + 2} ${top + v.w * 0.45}
      C${x0 + lean + 4} ${top - 4 + rag}, ${x1 + lean - 4} ${top - 4 - rag}, ${x1 + lean - 2} ${top + v.w * 0.45}
      C${x1 + lean + 2} ${top + h * 0.35}, ${x1 - neck} ${base - h * 0.3}, ${x1 + 6} ${base} Z`);
    v.core.setAttribute("d", `M${(x0 + x1) / 2} ${base} Q${tx - lean * 0.3} ${top + h * 0.5} ${tx} ${top + v.w * 0.55}`);
    v.p.setAttribute("fill", gut.sick > 0.5 ? "url(#villusSick)" : "url(#villusG)");
    v.p.setAttribute("opacity", 0.8 + 0.2 * (1 - gut.sick));
    v.core.setAttribute("opacity", 0.55 * (1 - gut.sick * 0.7));
  });
}
const particles = [];
function gutParticles() {
  const g = $("#nutrients");
  for (let i = 0; i < 46; i++) {
    const c = svgEl("circle", { r: 4 + (i % 3) * 2, fill: "#ffd23f" });
    g.append(c);
    particles.push({ c, x: Math.random() * 1000, y: Math.random() * 520, vy: 0.4 + Math.random() * 0.8, leak: i % 5 === 0 });
  }
  const d = $("#drops");
  for (let i = 0; i < 18; i++) {
    const c = svgEl("path", { d: "M0 -14 C6 -4 10 2 10 6 A10 10 0 0 1 -10 6 C-10 2 -6 -4 0 -14Z", fill: "#b6ff3b", opacity: 0 });
    d.append(c);
    particles.push({ c, drop: true, x: 40 + i * 55, y: -40 - (i % 6) * 70, vy: 2 + (i % 4) * 0.6 });
  }
}
function tickGut() {
  particles.forEach((p) => {
    if (p.drop) {
      p.y += p.vy;
      if (p.y > 560) p.y = -40;
      p.c.setAttribute("transform", `translate(${p.x} ${p.y})`);
      p.c.setAttribute("opacity", gut.heal * 0.95);
      return;
    }
    p.y += p.vy;
    const limit = p.leak && gut.leak > 0.3 ? 690 : 560 - gut.h * 0.6 * gut.absorb;
    if (p.y > limit) { p.y = -10; p.x = Math.random() * 1000; }
    p.c.setAttribute("cx", p.x);
    p.c.setAttribute("cy", p.y);
    p.c.setAttribute("fill", p.leak && gut.leak > 0.3 ? "#ff4b3e" : "#ffd23f");
  });
}

/* ------------------------------------------------------------------ bubbles */
function bubbles() {
  const g = $("#bubbles");
  for (let i = 0; i < 14; i++) {
    const c = svgEl("circle", { cx: 230 + (i * 53) % 240, cy: 560 - (i * 31) % 300, r: 3 + (i % 4) * 2.5, fill: "#fff", opacity: 0.35 });
    g.append(c);
    if (!reduced) gsap.to(c, { attr: { cy: `-=${80 + (i % 5) * 30}` }, opacity: 0, duration: 2.5 + (i % 4), repeat: -1, ease: "sine.in", delay: i * 0.25 });
  }
}

/* ------------------------------------------------------- optional packshot */
function packshot() {
  const img = $("#packshot");
  const probe = new Image();
  probe.onload = () => { img.src = probe.src; img.hidden = false; img.dataset.ready = "1"; };
  probe.src = "assets/aromax-pack.png";
}

/* ------------------------------------------------------------------ scroll */
function smoothScroll() {
  if (reduced) return;
  const lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  $$('a[href^="#"]').forEach((a) => a.addEventListener("click", (e) => { e.preventDefault(); lenis.scrollTo(a.getAttribute("href")); }));
}

const pins = {};
function pinScene(id, build) {
  const el = document.getElementById(id);
  const len = +el.dataset.pin;
  const tl = gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: { trigger: el, start: "top top", end: `+=${len}%`, pin: true, scrub: reduced ? true : 0.6, anticipatePin: 1 },
  });
  build && build(tl, el);
  pins[id] = tl.scrollTrigger;
  return tl;
}

function scenes() {
  pinScene("country", (tl, el) => {
    tl.from($(".panel", el), { opacity: 0, y: 40, duration: 0.2 }, 0.05).to({}, { duration: 0.75 });
  });

  pinScene("regions", (tl, el) => {
    tl.from($(".panel", el), { opacity: 0, x: -40, duration: 0.1 }, 0).to({}, { duration: 0.9 });
  });

  pinScene("south", (tl, el) => {
    tl.from($(".panel", el), { opacity: 0, x: 40, duration: 0.15 }, 0.12).to({}, { duration: 0.73 });
  });

  pinScene("persona", (tl, el) => {
    tl.from($(".halo", el), { scale: 0.6, opacity: 0, duration: 0.25 }, 0)
      .from($(".person", el), { y: 120, opacity: 0, duration: 0.25 }, 0.05)
      .from($(".char-name", el), { x: 60, opacity: 0, duration: 0.15 }, 0.12)
      .from($(".char-class", el), { x: 60, opacity: 0, duration: 0.15 }, 0.18)
      .from($$(".stat", el), { x: 40, opacity: 0, stagger: 0.03, duration: 0.12 }, 0.22)
      .from($$(".char-grid > div", el), { y: 30, opacity: 0, stagger: 0.03, duration: 0.12 }, 0.35)
      .to({}, { duration: 0.3 });
  });

  pinScene("farm", (tl, el) => {
    tl.fromTo($(".sky", el), { yPercent: 0 }, { yPercent: -6, duration: 1 }, 0)
      .fromTo($(".sun", el), { attr: { cy: 520 } }, { attr: { cy: 300 }, duration: 1 }, 0)
      .fromTo($(".hills", el), { xPercent: 0 }, { xPercent: -2, duration: 1 }, 0)
      .fromTo($(".trees", el), { xPercent: 1 }, { xPercent: -3, duration: 1 }, 0)
      .fromTo($(".houses", el), { xPercent: 3, yPercent: 4 }, { xPercent: -4, yPercent: 0, duration: 1 }, 0)
      .fromTo($(".ground", el), { xPercent: 5, yPercent: 6 }, { xPercent: -5, yPercent: 0, duration: 1 }, 0)
      .from($("h2", el), { y: 40, opacity: 0, duration: 0.12 }, 0.05)
      .from($$(".glass", el)[0], { x: -60, opacity: 0, duration: 0.15 }, 0.15)
      .from($$(".glass", el)[1], { x: 60, opacity: 0, duration: 0.15 }, 0.25)
      .from($$(".ceps li", el), { x: 30, opacity: 0, stagger: 0.05, duration: 0.08 }, 0.3);
  });

  pinScene("bird", (tl, el) => {
    tl.from($(".chicken", el), { scale: 0.55, y: 120, opacity: 0, transformOrigin: "50% 80%", duration: 0.25 }, 0)
      .from($(".bird-copy .kicker", el), { opacity: 0, duration: 0.05 }, 0.08)
      .from($(".huge", el), { y: 60, opacity: 0, duration: 0.15 }, 0.1)
      .from($(".bird-copy .lede", el), { y: 30, opacity: 0, duration: 0.12 }, 0.2)
      .to($(".heat-lines", el), { opacity: 1, duration: 0.1 }, 0.3)
      .to($(".pant", el), { opacity: 1, duration: 0.05, repeat: 5, yoyo: true }, 0.3)
      .from($(".insight", el), { y: 50, opacity: 0, duration: 0.15 }, 0.42)
      .to($(".gut-spot", el), { opacity: 1, scale: 1.4, transformOrigin: "50% 50%", duration: 0.2 }, 0.75)
      .to($(".chicken", el), { scale: 1.6, x: "4vw", transformOrigin: "49% 62%", duration: 0.25 }, 0.75);
  });

  pinScene("inside", (tl, el) => {
    const lis = $$(".cascade li", el);
    const gutState = $("#gut-state");
    gutState.innerHTML = GUT_STATES[0];
    tl.to($(".iris", el), { clipPath: "circle(150% at 30% 60%)", duration: 0.18, ease: "power2.in" }, 0)
      .from($(".inside-copy", el), { x: 60, opacity: 0, duration: 0.1 }, 0.12)
      .to(gut, { sick: 1, h: 160, duration: 0.3, onUpdate: drawVilli }, 0.28)
      .to(gut, { absorb: 0.25, duration: 0.2 }, 0.3)
      .to(gut, { leak: 1, duration: 0.1 }, 0.48)
      .to({}, { duration: 0.14 }, 0.58)
      .to(gut, { heal: 1, duration: 0.08 }, 0.74)
      .to(gut, { sick: 0, h: 300, absorb: 1, leak: 0, duration: 0.18, onUpdate: drawVilli }, 0.8);
    // cascade highlights follow progress
    ScrollTrigger.create({
      trigger: el, start: "top top", end: `+=${el.dataset.pin}%`,
      onUpdate: (st) => {
        const p = st.progress;
        lis.forEach((li, i) => li.classList.toggle("on", p > 0.18 + i * 0.12));
        const state = p < 0.3 ? 0 : p < 0.76 ? 1 : 2;
        if (state !== gutState.dataset.state) {
          gutState.dataset.state = state;
          gutState.innerHTML = GUT_STATES[state];
        }
      },
    });
  });

  pinScene("solution", (tl, el) => {
    tl.from($(".mega-drop", el), { scale: 0.2, y: -200, opacity: 0, transformOrigin: "50% 50%", duration: 0.25, ease: "back.out(1.4)" }, 0)
      .from($$(".ing", el), { opacity: 0, scale: 0.4, stagger: 0.05, duration: 0.12 }, 0.2)
      .from($(".solution-copy h2", el), { y: 40, opacity: 0, duration: 0.12 }, 0.1)
      .from($(".solution-copy .lede", el), { y: 30, opacity: 0, duration: 0.12 }, 0.18)
      .from($(".evidence", el), { y: 40, opacity: 0, duration: 0.15 }, 0.35)
      .from($(".solution-copy .note", el), { opacity: 0, duration: 0.1 }, 0.55)
      .to({}, { duration: 0.2 })
      .to($(".mega-drop", el), { scale: 0.35, y: 260, duration: 0.2, transformOrigin: "50% 50%", ease: "power2.in" }, 0.8)
      .to($(".orbit", el), { opacity: 0, duration: 0.1 }, 0.8);
  });

  pinScene("pack", (tl, el) => {
    const stream = $("#stream");
    const len = stream.getTotalLength();
    gsap.set(stream, { strokeDasharray: len, strokeDashoffset: len });
    tl.from($(".bottle-svg", el), { y: 120, opacity: 0, duration: 0.15 }, 0)
      .from($("#cap"), { y: -260, opacity: 0, duration: 0.01 }, 0)
      .set($("#cap"), { y: -260, opacity: 0 }, 0.01)
      .from($("#label"), { opacity: 0, duration: 0.01 }, 0)
      .to(stream, { strokeDashoffset: 0, duration: 0.12 }, 0.12)
      .to($("#fill"), { attr: { y: 300, height: 430 }, duration: 0.4, ease: "power1.out" }, 0.18)
      .to(stream, { strokeDashoffset: -len, duration: 0.12 }, 0.56)
      .to($("#cap"), { y: 0, opacity: 1, duration: 0.1, ease: "bounce.out" }, 0.64)
      .to($("#label"), { opacity: 1, duration: 0.1 }, 0.7)
      .from($(".pack-copy .big", el), { y: 60, opacity: 0, duration: 0.15 }, 0.2)
      .from($(".pack-copy .lede", el), { y: 30, opacity: 0, duration: 0.12 }, 0.3)
      .from($$(".spec > div", el), { x: 40, opacity: 0, stagger: 0.04, duration: 0.1 }, 0.45)
      .to($(".bottle-svg", el), { rotate: -4, duration: 0.2 }, 0.8);
    const shot = $("#packshot");
    tl.fromTo(shot, { opacity: 0, scale: 0.9 }, { opacity: () => (shot.dataset.ready ? 1 : 0), scale: 1, duration: 0.15 }, 0.8)
      .to($(".bottle-svg", el), { opacity: () => (shot.dataset.ready ? 0 : 1), duration: 0.15 }, 0.8);
  });

  const mm = gsap.matchMedia();
  mm.add("(min-width: 901px)", () => {
    const track = $("#plan-track");
    const dist = () => track.scrollWidth - window.innerWidth + 48;
    gsap.to(track, {
      x: () => -dist(), ease: "none",
      scrollTrigger: { trigger: "#plan", start: "top top", end: () => `+=${dist()}`, pin: true, scrub: reduced ? true : 0.6, invalidateOnRefresh: true, anticipatePin: 1 },
    });
  });

  $$(".reveal").forEach((r) => gsap.to(r, { opacity: 1, y: 0, duration: 0.9, ease: "power3.out", scrollTrigger: { trigger: r, start: "top 85%" } }));
  ScrollTrigger.create({ trigger: "#calendar", start: "top 80%", onEnter: () => $("#calendar").classList.add("in") });
  gsap.from(".mega", { y: 80, opacity: 0, duration: 1.2, ease: "power4.out", delay: 0.1 });
  gsap.from(".flow-chips li", { y: 20, opacity: 0, stagger: 0.06, duration: 0.6, ease: "power3.out", delay: 0.5 });
  gsap.from("#outro .recap li", { opacity: 0, x: -20, stagger: 0.08, scrollTrigger: { trigger: "#outro", start: "top 70%" } });
}

/* ------------------------------------------------------------------- HUD */
function hud() {
  const nav = $(".chain-hud");
  const items = $$(".chain-hud li");
  ScrollTrigger.create({ trigger: "#country", start: "top 60%", endTrigger: "#gtm", end: "bottom bottom", toggleClass: { targets: [nav, ".mprog"], className: "on" } });
  ScrollTrigger.create({ start: 0, end: "max", onUpdate: (st) => { $("#mprog-bar").style.transform = `scaleX(${st.progress})`; } });
  items.forEach((li, i) => {
    ScrollTrigger.create({
      trigger: "#" + li.dataset.for, start: "top 55%", end: "bottom 55%",
      onToggle: (st) => {
        if (!st.isActive) return;
        items.forEach((x, j) => { x.classList.toggle("active", j === i); x.classList.toggle("done", j < i); });
        $("#mprog-label").innerHTML = `${i + 1}/${items.length} · ${li.innerHTML}`;
      },
    });
  });
}

/* ------------------------------------------------------------------- map */
const BASE = { lon: 106.0, lat: 15.9, dist: 330, phi: 10, theta: 0, shift: -0.16, rise: 0, regionAlpha: 0, regionW: [0, 0, 0, 0, 0, 0], barGrow: 0, beacon: 0, canvas: 0, labels: 0, cities: 0, south: 0, vshift: 0 };
const lerp = (a, b, t) => a + (b - a) * t;
const ease = (t) => t * t * (3 - 2 * t);
function mix(a, b, t) {
  const o = {};
  for (const k in a) o[k] = Array.isArray(a[k]) ? a[k].map((v, i) => lerp(v, b[k][i], t)) : lerp(a[k], b[k], t);
  return o;
}

function mapKeyframes() {
  const H = window.innerHeight;
  const at = (id, f) => pins[id].start + f * (pins[id].end - pins[id].start);
  const mobile = window.innerWidth < 900;
  const sh = (v) => (mobile ? 0 : v);
  const k = [];
  let s = { ...BASE };
  const push = (pos, patch) => { s = { ...s, ...patch }; k.push({ pos, s }); };
  push(at("country", 0) - H * 0.9, { vshift: mobile ? 0.2 : 0 });
  push(at("country", 0), { canvas: 1, rise: 0.05, dist: mobile ? 360 : 290, phi: 20, shift: sh(-0.16) });
  push(at("country", 0.45), { rise: 1, dist: mobile ? 330 : 235, phi: 32, theta: -8, cities: 1 });
  push(at("country", 1), { dist: mobile ? 320 : 225, phi: 34, theta: -12 });
  push(at("regions", 0.12), { regionAlpha: 1, regionW: [0, 0.5, 0.5, 0.5, 0.5, 0.5], cities: 0, beacon: 1, labels: 1, shift: sh(-0.17) });
  REGIONS.forEach((r, i) => {
    const c = 0.2 + i * 0.16;
    const w = [0, 0, 0, 0, 0, 0]; w[r.idx] = 1;
    const view = { lon: r.lon, lat: r.lat, dist: mobile ? 150 : 130, phi: 42, theta: -14 + i * 2, regionW: w };
    push(at("regions", c - 0.04), view);
    push(at("regions", c + 0.06), view);
  });
  push(at("south", 0.05), { lon: 106.25, lat: 10.75, dist: mobile ? 120 : 110, phi: 46, theta: -18, regionW: [0, 0.05, 0.05, 0.05, 1, 0.8], labels: 0, shift: sh(0.2) });
  push(at("south", 0.28), { dist: mobile ? 110 : 88, phi: 52, theta: -28, south: 1 });
  push(at("south", 0.62), { barGrow: 1.4 });
  push(at("south", 0.86), { theta: -36, dist: mobile ? 105 : 82 });
  push(at("south", 1), { canvas: 0, south: 0 });
  return k;
}

function stateAt(keys, y) {
  if (y <= keys[0].pos) return keys[0].s;
  for (let i = 1; i < keys.length; i++) {
    if (y <= keys[i].pos) {
      const a = keys[i - 1], b = keys[i];
      const t = b.pos === a.pos ? 1 : (y - a.pos) / (b.pos - a.pos);
      return mix(a.s, b.s, ease(t));
    }
  }
  return keys[keys.length - 1].s;
}

async function startMap() {
  const canvas = $("#map");
  const labelsRoot = $("#map-labels");
  let map;
  try {
    map = await createMap(canvas);
  } catch (err) {
    console.warn("WebGL map unavailable", err);
    document.body.classList.add("no-webgl");
    return;
  }

  const cityLabels = [["Hà Nội", 105.85, 21.03], ["Đà Nẵng", 108.22, 16.05], ["TP. Hồ Chí Minh", 106.7, 10.78], ["Cần Thơ", 105.78, 10.03]].map(([n, lon, lat]) => {
    const el = document.createElement("div");
    el.className = "mlabel city";
    el.innerHTML = `<i></i>${n}`;
    labelsRoot.append(el);
    return { el, pos: map.lonLatToWorld(lon, lat, map.heightAt(lon, lat) + 0.6), group: "cities" };
  });

  const clusterLabels = REGIONS.filter((r) => r.id).map((r) => {
    const c = byId[r.id];
    const p = map.addBeacon(+c.lon, +c.lat, REGION_COLORS[r.idx]);
    const el = document.createElement("div");
    el.className = "mlabel";
    el.style.setProperty("--c", REGION_COLORS[r.idx]);
    el.innerHTML = `<i></i>${c.cluster_id}<small>${fmt(c.hours_thi_ge28)} h THI≥28</small>`;
    labelsRoot.append(el);
    return { el, pos: p.clone().setY(p.y + 6.2), group: "labels" };
  });

  const southLabels = [["VN-2", 106.95, 11.15, "#00e0c6"], ["VN-3", 105.5, 10.15, "#b6ff3b"]].map(([id, lon, lat, color]) => {
    const c = byId[id];
    const base = map.addBars(id, METRICS.map((m) => +c[m.k]), METRICS.map((m) => m.c), [lon, lat]);
    const el = document.createElement("div");
    el.className = "mlabel";
    el.style.setProperty("--c", color);
    el.innerHTML = `<i></i><b>${id}</b><small>${c.score_full_0to100}/100 · Tier ${c.tier}</small>`;
    labelsRoot.append(el);
    return { el, pos: base.clone().setY(base.y + 7.5), group: "south" };
  });
  const allLabels = [...cityLabels, ...clusterLabels, ...southLabels];

  let keys = mapKeyframes();
  ScrollTrigger.addEventListener("refresh", () => { keys = mapKeyframes(); });

  const cards = $$("#region-cards .rc");
  const icpBars = $$("#icp-compare .bars span");
  let lastActive = -1, barsOn = false;

  const clock = { t: 0 };
  gsap.ticker.add((time) => {
    clock.t = time;
    const y = window.scrollY;
    const s = stateAt(keys, y);
    const visible = s.canvas > 0.001;
    canvas.style.opacity = s.canvas;
    labelsRoot.style.opacity = s.canvas;
    if (visible) {
      map.render(s, time);
      allLabels.forEach((l) => {
        const p = map.project(l.pos);
        const o = s[l.group] * (p.behind ? 0 : 1);
        l.el.style.opacity = o;
        l.el.style.transform = `translate(${p.x}px, ${p.y}px) translate(-50%, ${l.group === "cities" ? "-50%" : "-100%"})`;
        l.el.style.left = "0"; l.el.style.top = "0";
      });
    }
    // region cards follow the region steps
    const rs = pins.regions;
    if (rs) {
      const f = (y - rs.start) / (rs.end - rs.start);
      const active = f < 0.14 || f > 1 ? -1 : Math.min(4, Math.max(0, Math.floor((f - 0.14) / 0.16)));
      if (active !== lastActive) { cards.forEach((c, i) => c.classList.toggle("active", i === active)); lastActive = active; }
    }
    const on = s.barGrow > 0.3;
    if (on !== barsOn) { icpBars.forEach((b) => b.style.setProperty("--grow", on ? 1 : 0)); barsOn = on; }
    if (gut.heal > 0 || (pins.inside && y > pins.inside.start - window.innerHeight && y < pins.inside.end)) tickGut();
  });
}

/* ------------------------------------------------------------------- boot */
try {
  renderPlan(await fetch("data/plan.json").then((r) => r.json()));
} catch (err) {
  console.warn("plan.json unavailable", err);
}
regionCards();
icpCompare();
personaStats();
calendar();
economics();
farm();
buildGut();
gutParticles();
bubbles();
packshot();
smoothScroll();
scenes();
hud();
ScrollTrigger.sort();
startMap().then(() => ScrollTrigger.refresh());
window.addEventListener("load", () => ScrollTrigger.refresh());
