// ========================================
// IMPORTAR THREE.JS
// ========================================

import * as THREE from 'three';


// ========================================
// 1. CREAR LA ESCENA
// ========================================

const scene = new THREE.Scene();

scene.background = new THREE.Color(0x07111f);


// ========================================
// 2. CREAR LA CÁMARA
// ========================================

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

// Posición de la cámara
camera.position.z = 5;


// ========================================
// 3. CREAR EL RENDERIZADOR
// ========================================

const renderer = new THREE.WebGLRenderer({
    antialias: true
});

renderer.setPixelRatio(
    Math.min(window.devicePixelRatio, 2)
);

renderer.setSize(
    window.innerWidth,
    window.innerHeight
);

// Agregar el canvas al documento
document.body.appendChild(renderer.domElement);


// ========================================
// 4. CREAR EL CUBO
// ========================================

// Dimensiones:
// Ancho = 2.2
// Alto = 1.2
// Profundidad = 1.6

const geometry = new THREE.BoxGeometry(
    2.2,
    1.2,
    1.6
);


// ========================================
// 5. MATERIAL DEL CUBO
// ========================================

// Color lila
// Wireframe desactivado para mostrar
// la superficie sólida

const material = new THREE.MeshBasicMaterial({
    color: 0xB481EB,
    wireframe: false
});


// ========================================
// 6. CREAR LA MALLA DEL CUBO
// ========================================

const cube = new THREE.Mesh(
    geometry,
    material
);


// Posición del cubo
cube.position.x = -1.3;


// Agregar el cubo a la escena
scene.add(cube);


// ========================================
// 7. CREAR LA ESFERA
// ========================================

const sphereGeometry = new THREE.SphereGeometry(
    1,
    32,
    32
);


// ========================================
// 8. MATERIAL DE LA ESFERA
// ========================================

// Color rosita
// Wireframe desactivado

const sphereMaterial = new THREE.MeshBasicMaterial({
    color: 0xF48FB1,
    wireframe: false
});


// ========================================
// 9. CREAR LA MALLA DE LA ESFERA
// ========================================

const sphere = new THREE.Mesh(
    sphereGeometry,
    sphereMaterial
);


// Posición de la esfera
sphere.position.x = 1.3;


// Agregar la esfera a la escena
scene.add(sphere);


// ========================================
// 10. ANIMACIÓN
// ========================================

function animate(time) {

    // Rotación del cubo
    // X y Y tienen velocidades diferentes

    cube.rotation.x = time / 1800;

    cube.rotation.y = time / 900;


    // Rotación de la esfera

    sphere.rotation.x = time / 3000;

    sphere.rotation.y = time / 1500;


    // Renderizar la escena

    renderer.render(
        scene,
        camera
    );
}


// ========================================
// 11. INICIAR EL CICLO DE ANIMACIÓN
// ========================================

renderer.setAnimationLoop(animate);


// ========================================
// 12. ADAPTACIÓN AL TAMAÑO DE LA VENTANA
// ========================================

window.addEventListener('resize', () => {

    // Actualizar proporción de la cámara

    camera.aspect =
        window.innerWidth /
        window.innerHeight;


    // Actualizar la cámara

    camera.updateProjectionMatrix();


    // Actualizar tamaño del renderizador

    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );

});