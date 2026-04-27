import * as THREE from "./vendor/three.module.js";

const SCALE = 0.037;
const CENTER = { x: 360, y: 310 };

function svgToWorld(x, y, height = 0) {
  return new THREE.Vector3((x - CENTER.x) * SCALE, height, (CENTER.y - y) * SCALE);
}

function createTempPath(pathData) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "0");
  svg.setAttribute("height", "0");
  svg.style.position = "absolute";
  svg.style.pointerEvents = "none";
  svg.style.opacity = "0";
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", pathData);
  svg.appendChild(path);
  document.body.appendChild(svg);
  return { svg, path };
}

function samplePath(pathData, sampleCount = 120) {
  const { svg, path } = createTempPath(pathData);
  let points = [];
  try {
    const length = path.getTotalLength();
    const count = Math.max(18, Math.min(sampleCount, Math.round(length / 8)));
    for (let i = 0; i <= count; i += 1) {
      const point = path.getPointAtLength((length * i) / count);
      points.push({ x: point.x, y: point.y });
    }
  } catch (error) {
    points = [];
  } finally {
    svg.remove();
  }
  return points;
}

function makeMaterial(color, options = {}) {
  return new THREE.MeshStandardMaterial({
    color,
    roughness: options.roughness ?? 0.74,
    metalness: options.metalness ?? 0.04,
    transparent: options.opacity !== undefined,
    opacity: options.opacity ?? 1,
    side: options.side ?? THREE.DoubleSide,
    depthWrite: options.depthWrite ?? true
  });
}

function makeLineMaterial(color, opacity = 1) {
  return new THREE.LineBasicMaterial({
    color,
    transparent: opacity < 1,
    opacity,
    depthTest: true
  });
}

function makeShapeMesh(pathData, color, y = 0.02, opacity = 1) {
  const sampled = samplePath(pathData, 150);
  if (sampled.length < 3) return null;
  const shapePoints = sampled.map((point) => {
    const world = svgToWorld(point.x, point.y);
    return new THREE.Vector2(world.x, -world.z);
  });
  const shape = new THREE.Shape(shapePoints);
  const geometry = new THREE.ShapeGeometry(shape);
  geometry.rotateX(-Math.PI / 2);
  geometry.computeVertexNormals();
  const mesh = new THREE.Mesh(
    geometry,
    makeMaterial(color, { opacity, roughness: 0.82, side: THREE.DoubleSide })
  );
  mesh.position.y = y;
  return mesh;
}

function makeOutline(pathData, color, y = 0.08, opacity = 1) {
  const sampled = samplePath(pathData, 180);
  if (sampled.length < 2) return null;
  const vertices = [];
  sampled.concat(sampled[0]).forEach((point) => {
    const world = svgToWorld(point.x, point.y, y);
    vertices.push(world.x, world.y, world.z);
  });
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
  return new THREE.Line(geometry, makeLineMaterial(color, opacity));
}

