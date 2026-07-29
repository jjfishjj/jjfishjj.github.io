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
addRoad([[-62, -20], [-43, -18], [-28, -13], [-13, -9], [3, -7], [15, -3], [26, 5]], 5.5);
addRoad([[67, 22], [59, 22], [54, 19], [48, 16], [40, 14], [31, 10], [26, 5], [15, -3], [3, -7], [-12, -5], [-27, 1], [-42, 12]], 5);
addRoad([[-34, -42], [-31, -18], [-28, 3], [-28, 28], [-20, 45]], 4.2);
addRoad([[18, -45], [18, -25], [20, -10], [22, 3], [26, 15], [31, 40]], 4.2);
addRoad([[-50, 34], [-20, 30], [10, 29], [35, 38], [50, 37], [58, 25]], 3.6, materials.path);
addRoad([[-43, 12], [-36, 2], [-31, -11], [-20, -20], [-5, -25], [8, -28]], 3.4, materials.path);
box("library plaza", [22, 0.08, 12], [8, 0.11, 8], materials.path);

const lake = new THREE.Mesh(new THREE.CylinderGeometry(10, 10, 0.28, 48), materials.water);
lake.name = "竹湖";
lake.position.set(46, 0.06, 31);
lake.scale.z = 0.62;
lake.receiveShadow = true;
lake.userData.landmark = "lake";
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

const buildingMeshes = new Map();
const buildings = [
  ["浩然圖書館", [18, 10, 16], [8, 5, -4], materials.landmark, 0.02],
  ["行政大樓", [13, 7, 10], [28, 3.5, 24], materials.landmark, -0.08],
  ["中正堂", [14, 6, 9], [30, 3, 25], materials.academic, -0.18],
  ["資訊技術服務中心", [13, 7, 8], [8, 3.5, 19], materials.academic, 0.08],
  ["工程一館", [15, 8, 10], [-24, 4, 1], materials.engineering, -0.05],
  ["工程二館", [17, 9, 11], [-14, 4.5, -13], materials.engineering, 0.04],
  ["工程三館", [16, 8, 10], [2, 4, -27], materials.engineering, -0.12],
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
  buildingMeshes.set(name, addBuilding(name, size, position, material, rotation));
}

buildingMeshes.get("行政大樓").userData.landmark = "administration";

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
  ["浩然圖書館", [8, 13, -4], 18],
  ["行政大樓", [28, 10, 24], 15],
  ["工程館群", [-23, 14, -5], 15],
  ["田徑場", [-45, 5, 38], 12],
  ["學生宿舍區", [25, 13, 41], 17]
]) {
  labelGroup.add(addLabel(text, position, width));
}

const landmarkData = {
  lake: {
    title: "竹湖",
    image: "https://nctuhistory.lib.nycu.edu.tw/collectionImg/306-1969-0003-0370001.jpg",
    alt: "從竹湖遠望圖書館、行政大樓與中正堂的歷史照片",
    description: "竹湖位於北大門進校後的左側，是光復校區早期核心景觀。這張 1981 年官方典藏照片由湖畔望向圖書館、行政大樓與中正堂。",
    source: "https://nctuhistory.lib.nycu.edu.tw/list_detail.aspx?cultiD=8677&search_mode=1&search_val=%E4%B8%AD%E6%AD%A3%E5%A0%82&url=4"
  },
  administration: {
    title: "行政大樓",
    image: "https://nctuhistory.lib.nycu.edu.tw/collectionImg/306-1969-0003-1560001.jpg",
    alt: "交通大學光復校區行政大樓歷史照片",
    description: "行政大樓位於竹湖更內側，是光復校區早期行政核心，與中正堂、圖書館共同構成北大門進校後的重要建築群。照片為 1981 年官方典藏。",
    source: "https://nctuhistory.lib.nycu.edu.tw/search_solution.aspx?search_mode=1&search_val=%E8%A1%8C%E6%94%BF%E5%A4%A7%E6%A8%93"
  }
};

const detailPanel = document.querySelector("#landmark-detail");
const detailTitle = document.querySelector("#detail-title");
const detailImage = document.querySelector("#detail-image");
const detailDescription = document.querySelector("#detail-description");
const detailSource = document.querySelector("#detail-source");
const interactiveLandmarks = [lake, buildingMeshes.get("行政大樓")];

function showLandmark(key) {
  const data = landmarkData[key];
  detailTitle.textContent = data.title;
  detailImage.src = data.image;
  detailImage.alt = data.alt;
  detailDescription.textContent = data.description;
  detailSource.href = data.source;
  detailPanel.hidden = false;
}

