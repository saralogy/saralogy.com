// Renders chapters 11 (the plan in ten slides) and 12 (operating plan) from data/plan.json.
// plan.json is the single source of truth; tools/validate_plan.py checks it (R1–R16).

const t2 = (en, tr) => `<span class="en">${en}</span><span class="tr">${tr ?? en}</span>`;
const tx = (o, k) => t2(o[k], o[`${k}_tr`]);
const eur = (k) => (k >= 1000 ? `€${(k / 1000).toFixed(1).replace(/\.0$/, "")}M` : `€${k}k`);
const COLORS = { violet: "#8a6cff", amber: "#ffb000", lime: "#b6ff3b", cyan: "#00e0c6", magenta: "#ff2e6e" };
const TIER_TR = { desk: "masa", client: "şirket", modelled: "model", primary: "birincil", simulated: "simüle" };

const ACTS = [
  ["Diagnose", "Teşhis"], ["Diagnose", "Teşhis"], ["Choose", "Seçim"], ["Choose", "Seçim"],
  ["Commit", "Taahhüt"], ["Commit", "Taahhüt"], ["Commit", "Taahhüt"], ["Commit", "Taahhüt"], ["Commit", "Taahhüt"], ["Fund", "Fonlama"],
];
const MODS = [
  ["Research", "Araştırma", "#00e0c6"], ["Segmentation", "Segmentasyon", "#00e0c6"], ["Targeting", "Hedefleme", "#ff2e6e"],
  ["Positioning", "Konumlandırma", "#ff2e6e"], ["Objectives", "Hedefler", "#b6ff3b"], ["Product", "Ürün", "#b6ff3b"],
  ["Price", "Fiyat", "#b6ff3b"], ["Place", "Dağıtım", "#b6ff3b"], ["Promotion", "Tanıtım", "#b6ff3b"], ["Budget", "Bütçe", "#ffb000"],
];
const MON_TR = { Oct: "Eki", Nov: "Kas", Dec: "Ara", Jan: "Oca", Feb: "Şub", Mar: "Mar", Apr: "Nis", May: "May", Jun: "Haz", Jul: "Tem", Aug: "Ağu", Sep: "Eyl", Monthly: "Aylık", "On the day": "Seminer günü" };
const trMonths = (w) => MON_TR[w] ?? w.replace(/[A-Z][a-z]+( the day)?/g, (m) => MON_TR[m] ?? m);
const KEYS = ["research", "segmentation", "targeting", "positioning", "objectives", "product", "price", "place", "promotion", "budget"];

const chip = (type) => {
  const L = {
    build: ["Build", "Kur"], improve: ["Improve", "İyileştir"], kill: ["Kill", "İptal"], keep: ["Keep", "Koru"], new: ["New", "Yeni"],
    deepen: ["Deepen", "Derinleş"], deprioritize: ["Deprioritize", "Geri plana"], new_door: ["New door", "Yeni kapı"],
    grow: ["Target", "Hedef"], ignore: ["Not a focus", "Odak dışı"], launch: ["Launch", "Lansman"],
  }[type] || [type, type];
  return `<i class="chip chip-${type}">${t2(L[0], L[1])}</i>`;
};

function slide(i, plan, hero, heroLabel, body) {
  const k = KEYS[i], [en, tr, c] = MODS[i];
  const tiers = [...new Set(Object.values(plan[k]?.tiers || {}))];
  return `<article class="slide" style="--c:${c}">
    <header class="sl-top"><span>${i + 1}/10 · ${t2(en, tr)}</span><span class="act">${t2(...ACTS[i])}</span></header>
    <div class="sl-head">
      <h3 class="claim">${t2(plan.titles[k], plan.titles_tr[k])}</h3>
      <div class="sl-hero"><b>${hero}</b><small>${heroLabel}</small></div>
    </div>
    <div class="sl-body">${body}</div>
    <footer class="sl-foot">${t2("Evidence", "Kanıt")}: ${tiers.map((t) => `<i class="tier tier-${t}">${t2(t, TIER_TR[t])}</i>`).join("")}</footer>
  </article>`;
}

