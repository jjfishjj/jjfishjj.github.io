import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const canvas = document.querySelector("#campus-canvas");
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0d121a);
scene.fog = new THREE.Fog(0x0d121a, 55, 155);

const camera = new THREE.PerspectiveCamera(48, 1, 0.1, 500);
camera.position.set(42, 42, 58);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.target.set(0, 0, 0);
controls.maxPolarAngle = Math.PI * 0.48;
controls.minDistance = 18;
controls.maxDistance = 130;

const materials = {
  ground: new THREE.MeshStandardMaterial({ color: 0x25352c, roughness: 0.95 }),
  road: new THREE.MeshStandardMaterial({ color: 0x20252d, roughness: 0.86 }),
  path: new THREE.MeshStandardMaterial({ color: 0x6f6b59, roughness: 0.9 }),
  plaza: new THREE.MeshStandardMaterial({ color: 0x958a72, roughness: 0.76 }),
  buildingA: new THREE.MeshStandardMaterial({ color: 0xc2d7e8, roughness: 0.7 }),
  buildingB: new THREE.MeshStandardMaterial({ color: 0xd6ba82, roughness: 0.76 }),
  buildingC: new THREE.MeshStandardMaterial({ color: 0xbac0c8, roughness: 0.72 }),
  roof: new THREE.MeshStandardMaterial({ color: 0x485160, roughness: 0.8 }),
  glass: new THREE.MeshStandardMaterial({ color: 0x7dc7d8, roughness: 0.35, metalness: 0.1 }),
  tree: new THREE.MeshStandardMaterial({ color: 0x2f8f5d, roughness: 0.82 }),
  trunk: new THREE.MeshStandardMaterial({ color: 0x7d5a3e, roughness: 0.95 }),
  route: new THREE.LineBasicMaterial({ color: 0x4fd1a5, linewidth: 3 }),
  robot: new THREE.MeshStandardMaterial({ color: 0xf6c85f, roughness: 0.48, metalness: 0.08 })
};

function box(name, size, position, material, castShadow = true) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), material);
  mesh.name = name;
  mesh.position.set(...position);
  mesh.castShadow = castShadow;
  mesh.receiveShadow = true;
  scene.add(mesh);
  return mesh;
}

function cylinder(name, radiusTop, radiusBottom, height, position, material, segments = 24) {
  const mesh = new THREE.Mesh(
    new THREE.CylinderGeometry(radiusTop, radiusBottom, height, segments),
    material
  );
  mesh.name = name;
  mesh.position.set(...position);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  scene.add(mesh);
  return mesh;
}

box("campus ground", [120, 0.4, 92], [0, -0.22, 0], materials.ground, false);
box("main boulevard", [12, 0.05, 88], [-14, 0.03, 0], materials.road, false);
box("east campus road", [82, 0.05, 10], [16, 0.04, -20], materials.road, false);
box("science walkway", [70, 0.06, 4], [12, 0.08, 18], materials.path, false);
box("central plaza", [24, 0.08, 20], [4, 0.11, 2], materials.plaza, false);
box("main gate marker", [18, 3.6, 1.2], [-14, 1.8, 43], materials.buildingB);

const buildingData = [
  ["engineering hall", [16, 10, 13], [-38, 5, 10], materials.buildingA],
  ["library", [20, 7, 15], [12, 3.5, 27], materials.buildingB],
  ["admin center", [14, 8, 12], [32, 4, 5], materials.buildingC],
  ["ai lab", [14, 11, 14], [34, 5.5, -28], materials.buildingA],
  ["student center", [18, 6, 10], [-37, 3, -25], materials.buildingB],
  ["robotics lab", [14, 8, 12], [4, 4, -33], materials.buildingC],
  ["lecture hall", [12, 7, 18], [-5, 3.5, 30], materials.buildingC],
  ["innovation hub", [16, 12, 12], [44, 6, 24], materials.buildingA]
];

for (const [name, size, position, material] of buildingData) {
  const building = box(name, size, position, material);
  box(`${name} roof`, [size[0] + 0.8, 0.6, size[2] + 0.8], [position[0], position[1] + size[1] / 2 + 0.3, position[2]], materials.roof);
  box(`${name} glass`, [size[0] * 0.72, size[1] * 0.46, 0.18], [position[0], position[1], position[2] + size[2] / 2 + 0.1], materials.glass);
  building.userData.kind = "campus-building";
}

