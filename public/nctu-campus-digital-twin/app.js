import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const canvas = document.querySelector("#campus-canvas");
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x93bed2);
scene.fog = new THREE.Fog(0x93bed2, 100, 220);

const camera = new THREE.PerspectiveCamera(46, 1, 0.1, 500);
camera.position.set(88, 76, 104);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.target.set(0, 0, 0);
controls.maxPolarAngle = Math.PI * 0.48;
controls.minDistance = 20;
controls.maxDistance = 190;

const materials = {
  lawn: new THREE.MeshStandardMaterial({ color: 0x6f9c68, roughness: 0.96 }),
  road: new THREE.MeshStandardMaterial({ color: 0x4b5158, roughness: 0.9 }),
  path: new THREE.MeshStandardMaterial({ color: 0xb9ac91, roughness: 0.9 }),
  water: new THREE.MeshStandardMaterial({ color: 0x55a9bd, roughness: 0.24, metalness: 0.08 }),
  track: new THREE.MeshStandardMaterial({ color: 0xb65f4d, roughness: 0.86, side: THREE.DoubleSide }),
  field: new THREE.MeshStandardMaterial({ color: 0x4d8f56, roughness: 0.96 }),
  roof: new THREE.MeshStandardMaterial({ color: 0x5b626a, roughness: 0.82 }),
  academic: new THREE.MeshStandardMaterial({ color: 0xd6d0bf, roughness: 0.78 }),
  engineering: new THREE.MeshStandardMaterial({ color: 0xbfc9ce, roughness: 0.72 }),
  landmark: new THREE.MeshStandardMaterial({ color: 0xd7ae6f, roughness: 0.7 }),
  residence: new THREE.MeshStandardMaterial({ color: 0xc89473, roughness: 0.8 }),
  glass: new THREE.MeshStandardMaterial({ color: 0x73b9c8, roughness: 0.3, metalness: 0.08 }),
  tree: new THREE.MeshStandardMaterial({ color: 0x2f7750, roughness: 0.88 }),
  trunk: new THREE.MeshStandardMaterial({ color: 0x76513b, roughness: 0.96 }),
  route: new THREE.LineBasicMaterial({ color: 0xffcf4a }),
  robot: new THREE.MeshStandardMaterial({ color: 0xf2c84b, roughness: 0.42, metalness: 0.12 })
};

function box(name, size, position, material, rotation = 0) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), material);
  mesh.name = name;
  mesh.position.set(...position);
  mesh.rotation.y = rotation;
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  scene.add(mesh);
  return mesh;
}

function addBuilding(name, size, position, material, rotation = 0) {
  const building = box(name, size, position, material, rotation);
  const roof = box(`${name} roof`, [size[0] + 0.5, 0.45, size[2] + 0.5], [position[0], position[1] + size[1] / 2 + 0.22, position[2]], materials.roof, rotation);
  building.userData.kind = "building";
  roof.userData.kind = "roof";
  return building;
}

function addRoad(points, width, material = materials.road) {
  const curve = new THREE.CatmullRomCurve3(points.map(([x, z]) => new THREE.Vector3(x, 0.08, z)));
  const road = new THREE.Mesh(new THREE.TubeGeometry(curve, 48, width / 2, 8, false), material);
  road.scale.y = 0.055;
  road.receiveShadow = true;
  scene.add(road);
  return curve;
}

function addLabel(text, position, width = 16) {
  const labelCanvas = document.createElement("canvas");
  labelCanvas.width = 512;
  labelCanvas.height = 128;
  const context = labelCanvas.getContext("2d");
  context.fillStyle = "rgba(17, 25, 31, 0.86)";
  context.roundRect(8, 8, 496, 112, 18);
  context.fill();
  context.font = "600 42px sans-serif";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillStyle = "#ffffff";
  context.fillText(text, 256, 65);
  const texture = new THREE.CanvasTexture(labelCanvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, transparent: true, depthTest: false }));
  sprite.position.set(...position);
  sprite.scale.set(width, width / 4, 1);
  sprite.renderOrder = 20;
  scene.add(sprite);
  return sprite;
}

const campusShape = new THREE.Shape();
campusShape.moveTo(-66, -22);
campusShape.lineTo(-53, -48);
campusShape.lineTo(8, -54);
campusShape.lineTo(52, -38);
campusShape.lineTo(66, -6);
campusShape.lineTo(61, 33);
campusShape.lineTo(35, 50);
campusShape.lineTo(-34, 51);
campusShape.lineTo(-61, 34);
campusShape.closePath();
const campus = new THREE.Mesh(new THREE.ShapeGeometry(campusShape), materials.lawn);
campus.rotation.x = -Math.PI / 2;
campus.receiveShadow = true;
scene.add(campus);