function seededRandom(seed) {
  let t = seed + 0x6d2b79f5;
  return function random() {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function createAxis(from, to, color, radius) {
  const start = svgToWorld(from[0], from[1], 0.12);
  const end = svgToWorld(to[0], to[1], 0.12);
  const direction = new THREE.Vector3().subVectors(end, start);
  const length = direction.length();
  const geometry = new THREE.CylinderGeometry(radius, radius, length, 14);
  const material = makeMaterial(color, { opacity: 0.88, roughness: 0.45 });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.copy(start).add(end).multiplyScalar(0.5);
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize());
  return mesh;
}

function makeRing(item, color) {
  const center = svgToWorld(item.x, item.y, 0.18);
  const radius = item.radius * SCALE;
  const geometry = new THREE.TorusGeometry(radius, 0.018, 10, 90);
  const material = makeMaterial(color, { opacity: 0.42, roughness: 0.5, depthWrite: false });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.rotation.x = Math.PI / 2;
  mesh.position.copy(center);
  return mesh;
}

function makePark(item, color) {
  const geometry = new THREE.CircleGeometry(1, 64);
  const material = makeMaterial(color, { opacity: 0.4, roughness: 0.8, depthWrite: false });
  const mesh = new THREE.Mesh(geometry, material);
  const center = svgToWorld(item.x, item.y, 0.065);
  mesh.position.copy(center);
  mesh.rotation.x = -Math.PI / 2;
  mesh.scale.set(item.rx * SCALE, item.ry * SCALE, 1);
  return mesh;
}

function massColor(cluster) {
  const sceneData = window.YEONGTONG_3D_DATA;
  const palette = sceneData.palette;
  if (cluster.use === "industry") return palette.industry;
  if (cluster.use === "renewal") return palette.renewal;
  if (cluster.use === "soc") return palette.soc;
  if (cluster.tone === "mangpo") return 0xd8efe1;
  if (cluster.tone === "maetan") return 0xf7dfbe;
  if (cluster.tone === "yeongtong") return 0xdce5ed;
  return 0xe8edf4;
}

function createMassing(cluster, index) {
  const group = new THREE.Group();
  const random = seededRandom(22040 + index * 91);
  const base = massColor(cluster);
  const material = makeMaterial(base, {
    opacity: cluster.use === "industry" ? 0.82 : 0.9,
    roughness: 0.68
  });
  for (let i = 0; i < cluster.count; i += 1) {
    const sx = (random() - 0.5) * cluster.radiusX * 2;
    const sy = (random() - 0.5) * cluster.radiusY * 2;
    const x = cluster.x + sx;
    const y = cluster.y + sy;
    const height = cluster.minHeight + random() * (cluster.maxHeight - cluster.minHeight);
    const width = (7 + random() * 13) * SCALE;
    const depth = (8 + random() * 18) * SCALE;
    const geometry = new THREE.BoxGeometry(width, height, depth);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.copy(svgToWorld(x, y, height / 2 + 0.08));
    mesh.rotation.y = (random() - 0.5) * 0.32;
    group.add(mesh);
  }
  return group;
}

function roundedRect(ctx, x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + width, y, x + width, y + height, r);
  ctx.arcTo(x + width, y + height, x, y + height, r);
  ctx.arcTo(x, y + height, x, y, r);
  ctx.arcTo(x, y, x + width, y, r);
  ctx.closePath();
}

function makeLabel(text, tone = "black", width = 720) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = 180;
  const ctx = canvas.getContext("2d");
  const fill = tone === "green" ? "#006d35" : tone === "amber" ? "#c66c00" : "#07111d";
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "rgba(255, 255, 255, 0.94)";
  roundedRect(ctx, 22, 34, canvas.width - 44, 100, 18);
  ctx.fill();
  ctx.fillStyle = fill;
  ctx.font = "900 42px Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, canvas.width / 2, 84);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const material = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    depthTest: false,
    depthWrite: false
  });
  const sprite = new THREE.Sprite(material);
  sprite.scale.set(width / 300, 0.6, 1);
  return sprite;
}

function setActiveButton(root, viewKey) {
  root.querySelectorAll("[data-yt3d-view]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.yt3dView === viewKey);
  });
}

