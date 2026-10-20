// Vietnam relief map: three.js terrain driven by a single `state` object that
// main.js interpolates from the scroll position.
import * as THREE from "three";

// Must match tools/make_assets.py
const LON0 = 101.0, LON1 = 110.5, LAT0 = 7.8, LAT1 = 23.8, MAX_M = 3200;
const K = 10;                                   // world units per degree
const COS = Math.cos((15.8 * Math.PI) / 180);
const LON_C = (LON0 + LON1) / 2, LAT_C = (LAT0 + LAT1) / 2;
const EXAG = 0.0026;                            // world units per metre (about 30x vertical exaggeration)

export const REGION_COLORS = ["#000000", "#ff2e6e", "#ffb000", "#7c84a6", "#00e0c6", "#b6ff3b"];

export function lonLatToWorld(lon, lat, y = 0) {
  return new THREE.Vector3((lon - LON_C) * K * COS, y, -(lat - LAT_C) * K);
}

function loadPixels(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const c = document.createElement("canvas");
      c.width = img.width; c.height = img.height;
      const ctx = c.getContext("2d", { willReadFrequently: true });
      ctx.drawImage(img, 0, 0);
      resolve({ img, w: img.width, h: img.height, data: ctx.getImageData(0, 0, img.width, img.height).data });
    };
    img.onerror = reject;
    img.src = url;
  });
}

const vert = /* glsl */ `
  attribute float aH;
  attribute float aMask;
  uniform float uRise;
  varying float vH;
  varying vec3 vNormal;
  varying vec3 vWorld;
  varying vec2 vUv;
  void main() {
    vec3 p = position;
    float vn = step(0.8, aMask);
    p.y = aH * ${EXAG.toFixed(6)} * uRise * mix(0.45, 1.0, vn) + 0.1;
    vH = aH; vUv = uv;
    vNormal = normalize(mat3(modelMatrix) * normal);
    vec4 w = modelMatrix * vec4(p, 1.0);
    vWorld = w.xyz;
    gl_Position = projectionMatrix * viewMatrix * w;
  }
`;

const frag = /* glsl */ `
  uniform float uRegionAlpha;
  uniform float uRegionW[6];
  uniform vec3 uRegionC[6];
  uniform float uRise;
  uniform float uTime;
  uniform vec3 uBg;
  uniform sampler2D uMaskTex;
  uniform sampler2D uRegionTex;
  varying float vH;
  varying vec3 vNormal;
  varying vec3 vWorld;
  varying vec2 vUv;

  vec3 hypso(float h) {
    float t = clamp(h / 2400.0, 0.0, 1.0);
    vec3 c = mix(vec3(0.04, 0.20, 0.24), vec3(0.05, 0.47, 0.42), smoothstep(0.0, 0.06, t));
    c = mix(c, vec3(0.42, 0.74, 0.40), smoothstep(0.06, 0.25, t));
    c = mix(c, vec3(0.93, 0.80, 0.40), smoothstep(0.25, 0.55, t));
    c = mix(c, vec3(0.99, 0.95, 0.88), smoothstep(0.55, 0.95, t));
    return c;
  }

  float contour(float h, float step_) {
    float f = h / step_;
    float d = abs(fract(f - 0.5) - 0.5) / max(fwidth(f), 1e-4);
    return 1.0 - clamp(d, 0.0, 1.0);
  }

  void main() {
    vec3 n = normalize(vNormal);
    vec3 L = normalize(vec3(-0.6, 0.75, -0.35));
    float diff = clamp(dot(n, L), 0.0, 1.0);
    float shade = 0.38 + 0.85 * diff;

    float mask = texture2D(uMaskTex, vUv).b;
    float vnA = smoothstep(0.62, 0.92, mask);
    float landA = smoothstep(0.12, 0.38, mask);
    vec3 sea = uBg;
    vec2 gq = abs(fract(vWorld.xz / ${(K).toFixed(1)} - 0.5) - 0.5) / fwidth(vWorld.xz / ${(K).toFixed(1)});
    sea += (1.0 - clamp(min(gq.x, gq.y), 0.0, 1.0)) * vec3(0.0, 0.55, 0.5) * 0.10;
    vec3 nb = vec3(0.10, 0.12, 0.19) * (0.55 + 0.6 * diff) + contour(vH, 300.0) * 0.03;
    vec3 col;
    {
      col = hypso(vH) * shade;
      float c1 = contour(vH, 120.0) * smoothstep(20.0, 80.0, vH);
      float c2 = contour(vH, 600.0);
      col = mix(col, vec3(1.0), c1 * 0.18 * uRise + c2 * 0.35 * uRise);
      // region overlay
      int r = int(texture2D(uRegionTex, vUv).r * 255.0 / 40.0 + 0.5);
      vec3 rc = vec3(0.0); float rw = 0.0;
      for (int i = 1; i < 6; i++) { if (i == r) { rc = uRegionC[i]; rw = uRegionW[i]; } }
      float a = uRegionAlpha * (0.08 + 0.34 * rw);
      col = mix(col, rc * (0.55 + 0.65 * shade), a);
      col *= mix(1.0, 0.4 + 0.6 * rw, uRegionAlpha * 0.8);
      // bright coastline / border rim
      float rim = smoothstep(0.62, 0.75, mask) * (1.0 - smoothstep(0.75, 0.9, mask));
      col += rim * vec3(0.5, 1.0, 0.85) * 0.35;
    }
    col = mix(mix(sea, nb, landA), col, vnA);
    // fade the edges of the slab into the background
    float edge = smoothstep(0.0, 0.12, vUv.x) * smoothstep(1.0, 0.88, vUv.x) * smoothstep(0.0, 0.08, vUv.y) * smoothstep(1.0, 0.92, vUv.y);
    gl_FragColor = vec4(mix(uBg, col, edge), 1.0);
  }
`;

