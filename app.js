const data = window.YEONGTONG_DATA;

function bindText() {
  document.querySelectorAll("[data-bind]").forEach((node) => {
    const path = node.dataset.bind.split(".");
    let value = data;
    for (const key of path) value = value?.[key];
    if (value !== undefined) node.textContent = value;
  });
}

function chartPoints(series, width, height, pad, min, max) {
  const span = max - min || 1;
  return series.map((item, index) => {
    const x = pad.left + (index / Math.max(1, series.length - 1)) * (width - pad.left - pad.right);
    const y = pad.top + (1 - ((item.value - min) / span)) * (height - pad.top - pad.bottom);
    return { ...item, x, y };
  });
}

function renderOfficialPlanChart() {
  const root = document.querySelector("#officialPlanChart");
  if (!root) return;
  const width = 680;
  const height = 260;
  const pad = { left: 54, right: 28, top: 34, bottom: 48 };
  const series = data.officialPlanTrend;
  const values = series.map((item) => item.value);
  const min = Math.min(...values) - 0.2;
  const max = Math.max(...values) + 0.2;
  const points = chartPoints(series, width, height, pad, min, max);
  const path = points.map((p, index) => `${index ? "L" : "M"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ");
  const baseY = pad.top + (1 - ((23.2 - min) / (max - min))) * (height - pad.top - pad.bottom);

  root.innerHTML = `
    <svg class="chart-svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="2040 수원도시기본계획 영통생활권 계획인구 추세">
      <line class="chart-gridline" x1="${pad.left}" y1="${baseY.toFixed(1)}" x2="${width - pad.right}" y2="${baseY.toFixed(1)}"></line>
      <path class="chart-line official" d="${path}"></path>
      ${points.map((p) => `
        <g class="chart-point">
          <circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="${p.year === "2040" ? 8 : 5}"></circle>
          <text class="point-value" x="${p.x.toFixed(1)}" y="${(p.y - 14).toFixed(1)}">${p.label}</text>
          <text class="point-year" x="${p.x.toFixed(1)}" y="${height - 16}">${p.year}</text>
        </g>
      `).join("")}
    </svg>
  `;
}

function renderResidentTrendChart() {
  const root = document.querySelector("#residentTrendChart");
  if (!root) return;
  const width = 680;
  const height = 260;
  const pad = { left: 54, right: 28, top: 34, bottom: 48 };
  const series = data.residentTrend;
  const values = series.map((item) => item.value);
  const min = Math.min(...values) - 0.2;
  const max = Math.max(...values) + 0.2;
  const points = chartPoints(series, width, height, pad, min, max);
  const path = points.map((p, index) => `${index ? "L" : "M"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ");
  const keyYears = new Set(["2016", "2021", "2026"]);

  root.innerHTML = `
    <svg class="chart-svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="영통생활권 실제 주민등록 인구 2016년부터 2026년까지 추세">
      <line class="chart-gridline" x1="${pad.left}" y1="${pad.top}" x2="${pad.left}" y2="${height - pad.bottom}"></line>
      <line class="chart-gridline" x1="${pad.left}" y1="${height - pad.bottom}" x2="${width - pad.right}" y2="${height - pad.bottom}"></line>
      <path class="chart-line resident" d="${path}"></path>
      ${points.map((p) => `
        <g class="chart-point ${keyYears.has(p.year) ? "key" : ""}">
          <circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="${keyYears.has(p.year) ? 6 : 3.5}"></circle>
          ${keyYears.has(p.year) ? `<text class="point-value" x="${p.x.toFixed(1)}" y="${(p.y - 14).toFixed(1)}">${p.value.toFixed(1)}만</text>` : ""}
          <text class="point-year" x="${p.x.toFixed(1)}" y="${height - 16}">${p.year.slice(2)}</text>
        </g>
      `).join("")}
    </svg>
  `;
}

function renderTrendSummary() {
  const root = document.querySelector("#trendSummaryCards");
  if (!root) return;
  root.innerHTML = data.trendSummary.map((item) => `
    <article class="trend-summary-card tone-${item.tone}">
      <span>${item.label}</span>
      <strong>${item.value}</strong>
      <small>${item.sub}</small>
    </article>
  `).join("");
}

function renderTrendLogic() {
  const root = document.querySelector("#trendLogicGraphic");
  if (!root) return;
  const logic = data.trendLogic;
  root.innerHTML = `
    <div class="trend-verdict">
      <span>${logic.title}</span>
      <strong>${logic.value}</strong>
      <p>${logic.text}</p>
    </div>
    <div class="trend-signal-strip">
      ${logic.signals.map((item) => `
        <article class="trend-signal tone-${item.tone}">
          <span>${item.label}</span>
          <b>${item.value}</b>
          <small>${item.sub}</small>
        </article>
      `).join("")}
    </div>
  `;
}

function renderAgeCards() {
  const root = document.querySelector("#ageCards");
  if (!root) return;
  root.innerHTML = data.ages.map((item) => `
    <article class="age-card reveal tone-${item.tone}">
      <span>${item.label}</span>
      <strong>${item.value}</strong>
      <small>${item.sub}</small>
    </article>
  `).join("");
}

function renderDemandMatrix() {
  const root = document.querySelector("#demandMatrix");
  if (!root) return;
  root.innerHTML = data.demandMatrix.map((item) => {
    const compareRows = (item.compare || []).map((row) => `
      <span>
        <b>${row.label}</b>
        <strong>${row.value}</strong>
      </span>
    `).join("");
    const tags = (item.tags || []).map((tag) => `<em>${tag}</em>`).join("");
    return `
    <article class="demand-card tone-${item.tone}">
      <span>${item.type}</span>
      <strong class="demand-main">${item.value}</strong>
      <small class="demand-focus">${item.focus}</small>
      <div class="demand-compare">${compareRows}</div>
      <div class="demand-tags">${tags}</div>
      <p>${item.text}</p>
    </article>
  `;
  }).join("");
}

function renderDongBars() {
  const root = document.querySelector("#dongBars");
  const max = Math.max(...data.dongs.map((d) => d.value));
  root.innerHTML = data.dongs.map((dong) => {
    const width = `${Math.max(10, (dong.value / max) * 100)}%`;
    return `
      <div class="dong-row">
        <span>${dong.name}</span>
        <div class="track"><i class="tone-${dong.tone}" style="--w:${width}"></i></div>
        <b>${dong.population}</b>
      </div>
    `;
  }).join("");
}

function renderDongColorLegend() {
  const root = document.querySelector("#dongColorLegend");
  if (!root) return;
  root.innerHTML = data.dongColorLegend.map((item) => `
    <article class="dong-legend-item tone-${item.tone}">
      <span>${item.label}</span>
      <div>
        <b>${item.title}</b>
        <small>${item.text}</small>
      </div>
    </article>
  `).join("");
}

function renderSubAreaCards() {
  const root = document.querySelector("#subAreaCards");
  if (!root) return;
  root.innerHTML = data.subAreas.map((item) => `
    <article class="subarea-card tone-${item.tone}">
      <span>${item.label}</span>
      <strong>${item.value}</strong>
      <small>${item.sub}</small>
    </article>
  `).join("");
}

function polygonCentroid(points) {
  const coords = points.split(" ").map((pair) => pair.split(",").map(Number));
  const sum = coords.reduce((acc, [x, y]) => ({ x: acc.x + x, y: acc.y + y }), { x: 0, y: 0 });
  return { x: sum.x / coords.length, y: sum.y / coords.length };
}

function svgPathPoints(path) {
  const nums = path.match(/-?\d+(?:\.\d+)?/g)?.map(Number) ?? [];
  const points = [];
  for (let i = 0; i < nums.length; i += 2) {
    points.push([nums[i], nums[i + 1]]);
  }
  return points;
}

function buildSubareaBoundaryPath(cells) {
  const edges = new Map();
  cells.forEach((cell) => {
    const points = svgPathPoints(cell.path);
    points.forEach((point, index) => {
      const next = points[(index + 1) % points.length];
      const a = `${point[0].toFixed(1)},${point[1].toFixed(1)}`;
      const b = `${next[0].toFixed(1)},${next[1].toFixed(1)}`;
      const key = a < b ? `${a}|${b}` : `${b}|${a}`;
      const existing = edges.get(key) ?? { count: 0, a, b };
      existing.count += 1;
      edges.set(key, existing);
    });
  });

  const boundaryEdges = [...edges.values()]
    .filter((edge) => edge.count === 1)
    .map((edge, id) => ({ ...edge, id, used: false }));
  const adjacency = new Map();
  const addAdjacency = (point, edge) => {
    const list = adjacency.get(point) ?? [];
    list.push(edge);
    adjacency.set(point, list);
  };
  boundaryEdges.forEach((edge) => {
    addAdjacency(edge.a, edge);
    addAdjacency(edge.b, edge);
  });

  const parsePoint = (point) => point.split(",").map(Number);
  const takeNextEdge = (point) => (adjacency.get(point) ?? []).find((edge) => !edge.used);
  const extendRoute = (route, forward) => {
    while (true) {
      const anchor = forward ? route[route.length - 1] : route[0];
      const nextEdge = takeNextEdge(anchor);
      if (!nextEdge) break;
      nextEdge.used = true;
      const nextPoint = nextEdge.a === anchor ? nextEdge.b : nextEdge.a;
      if (forward) route.push(nextPoint);
      else route.unshift(nextPoint);
      if (nextPoint === (forward ? route[0] : route[route.length - 1])) break;
    }
  };

  const routes = [];
  boundaryEdges.forEach((edge) => {
    if (edge.used) return;
    edge.used = true;
    const route = [edge.a, edge.b];
    extendRoute(route, true);
    extendRoute(route, false);
    routes.push(route);
  });

  return routes.map((route) => {
    const points = route.map(parsePoint);
    const [first, ...rest] = points;
    const close = route[0] === route[route.length - 1] ? " Z" : "";
    return `M ${first[0].toFixed(1)} ${first[1].toFixed(1)} ${rest.map(([x, y]) => `L ${x.toFixed(1)} ${y.toFixed(1)}`).join(" ")}${close}`;
  }).join(" ");
}

function renderYeongtongMap() {
  const roots = document.querySelectorAll(".yeongtong-svg-map");
  if (!roots.length) return;
  const map = data.gisMap;
  const subareaDefs = [
    { name: "망포권", tone: "mangpo", dongs: ["망포1동", "망포2동"] },
    { name: "영통권", tone: "yeongtong", dongs: ["영통1동", "영통2동", "영통3동"] },
    { name: "매탄권", tone: "maetan", dongs: ["매탄2동", "매탄3동", "매탄4동"] },
  ];
  const populationByDong = new Map(data.dongs.map((dong) => [dong.name, dong.population.replace(" 명", "")]));
  const subareaByDong = new Map(subareaDefs.flatMap((area) => area.dongs.map((dong) => [dong, area])));
  const cells = map.cells.map((cell) => {
    const area = subareaByDong.get(cell.name);
    return {
      ...cell,
      subarea: area?.name,
      population: populationByDong.get(cell.name) ?? cell.population,
    };
  });
  const cellsByName = new Map(cells.map((cell) => [cell.name, cell]));
  const subareas = subareaDefs.map((area) => {
    const members = cells.filter((cell) => cell.subarea === area.name);
    const outline = map.subareaOutlines?.find((item) => item.name === area.name);
    return { ...area, boundaryPath: outline?.path ?? buildSubareaBoundaryPath(members) };
  });

  const modeTone = (cell, mode) => {
    if (mode === "baseline") return cell.tone;
    if (mode === "profile") {
      if (cell.name === "영통2동") return "green";
      if (["매탄2동", "매탄4동"].includes(cell.name)) return "amber";
      if (cell.name === "망포2동") return "blue";
      return "muted";
    }
    if (mode === "capacity") {
      if (["망포2동", "영통2동", "영통3동"].includes(cell.name)) return "capacity";
      if (["매탄3동", "매탄4동", "영통1동"].includes(cell.name)) return "renewal";
      return "quiet";
    }
    if (mode === "risk") {
      if (["매탄2동", "매탄4동"].includes(cell.name)) return "risk-amber";
      if (cell.name === "망포2동") return "risk-blue";
      if (["영통1동", "영통3동"].includes(cell.name)) return "risk-black";
      return "risk-wash";
    }
    if (mode === "allocation") {
      if (["영통2동", "영통3동", "망포2동"].includes(cell.name)) return "capacity";
      if (["매탄2동", "매탄3동", "매탄4동"].includes(cell.name)) return "renewal-soft";
      return "quiet";
    }
    return cell.tone;
  };

  const hotspot = (item, index) => {
    const cell = cellsByName.get(item.dong);
    if (!cell) return "";
    const x = cell.x + (item.dx ?? 0);
    const y = cell.y + (item.dy ?? 0);
    const count = item.count ? `<tspan class="yt-hotspot-count" dx="7">${item.count}</tspan>` : "";
    return `
      <g class="yt-hotspot tone-${item.tone}" style="--delay:${index * 0.12}s">
        <circle class="yt-hotspot-pulse" cx="${cell.x}" cy="${cell.y}" r="34"></circle>
        <circle class="yt-hotspot-dot" cx="${cell.x}" cy="${cell.y}" r="9"></circle>
        <path class="yt-hotspot-line" d="M ${cell.x} ${cell.y} L ${x} ${y}"></path>
        <g class="yt-hotspot-label" transform="translate(${x} ${y})">
          <rect x="-92" y="-25" width="184" height="50" rx="2"></rect>
          <text class="yt-hotspot-title" y="-5">${item.type ?? item.dong}</text>
          <text class="yt-hotspot-metric" y="15"><tspan>${item.label}</tspan>${count}</text>
        </g>
      </g>
    `;
  };

  const capacityOverlay = () => `
    <g class="yt-capacity-layer">
      <path class="yt-corridor-line green" d="M 206 432 C 246 382, 310 357, 378 356 S 489 309, 555 233"></path>
      <path class="yt-corridor-line black" d="M 240 178 C 293 208, 344 238, 397 268 S 477 281, 540 310"></path>
      <path class="yt-renewal-hatch" d="${cellsByName.get("매탄3동")?.path ?? ""}"></path>
      <path class="yt-renewal-hatch" d="${cellsByName.get("매탄4동")?.path ?? ""}"></path>
      <path class="yt-renewal-hatch soft" d="${cellsByName.get("영통1동")?.path ?? ""}"></path>
      ${(data.mapHotspots.capacity ?? []).map((item, index) => {
        const cell = cellsByName.get(item.dong);
        if (!cell) return "";
        return `<circle class="yt-capacity-ring tone-${item.tone}" cx="${cell.x}" cy="${cell.y}" r="${index === 3 ? 44 : 38}"></circle>`;
      }).join("")}
      ${[
        ["망포", 234, 421],
        ["영통", 452, 315],
        ["청명", 506, 228],
        ["매탄권선", 257, 185],
      ].map(([name, x, y]) => `
        <g class="yt-station-node" transform="translate(${x} ${y})">
          <circle r="12"></circle><rect x="-42" y="-38" width="84" height="24" rx="3"></rect><text y="-20">${name}</text>
        </g>
      `).join("")}
    </g>
  `;

  const riskOverlay = () => `
    <g class="yt-risk-layer">
      <rect class="yt-density-wash" x="156" y="122" width="426" height="386" rx="190"></rect>
      <g class="yt-density-callout" transform="translate(486 132)">
        <rect x="-86" y="-22" width="172" height="44" rx="3"></rect>
        <text y="-3">전 생활권 고밀</text>
        <text y="14">218.5인/ha</text>
      </g>
      <path class="yt-risk-edge" d="M 246 184 C 331 230, 404 266, 522 308"></path>
      ${(data.mapHotspots.risk ?? []).map((item, index) => {
        const cell = cellsByName.get(item.dong);
        if (!cell) return "";
        const x = cell.x + (item.dx ?? 0);
        const y = cell.y + (item.dy ?? 0);
        return `
          <g class="yt-risk-marker tone-${item.tone}" style="--delay:${index * 0.1}s">
            <circle class="yt-risk-dot-core" cx="${cell.x}" cy="${cell.y}" r="10"></circle>
            <circle class="yt-risk-dot-ring" cx="${cell.x}" cy="${cell.y}" r="25"></circle>
            <path class="yt-risk-callout-line" d="M ${cell.x} ${cell.y} L ${x} ${y}"></path>
            <g class="yt-risk-callout" transform="translate(${x} ${y})">
              <rect x="-76" y="-24" width="152" height="48" rx="3"></rect>
              <text y="-4">${item.type ?? item.dong}</text>
              <text y="15">${item.label}</text>
            </g>
          </g>
        `;
      }).join("")}
    </g>
  `;

  const allocationOverlay = () => `
    <g class="yt-allocation-layer">
      <path class="yt-allocation-arrow" d="M 198 436 C 287 381, 372 348, 548 255"></path>
      <g class="yt-allocation-node node-mangpo" transform="translate(234 421)"><circle r="18"></circle></g>
      <g class="yt-allocation-node node-yeongtong" transform="translate(452 315)"><circle r="18"></circle></g>
      <g class="yt-allocation-node node-industry" transform="translate(506 228)"><circle r="18"></circle></g>
      <g class="yt-allocation-badge" transform="translate(538 118)">
        <rect x="-42" y="-24" width="84" height="48" rx="4"></rect>
        <text y="6">1.9만</text>
      </g>
    </g>
  `;

  const legend = (mode) => {
    if (mode === "allocation") return "";
    const lines = {
      baseline: ["GIS 행정동 경계 기반", "굵은 경계: 망포·영통·매탄권"],
      profile: ["Population Demand Map", "청년·고령·아동 수요 핫스팟"],
      capacity: ["Capacity Layer Map", "역세권·정비·산업접점·생활SOC"],
      risk: ["Risk Diagnostic Map", "밀도·고령·아동SOC·산업접점"],
      allocation: ["Allocation Basis Map", "공식 격차와 공간 수용축 결합"],
    }[mode] ?? ["GIS Map", "Yeongtong living area"];
    const box = mode === "profile"
      ? { x: 38, y: 30, w: 214, h: 68, tx: 58, titleY: 62, subY: 88 }
      : { x: 42, y: 42, w: mode === "baseline" ? 208 : 258, h: 82, tx: 62, titleY: 76, subY: 103 };
    return `
      <g class="yt-map-legend mode-${mode}">
        <rect x="${box.x}" y="${box.y}" width="${box.w}" height="${box.h}" rx="2"></rect>
        <text x="${box.tx}" y="${box.titleY}">${lines[0]}</text>
        <text x="${box.tx}" y="${box.subY}">${lines[1]}</text>
      </g>
    `;
  };

  const buildMarkup = (mode, id) => {
    const showContext = mode === "baseline" || mode === "profile";
    const showLabels = mode === "baseline";
    const showSubareas = mode !== "risk" && mode !== "profile";
    const labelOffsets = data.mapLabelOffsets?.[mode] ?? {};
    const profileHotspots = mode === "profile" ? (data.mapHotspots.profile ?? []).map(hotspot).join("") : "";
    const narrative = (mode === "profile" || mode === "risk" ? [] : (data.mapNarratives[mode] ?? [])).map((line, index) => `
      <g class="yt-map-note" transform="translate(470 ${422 + index * 38})">
        <rect x="-12" y="-18" width="210" height="29" rx="2"></rect>
        <text>${line}</text>
      </g>
    `).join("");

    return `
      <svg viewBox="${map.viewBox}" class="yt-map-svg mode-${mode}" aria-hidden="true">
        <defs>
          <filter id="ytMapShadow-${id}" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="18" stdDeviation="18" flood-color="#091827" flood-opacity="0.16"/>
          </filter>
          <pattern id="ytHatch-${id}" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="10"></line>
          </pattern>
        </defs>
        <rect class="yt-map-bg" x="0" y="0" width="720" height="620" rx="34"></rect>
        ${showContext ? `<g class="yt-context-cluster">${map.context.map((cell) => `<path class="yt-context-cell" d="${cell.path}"></path>`).join("")}</g>` : ""}
        <g class="yt-target-cluster" filter="url(#ytMapShadow-${id})">
          ${cells.map((cell) => `
            <g class="yt-cell-group">
              <path class="yt-cell tone-${modeTone(cell, mode)}" d="${cell.path}"></path>
            </g>
          `).join("")}
        </g>
        ${mode === "capacity" ? capacityOverlay() : ""}
        ${mode === "risk" ? riskOverlay() : ""}
        ${mode === "allocation" ? allocationOverlay() : ""}
        ${profileHotspots ? `<g class="yt-profile-hotspots">${profileHotspots}</g>` : ""}
        ${showSubareas ? `<g class="yt-subarea-outlines">${subareas.map((area) => `<path class="yt-subarea-outline tone-${area.tone}" d="${area.boundaryPath}"></path>`).join("")}</g>` : ""}
        ${showLabels ? `
          <g class="yt-map-labels">
            ${cells.map((cell) => {
              const offset = labelOffsets[cell.name] ?? {};
              const labelX = cell.x + (offset.dx ?? 0);
              const labelY = cell.y + (offset.dy ?? 0);
              return `
              <g class="yt-cell-label">
                <rect x="${labelX - 43}" y="${labelY - 20}" width="86" height="43" rx="3"></rect>
                <text class="yt-cell-name" x="${labelX}" y="${labelY + 2}">${cell.name}</text>
                <text class="yt-cell-pop" x="${labelX}" y="${labelY + 20}">${cell.population}</text>
              </g>
            `;
            }).join("")}
          </g>
        ` : ""}
        ${narrative ? `<g class="yt-map-notes">${narrative}</g>` : ""}
        ${legend(mode)}
      </svg>
    `;
  };

  roots.forEach((root) => {
    const mode = root.dataset.mapMode ?? "baseline";
    root.innerHTML = buildMarkup(mode, root.id || mode);
  });
}

function renderObservations() {
  const root = document.querySelector("#observations");
  if (!root) return;
  root.innerHTML = data.observations.map((item) => `
    <article class="observation tone-${item.tone}">
      <div><b>${item.tag}</b><span>${item.value}</span></div>
      <p>${item.text}</p>
    </article>
  `).join("");
}

function renderCapacity() {
  const root = document.querySelector("#capacityList");
  root.innerHTML = data.capacity.map((item) => `
    <article class="capacity-card">
      <b>${item.no}</b>
      <div>
        <span>${item.tag}</span>
        <h3>${item.title}</h3>
        <dl>
          <dt>근거</dt><dd>${item.evidence}</dd>
          <dt>조건</dt><dd>${item.condition}</dd>
        </dl>
        <p>${item.text}</p>
      </div>
    </article>
  `).join("");
}

function renderSpecificSites() {
  const root = document.querySelector("#specificSites");
  if (!root) return;
  root.innerHTML = data.specificSites.map((item) => `
    <article class="site-action-card tone-${item.tone}">
      <span>${item.label}</span>
      <h4>${item.place}</h4>
      <p>${item.action}</p>
      <small>${item.condition}</small>
    </article>
  `).join("");
}

function renderConditionMetrics() {
  const root = document.querySelector("#conditionMetrics");
  if (!root) return;
  root.innerHTML = data.conditionMetrics.map((item) => `
    <article class="condition-metric tone-${item.tone}">
      <span>${item.label}</span>
      <strong>${item.value}</strong>
      <small>${item.sub}</small>
      <i class="condition-meter" style="--w:${item.meter ?? 0}%"></i>
      <b>${item.read}</b>
    </article>
  `).join("");
}

function renderRisks() {
  const root = document.querySelector("#riskGrid");
  if (!root) return;
  root.innerHTML = data.risks.map((item) => `
    <article class="risk-card reveal tone-${item.tone}">
      <span>${item.tag}</span>
      <h3>${item.title}</h3>
      <p>${item.text}</p>
      <b>${item.condition}</b>
    </article>
  `).join("");
}

function renderRiskLedger() {
  const root = document.querySelector("#riskLedger");
  if (!root) return;
  root.innerHTML = `
    <div class="risk-ledger-head">
      <span>부담 지표</span><span>데이터 기준</span><span>영향권역</span><span>필요 조건</span>
    </div>
    ${data.riskLedger.map((row) => `
      <div class="risk-ledger-row tone-${row.tone}">
        <b>${row.risk}<em>${row.level}</em></b>
        <span>${row.indicator}</span>
        <span>${row.area}</span>
        <span>${row.response}</span>
      </div>
    `).join("")}
  `;
}

function renderConstraints() {
  const root = document.querySelector("#constraintCards");
  if (!root) return;
  root.innerHTML = data.constraints.map((item) => `
    <article class="constraint-card tone-${item.tone}">
      <span>${item.title}</span>
      <strong>${item.value}</strong>
      <p>${item.text}</p>
    </article>
  `).join("");
}

function renderFormula() {
  const root = document.querySelector("#formulaRows");
  if (!root) return;
  root.innerHTML = data.formula.map((row) => `
    <div class="formula-row">
      <b>${row.label}</b>
      <span>${row.expr}</span>
      <strong>${row.result}</strong>
    </div>
  `).join("");
}

function renderBenchmarks() {
  const criteria = document.querySelector("#benchmarkCriteria");
  if (criteria) {
    criteria.innerHTML = data.benchmarkCriteria.map((item) => `
      <article>
        <span>${item.label}</span>
        <b>${item.value}</b>
        <small>${item.text}</small>
      </article>
    `).join("");
  }

  const table = document.querySelector("#livingAreaBenchmarks");
  if (!table) return;
  const maxShare = Math.max(...data.livingAreaBenchmarks.map((row) => row.share));
  const maxLoad = Math.max(...data.livingAreaBenchmarks.map((row) => row.load));
  table.innerHTML = `
    <div class="benchmark-row benchmark-row-head">
      <span>생활권</span><span>2040 계획인구</span><span>수원 내 비중</span><span>9.9만 환산</span><span>면적부담 지수</span>
    </div>
    ${data.livingAreaBenchmarks.map((row) => `
      <div class="benchmark-row tone-${row.tone}">
        <b>${row.area}</b>
        <span>${row.pop2040}</span>
        <span class="benchmark-bar"><i style="--w:${(row.share / maxShare * 100).toFixed(1)}%"></i><em>${row.shareText}</em></span>
        <strong>${row.proportional}</strong>
        <span class="benchmark-load"><i style="--w:${(row.load / maxLoad * 100).toFixed(1)}%"></i><em>${row.loadText}</em></span>
      </div>
    `).join("")}
  `;
}

function renderSources() {
  const root = document.querySelector("#sourceList");
  if (!root) return;
  root.textContent = data.sources.join(" · ");
}

function renderSourceNotes() {
  document.querySelectorAll("[data-source-key]").forEach((node) => {
    const value = data.sourceNotes?.[node.dataset.sourceKey];
    if (value) node.textContent = value;
  });
}

function setupReveal() {
  const io = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) entry.target.classList.add("is-visible");
    }
  }, { threshold: 0.18 });
  document.querySelectorAll(".reveal").forEach((node) => io.observe(node));
}

function setupProgress() {
  const bar = document.querySelector(".progress-line span");
  const update = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const progress = max > 0 ? window.scrollY / max : 0;
    bar.style.transform = `scaleX(${Math.min(1, Math.max(0, progress))})`;
  };
  update();
  window.addEventListener("scroll", update, { passive: true });
}

function setupPrintMode() {
  if (new URLSearchParams(window.location.search).has("print")) {
    document.documentElement.classList.add("print-mode");
    document.querySelectorAll(".reveal").forEach((node) => node.classList.add("is-visible"));
  }
}

bindText();
renderOfficialPlanChart();
renderResidentTrendChart();
renderTrendSummary();
renderTrendLogic();
renderAgeCards();
renderDemandMatrix();
renderDongBars();
renderDongColorLegend();
renderSubAreaCards();
renderYeongtongMap();
renderObservations();
renderCapacity();
renderSpecificSites();
renderConditionMetrics();
renderRisks();
renderRiskLedger();
renderConstraints();
renderFormula();
renderBenchmarks();
renderSources();
renderSourceNotes();
setupPrintMode();
setupReveal();
setupProgress();
