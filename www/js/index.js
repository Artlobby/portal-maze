// Cordova setup
document.addEventListener('deviceready', onDeviceReady);

function onDeviceReady() {

}

// Global variables
var boxHeight = 111;
var boxWidth = boxHeight * window.innerWidth / window.innerHeight;
var boxDepth = boxWidth;
var ballRadius = boxWidth / 20;

// Three.js variables
var scene, camera, renderer, ballMesh;

// Cannon.js variables
var world, ballBody;
var gravity = 9807;

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
  camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight);

  // Renderer
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0xff0000);
  document.body.appendChild(renderer.domElement);

  // Box
  var boxGeometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
  var boxMaterial = new THREE.MeshStandardMaterial({color: 0x008800});
  boxMaterial.side = THREE.BackSide;
  var box = new THREE.Mesh(boxGeometry, boxMaterial);
  box.position.z = -boxDepth / 2;
  scene.add(box);

  // Ball
  var ballGeometry = new THREE.SphereGeometry(ballRadius, 32, 32);
  var ballMaterial = new THREE.MeshStandardMaterial({color: 0x888888});
  ballMesh = new THREE.Mesh(ballGeometry, ballMaterial);
  scene.add(ballMesh);

  // Lights
  var ambient = new THREE.AmbientLight(0xffffff, 0.4);
  var point = new THREE.PointLight(0xffffff, 1, boxHeight);
  scene.add(ambient);
  scene.add(point);
}

function initCannon() {
  // World
  world = new CANNON.World();
  world.broadphase = new CANNON.NaiveBroadphase();

  // Box
  var boxShape = new CANNON.Box(new CANNON.Vec3(boxWidth / 2, boxHeight / 2, boxDepth));
  world.addBody(new CANNON.Body({mass: 0, shape: boxShape, position: new CANNON.Vec3(0, boxHeight, 0)}));
  world.addBody(new CANNON.Body({mass: 0, shape: boxShape, position: new CANNON.Vec3(boxWidth, 0, 0)}));
  world.addBody(new CANNON.Body({mass: 0, shape: boxShape, position: new CANNON.Vec3(0, -boxHeight, 0)}));
  world.addBody(new CANNON.Body({mass: 0, shape: boxShape, position: new CANNON.Vec3(-boxWidth, 0, 0)}));
  world.addBody(new CANNON.Body({mass: 0, shape: boxShape, position: new CANNON.Vec3(0, 0, -boxDepth * 2)}));

  // Ball
  var ballShape = new CANNON.Sphere(ballRadius);
  ballBody = new CANNON.Body({mass: 0.005, shape: ballShape});
  world.addBody(ballBody);
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
  world.gravity.set(gravity * Math.sin(gamma), -gravity * Math.sin(beta), -gravity * Math.cos(beta) * Math.cos(gamma));
  world.step(1 / 60);
  ballMesh.position.x = ballBody.position.x;
  ballMesh.position.y = ballBody.position.y;
  ballMesh.position.z = ballBody.position.z;
  ballMesh.quaternion.x = ballBody.quaternion.x;
  ballMesh.quaternion.y = ballBody.quaternion.y;
  ballMesh.quaternion.z = ballBody.quaternion.z;
  ballMesh.quaternion.w = ballBody.quaternion.w;
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
