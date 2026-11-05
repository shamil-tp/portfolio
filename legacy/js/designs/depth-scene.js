/**
 * depth-scene.js — the "Systems Maquette": a clay architectural model of the
 * portfolio, rendered with Three.js. Loaded only when the Depth design runs.
 *
 * Meaning, not decoration:
 *   - each project is a building on a 4×4 grid around a central plaza;
 *   - floors = the number of technologies in its stack (from content.js);
 *   - roof colour = its area (AI, streaming, client work, web & systems);
 *   - the plaza holds the landmarks: a monolith (About), six stones (one per
 *     skill group) and, on the plinth's corner, a mast (Contact).
 *
 * Every object is mirrored by an HTML button that the design positions over
 * the canvas, so the scene is reachable by keyboard and screen readers, and
 * still usable as a plain list if WebGL is unavailable.
 *
 * Rendering is on demand: frames are drawn only while the camera moves, the
 * pointer changes the hover target, or the canvas resizes. When idle, the
 * GPU does nothing.
 */

const THREE_URL = 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.min.js';

const CELL = 1.9;
const FLOOR_H = 0.3;
const ROOF_H = 0.07;
const FLOOR_GAP = 0.05;
const PLINTH = 4 * CELL + 1.6;
const MAX_DPR = 1.75;

const COLORS = {
    clay: 0xddd3c4,
    clayDark: 0xb7aa97,
    plinth: 0xcabfae,
    slate: 0x46525e,
    mast: 0x3b4652,
    hover: 0xfff4e2,
};

/** View presets (spherical coordinates around a target). */
const HOME = { x: 0, y: 0.2, z: 0, radius: 23, polar: 0.92, azimuth: 0.72 };

export function supportsWebGL() {
    try {
        const c = document.createElement('canvas');
        return !!(window.WebGL2RenderingContext && c.getContext('webgl2')) || !!c.getContext('webgl');
    } catch {
        return false;
    }
}

export async function loadThree() {
    return import(/* @vite-ignore */ THREE_URL);
}

/**
 * @param {object} opts
 * @param {typeof import('three')} opts.THREE
 * @param {HTMLElement} opts.host        element the canvas fills
 * @param {Array} opts.items             [{ id, kind: 'building'|'monolith'|'stones'|'mast', floors, accent, cell }]
 * @param {(id: string|null) => void} opts.onHover
 * @param {(id: string) => void} opts.onSelect
 * @param {(positions: Map<string, {x:number,y:number,visible:boolean}>) => void} opts.onProject  label positions after each frame
 * @param {() => boolean} opts.reducedMotion
 * @param {() => void} opts.onLost       WebGL context lost
 */
