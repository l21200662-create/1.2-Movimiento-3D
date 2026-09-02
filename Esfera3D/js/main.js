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

// Caja contenedora de cristal
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

// Función para generar colores en tonos pasteles
function getRandomPastelColor() {
  const hue = Math.random();
  const saturation = 0.6 + Math.random() * 0.2; // 60% - 80%
  const lightness = 0.7 + Math.random() * 0.15; // 70% - 85%
  return new THREE.Color().setHSL(hue, saturation, lightness);
}

// Estructura de datos para múltiples esferas
const spheres = [];
const sphereGeometry = new THREE.SphereGeometry(radius, 32, 32);

function createSphere() {
  const material = new THREE.MeshStandardMaterial({
    color: getRandomPastelColor(),
    roughness: 0.35,
    metalness: 0.1
  });
  const mesh = new THREE.Mesh(sphereGeometry, material);

  // Posicionamiento inicial evitando solapamiento con esferas existentes
  let validPosition = false;
  let attempts = 0;
  while (!validPosition && attempts < 100) {
    mesh.position.set(
      THREE.MathUtils.randFloat(-limit, limit),
      THREE.MathUtils.randFloat(-limit, limit),
      THREE.MathUtils.randFloat(-limit, limit)
    );

    validPosition = true;
    for (const other of spheres) {
      if (mesh.position.distanceTo(other.mesh.position) < radius * 2) {
        validPosition = false;
        break;
      }
    }
    attempts++;
  }

  // Velocidades iniciales aleatorias
  const velocity = new THREE.Vector3(
    (Math.random() - 0.5) * 0.08,
    (Math.random() - 0.5) * 0.08,
    (Math.random() - 0.5) * 0.08
  );

  scene.add(mesh);
  spheres.push({ mesh, velocity });
}

function removeSphere() {
  if (spheres.length === 0) return;
  const s = spheres.pop();
  scene.remove(s.mesh);
  s.mesh.material.dispose();
}

function updateSphereCount(targetCount) {
  while (spheres.length < targetCount) {
    createSphere();
  }
  while (spheres.length > targetCount) {
    removeSphere();
  }
  updateGUIFolders();
}

// Configuración de interfaz GUI
const params = {
  numSpheres: 1
};

const gui = new GUI({
  container: document.getElementById('gui-container'),
  title: 'Parámetros del Sistema'
});

gui.add(params, 'numSpheres', 1, 10, 1)
  .name('N° Esferas')
  .onChange((v) => updateSphereCount(v));

let velFolder = gui.addFolder('Velocidades (Esfera 1)');
let posFolder = gui.addFolder('Posiciones (Esfera 1)');

function updateGUIFolders() {
  velFolder.destroy();
  posFolder.destroy();

  velFolder = gui.addFolder('Velocidades');
  posFolder = gui.addFolder('Posiciones');

  spheres.forEach((s, idx) => {
    const sphereName = `Esfera ${idx + 1}`;
    const fVel = velFolder.addFolder(sphereName);
    fVel.add(s.velocity, 'x', -0.2, 0.2, 0.005).name('Vel X').listen();
    fVel.add(s.velocity, 'y', -0.2, 0.2, 0.005).name('Vel Y').listen();
    fVel.add(s.velocity, 'z', -0.2, 0.2, 0.005).name('Vel Z').listen();

    const fPos = posFolder.addFolder(sphereName);
    fPos.add(s.mesh.position, 'x', -limit, limit, 0.01).name('Pos X').listen();
    fPos.add(s.mesh.position, 'y', -limit, limit, 0.01).name('Pos Y').listen();
    fPos.add(s.mesh.position, 'z', -limit, limit, 0.01).name('Pos Z').listen();
  });
}

// Inicializar la primera esfera
updateSphereCount(1);

// Marcas de Impacto en Paredes
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
  // 1. Mover esferas
  for (let i = 0; i < spheres.length; i++) {
    spheres[i].mesh.position.add(spheres[i].velocity);
  }

  // 2. Colisiones entre esferas
  for (let i = 0; i < spheres.length; i++) {
    for (let j = i + 1; j < spheres.length; j++) {
      const s1 = spheres[i];
      const s2 = spheres[j];

      const delta = new THREE.Vector3().subVectors(s2.mesh.position, s1.mesh.position);
      const distance = delta.length();
      const minDistance = radius * 2;

      if (distance < minDistance) {
        // Cambiar colores a nuevos tonos pasteles tras la colisión
        s1.mesh.material.color.copy(getRandomPastelColor());
        s2.mesh.material.color.copy(getRandomPastelColor());

        // Resolver solapamiento físico
        const overlap = minDistance - distance;
        const normal = delta.clone().normalize();
        if (distance === 0) {
          normal.set(1, 0, 0); // Prevenir división por cero
        }
        
        s1.mesh.position.addScaledVector(normal, -overlap * 0.5);
        s2.mesh.position.addScaledVector(normal, overlap * 0.5);

        // Respuesta a colisión elástica de masas iguales
        const relativeVelocity = new THREE.Vector3().subVectors(s1.velocity, s2.velocity);
        const velAlongNormal = relativeVelocity.dot(normal);

        if (velAlongNormal > 0) {
          const impulse = normal.clone().multiplyScalar(velAlongNormal);
          s1.velocity.sub(impulse);
          s2.velocity.add(impulse);
        }
      }
    }
  }

  // 3. Colisiones con paredes y generación de marcas de impacto
  for (let i = 0; i < spheres.length; i++) {
    const s = spheres[i];
    const pos = s.mesh.position;
    const vel = s.velocity;
    let collided = false;

    if (pos.x >= limit) {
      vel.x *= -1;
      pos.x = limit;
      createHitMark(new THREE.Vector3(boxSize / 2 - 0.01, pos.y, pos.z), new THREE.Vector3(-1, 0, 0));
      collided = true;
    } else if (pos.x <= -limit) {
      vel.x *= -1;
      pos.x = -limit;
      createHitMark(new THREE.Vector3(-boxSize / 2 + 0.01, pos.y, pos.z), new THREE.Vector3(1, 0, 0));
      collided = true;
    }

    if (pos.y >= limit) {
      vel.y *= -1;
      pos.y = limit;
      createHitMark(new THREE.Vector3(pos.x, boxSize / 2 - 0.01, pos.z), new THREE.Vector3(0, -1, 0));
      collided = true;
    } else if (pos.y <= -limit) {
      vel.y *= -1;
      pos.y = -limit;
      createHitMark(new THREE.Vector3(pos.x, -boxSize / 2 + 0.01, pos.z), new THREE.Vector3(0, 1, 0));
      collided = true;
    }

    if (pos.z >= limit) {
      vel.z *= -1;
      pos.z = limit;
      createHitMark(new THREE.Vector3(pos.x, pos.y, boxSize / 2 - 0.01), new THREE.Vector3(0, 0, -1));
      collided = true;
    } else if (pos.z <= -limit) {
      vel.z *= -1;
      pos.z = -limit;
      createHitMark(new THREE.Vector3(pos.x, pos.y, -boxSize / 2 + 0.01), new THREE.Vector3(0, 0, 1));
      collided = true;
    }

    if (collided) {
      s.mesh.material.color.copy(getRandomPastelColor());
    }
  }

  // 4. Actualización y desvanecimiento de marcas
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