document.querySelector("#close-detail").addEventListener("click", () => {
  detailPanel.hidden = true;
});

const landmarkRaycaster = new THREE.Raycaster();
const landmarkPointer = new THREE.Vector2();
let pointerStart = null;

function updateLandmarkPointer(event) {
  const bounds = canvas.getBoundingClientRect();
  landmarkPointer.x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
  landmarkPointer.y = -((event.clientY - bounds.top) / bounds.height) * 2 + 1;
  landmarkRaycaster.setFromCamera(landmarkPointer, camera);
  return landmarkRaycaster.intersectObjects(interactiveLandmarks, false)[0];
}

canvas.addEventListener("pointerdown", (event) => {
  pointerStart = { x: event.clientX, y: event.clientY };
});

canvas.addEventListener("pointermove", (event) => {
  canvas.style.cursor = updateLandmarkPointer(event) ? "pointer" : "grab";
});

canvas.addEventListener("pointerup", (event) => {
  if (!pointerStart || Math.hypot(event.clientX - pointerStart.x, event.clientY - pointerStart.y) > 5) {
    pointerStart = null;
    return;
  }
  const hit = updateLandmarkPointer(event);
  if (hit?.object.userData.landmark) {
    showLandmark(hit.object.userData.landmark);
  }
  pointerStart = null;
});

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
  library: { camera: [32, 24, 25], target: [8, 3, -4] },
  lake: { camera: [70, 24, 45], target: [46, 1, 31] }
};

const tourRoutes = {
  core: {
    label: "校園核心",
    points: [[82, 4.6, 22], [69, 4.5, 22], [61, 4.5, 22], [56, 4.5, 23], [52, 4.5, 25], [49, 4.5, 30], [43, 4.5, 35], [41, 4.5, 37], [36, 4.5, 34], [37, 4.5, 29], [38, 4.5, 23], [37, 4.5, 17], [36, 4.5, 10], [38, 5, 5], [41, 5.8, 0], [44, 6.5, -4]],
    stops: [
      { title: "北大門", progress: 0, narration: "導覽從光復校區北大門出發。穿過校門後，竹湖位於行進方向左側，中央道路則向校園核心延伸。" },
      { title: "竹湖", progress: 0.34, landmark: "lake", narration: "竹湖是光復校區早期的重要景觀。從湖畔可以辨認行政大樓、中正堂與浩然圖書館形成的校園東部核心。" },
      { title: "行政大樓", progress: 0.58, landmark: "administration", narration: "行政大樓位於竹湖內側，是校園早期行政核心。導覽在此轉入中央道路，繼續前往浩然圖書館。" },
      { title: "浩然圖書館", progress: 1, narration: "浩然圖書館位於中央教學區東側，周圍連接工程館群與主要校園道路。本次校園核心導覽在此完成。" }
    ],
    durations: [7, 6, 9],
    endTarget: [8, 4, -4]
  },
  engineering: {
    label: "工程館群",
    points: [[32, 6, -4], [25, 5, -2], [18, 5, 3], [7, 5, 6], [-5, 5, 8], [-16, 5, 10], [-24, 5, 10], [-18, 5, 6], [-9, 5, 0], [-2, 5, -7], [-1, 5, -13], [-7, 5, -5], [-18, 5, -3], [-29, 5, -3]],
    stops: [
      { title: "浩然圖書館", progress: 0, narration: "工程館群導覽從浩然圖書館東側出發，沿中央教學區道路往西進入主要工程館區。" },
      { title: "工程一館", progress: 0.42, narration: "工程一館位於工程館群北側，周圍連接科學館群與校園中央道路，是工程教學區的重要入口。" },
      { title: "工程二館", progress: 0.72, narration: "工程二館位於工程館群南側，與管理一館及工程三館共同形成中央偏南的教學區。" },
      { title: "工程六館", progress: 1, narration: "工程六館位於工程館群西南側。從此處可沿內環道路前往其他工程館與南側生活區。" }
    ],
    durations: [7, 6, 7],
    endTarget: [-29, 4, -13]
  },
  residence: {
    label: "宿舍生活區",
    points: [[60, 5, 22], [55, 5, 28], [50, 5, 36], [42, 5, 46], [32, 5, 49], [26, 5, 49], [19, 5, 49], [12, 5, 49], [18, 5, 43], [20, 5, 30], [20, 5, 15], [18, 5, 0], [15, 5, -15], [8, 5, -28], [0, 5, -40], [-12, 5, -52]],
    stops: [
      { title: "北大門", progress: 0, narration: "宿舍生活區導覽從北大門內側出發，先沿東側道路前往校園北側的學生宿舍。" },
      { title: "學生宿舍十一舍", progress: 0.22, narration: "十一舍位於校園東北側，鄰近竹湖與北側生活動線，是北側宿舍群的第一站。" },
      { title: "學生宿舍九、十舍", progress: 0.48, narration: "九舍與十舍並列於校園北側，周圍連接餐飲、運動及中央教學區的步行路線。" },
      { title: "學生餐廳", progress: 1, narration: "學生餐廳位於校園南側生活區，鄰近南側宿舍與主要步道，宿舍生活區導覽在此完成。" }
    ],
    durations: [7, 7, 12],
    endTarget: [-12, 2.5, -43]
  },
  sports: {
    label: "運動區",
    points: [[32, 6, -4], [23, 5, 3], [12, 5, 12], [0, 5, 23], [-10, 5, 34], [-18, 5, 42], [-23, 5, 52], [-32, 5, 49], [-40, 5, 47], [-45, 5, 50]],
    stops: [
      { title: "浩然圖書館", progress: 0, narration: "運動區導覽從浩然圖書館出發，沿中央道路往校園西北側前進。" },
      { title: "綜合球館", progress: 0.65, narration: "綜合球館位於校園北側，是室內球類、訓練與大型活動的重要場地。" },
      { title: "田徑場", progress: 1, narration: "田徑場位於綜合球館西側，包含環形跑道與中央運動場，本次運動區導覽在此完成。" }
    ],
    durations: [10, 7],
    endTarget: [-45, 1, 38]
  }
};