function slides(plan) {
  const m = plan.market, seg = plan.segmentation.segments, out = [];
  const total = (a, f) => a.reduce((s, x) => s + f(x), 0);

  // 1 Research
  out.push(slide(0, plan, plan.research.primary_sample_planned, t2("primary sample planned", "planlanan birincil örneklem"), `
    <div class="cols">
      <ul class="ledger">${plan.research.studies.map((s) => `<li class="${s.name.startsWith("PLANNED") ? "planned" : ""}"><span>${tx(s, "name").replace("PLANNED: ", "").replace("PLANLI: ", "")}</span><b>n=${s.n}</b><i class="tier tier-${s.tier}">${t2(s.tier, TIER_TR[s.tier])}</i></li>`).join("")}</ul>
      <ol class="insights">${plan.research.insights.map((x) => `<li>${tx(x, "claim")}<small>${x.proof} → ${x.feeds}</small></li>`).join("")}</ol>
    </div>`));

  // 2 Segmentation
  const maxS = Math.max(...seg.map((s) => s.spend));
  out.push(slide(1, plan, eur(m.category_value), t2("category pool, sell-out / yr", "kategori havuzu, yıllık satış"), `
    <div class="funnel-strip">
      <div><b>${m.universe_households.toLocaleString("en-US")}</b><small>${t2("broiler farms", "broiler çiftliği")}</small></div><i>→</i>
      <div><b>${m.qualified_households}</b><small>${t2("qualified accounts", "nitelikli hesap")}</small></div><i>→</i>
      <div><b>+${m.category_growth_pct}%</b><small>${t2("growth / yr", "yıllık büyüme")}</small></div><i>→</i>
      <div><b>€0</b><small>${t2("our baseline", "bizim taban")}</small></div>
    </div>
    <div class="segs">${seg.map((s) => `<div class="seg">
      <div class="seg-bar" style="--w:${(s.spend / maxS) * 100}%"><span>${eur(s.spend)}</span></div>
      <b>${s.id} · ${tx(s, "name")}</b><small>${tx(s, "description")} · ${s.households} ${t2("accounts", "hesap")} · +${s.growth_pct}%</small></div>`).join("")}</div>
    <p class="sl-note">${t2(m.sizing, m.sizing)}</p>`));

  // 3 Targeting
  const sc = plan.targeting.scores;
  out.push(slide(2, plan, "100%", t2("of the gap from S1 + S2", "açığın S1 + S2'den gelen payı"), `
    <div class="cols">
      <div class="matrix">
        <span class="ax ax-x">${t2("Right to win →", "Kazanma hakkı →")}</span><span class="ax ax-y">${t2("Attractiveness →", "Çekicilik →")}</span>
        ${sc.map((s) => `<i class="dot dot-${s.segment_id}" style="left:${s.right_to_win * 10}%;bottom:${s.attractiveness * 10}%">${s.segment_id}</i>`).join("")}
      </div>
      <div>
        <p class="sl-lead">${tx(plan.targeting, "philosophy")}</p>
        <ul class="roles">${plan.targeting.roles.map((r) => `<li>${chip(r.role)}<b>${r.segment_id}</b><span>${tx(r, "job")}<small>${tx(r, "reason")}</small></span></li>`).join("")}</ul>
      </div>
    </div>`));

  // 4 Positioning
  const st = plan.positioning.statements[0], stTr = plan.positioning.statements_tr[0];
  out.push(slide(3, plan, "1", t2("programme, one story", "program, tek hikâye"), `
    <p class="big-line">“${tx(plan.positioning, "total_position")}”</p>
    <p class="sl-lead">${tx(plan.positioning, "articulation")}</p>
    <dl class="tovis">
      ${["to", "what", "versus", "is"].map((k) => `<div><dt>${{ to: t2("TO", "KİME"), what: t2("WHAT", "NE"), versus: t2("VERSUS", "KARŞISINDA"), is: t2("IS", "FARKI") }[k]}</dt><dd>${t2(st[k], stTr[k])}</dd></div>`).join("")}
    </dl>
    <p class="sl-note">${t2("New assets to earn fame: THI heat-alert badge · House A vs B result card.", "Tanınırlık kazanacak yeni varlıklar: THI sıcak alarmı rozeti · Kümes A–B sonuç kartı.")}</p>`));

  // 5 Objectives
  const mos = plan.objectives.business[0].marketing;
  const fn = plan.objectives.funnel;
  out.push(slide(4, plan, eur(m.target), t2("sell-out by Sep 2027 · 4.3% share", "Eylül 2027'ye kadar satış · %4,3 pay"), `
    <table class="obj"><thead><tr><th>ID</th><th>${t2("Objective", "Hedef")}</th><th>${t2("Target", "Hedef değer")}</th><th>${t2("Cost", "Maliyet")}</th><th>${t2("Value", "Değer")}</th></tr></thead>
    <tbody>${mos.map((o) => `<tr><td><b>${o.id}</b></td><td>${tx(o, "metric")}<small>${o.owner} · ${o.date}</small></td><td>${o.target}${o.unit === "EUR" ? " €" : ""}</td><td>${eur(o.cost)}</td><td>${eur(o.value)}</td></tr>`).join("")}</tbody></table>
    <div class="acct-funnel">${fn.map((f) => `<div style="--w:${Math.max(6, (f.n / fn[0].n) * 100)}%"><span></span><b>${f.n}</b><small>${tx(f, "stage")}</small></div>`).join("")}</div>`));

  // 6 Product
  const pf = plan.product.funnel;
  out.push(slide(5, plan, `${pf.chosen}/${pf.considered}`, t2("ideas chosen", "seçilen fikir"), `
    <div class="pfunnel"><div style="--w:100%"><b>${pf.considered}</b>${t2("considered", "düşünülen")}</div><div style="--w:60%"><b>${pf.tested}</b>${t2("tested", "test edilen")}</div><div style="--w:32%"><b>${pf.chosen}</b>${t2("chosen", "seçilen")}</div></div>
    <ul class="moves">${plan.product.moves.map((x) => `<li>${chip(x.type)}<span><b>${tx(x, "name")}</b><small>${tx(x, "job")} · ${x.objective}</small></span><em>${x.value ? eur(x.value) : "—"}</em></li>`).join("")}</ul>
    <p class="sl-note">${t2("Runner-up: ", "İkinci sıradaki: ")}${tx(plan.product, "runner_up")}</p>`));

  // 7 Price
  const px = plan.price.moves;
  out.push(slide(6, plan, "2.9×", t2("farmer return at €12", "€12'de çiftçi getirisi"), `
    <div class="ladder">
      <div class="lad-track"></div>
      ${[[12, "€12", t2("our price", "fiyatımız"), "lime"], [17.6, "€17.6", t2("1:2 ceiling", "1:2 tavanı"), "amber"], [35.3, "€35.3", t2("farmer benefit", "çiftçi faydası"), "magenta"]].map(([v, l, s, c]) => `<div class="lad-pt ${v === 17.6 ? "below" : ""}" style="left:${(v / 40) * 100}%;--pc:${COLORS[c]}"><b>${l}</b><small>${s}</small></div>`).join("")}
      <span class="lad-unit">${t2("per 1,000 birds per hot-season cycle", "sıcak sezon döngüsünde 1.000 kuş başına")}</span>
    </div>
    <ul class="moves">${px.map((x) => `<li>${chip("launch")}<span><b>${t2(`${x.format}: ${x.new}`, `${x.format_tr}: ${x.new_tr}`)}</b><small>${tx(x, "change")} · ${tx(x, "reversal_trigger")}</small></span><em>${eur(x.value.low)}–${eur(x.value.high)}</em></li>`).join("")}</ul>
    <p class="sl-note">${t2(`Break-even volume loss: ${plan.price.breakeven_volume_loss_pct}%. Price list not yet supplied by XVET: €12 is a modeled anchor.`, `Başa baş hacim kaybı: %${plan.price.breakeven_volume_loss_pct}. XVET fiyat listesi henüz yok: €12 modellenmiş bir çapadır.`)}</p>`));

  // 8 Place
  const pl = plan.place, maxPool = Math.max(...pl.cells.map((c) => c.pool));
  const deepen = total(pl.cells.filter((c) => pl.tags[`${c.region}|${c.channel}`] === "deepen"), (c) => c.pool);
  out.push(slide(7, plan, eur(deepen), t2("pool in the deepen cells", "derinleşilecek hücrelerdeki havuz"), `
    <div class="heat">
      <div class="hm-row hm-head"><span></span>${pl.channels.map((c, j) => `<span>${t2(c, pl.channels_tr[j])}</span>`).join("")}</div>
      ${pl.regions.map((r) => `<div class="hm-row"><span>${r.name}<small>${r.share_of_category_pct}%</small></span>${pl.channels.map((c) => {
        const cell = pl.cells.find((x) => x.region === r.name && x.channel === c), tag = pl.tags[`${r.name}|${c}`] || "";
        return `<span class="hm-cell ${tag}" style="--a:${(cell.pool / maxPool).toFixed(2)}"><b>${eur(cell.pool)}</b>${tag ? chip(tag) : ""}</span>`;
      }).join("")}</div>`).join("")}
    </div>
    <ul class="moves">${pl.moves.map((x) => `<li>${chip(x.type)}<span><b>${tx(x, "name")}</b><small>${tx(x, "note")}</small></span><em>${x.cost ? eur(x.cost) : "€0"}</em></li>`).join("")}</ul>`));

  // 9 Promotion
  const pr = plan.promotion, maxQ = Math.max(...pr.phasing.map((q) => q.brand + q.activation));
  out.push(slide(8, plan, eur(pr.total), t2(`ESOV +${pr.esov} pts`, `ESOV +${pr.esov} puan`), `
    <div class="promo">
      <div class="split">
        <div class="split-bar"><span style="--w:${(pr.brand / pr.total) * 100}%">${t2("Brand", "Marka")} ${Math.round((pr.brand / pr.total) * 100)}%</span><span style="--w:${(pr.activation / pr.total) * 100}%">${t2("Activation", "Aktivasyon")} ${Math.round((pr.activation / pr.total) * 100)}%</span></div>
        <small>${t2(`B2B norm ${pr.norm_brand_pct}/${100 - pr.norm_brand_pct}; launch leans to trial`, `B2B normu ${pr.norm_brand_pct}/${100 - pr.norm_brand_pct}; lansman denemeye yaslanır`)}</small>
        <div class="qbars">${pr.phasing.map((q) => `<div><span style="--h:${((q.brand + q.activation) / maxQ) * 100}%"><i style="--b:${(q.brand / (q.brand + q.activation)) * 100}%"></i></span><small>${q.q.split(" ")[0]}</small><b>${eur(q.brand + q.activation)}</b></div>`).join("")}</div>
      </div>
      <ul class="media">${pr.media.map((x) => `<li><span>${tx(x, "channel")}</span><i style="--w:${(x.amount / pr.total) * 100}%"></i><b>${eur(x.amount)}</b></li>`).join("")}</ul>
    </div>
    <ul class="msgs">${pr.messages.map((x) => `<li>${chip(x.status)}<span>${tx(x, "name")}</span><b class="${x.score < 5 ? "low" : ""}">${x.score.toFixed(1)}</b></li>`).join("")}</ul>`));

  // 10 Budget
  const yrs = plan.budget.years, cumM = total(yrs, (y) => y.margin), cumS = total(yrs, (y) => y.spend);
  let run = 0;
  const wf = mos.map((o) => { const s = run; run += o.value; return { id: o.id, s, v: o.value }; });
  const maxY = Math.max(...yrs.map((y) => y.sellout));
  out.push(slide(9, plan, `${(cumM / cumS).toFixed(2)}×`, t2("3-year margin return", "3 yıllık marj getirisi"), `
    <div class="cols">
      <div>
        <div class="waterfall">${wf.map((w) => `<div><span style="--b:${(w.s / m.target) * 100}%;--h:${(w.v / m.target) * 100}%"></span><small>${w.id}</small><b>+${eur(w.v)}</b></div>`).join("")}
          <div class="wf-total"><span style="--b:0%;--h:100%"></span><small>${t2("Plan", "Plan")}</small><b>${eur(m.target)}</b></div></div>
        <p class="sl-note">${t2(`Y1: €100k cost → €${Math.round(m.target * m.gross_margin_pct / 100)}k margin (0.65×). Entry year is an investment.`, `1. yıl: €100k maliyet → €${Math.round(m.target * m.gross_margin_pct / 100)}k marj (0,65×). Giriş yılı bir yatırımdır.`)}</p>
      </div>
      <div>
        <div class="years">${yrs.map((y) => `<div><span class="ys" style="--h:${((y.sellout / maxY) * 100).toFixed(1)}"></span><span class="yc" style="--h:${((y.spend / maxY) * 100).toFixed(1)}"></span><b>${eur(y.sellout)}</b><small>${y.year.split(" ")[0]}</small></div>`).join("")}</div>
        <p class="legend"><i class="ls"></i>${t2("Sell-out", "Satış")} <i class="lc"></i>${t2("Spend", "Harcama")}</p>
        <p class="sl-note">${t2(`3 years: €${cumS}k spend, €${cumM}k margin. Cumulative payback during year 2.`, `3 yıl: €${cumS}k harcama, €${cumM}k marj. Kümülatif geri dönüş 2. yıl içinde.`)}</p>
      </div>
    </div>`));
  return out.join("");
}

