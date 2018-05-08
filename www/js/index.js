// Cordova setup
document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {

}

// Three.js variables
var scene, camera, renderer;

// Cannon.js variables


initThree();
initCannon();
animate();

function initThree() {
  // Scene
  scene = new THREE.Scene();

  // Camera
  camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight);
  camera.position.x = window.innerWidth / 2;
  camera.position.z = window.innerHeight * 2;

  // Renderer
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0xff0000);
  document.body.appendChild(renderer.domElement);

  // Box
  var cubeGeometry = new THREE.BoxGeometry(window.innerWidth, window.innerHeight, window.innerWidth);
  var cubeMaterial = new THREE.MeshStandardMaterial({color: 0x008800});
  cubeMaterial.side = THREE.BackSide;
  var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
  cube.position.z = -window.innerWidth / 2;
  scene.add(cube);

  // Lights
  var ambient = new THREE.AmbientLight(0xffffff, 0.4);
  var point = new THREE.PointLight(0xffffff, 1, window.innerHeight);
  scene.add(ambient);
  scene.add(point);
}

function initCannon() {

}

function animate() {
  requestAnimationFrame(animate);
  updatePhysics();
  updateScene();
  updateCamera();
  render();
}

function updatePhysics() {

}

function updateScene() {

}

function updateCamera() {
  // Calculate the fov according to the distance from the phone
  camera.fov = Math.atan((window.innerHeight / 2) / camera.position.z) / Math.PI * 180 * 2;

  // Update the projection matrix with the new fov
  camera.updateProjectionMatrix();

  // Set the oblique frustum to look at the box
  // Horizontal obliqueness
  camera.projectionMatrix.elements[8] = -1;
  // Vertical obliqueness
  camera.projectionMatrix.elements[9] = 0;
}

function render() {
  renderer.render(scene, camera);
}