const walkTourButton = document.querySelector("#walk-tour");
const tourGuide = document.querySelector("#tour-guide");
const tourStep = document.querySelector("#tour-step");
const tourTitle = document.querySelector("#tour-title");
const tourNarration = document.querySelector("#tour-narration");
const tourPercent = document.querySelector("#tour-percent");
const tourProgress = document.querySelector(".tour-progress");
const tourProgressFill = document.querySelector("#tour-progress-fill");
const tourPauseButton = document.querySelector("#tour-pause");
const tourAudioButton = document.querySelector("#tour-audio");
const tourExitButton = document.querySelector("#tour-exit");
const tourMapRoute = document.querySelector("#tour-map-route");
const tourMapStations = document.querySelector("#tour-map-stations");
const tourMapPosition = document.querySelector("#tour-map-position");
const tourMapStatus = document.querySelector("#tour-map-status");
const tourMapStops = document.querySelector("#tour-map-stops");
const tourStationLabels = document.querySelector("#tour-station-labels");
const tourRouteSelect = document.querySelector("#tour-route-select");
const tourMapSvg = document.querySelector("#tour-map-svg");
const tourStopDuration = 3.5;
let currentRouteKey = "core";
let currentRoute = tourRoutes[currentRouteKey];
let tourStops = currentRoute.stops;
let tourSegmentDurations = currentRoute.durations;
let walkTourCurve = createTourCurve(currentRoute.points);
let walkTourActive = false;
let walkTourPaused = false;
let walkTourCompleted = false;
let tourAudioEnabled = true;
let tourStopIndex = 0;
let tourSegmentElapsed = 0;
let tourStopElapsed = 0;
let tourHolding = true;

function createTourCurve(points) {
  return new THREE.CatmullRomCurve3(points.map((point) => new THREE.Vector3(...point)), false, "catmullrom", 0.45);
}

function projectTourPoint(point) {
  return {
    x: 20 + (point.x + 66) * (220 / 148),
    y: 16 + (51 - point.z) * (148 / 105)
  };
}

function updateTourMap(progress, status) {
  const mapPoint = projectTourPoint(walkTourCurve.getPointAt(progress));
  tourMapPosition.setAttribute("cx", mapPoint.x.toFixed(1));
  tourMapPosition.setAttribute("cy", mapPoint.y.toFixed(1));
  if (status) tourMapStatus.textContent = status;
}

function selectTourMapStop(index) {
  [...tourMapStops.querySelectorAll("[data-tour-stop]")].forEach((button, buttonIndex) => {
    button.setAttribute("aria-pressed", String(buttonIndex === index));
  });
}

