import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'lil-gui';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x07111f);

const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.set(9, 7, 12);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.target.set(0, 0, 0);

scene.add(new THREE.AmbientLight(0xffffff, 1.4));
const light = new THREE.DirectionalLight(0xffffff, 3);
light.position.set(5, 8, 6);
scene.add(light);

const boxSize = 10;
const radius = 0.5;
const limit = boxSize / 2 - radius;

const boxGeometry = new THREE.BoxGeometry(boxSize, boxSize, boxSize);
const glassMaterial = new THREE.MeshPhysicalMaterial({
  color: 0x8fd3ff,
  transparent: true,
  opacity: 0.18,
  transmission: 0.9,
  roughness: 0.05,
  metalness: 0,
  side: THREE.DoubleSide,
  depthWrite: false
});
const glassBox = new THREE.Mesh(boxGeometry, glassMaterial);
scene.add(glassBox);

const edges = new THREE.LineSegments(
  new THREE.EdgesGeometry(boxGeometry),
  new THREE.LineBasicMaterial({ color: 0xbfe8ff })
);
scene.add(edges);

const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(radius, 32, 32),
  new THREE.MeshStandardMaterial({ color: 0xff7043, roughness: 0.35 })
);
scene.add(sphere);

const velocity = new THREE.Vector3(0.035, 0.027, 0.041);

// --- CONFIGURACIÓN DE LIL-GUI (CONTROLES DESPLAZADORES) ---
const gui = new GUI({ title: 'Control de la Esfera' });

// Carpeta para modificar las velocidades en cada eje
const velFolder = gui.addFolder('Velocidad (Ejes)');
const velXController = velFolder.add(velocity, 'x', -0.2, 0.2, 0.005).name('Velocidad X').listen();
const velYController = velFolder.add(velocity, 'y', -0.2, 0.2, 0.005).name('Velocidad Y').listen();
const velZController = velFolder.add(velocity, 'z', -0.2, 0.2, 0.005).name('Velocidad Z').listen();
velFolder.open();

// Carpeta para desplazar/mover la posición de la esfera manualmente
const posFolder = gui.addFolder('Posición (Ejes)');
posFolder.add(sphere.position, 'x', -limit, limit, 0.01).name('Posición X').listen();
posFolder.add(sphere.position, 'y', -limit, limit, 0.01).name('Posición Y').listen();
posFolder.add(sphere.position, 'z', -limit, limit, 0.01).name('Posición Z').listen();
posFolder.open();

// Arreglo para almacenar y gestionar las marcas activas
const hitMarks = [];

function createHitMark(position, normal) {
  const markSize = 1.2;
  const markGeometry = new THREE.PlaneGeometry(markSize, markSize);
  const markMaterial = new THREE.MeshBasicMaterial({
    color: 0xff3366,
    transparent: true,
    opacity: 0.8,
    side: THREE.DoubleSide,
    depthWrite: false
  });

  const mark = new THREE.Mesh(markGeometry, markMaterial);
  mark.position.copy(position);

  const lookAtPoint = position.clone().add(normal);
  mark.lookAt(lookAtPoint);

  scene.add(mark);

  hitMarks.push({
    mesh: mark,
    life: 1.0
  });
}

function animate() {
  sphere.position.add(velocity);

  // Verificación de colisiones
  if (sphere.position.x >= limit) {
    velocity.x *= -1;
    sphere.position.x = limit;
    createHitMark(new THREE.Vector3(boxSize / 2 - 0.01, sphere.position.y, sphere.position.z), new THREE.Vector3(-1, 0, 0));
  } else if (sphere.position.x <= -limit) {
    velocity.x *= -1;
    sphere.position.x = -limit;
    createHitMark(new THREE.Vector3(-boxSize / 2 + 0.01, sphere.position.y, sphere.position.z), new THREE.Vector3(1, 0, 0));
  }

  if (sphere.position.y >= limit) {
    velocity.y *= -1;
    sphere.position.y = limit;
    createHitMark(new THREE.Vector3(sphere.position.x, boxSize / 2 - 0.01, sphere.position.z), new THREE.Vector3(0, -1, 0));
  } else if (sphere.position.y <= -limit) {
    velocity.y *= -1;
    sphere.position.y = -limit;
    createHitMark(new THREE.Vector3(sphere.position.x, -boxSize / 2 + 0.01, sphere.position.z), new THREE.Vector3(0, 1, 0));
  }

  if (sphere.position.z >= limit) {
    velocity.z *= -1;
    sphere.position.z = limit;
    createHitMark(new THREE.Vector3(sphere.position.x, sphere.position.y, boxSize / 2 - 0.01), new THREE.Vector3(0, 0, -1));
  } else if (sphere.position.z <= -limit) {
    velocity.z *= -1;
    sphere.position.z = -limit;
    createHitMark(new THREE.Vector3(sphere.position.x, sphere.position.y, -boxSize / 2 + 0.01), new THREE.Vector3(0, 0, 1));
  }

  // Actualizar y desvanecer las marcas
  for (let i = hitMarks.length - 1; i >= 0; i--) {
    const item = hitMarks[i];
    item.life -= 0.02;
    item.mesh.material.opacity = item.life;

    if (item.life <= 0) {
      scene.remove(item.mesh);
      item.mesh.geometry.dispose();
      item.mesh.material.dispose();
      hitMarks.splice(i, 1);
    }
  }

  controls.update();
  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});