function gantt(plan) {
  const g = plan.gantt, vn2 = [196, 184, 165, 152, 247, 334, 368, 330, 251, 209, 230, 168]; // Oct→Sep, THI≥28 h (VN-2, measured)
  const max = Math.max(...vn2);
  const pts = vn2.map((h, i) => `${(i + 0.5) * (100 / 12)},${100 - (h / max) * 90}`).join(" ");
  return `<div class="gt">
    <div class="gt-row gt-months"><span></span><div class="gt-grid">${g.months.map((mo, i) => `<span>${t2(mo, g.months_tr[i])}</span>`).join("")}</div><span></span></div>
    <div class="gt-row gt-heat"><span>${t2("Heat (THI≥28 h)", "Sıcak (THI≥28 saat)")}</span><div class="gt-grid"><svg viewBox="0 0 100 100" preserveAspectRatio="none"><polyline points="0,100 ${pts} 100,100" fill="rgba(255,46,110,.25)" stroke="#ff2e6e" stroke-width="1.5" vector-effect="non-scaling-stroke"/></svg></div><span></span></div>
    ${plan.operations.map((o) => `<div class="gt-row" style="--c:${COLORS[o.color]}"><span>${tx(o, "name")}</span><div class="gt-grid">${g.bars[o.id].map(([a, b]) => `<i style="left:${(a / 12) * 100}%;width:${((b - a) / 12) * 100}%"></i>`).join("")}</div><b>${eur(o.budget)}</b></div>`).join("")}
    <div class="gt-row gt-total"><span>${t2("Total", "Toplam")}</span><div class="gt-grid"></div><b>${eur(plan.budget.total_spend)}</b></div>
  </div>`;
}