const treePositions = [
  [-28, 0, 35], [-20, 0, 34], [-7, 0, 35], [8, 0, 38], [24, 0, 36],
  [-26, 0, 19], [-13, 0, 19], [6, 0, 18], [20, 0, 18], [36, 0, 18],
  [-47, 0, -7], [-28, 0, -6], [-2, 0, -7], [21, 0, -8], [46, 0, -8],
  [-44, 0, -38], [-29, 0, -38], [-11, 0, -39], [15, 0, -40], [35, 0, -40]
];

for (const [x, , z] of treePositions) {
  cylinder("tree trunk", 0.28, 0.34, 2.5, [x, 1.25, z], materials.trunk, 10);
  cylinder("tree canopy", 1.8, 0.7, 4.4, [x, 4.3, z], materials.tree, 18);
}

const routePoints = [
  new THREE.Vector3(-14, 0.4, 42),
  new THREE.Vector3(-14, 0.4, 12),
  new THREE.Vector3(4, 0.4, 2),
  new THREE.Vector3(12, 0.4, 23),
  new THREE.Vector3(31, 0.4, 5),
  new THREE.Vector3(34, 0.4, -25),
  new THREE.Vector3(4, 0.4, -33),
  new THREE.Vector3(-14, 0.4, -5)
];
const route = new THREE.Line(new THREE.BufferGeometry().setFromPoints(routePoints), materials.route);
route.name = "isaac patrol route";
scene.add(route);

const robot = new THREE.Group();
robot.name = "isaac patrol robot";
const robotBase = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.8, 2.3), materials.robot);
const robotMast = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 2.8, 16), materials.robot);
const robotSensor = new THREE.Mesh(new THREE.SphereGeometry(0.55, 24, 12), materials.glass);
robotBase.castShadow = true;
robotMast.position.y = 1.6;
robotSensor.position.y = 3.05;
robot.add(robotBase, robotMast, robotSensor);
scene.add(robot);

const sun = new THREE.DirectionalLight(0xfff4d0, 3.2);
sun.position.set(32, 62, 24);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
scene.add(sun);
scene.add(new THREE.HemisphereLight(0x8ecaff, 0x203525, 1.4));

function addCampusLight(x, z) {
  const pole = cylinder("campus light pole", 0.08, 0.08, 4.5, [x, 2.25, z], materials.roof, 10);
  const bulb = new THREE.PointLight(0xf6c85f, 1.1, 20);
  bulb.position.set(x, 4.8, z);
  scene.add(bulb);
  return pole;
}

[-32, -14, 4, 22, 40].forEach((x) => addCampusLight(x, 18));
[-14, 12, 34].forEach((x) => addCampusLight(x, -20));

const views = {
  overview: { camera: [42, 42, 58], target: [0, 0, 0] },
  gate: { camera: [-28, 16, 58], target: [-14, 2, 31] },
  plaza: { camera: [23, 18, 27], target: [4, 1, 2] }
};

function setView(view) {
  const next = views[view];
  camera.position.set(...next.camera);
  controls.target.set(...next.target);
  controls.update();
}

document.querySelector("#view-overview").addEventListener("click", () => setView("overview"));
document.querySelector("#view-gate").addEventListener("click", () => setView("gate"));
document.querySelector("#view-plaza").addEventListener("click", () => setView("plaza"));

document.querySelector("#toggle-route").addEventListener("click", (event) => {
  route.visible = !route.visible;
  event.currentTarget.textContent = route.visible ? "Route On" : "Route Off";
  event.currentTarget.setAttribute("aria-pressed", String(route.visible));
});

const pathCurve = new THREE.CatmullRomCurve3(routePoints, true);
let clock = new THREE.Clock();
let routeTime = 0;

function resize() {
  const { clientWidth, clientHeight } = canvas;
  renderer.setSize(clientWidth, clientHeight, false);
  camera.aspect = clientWidth / Math.max(clientHeight, 1);
  camera.updateProjectionMatrix();
}

function animate() {
  resize();
  const delta = clock.getDelta();
  routeTime = (routeTime + delta * 0.045) % 1;
  const point = pathCurve.getPointAt(routeTime);
  const ahead = pathCurve.getPointAt((routeTime + 0.01) % 1);
  robot.position.copy(point);
  robot.lookAt(ahead.x, point.y, ahead.z);
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

animate();
