// Cordova setup
document.addEventListener('deviceready', onDeviceReady);

function onDeviceReady() {

}

// Global variables
var boxWidth = window.innerWidth;
var boxHeight = window.innerHeight;
var boxDepth = window.innerWidth;

// Three.js variables
var scene, camera, renderer;

// Cannon.js variables


// Sensor data variables
var beta = 0;
var gamma = 0;
window.addEventListener('deviceorientation', onDeviceOrientation);

// Face tracking variables
var distance = boxHeight * 2;

function onDeviceOrientation(event) {
  if (event.beta !== null)
    beta = THREE.Math.degToRad(event.beta);
  if (event.gamma !== null)
    gamma = THREE.Math.degToRad(event.gamma);
}

initThree();
initCannon();
animate();

function initThree() {
  // Scene
  scene = new THREE.Scene();

  // Camera
  camera = new THREE.PerspectiveCamera(90, boxWidth / boxHeight);

  // Renderer
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0xff0000);
  document.body.appendChild(renderer.domElement);

  // Box
  var cubeGeometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
  var cubeMaterial = new THREE.MeshStandardMaterial({color: 0x008800});
  cubeMaterial.side = THREE.BackSide;
  var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
  cube.position.z = -boxDepth / 2;
  scene.add(cube);

  // Lights
  var ambient = new THREE.AmbientLight(0xffffff, 0.4);
  var point = new THREE.PointLight(0xffffff, 1, boxHeight);
  scene.add(ambient);
  scene.add(point);
}

function initCannon() {

}

function animate() {
  requestAnimationFrame(animate);
  updatePhysics();
  updateScene();
  findCameraPosition();
  updateCamera();
  render();
}

function updatePhysics() {

}

function updateScene() {

}

function findCameraPosition() {
  camera.position.x = -distance * Math.sin(gamma);
  camera.position.y = distance * Math.sin(beta);
  camera.position.z = distance * Math.cos(beta) * Math.cos(gamma);
}

function updateCamera() {
  // Calculate the fov according to the distance from the phone
  camera.fov = THREE.Math.radToDeg(Math.atan((boxHeight / 2) / camera.position.z)) * 2;

  // Update the projection matrix with the new fov
  camera.updateProjectionMatrix();

  // Set the oblique frustum to look at the box
  // Horizontal obliqueness
  camera.projectionMatrix.elements[8] = -camera.position.x / (boxWidth / 2);
  // Vertical obliqueness
  camera.projectionMatrix.elements[9] = -camera.position.y / (boxHeight / 2);
}

function render() {
  renderer.render(scene, camera);
}

function debug(text) {
  document.getElementById('debug').innerHTML = text;
}