function playbook(plan) {
  return plan.operations.map((o, i) => `<details class="play reveal" style="--c:${COLORS[o.color]}" ${i < 3 ? "open" : ""}>
    <summary><span class="pl-obj">${o.objective}</span><b>${tx(o, "name")}</b><em>${eur(o.budget)}</em></summary>
    <div class="pl-body">
      <p class="pl-why"><span>${t2("Why", "Neden")}</span>${tx(o, "why")}</p>
      <ol class="pl-steps">${o.steps.map((s) => `<li><time>${t2(s.when, trMonths(s.when))}</time><span>${tx(s, "what")}</span></li>`).join("")}</ol>
      <p class="pl-kpi"><span>KPI</span>${tx(o, "kpi")}</p>
    </div>
  </details>`).join("");
}

export function renderPlan(plan) {
  document.getElementById("plan-track").innerHTML = slides(plan);
  document.getElementById("gantt").innerHTML = gantt(plan);
  document.getElementById("playbook").innerHTML = playbook(plan);
  document.getElementById("triggers").innerHTML = plan.budget.risks.map((r) => {
    const mo = plan.objectives.business[0].marketing.find((x) => x.id === r.objective);
    return `<li><b>${r.objective} · ${tx(r, "risk")}</b><span>${t2("Trigger", "Tetikleyici")}: ${tx(mo, "risk_trigger")}</span></li>`;
  }).join("");
}