export function createScene({ THREE, host, items, onHover, onSelect, onProject, reducedMotion, onLost }) {
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, MAX_DPR));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    // The model never moves, so the shadow map is drawn once.
    renderer.shadowMap.autoUpdate = false;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    const canvas = renderer.domElement;
    canvas.className = 'dp-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    host.prepend(canvas);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, 1, 0.5, 120);

    // ---- Light: low warm sun, cool sky. One shadow-casting light only. ----
    scene.add(new THREE.HemisphereLight(0xd7e1ec, 0x4a3b30, 1.1));
    const sun = new THREE.DirectionalLight(0xffd7ad, 2.4);
    sun.position.set(-7, 11, 6);
    sun.castShadow = true;
    sun.shadow.mapSize.set(1024, 1024);
    sun.shadow.camera.left = -9;
    sun.shadow.camera.right = 9;
    sun.shadow.camera.top = 9;
    sun.shadow.camera.bottom = -9;
    sun.shadow.bias = -0.0008;
    sun.shadow.normalBias = 0.02;
    scene.add(sun);

    const disposables = [];
    const track = (o) => (disposables.push(o), o);
    const clayMat = track(new THREE.MeshStandardMaterial({ color: COLORS.clay, roughness: 0.92, metalness: 0 }));

    // ---- Plinth ----
    const plinth = new THREE.Mesh(track(new THREE.BoxGeometry(PLINTH, 0.6, PLINTH)), track(new THREE.MeshStandardMaterial({ color: COLORS.plinth, roughness: 0.95 })));
    plinth.position.y = -0.3;
    plinth.receiveShadow = true;
    scene.add(plinth);

    // Street inlay: a slightly darker cross through the grid gives the plan a reading.
    const streetMat = track(new THREE.MeshStandardMaterial({ color: COLORS.clayDark, roughness: 1 }));
    const streetGeo = track(new THREE.BoxGeometry(PLINTH - 0.4, 0.02, 0.22));
    for (const z of [-CELL, 0, CELL]) {
        const s = new THREE.Mesh(streetGeo, streetMat);
        s.position.set(0, 0.011, z);
        s.receiveShadow = true;
        scene.add(s);
        const s2 = s.clone();
        s2.rotation.y = Math.PI / 2;
        s2.position.set(z, 0.011, 0);
        scene.add(s2);
    }

    // Soft contact shadow under the floating plinth (tiny canvas texture).
    const shadowTex = (() => {
        const c = document.createElement('canvas');
        c.width = c.height = 64;
        const g = c.getContext('2d');
        const grd = g.createRadialGradient(32, 32, 4, 32, 32, 32);
        grd.addColorStop(0, 'rgba(0,0,0,0.45)');
        grd.addColorStop(1, 'rgba(0,0,0,0)');
        g.fillStyle = grd;
        g.fillRect(0, 0, 64, 64);
        return track(new THREE.CanvasTexture(c));
    })();
    const contact = new THREE.Mesh(track(new THREE.PlaneGeometry(PLINTH * 1.6, PLINTH * 1.6)), track(new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false })));
    contact.rotation.x = -Math.PI / 2;
    contact.position.y = -1.4;
    scene.add(contact);

    // ---- Buildings: every floor of every building is one instance (one draw call). ----
    const buildings = items.filter((i) => i.kind === 'building');
    // Floors plus one thin roof cap per building.
    const floorCount = buildings.reduce((n, b) => n + b.floors + 1, 0);
    const floors = new THREE.InstancedMesh(track(new THREE.BoxGeometry(1, 1, 1)), clayMat, floorCount);
    floors.castShadow = true;
    floors.receiveShadow = true;
    const instanceOwner = []; // instance index -> item id
    const baseColors = []; // per instance THREE.Color
    const ownerRanges = new Map(); // item id -> [start, end)
    const anchors = new Map(); // item id -> THREE.Vector3 (label anchor)
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const scl = new THREE.Vector3();
    const pos = new THREE.Vector3();
    let idx = 0;
    const cellCenter = (c) => ({ x: (c[0] - 1.5) * CELL, z: (c[1] - 1.5) * CELL });

    for (const b of buildings) {
        const { x, z } = cellCenter(b.cell);
        const start = idx;
        const accent = new THREE.Color(b.accent);
        const clay = new THREE.Color(COLORS.clay);
        for (let f = 0; f < b.floors; f++) {
            // Each floor steps in slightly, so the floor count reads at a glance.
            const inset = f * 0.035;
            scl.set(b.w - inset, FLOOR_H, b.d - inset);
            pos.set(x, FLOOR_H / 2 + f * (FLOOR_H + FLOOR_GAP), z);
            m.compose(pos, q, scl);
            floors.setMatrixAt(idx, m);
            floors.setColorAt(idx, clay);
            baseColors.push(clay.clone());
            instanceOwner.push(b.id);
            idx++;
        }
        // Roof cap in the area colour: reads as architecture, not as a coloured crate.
        const top = b.floors * (FLOOR_H + FLOOR_GAP);
        const capInset = (b.floors - 1) * 0.035;
        scl.set(b.w - capInset + 0.06, ROOF_H, b.d - capInset + 0.06);
        pos.set(x, top + ROOF_H / 2 - FLOOR_GAP / 2, z);
        m.compose(pos, q, scl);
        floors.setMatrixAt(idx, m);
        floors.setColorAt(idx, accent);
        baseColors.push(accent.clone());
        instanceOwner.push(b.id);
        idx++;
        ownerRanges.set(b.id, [start, idx]);
        anchors.set(b.id, new THREE.Vector3(x, top + 0.25, z));
    }
    floors.instanceMatrix.needsUpdate = true;
    floors.instanceColor.needsUpdate = true;
    scene.add(floors);

    // ---- Landmarks ----
    const landmarkMeshes = [];
    const pickable = [floors];
    const tagged = (mesh, id) => {
        mesh.userData.itemId = id;
        // Landmarks glow warmly when hovered or selected.
        if (!mesh.material.emissive.getHex()) mesh.material.emissive.setHex(0x5a3a1c);
        mesh.userData.baseGlow = mesh.material.emissiveIntensity = id === 'contact' && mesh.geometry.type === 'SphereGeometry' ? 0.4 : 0;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        landmarkMeshes.push(mesh);
        pickable.push(mesh);
        scene.add(mesh);
        return mesh;
    };

    if (items.some((i) => i.id === 'about')) {
        const monolith = tagged(new THREE.Mesh(track(new THREE.BoxGeometry(0.55, 2.6, 0.3)), track(new THREE.MeshStandardMaterial({ color: COLORS.slate, roughness: 0.6 }))), 'about');
        monolith.position.set(0, 1.3, 0);
        monolith.rotation.y = 0.35;
        anchors.set('about', new THREE.Vector3(0, 2.95, 0));
    }

    const stonesItem = items.find((i) => i.id === 'skills');
    if (stonesItem) {
        const stoneGeo = track(new THREE.CylinderGeometry(0.2, 0.26, 0.42, 7));
        const n = stonesItem.count || 6;
        for (let i = 0; i < n; i++) {
            const a = (i / n) * Math.PI * 2 + 0.3;
            const stone = tagged(new THREE.Mesh(stoneGeo, track(new THREE.MeshStandardMaterial({ color: stonesItem.palette[i % stonesItem.palette.length], roughness: 0.85 }))), 'skills');
            stone.position.set(Math.cos(a) * 1.05, 0.21, Math.sin(a) * 1.05);
            stone.rotation.y = a;
        }
        anchors.set('skills', new THREE.Vector3(0.95, 0.75, -0.95));
    }

    if (items.some((i) => i.id === 'contact')) {
        const mastMat = track(new THREE.MeshStandardMaterial({ color: COLORS.mast, roughness: 0.5, metalness: 0.2 }));
        const corner = PLINTH / 2 - 0.4;
        const mast = tagged(new THREE.Mesh(track(new THREE.CylinderGeometry(0.05, 0.08, 3.2, 8)), mastMat), 'contact');
        mast.position.set(corner, 1.6, -corner);
        const dish = tagged(new THREE.Mesh(track(new THREE.SphereGeometry(0.2, 16, 12)), track(new THREE.MeshStandardMaterial({ color: 0xe9a35e, roughness: 0.4, emissive: 0x6b3a12, emissiveIntensity: 0.4 }))), 'contact');
        dish.position.set(corner, 3.25, -corner);
        anchors.set('contact', new THREE.Vector3(corner, 3.7, -corner));
    }

    renderer.shadowMap.needsUpdate = true;

    // ---- Camera: damped spherical rig. Target values are set; current values ease toward them. ----
    const view = { ...HOME };
    const goal = { ...HOME };
    let fitScale = 1;
    // Pixels the open panel covers; the view shifts so the subject stays in the free area.
    const inset = { x: 0, y: 0 };
    const homePolar = () => (camera.aspect < 1 ? 0.74 : HOME.polar);

    function applyCamera() {
        const r = view.radius * fitScale;
        camera.position.set(
            view.x + r * Math.sin(view.polar) * Math.sin(view.azimuth),
            view.y + r * Math.cos(view.polar),
            view.z + r * Math.sin(view.polar) * Math.cos(view.azimuth)
        );
        camera.lookAt(view.x, view.y, view.z);
    }

    // ---- Hover / selection colouring ----
    let hoverId = null;
    let selectedId = null;
    const tmpColor = new THREE.Color();
    const hoverColor = new THREE.Color(COLORS.hover);
    const buildingIds = new Set(buildings.map((b) => b.id));

    // Only called on state changes (hover target, selection), never per frame.
    function paint() {
        const dimOthers = selectedId && buildingIds.has(selectedId);
        for (let i = 0; i < instanceOwner.length; i++) {
            const owner = instanceOwner[i];
            tmpColor.copy(baseColors[i]);
            if (owner === hoverId && owner !== selectedId) tmpColor.lerp(hoverColor, 0.45);
            if (dimOthers && owner !== selectedId) tmpColor.multiplyScalar(0.62);
            floors.setColorAt(i, tmpColor);
        }
        floors.instanceColor.needsUpdate = true;
        for (const mesh of landmarkMeshes) {
            const on = mesh.userData.itemId === hoverId || mesh.userData.itemId === selectedId;
            mesh.material.emissiveIntensity = on ? 0.85 : mesh.userData.baseGlow;
        }
        requestRender();
    }

    // ---- Render on demand ----
    let frame = 0;
    let last = 0;
    let visible = true;
    let disposed = false;
    const projected = new Map();
    const v = new THREE.Vector3();

    function settle(dt) {
        const k = reducedMotion() ? 1 : 1 - Math.pow(0.0009, dt / 1000);
        let moving = false;
        for (const key of ['x', 'y', 'z', 'radius', 'polar', 'azimuth']) {
            const d = goal[key] - view[key];
            if (Math.abs(d) > 0.0005) {
                view[key] += d * k;
                moving = true;
            } else {
                view[key] = goal[key];
            }
        }
        return moving;
    }

    function draw(now) {
        frame = 0;
        if (disposed) return;
        const dt = last ? Math.min(now - last, 64) : 16;
        last = now;
        const moving = settle(dt);
        applyCamera();
        renderer.render(scene, camera);

        const w = canvas.clientWidth;
        const h = canvas.clientHeight;
        for (const [id, anchor] of anchors) {
            v.copy(anchor).project(camera);
            let p = projected.get(id);
            if (!p) projected.set(id, (p = { x: 0, y: 0, visible: true }));
            p.x = (v.x * 0.5 + 0.5) * w;
            p.y = (-v.y * 0.5 + 0.5) * h;
            p.visible = v.z < 1;
        }
        onProject(projected);

        if (moving) requestRender();
        else last = 0;
    }

    function requestRender() {
        if (frame || disposed || !visible) return;
        frame = requestAnimationFrame(draw);
    }

    // ---- Size ----
    function resize() {
        const w = host.clientWidth;
        const h = host.clientHeight;
        if (!w || !h) return;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        // Keep the whole plinth in frame on tall, narrow screens, seen more from above so labels spread out.
        fitScale = camera.aspect < 1 ? Math.min(1.6, 1 / Math.max(camera.aspect, 0.6)) : 1;
        if (!selectedId) goal.polar = view.polar = homePolar();
        applyInset();
        requestRender();
    }
    const ro = new ResizeObserver(resize);
    ro.observe(host);

    const io = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        if (visible) requestRender();
    });
    io.observe(host);

    // ---- Picking ----
    const raycaster = new THREE.Raycaster();
    const ndc = new THREE.Vector2();
    function pick(clientX, clientY) {
        const r = canvas.getBoundingClientRect();
        ndc.set(((clientX - r.left) / r.width) * 2 - 1, -((clientY - r.top) / r.height) * 2 + 1);
        raycaster.setFromCamera(ndc, camera);
        const hit = raycaster.intersectObjects(pickable, false)[0];
        if (!hit) return null;
        if (hit.object === floors) return instanceOwner[hit.instanceId] ?? null;
        return hit.object.userData.itemId ?? null;
    }

    // ---- Pointer: drag turns the model; a tap/click selects. Vertical page scroll is preserved. ----
    const ac = new AbortController();
    const opts = { signal: ac.signal };
    let drag = null;

    canvas.addEventListener('pointerdown', (e) => {
        if (e.button !== 0) return;
        drag = { id: e.pointerId, x: e.clientX, y: e.clientY, az: goal.azimuth, po: goal.polar, moved: false };
    }, opts);

    canvas.addEventListener('pointermove', (e) => {
        if (drag && e.pointerId === drag.id) {
            const dx = e.clientX - drag.x;
            const dy = e.clientY - drag.y;
            if (!drag.moved && Math.hypot(dx, dy) > 6) {
                drag.moved = true;
                canvas.setPointerCapture(e.pointerId);
                host.classList.add('is-dragging');
                host.dispatchEvent(new CustomEvent('maquette:interact'));
            }
            if (drag.moved) {
                goal.azimuth = drag.az - dx * 0.006;
                goal.polar = Math.min(1.25, Math.max(0.55, drag.po - dy * 0.004));
                requestRender();
            }
            return;
        }
        if (e.pointerType !== 'mouse') return;
        const id = pick(e.clientX, e.clientY);
        if (id !== hoverId) {
            hoverId = id;
            canvas.style.cursor = id ? 'pointer' : 'grab';
            onHover(id);
            paint();
        }
    }, { ...opts, passive: true });

    const endDrag = (e) => {
        if (!drag || e.pointerId !== drag.id) return;
        const wasDrag = drag.moved;
        drag = null;
        host.classList.remove('is-dragging');
        if (!wasDrag) {
            const id = pick(e.clientX, e.clientY);
            if (id) onSelect(id);
        }
    };
    canvas.addEventListener('pointerup', endDrag, opts);
    canvas.addEventListener('pointercancel', () => {
        drag = null;
        host.classList.remove('is-dragging');
    }, opts);
    canvas.addEventListener('pointerleave', () => {
        if (hoverId && !drag) {
            hoverId = null;
            onHover(null);
            paint();
        }
    }, opts);

    canvas.addEventListener('webglcontextlost', (e) => {
        e.preventDefault();
        onLost();
    }, opts);

    function applyInset() {
        const w = host.clientWidth;
        const h = host.clientHeight;
        if (inset.x || inset.y) camera.setViewOffset(w, h, inset.x / 2, inset.y / 2, w, h);
        else camera.clearViewOffset();
        camera.updateProjectionMatrix();
    }

    resize();
    applyCamera();
    requestRender();

    return {
        /** Highlight from outside (e.g. a focused label). */
        setHover(id) {
            if (id === hoverId) return;
            hoverId = id;
            paint();
        },
        /** Frame an item; null returns to the overview. */
        focus(id) {
            selectedId = id;
            const a = id && anchors.get(id);
            if (a) {
                Object.assign(goal, { x: a.x * 0.8, y: Math.max(0.4, a.y * 0.4), z: a.z * 0.8, radius: 13.5 });
            } else {
                Object.assign(goal, { x: HOME.x, y: HOME.y, z: HOME.z, radius: HOME.radius });
            }
            paint();
        },
        reset() {
            selectedId = null;
            Object.assign(goal, HOME, { polar: homePolar() });
            paint();
        },
        /**
         * A scroll-story viewpoint: frame `id` (null = the whole model) from a
         * turn of `turn` radians off the home azimuth, by the shortest way
         * round, so chapters glide rather than spin.
         */
        story({ id = null, turn = 0, radius } = {}) {
            selectedId = id;
            const a = id && anchors.get(id);
            const target = a
                ? { x: a.x * 0.8, y: Math.max(0.4, a.y * 0.4), z: a.z * 0.8, radius: radius ?? 13.5 }
                : { x: HOME.x, y: HOME.y, z: HOME.z, radius: radius ?? HOME.radius };
            const want = HOME.azimuth + turn;
            const delta = Math.atan2(Math.sin(want - goal.azimuth), Math.cos(want - goal.azimuth));
            Object.assign(goal, target, { azimuth: goal.azimuth + delta, polar: homePolar() });
            paint();
        },
        /** Space covered by an overlay (px): x from the right, y from the bottom. */
        setInset(x, y) {
            inset.x = x;
            inset.y = y;
            applyInset();
            requestRender();
        },
        /** Turn the model by a step (keyboard alternative to dragging). */
        rotate(step) {
            goal.azimuth += step;
            requestRender();
        },
        dispose() {
            disposed = true;
            cancelAnimationFrame(frame);
            ac.abort();
            ro.disconnect();
            io.disconnect();
            disposables.forEach((d) => d.dispose());
            floors.dispose();
            renderer.dispose();
            canvas.remove();
        },
    };
}