function init3d() {
  const baseData = window.YEONGTONG_DATA;
  const sceneData = window.YEONGTONG_3D_DATA;
  const root = document.querySelector("#yt3dScene");
  const stage = root?.querySelector(".yt3d-canvas");
  if (!root || !stage || !baseData?.gisMap || !sceneData) return;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
  } catch (error) {
    root.classList.add("is-unsupported");
    return;
  }

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x07111d);
  scene.fog = new THREE.Fog(0x07111d, 9, 22);

  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 80);
  const target = new THREE.Vector3();
  const desiredTarget = new THREE.Vector3();
  const desiredCamera = new THREE.Vector3();

  const world = new THREE.Group();
  scene.add(world);

  const hemi = new THREE.HemisphereLight(0xffffff, 0x1a2533, 2.2);
  scene.add(hemi);
  const keyLight = new THREE.DirectionalLight(0xffffff, 2.4);
  keyLight.position.set(3.5, 8, 5.5);
  scene.add(keyLight);
  const rimLight = new THREE.DirectionalLight(0x9ddcff, 0.9);
  rimLight.position.set(-5, 4, -4);
  scene.add(rimLight);

  const grid = new THREE.GridHelper(18, 24, 0x466071, 0x263444);
  grid.position.y = -0.015;
  grid.material.transparent = true;
  grid.material.opacity = 0.34;
  world.add(grid);

  const palette = sceneData.palette;
  const subareaColor = {
    "망포권": palette.mangpo,
    "영통권": palette.yeongtong,
    "매탄권": palette.maetan
  };
  const toneColor = {
    mangpo: palette.mangpo,
    yeongtong: 0xffffff,
    maetan: palette.maetan
  };

  baseData.gisMap.context?.forEach((item) => {
    const mesh = makeShapeMesh(item.path, 0x344557, 0, 0.14);
    if (mesh) world.add(mesh);
  });

  baseData.gisMap.cells?.forEach((cell) => {
    const color = subareaColor[cell.subarea] ?? palette.base;
    const mesh = makeShapeMesh(cell.path, color, 0.035, cell.tone === "strong" ? 0.52 : 0.38);
    if (mesh) world.add(mesh);
    const outline = makeOutline(cell.path, 0xffffff, 0.09, 0.38);
    if (outline) world.add(outline);
  });

  baseData.gisMap.subareaOutlines?.forEach((outline) => {
    const line = makeOutline(outline.path, toneColor[outline.tone] ?? 0xffffff, 0.13, 0.96);
    if (line) world.add(line);
  });

  sceneData.parks.forEach((park) => world.add(makePark(park, palette.park)));
  sceneData.axes.forEach((axis) => {
    const color = palette[axis.color] ?? palette.road;
    world.add(createAxis(axis.from, axis.to, color, axis.width));
  });
  sceneData.stations.forEach((station) => {
    world.add(makeRing(station, palette.station));
    const label = makeLabel(station.label, "green", 620);
    label.position.copy(svgToWorld(station.x, station.y, 0.78));
    world.add(label);
  });
  sceneData.massingClusters.forEach((cluster, index) => world.add(createMassing(cluster, index)));
  sceneData.subareaLabels.forEach((item) => {
    const label = makeLabel(item.label, item.tone, 420);
    label.position.copy(svgToWorld(item.x, item.y, 1.45));
    world.add(label);
  });

  const pulseGroup = new THREE.Group();
  const flowMaterial = makeMaterial(palette.station, { opacity: 0.28, roughness: 0.5, depthWrite: false });
  for (let i = 0; i < 5; i += 1) {
    const geometry = new THREE.TorusGeometry((1.05 + i * 0.26), 0.01, 8, 80);
    const mesh = new THREE.Mesh(geometry, flowMaterial);
    mesh.rotation.x = Math.PI / 2;
    mesh.position.set(0.25, 0.2 + i * 0.012, 0.75);
    pulseGroup.add(mesh);
  }
  world.add(pulseGroup);

  stage.appendChild(renderer.domElement);

  const copyNode = root.querySelector("[data-yt3d-copy]");
  function setView(viewKey) {
    const view = sceneData.viewPoints[viewKey] ?? sceneData.viewPoints.overview;
    desiredCamera.set(...view.camera);
    desiredTarget.set(...view.target);
    if (!camera.position.length()) camera.position.copy(desiredCamera);
    if (!target.length()) target.copy(desiredTarget);
    if (copyNode) copyNode.textContent = view.copy;
    setActiveButton(root, viewKey);
  }

  function resize() {
    const rect = stage.getBoundingClientRect();
    const width = Math.max(320, rect.width);
    const height = Math.max(360, rect.height);
    renderer.setSize(width, height, false);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }

  root.querySelectorAll("[data-yt3d-view]").forEach((button) => {
    button.addEventListener("click", () => setView(button.dataset.yt3dView));
  });

  let isVisible = true;
  const visibilityObserver = new IntersectionObserver((entries) => {
    isVisible = entries.some((entry) => entry.isIntersecting);
  }, { threshold: 0.05 });
  visibilityObserver.observe(root);

  setView("overview");
  resize();
  window.addEventListener("resize", resize, { passive: true });

  function animate(time) {
    requestAnimationFrame(animate);
    if (!isVisible && document.visibilityState !== "visible") return;
    camera.position.lerp(desiredCamera, 0.045);
    target.lerp(desiredTarget, 0.05);
    world.rotation.y = Math.sin(time * 0.00022) * 0.025;
    pulseGroup.rotation.y += 0.0022;
    pulseGroup.children.forEach((ring, index) => {
      ring.material.opacity = 0.18 + Math.sin(time * 0.0015 + index) * 0.06;
    });
    camera.lookAt(target);
    renderer.render(scene, camera);
  }

  animate(0);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init3d, { once: true });
} else {
  init3d();
}