box("Daxue Road", [9, 0.18, 132], [70, -0.02, 2], materials.road, -0.12);
addRoad([[-62, -20], [-34, -18], [-7, -13], [23, -8], [58, 2]], 5.5);
addRoad([[67, 22], [59, 22], [54, 18], [47, 14], [38, 13], [28, 11], [-3, 17], [-28, 20], [-53, 27]], 5);
addRoad([[-34, -42], [-31, -18], [-28, 3], [-28, 28], [-20, 45]], 4.2);
addRoad([[12, -45], [12, -24], [14, -2], [21, 19], [31, 40]], 4.2);
addRoad([[-50, 34], [-20, 30], [10, 29], [35, 38], [50, 37], [58, 25]], 3.6, materials.path);

const lake = new THREE.Mesh(new THREE.CylinderGeometry(10, 10, 0.28, 48), materials.water);
lake.name = "竹湖";
lake.position.set(46, 0.06, 31);
lake.scale.z = 0.62;
lake.receiveShadow = true;
scene.add(lake);

const track = new THREE.Mesh(new THREE.RingGeometry(9, 13, 64), materials.track);
track.rotation.x = -Math.PI / 2;
track.position.set(-45, 0.14, 38);
track.scale.x = 1.55;
scene.add(track);
const athleticField = new THREE.Mesh(new THREE.CircleGeometry(8.7, 48), materials.field);
athleticField.rotation.x = -Math.PI / 2;
athleticField.position.set(-45, 0.15, 38);
athleticField.scale.x = 1.55;
scene.add(athleticField);

const buildings = [
  ["浩然圖書館", [18, 10, 16], [12, 5, -2], materials.landmark, 0.06],
  ["行政大樓", [13, 7, 10], [28, 3.5, 24], materials.landmark, -0.08],
  ["中正堂", [14, 6, 9], [30, 3, 25], materials.academic, -0.18],
  ["資訊技術服務中心", [13, 7, 8], [8, 3.5, 19], materials.academic, 0.08],
  ["工程一館", [15, 8, 10], [-16, 4, 4], materials.engineering, -0.05],
  ["工程二館", [17, 9, 11], [-17, 4.5, -13], materials.engineering, 0.04],
  ["工程三館", [16, 8, 10], [-4, 4, -29], materials.engineering, -0.16],
  ["工程四館", [13, 8, 9], [-28, 4, 14], materials.engineering, 0.06],
  ["工程五館", [15, 10, 10], [-35, 5, 1], materials.engineering, -0.08],
  ["工程六館", [13, 8, 10], [-29, 4, -13], materials.engineering, -0.12],
  ["科學一館", [14, 8, 9], [-7, 4, 31], materials.academic, -0.04],
  ["科學二館", [12, 7, 9], [-19, 3.5, 33], materials.academic, 0.1],
  ["科學三館", [13, 8, 8], [-7, 4, 18], materials.academic, 0.02],
  ["生物醫學大樓", [13, 9, 10], [46, 4.5, -8], materials.academic, -0.25],
  ["電子資訊研究大樓", [12, 10, 9], [43, 5, -23], materials.engineering, -0.18],
  ["管理一館", [13, 7, 9], [0, 3.5, -17], materials.academic, 0.05],
  ["綜合球館", [17, 7, 12], [-23, 3.5, 44], materials.academic, -0.08],
  ["學生宿舍九舍", [12, 8, 7], [12, 4, 41], materials.residence, -0.08],
  ["學生宿舍十舍", [12, 8, 7], [26, 4, 41], materials.residence, -0.08],
  ["學生宿舍十一舍", [12, 8, 7], [39, 4, 36], materials.residence, -0.14],
  ["學生宿舍十二舍", [12, 8, 7], [-39, 4, -34], materials.residence, -0.1],
  ["學生宿舍十三舍", [12, 8, 7], [-26, 4, -39], materials.residence, -0.08],
  ["學生餐廳", [14, 5, 8], [-12, 2.5, -43], materials.residence, 0.05],
  ["竹軒女舍", [14, 8, 8], [13, 4, -44], materials.residence, 0.1]
];

for (const [name, size, position, material, rotation] of buildings) {
  addBuilding(name, size, position, material, rotation);
}

box("北大門北柱", [1.8, 5.5, 3.2], [62, 2.75, 27.5], materials.landmark, 0);
box("北大門南柱", [1.8, 5.5, 3.2], [62, 2.75, 16.5], materials.landmark, 0);
box("北大門門楣", [1.3, 1, 8], [62, 5.4, 22], materials.landmark, 0);
box("南大門", [1.2, 4, 12], [-63, 2, -20], materials.landmark, 0.18);

const labelGroup = new THREE.Group();
scene.add(labelGroup);
for (const [text, position, width] of [
  ["北大門", [62, 8, 22], 8],
  ["南大門", [-59, 7, -21], 12],
  ["竹湖", [46, 4, 31], 9],
  ["浩然圖書館", [12, 13, -2], 18],
  ["行政大樓", [28, 10, 24], 15],
  ["工程館群", [-23, 14, -5], 15],
  ["田徑場", [-45, 5, 38], 12],
  ["學生宿舍區", [25, 13, 41], 17]
]) {
  labelGroup.add(addLabel(text, position, width));
}