function renderTourRoute() {
  const mapRoutePoints = walkTourCurve.getPoints(70).map((point) => {
    const mapPoint = projectTourPoint(point);
    return `${mapPoint.x.toFixed(1)},${mapPoint.y.toFixed(1)}`;
  });
  tourMapRoute.setAttribute("points", mapRoutePoints.join(" "));
  tourMapStations.replaceChildren();
  tourMapStops.replaceChildren();
  tourStationLabels.replaceChildren();
  tourStationLabels.style.setProperty("--tour-stop-count", String(tourStops.length));
  tourMapSvg.setAttribute("aria-label", `${currentRoute.label}導覽路線與目前位置`);

  tourStops.forEach((stop, index) => {
    const point = projectTourPoint(walkTourCurve.getPointAt(stop.progress));
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("class", "map-station-dot");
    circle.setAttribute("cx", point.x.toFixed(1));
    circle.setAttribute("cy", point.y.toFixed(1));
    circle.setAttribute("r", "7");
    const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
    label.setAttribute("class", "map-station-number");
    label.setAttribute("x", point.x.toFixed(1));
    label.setAttribute("y", point.y.toFixed(1));
    label.textContent = String(index + 1);
    tourMapStations.append(circle, label);

    const button = document.createElement("button");
    button.type = "button";
    button.dataset.tourStop = String(index);
    button.setAttribute("aria-pressed", String(index === 0));
    button.textContent = stop.title;
    tourMapStops.append(button);

    const stationLabel = document.createElement("span");
    stationLabel.textContent = stop.title;
    tourStationLabels.append(stationLabel);
  });
  updateTourMap(0, `已選：${currentRoute.label}`);
}

function updateTourProgress(progress) {
  const percent = Math.round(progress * 100);
  tourProgressFill.style.width = `${percent}%`;
  tourPercent.textContent = `${percent}%`;
  tourProgress.setAttribute("aria-valuenow", String(percent));
  const nextStop = tourStops[Math.min(tourStopIndex + 1, tourStops.length - 1)];
  updateTourMap(progress, tourHolding ? `停留：${tourStops[tourStopIndex].title}` : `前往：${nextStop.title}`);
}