export async function createMap(canvas, { base = "assets/" } = {}) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, Math.min(window.innerWidth, window.innerHeight) < 700 ? 1.5 : 1.75));
  const bg = new THREE.Color("#0a0e1a");
  renderer.setClearColor(bg, 1);

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(bg, 260, 520);
  const camera = new THREE.PerspectiveCamera(32, 1, 1, 2000);

  const [terrain, regions] = await Promise.all([loadPixels(base + "terrain.png"), loadPixels(base + "regions.png")]);
  const mobile = Math.min(window.innerWidth, window.innerHeight) < 700;
  const segX = mobile ? 190 : 380, segY = Math.round(segX * terrain.h / terrain.w);
  const width = (LON1 - LON0) * K * COS, depth = (LAT1 - LAT0) * K;
  const geo = new THREE.PlaneGeometry(width, depth, segX, segY);
  const tex = (img, filter) => {
    const t = new THREE.Texture(img);
    t.minFilter = t.magFilter = filter;
    t.generateMipmaps = false;
    t.needsUpdate = true;
    return t;
  };
  geo.rotateX(-Math.PI / 2);

  const count = geo.attributes.position.count;
  const aH = new Float32Array(count), aMask = new Float32Array(count);
  const uv = geo.attributes.uv, pos = geo.attributes.position;
  for (let i = 0; i < count; i++) {
    const px = Math.min(terrain.w - 1, Math.round(uv.getX(i) * (terrain.w - 1)));
    const py = Math.min(terrain.h - 1, Math.round((1 - uv.getY(i)) * (terrain.h - 1)));
    const o = (py * terrain.w + px) * 4;
    aH[i] = ((terrain.data[o] << 8) | terrain.data[o + 1]) / 65535 * MAX_M;
    aMask[i] = terrain.data[o + 2] / 255;
    pos.setY(i, aH[i] * EXAG * (aMask[i] > 0.8 ? 1 : 0.45));
  }
  geo.computeVertexNormals();
  geo.setAttribute("aH", new THREE.BufferAttribute(aH, 1));
  geo.setAttribute("aMask", new THREE.BufferAttribute(aMask, 1));

  const uniforms = {
    uRise: { value: 0 },
    uRegionAlpha: { value: 0 },
    uRegionW: { value: [0, 0, 0, 0, 0, 0] },
    uRegionC: { value: REGION_COLORS.map((c) => new THREE.Color(c)) },
    uTime: { value: 0 },
    uBg: { value: new THREE.Vector3(10 / 255, 14 / 255, 26 / 255) },   // output is not colour-managed, so pass sRGB
    uMaskTex: { value: tex(terrain.img, THREE.LinearFilter) },
    uRegionTex: { value: tex(regions.img, THREE.NearestFilter) },
  };
  const terrainMesh = new THREE.Mesh(geo, new THREE.ShaderMaterial({ vertexShader: vert, fragmentShader: frag, uniforms }));
  scene.add(terrainMesh);

  // height lookup for placing things on the surface
  function heightAt(lon, lat) {
    const px = Math.round((lon - LON0) / (LON1 - LON0) * (terrain.w - 1));
    const py = Math.round((LAT1 - lat) / (LAT1 - LAT0) * (terrain.h - 1));
    const o = (py * terrain.w + px) * 4;
    return ((terrain.data[o] << 8) | terrain.data[o + 1]) / 65535 * MAX_M * EXAG + 0.1;
  }

  // score bars for the South zoom
  const barGroup = new THREE.Group();
  scene.add(barGroup);
  const bars = [];
  function addBars(cluster, metrics, colors, anchor) {
    const base = lonLatToWorld(anchor[0], anchor[1], heightAt(anchor[0], anchor[1]));
    metrics.forEach((v, i) => {
      const h = Math.max(0.15, (v / 5) * 5.5);
      const g = new THREE.BoxGeometry(0.9, 1, 0.9);
      g.translate(0, 0.5, 0);
      const m = new THREE.Mesh(g, new THREE.MeshBasicMaterial({ color: colors[i], transparent: true, opacity: 0.92 }));
      m.position.set(base.x + (i - 2.5) * 1.15, base.y, base.z);
      m.userData = { h, delay: i * 0.08 };
      m.scale.y = 0.0001;
      barGroup.add(m);
      bars.push(m);
      const e = new THREE.LineSegments(new THREE.EdgesGeometry(g), new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.35 }));
      m.add(e);
    });
    const plate = new THREE.Mesh(new THREE.BoxGeometry(7.6, 0.25, 2.2), new THREE.MeshBasicMaterial({ color: 0x0a0e1a, transparent: true, opacity: 0.85 }));
    plate.position.set(base.x, base.y - 0.05, base.z);
    plate.userData.plate = true;
    barGroup.add(plate);
    return base;
  }

  // beacons on cluster anchors
  const beacons = [];
  function addBeacon(lon, lat, color) {
    const p = lonLatToWorld(lon, lat, heightAt(lon, lat));
    const g = new THREE.CylinderGeometry(0.18, 0.18, 1, 12, 1, true);
    g.translate(0, 0.5, 0);
    const m = new THREE.Mesh(g, new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.85, depthWrite: false }));
    m.position.copy(p);
    m.scale.y = 0.0001;
    scene.add(m);
    const ring = new THREE.Mesh(new THREE.RingGeometry(0.6, 0.9, 32), new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.8, side: THREE.DoubleSide, depthWrite: false }));
    ring.rotation.x = -Math.PI / 2;
    ring.position.copy(p).add(new THREE.Vector3(0, 0.2, 0));
    scene.add(ring);
    beacons.push({ m, ring });
    return p;
  }

  // camera rig
  const target = new THREE.Vector3();
  function applyCamera(s, w, h) {
    target.copy(lonLatToWorld(s.lon, s.lat, 0));
    const phi = (s.phi * Math.PI) / 180, th = (s.theta * Math.PI) / 180;
    camera.position.set(
      target.x + s.dist * Math.sin(phi) * Math.sin(th),
      target.y + s.dist * Math.cos(phi),
      target.z + s.dist * Math.sin(phi) * Math.cos(th),
    );
    camera.lookAt(target);
    camera.setViewOffset(w, h, s.shift * w, (s.vshift || 0) * h, w, h);
  }

  let W = 1, H = 1;
  function resize() {
    W = window.innerWidth; H = window.innerHeight;
    renderer.setSize(W, H, false);
    camera.aspect = W / H;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener("resize", resize);

  const tmp = new THREE.Vector3();
  function project(v) {
    tmp.copy(v).project(camera);
    return { x: (tmp.x * 0.5 + 0.5) * W, y: (-tmp.y * 0.5 + 0.5) * H, behind: tmp.z > 1 };
  }

  function render(s, t) {
    uniforms.uRise.value = s.rise;
    uniforms.uRegionAlpha.value = s.regionAlpha;
    for (let i = 0; i < 6; i++) uniforms.uRegionW.value[i] = s.regionW[i];
    uniforms.uTime.value = t;
    terrainMesh.scale.y = 1;
    bars.forEach((b) => {
      const k = Math.min(1, Math.max(0, (s.barGrow - b.userData.delay) / 0.6));
      const e = 1 - Math.pow(1 - k, 3);
      b.scale.y = Math.max(0.0001, b.userData.h * e);
    });
    barGroup.visible = s.barGrow > 0.001;
    beacons.forEach(({ m, ring }, i) => {
      m.scale.y = Math.max(0.0001, s.beacon * (5 + Math.sin(t * 2 + i) * 0.4));
      m.material.opacity = 0.85 * s.beacon;
      ring.material.opacity = 0.8 * s.beacon * (0.6 + 0.4 * Math.sin(t * 3 + i));
      ring.scale.setScalar(1 + 0.25 * Math.sin(t * 3 + i));
    });
    applyCamera(s, W, H);
    renderer.render(scene, camera);
  }

  return { render, project, addBars, addBeacon, lonLatToWorld, heightAt, resize };
}