function addTree(x, z, scale = 1) {
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.22 * scale, 0.3 * scale, 2.2 * scale, 8), materials.trunk);
  const crown = new THREE.Mesh(new THREE.ConeGeometry(1.35 * scale, 3.5 * scale, 12), materials.tree);
  trunk.position.set(x, 1.1 * scale, z);
  crown.position.set(x, 3.6 * scale, z);
  trunk.castShadow = true;
  crown.castShadow = true;
  scene.add(trunk, crown);
}

for (let i = 0; i < 88; i += 1) {
  const angle = (i / 88) * Math.PI * 2;
  const radiusX = 57 + Math.sin(i * 2.7) * 4;
  const radiusZ = 43 + Math.cos(i * 1.9) * 3;
  addTree(Math.cos(angle) * radiusX, Math.sin(angle) * radiusZ, 0.75 + (i % 4) * 0.08);
}
for (const [x, z] of [[-41, 13], [-38, 20], [-12, 9], [1, 8], [20, 8], [38, 3], [52, 26], [25, -16], [2, -39], [-48, -8], [-51, 4]]) {
  addTree(x, z, 0.9);
}

const routePoints = [
  new THREE.Vector3(57, 0.65, 24),
  new THREE.Vector3(34, 0.65, 18),
  new THREE.Vector3(15, 0.65, 2),
  new THREE.Vector3(-14, 0.65, 3),
  new THREE.Vector3(-25, 0.65, -14),
  new THREE.Vector3(0, 0.65, -18),
  new THREE.Vector3(18, 0.65, -4),
  new THREE.Vector3(42, 0.65, 9)
];
const patrolCurve = new THREE.CatmullRomCurve3(routePoints, true);
const route = new THREE.Line(new THREE.BufferGeometry().setFromPoints(patrolCurve.getPoints(120)), materials.route);
scene.add(route);

const robot = new THREE.Group();
const robotBase = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.8, 2), materials.robot);
const robotMast = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 2.5, 16), materials.robot);
const robotSensor = new THREE.Mesh(new THREE.SphereGeometry(0.48, 20, 12), materials.glass);
robotMast.position.y = 1.55;
robotSensor.position.y = 2.9;
robot.add(robotBase, robotMast, robotSensor);
scene.add(robot);

const sun = new THREE.DirectionalLight(0xfff1cf, 3.1);
sun.position.set(60, 90, 45);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
sun.shadow.camera.left = -90;
sun.shadow.camera.right = 90;
sun.shadow.camera.top = 90;
sun.shadow.camera.bottom = -90;
scene.add(sun);
scene.add(new THREE.HemisphereLight(0xd7efff, 0x355538, 1.8));

const views = {
  overview: { camera: [88, 76, 104], target: [0, 0, 0] },
  northGate: { camera: [82, 9, 22], target: [42, 2, 22] },
  library: { camera: [35, 24, 29], target: [12, 3, -2] },
  lake: { camera: [72, 25, 31], target: [43, 1, 11] }
};

function setView(key) {
  camera.position.set(...views[key].camera);
  controls.target.set(...views[key].target);
  controls.update();
}

document.querySelector("#view-overview").addEventListener("click", () => setView("overview"));
document.querySelector("#view-north-gate").addEventListener("click", () => setView("northGate"));
document.querySelector("#view-library").addEventListener("click", () => setView("library"));
document.querySelector("#view-lake").addEventListener("click", () => setView("lake"));
document.querySelector("#toggle-labels").addEventListener("click", (event) => {
  labelGroup.visible = !labelGroup.visible;
  event.currentTarget.textContent = labelGroup.visible ? "地標開啟" : "地標關閉";
  event.currentTarget.setAttribute("aria-pressed", String(labelGroup.visible));
});
document.querySelector("#toggle-route").addEventListener("click", (event) => {
  route.visible = !route.visible;
  robot.visible = route.visible;
  event.currentTarget.textContent = route.visible ? "路線開啟" : "路線關閉";
  event.currentTarget.setAttribute("aria-pressed", String(route.visible));
});

const clock = new THREE.Clock();
let routeTime = 0;

function resize() {
  const { clientWidth, clientHeight } = canvas;
  renderer.setSize(clientWidth, clientHeight, false);
  camera.aspect = clientWidth / Math.max(clientHeight, 1);
  camera.updateProjectionMatrix();
}

function animate() {
  resize();
  routeTime = (routeTime + clock.getDelta() * 0.035) % 1;
  const point = patrolCurve.getPointAt(routeTime);
  const ahead = patrolCurve.getPointAt((routeTime + 0.008) % 1);
  robot.position.copy(point);
  robot.lookAt(ahead.x, point.y, ahead.z);
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

animate();