function speakTourStop(index) {
  if (!tourAudioEnabled || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const stop = tourStops[index];
  const utterance = new SpeechSynthesisUtterance(`${stop.title}。${stop.narration}`);
  utterance.lang = "zh-TW";
  utterance.rate = 0.95;
  window.speechSynthesis.speak(utterance);
}

function showTourStop(index) {
  const stop = tourStops[index];
  tourStep.textContent = `第 ${index + 1} 站，共 ${tourStops.length} 站`;
  tourTitle.textContent = stop.title;
  tourNarration.textContent = stop.narration;
  selectTourMapStop(index);
  updateTourProgress(stop.progress);
  if (stop.landmark) {
    showLandmark(stop.landmark);
  } else {
    detailPanel.hidden = true;
  }
  speakTourStop(index);
}

function stopWalkTour(hideGuide = true) {
  walkTourActive = false;
  walkTourPaused = false;
  walkTourCompleted = false;
  controls.enabled = true;
  walkTourButton.textContent = "步行導覽";
  walkTourButton.setAttribute("aria-pressed", "false");
  tourPauseButton.textContent = "暫停";
  tourPauseButton.setAttribute("aria-pressed", "false");
  if (hideGuide) tourGuide.hidden = true;
  tourMapStatus.textContent = `目前：${tourStops[tourStopIndex].title}`;
  if ("speechSynthesis" in window) window.speechSynthesis.cancel();
}

function completeWalkTour() {
  walkTourActive = false;
  walkTourCompleted = true;
  controls.enabled = true;
  walkTourButton.textContent = "重新導覽";
  walkTourButton.setAttribute("aria-pressed", "false");
  tourPauseButton.disabled = true;
  tourExitButton.textContent = "關閉";
  updateTourProgress(1);
}

function startWalkTour() {
  walkTourActive = true;
  walkTourPaused = false;
  walkTourCompleted = false;
  tourStopIndex = 0;
  tourSegmentElapsed = 0;
  tourStopElapsed = 0;
  tourHolding = true;
  controls.enabled = false;
  walkTourButton.textContent = "停止導覽";
  walkTourButton.setAttribute("aria-pressed", "true");
  tourGuide.hidden = false;
  tourPauseButton.disabled = false;
  tourPauseButton.textContent = "暫停";
  tourPauseButton.setAttribute("aria-pressed", "false");
  tourExitButton.textContent = "結束";
  placeTourCamera(0);
  showTourStop(0);
}

function placeTourCamera(progress) {
  const walkPoint = walkTourCurve.getPointAt(progress);
  const lookPoint = progress > 0.96
    ? new THREE.Vector3(...currentRoute.endTarget)
    : walkTourCurve.getPointAt(Math.min(progress + 0.025, 1));
  camera.position.copy(walkPoint);
  controls.target.set(lookPoint.x, 2, lookPoint.z);
}

function jumpToTourStop(index) {
  walkTourActive = true;
  walkTourPaused = true;
  walkTourCompleted = false;
  tourStopIndex = index;
  tourSegmentElapsed = 0;
  tourStopElapsed = 0;
  tourHolding = true;
  controls.enabled = false;
  walkTourButton.textContent = "停止導覽";
  walkTourButton.setAttribute("aria-pressed", "true");
  tourGuide.hidden = false;
  tourPauseButton.disabled = false;
  tourPauseButton.textContent = "繼續";
  tourPauseButton.setAttribute("aria-pressed", "true");
  tourExitButton.textContent = "結束";
  placeTourCamera(tourStops[index].progress);
  showTourStop(index);
}

function switchTourRoute(key) {
  stopWalkTour();
  currentRouteKey = key;
  currentRoute = tourRoutes[currentRouteKey];
  tourStops = currentRoute.stops;
  tourSegmentDurations = currentRoute.durations;
  walkTourCurve = createTourCurve(currentRoute.points);
  tourStopIndex = 0;
  tourSegmentElapsed = 0;
  tourStopElapsed = 0;
  tourHolding = true;
  detailPanel.hidden = true;
  renderTourRoute();
}

function setView(key) {
  stopWalkTour();
  camera.position.set(...views[key].camera);
  controls.target.set(...views[key].target);
  controls.update();
}

document.querySelector("#view-overview").addEventListener("click", () => setView("overview"));
document.querySelector("#view-north-gate").addEventListener("click", () => setView("northGate"));
document.querySelector("#view-library").addEventListener("click", () => setView("library"));
document.querySelector("#view-lake").addEventListener("click", () => setView("lake"));
walkTourButton.addEventListener("click", () => {
  if (walkTourActive) {
    stopWalkTour();
  } else {
    startWalkTour();
  }
});
tourPauseButton.addEventListener("click", () => {
  if (!walkTourActive) return;
  walkTourPaused = !walkTourPaused;
  tourPauseButton.textContent = walkTourPaused ? "繼續" : "暫停";
  tourPauseButton.setAttribute("aria-pressed", String(walkTourPaused));
  if (walkTourPaused && "speechSynthesis" in window) window.speechSynthesis.pause();
  if (!walkTourPaused && "speechSynthesis" in window) window.speechSynthesis.resume();
});
tourAudioButton.addEventListener("click", () => {
  tourAudioEnabled = !tourAudioEnabled;
  tourAudioButton.textContent = tourAudioEnabled ? "語音開啟" : "語音關閉";
  tourAudioButton.setAttribute("aria-pressed", String(tourAudioEnabled));
  if (!tourAudioEnabled && "speechSynthesis" in window) window.speechSynthesis.cancel();
  if (tourAudioEnabled && !tourGuide.hidden) speakTourStop(tourStopIndex);
});
tourExitButton.addEventListener("click", () => {
  stopWalkTour();
});
tourMapStops.addEventListener("click", (event) => {
  const button = event.target.closest("[data-tour-stop]");
  if (button) jumpToTourStop(Number(button.dataset.tourStop));
});
tourRouteSelect.addEventListener("change", () => switchTourRoute(tourRouteSelect.value));
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
  const delta = clock.getDelta();
  routeTime = (routeTime + delta * 0.035) % 1;
  const point = patrolCurve.getPointAt(routeTime);
  const ahead = patrolCurve.getPointAt((routeTime + 0.008) % 1);
  robot.position.copy(point);
  robot.lookAt(ahead.x, point.y, ahead.z);

  if (walkTourActive && !walkTourPaused) {
    if (tourHolding) {
      tourStopElapsed += delta;
      if (tourStopElapsed >= tourStopDuration) {
        if (tourStopIndex === tourStops.length - 1) {
          completeWalkTour();
        } else {
          tourHolding = false;
          tourSegmentElapsed = 0;
        }
      }
    } else {
      const segmentDuration = tourSegmentDurations[tourStopIndex];
      tourSegmentElapsed += delta;
      const segmentProgress = Math.min(tourSegmentElapsed / segmentDuration, 1);
      const easedProgress = segmentProgress * segmentProgress * (3 - 2 * segmentProgress);
      const startProgress = tourStops[tourStopIndex].progress;
      const endProgress = tourStops[tourStopIndex + 1].progress;
      const progress = THREE.MathUtils.lerp(startProgress, endProgress, easedProgress);
      placeTourCamera(progress);
      updateTourProgress(progress);
      if (segmentProgress >= 1) {
        tourStopIndex += 1;
        tourStopElapsed = 0;
        tourHolding = true;
        showTourStop(tourStopIndex);
      }
    }
  }

  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

renderTourRoute();

animate();

