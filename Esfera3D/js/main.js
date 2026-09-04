import * as THREE from 'three';

import {
  OrbitControls
} from 'three/addons/controls/OrbitControls.js';

import {
  GUI
} from 'lil-gui';


/* =====================================================
   ESCENA
===================================================== */

const scene =
  new THREE.Scene();

scene.background =
  new THREE.Color(0x0b1021);

scene.fog =
  new THREE.FogExp2(
    0x0b1021,
    0.015
  );


/* =====================================================
   CÁMARA
===================================================== */

const camera =
  new THREE.PerspectiveCamera(
    45,
    window.innerWidth /
      window.innerHeight,
    0.1,
    200
  );

camera.position.set(
  12,
  8,
  15
);


/* =====================================================
   RENDERER
===================================================== */

const renderer =
  new THREE.WebGLRenderer({

    antialias: true,

    alpha: false,

    powerPreference:
      'high-performance'
  });


renderer.setPixelRatio(
  Math.min(
    window.devicePixelRatio,
    2
  )
);

renderer.setSize(
  window.innerWidth,
  window.innerHeight
);


/* SOMBRAS */

renderer.shadowMap.enabled =
  true;

renderer.shadowMap.type =
  THREE.PCFSoftShadowMap;


/* COLOR */

renderer.outputColorSpace =
  THREE.SRGBColorSpace;


/* TONEMAPPING */

renderer.toneMapping =
  THREE.ACESFilmicToneMapping;

renderer.toneMappingExposure =
  1.1;


/* CANVAS */

document.body.appendChild(
  renderer.domElement
);


/* =====================================================
   CÁMARA ORBITAL
===================================================== */

const controls =
  new OrbitControls(
    camera,
    renderer.domElement
  );

controls.enableDamping =
  true;

controls.dampingFactor =
  0.05;

controls.minDistance =
  5;

controls.maxDistance =
  40;

controls.target.set(
  0,
  3,
  0
);


/* =====================================================
   LUCES
===================================================== */

const hemiLight =
  new THREE.HemisphereLight(
    0xbfd8ff,
    0x15100d,
    0.8
  );

scene.add(
  hemiLight
);


/* Luz de relleno */

const fillLight =
  new THREE.DirectionalLight(
    0x8bbcff,
    0.55
  );

fillLight.position.set(
  -8,
  10,
  -10
);

scene.add(
  fillLight
);


/* =====================================================
   FOCO PRINCIPAL
===================================================== */

const spotlight =
  new THREE.SpotLight(
    0xffffff,
    200
  );


spotlight.position.set(
  0,
  9,
  0
);


spotlight.angle =
  THREE.MathUtils.degToRad(
    32
  );


spotlight.penumbra =
  0.45;


spotlight.distance =
  40;


spotlight.decay =
  2;


spotlight.castShadow =
  true;


spotlight.shadow.mapSize.width =
  2048;

spotlight.shadow.mapSize.height =
  2048;


spotlight.shadow.camera.near =
  0.5;

spotlight.shadow.camera.far =
  40;

spotlight.shadow.bias =
  -0.0001;


scene.add(
  spotlight
);


/* =====================================================
   OBJETIVO DEL FOCO
===================================================== */

const spotlightTarget =
  new THREE.Object3D();

spotlightTarget.position.set(
  0,
  1.5,
  0
);

scene.add(
  spotlightTarget
);

spotlight.target =
  spotlightTarget;


/* =====================================================
   BOMBILLA VISIBLE
===================================================== */

const bulbGeometry =
  new THREE.SphereGeometry(
    0.28,
    32,
    32
  );


const bulbMaterial =
  new THREE.MeshStandardMaterial({

    color:
      0xffffdd,

    emissive:
      0xffee99,

    emissiveIntensity:
      5,

    roughness:
      0.15,

    metalness:
      0.05
  });


const bulb =
  new THREE.Mesh(
    bulbGeometry,
    bulbMaterial
  );


bulb.position.copy(
  spotlight.position
);

bulb.castShadow =
  true;

scene.add(
  bulb
);


/* =====================================================
   HALO
===================================================== */

const haloGeometry =
  new THREE.SphereGeometry(
    0.45,
    32,
    32
  );


const haloMaterial =
  new THREE.MeshBasicMaterial({

    color:
      0xffffbb,

    transparent:
      true,

    opacity:
      0.13
  });


const halo =
  new THREE.Mesh(
    haloGeometry,
    haloMaterial
  );


halo.position.copy(
  spotlight.position
);

scene.add(
  halo
);


/* =====================================================
   AYUDA VISUAL DEL FOCO
===================================================== */

const spotHelper =
  new THREE.SpotLightHelper(
    spotlight,
    0xffffcc
  );

scene.add(
  spotHelper
);


/* =====================================================
   PISO DE CRISTAL
===================================================== */

const floorGeometry =
  new THREE.PlaneGeometry(
    100,
    100
  );


const floorMaterial =
  new THREE.MeshPhysicalMaterial({

    color:
      0xbfdff2,

    roughness:
      0.08,

    metalness:
      0.05,

    transmission:
      0.4,

    transparent:
      true,

    opacity:
      0.55,

    thickness:
      0.18,

    ior:
      1.45
  });


const floor =
  new THREE.Mesh(
    floorGeometry,
    floorMaterial
  );


floor.rotation.x =
  -Math.PI / 2;

floor.receiveShadow =
  true;

scene.add(
  floor
);


/* =====================================================
   CUADRÍCULA
===================================================== */

const grid =
  new THREE.GridHelper(
    30,
    30,
    0x6fa8c9,
    0x29485b
  );

grid.position.y =
  0.025;

grid.material.transparent =
  true;

grid.material.opacity =
  0.25;

scene.add(
  grid
);


/* =====================================================
   BASE
===================================================== */

const baseGeometry =
  new THREE.CylinderGeometry(
    2.4,
    2.6,
    0.35,
    64
  );


const baseMaterial =
  new THREE.MeshStandardMaterial({

    color:
      0x111827,

    roughness:
      0.55,

    metalness:
      0.35
  });


const base =
  new THREE.Mesh(
    baseGeometry,
    baseMaterial
  );


base.position.y =
  0.18;

base.castShadow =
  true;

base.receiveShadow =
  true;

scene.add(
  base
);


/* =====================================================
   CUBO DE CRISTAL
===================================================== */

const boxSize =
  7;

const half =
  boxSize / 2;


/*
   Material de cristal.
*/

const crystalMaterial =
  new THREE.MeshPhysicalMaterial({

    color:
      0x9ee7ff,

    transparent:
      true,

    opacity:
      0.18,

    transmission:
      0.9,

    roughness:
      0.04,

    metalness:
      0,

    thickness:
      0.15,

    ior:
      1.5,

    side:
      THREE.DoubleSide
  });


/* =====================================================
   PAREDES DE CRISTAL
===================================================== */

function createCrystalWall(
  width,
  height,
  depth,
  x,
  y,
  z
) {

  const geometry =
    new THREE.BoxGeometry(
      width,
      height,
      depth
    );


  const wall =
    new THREE.Mesh(
      geometry,
      crystalMaterial
    );


  wall.position.set(
    x,
    y,
    z
  );


  wall.receiveShadow =
    true;

  wall.castShadow =
    true;


  scene.add(
    wall
  );


  return wall;
}


/* Atrás */

const backWall =
  createCrystalWall(
    boxSize,
    boxSize,
    0.12,
    0,
    boxSize / 2,
    -half
  );


/* Izquierda */

const leftWall =
  createCrystalWall(
    0.12,
    boxSize,
    boxSize,
    -half,
    boxSize / 2,
    0
  );


/* Derecha */

const rightWall =
  createCrystalWall(
    0.12,
    boxSize,
    boxSize,
    half,
    boxSize / 2,
    0
  );


/* Frente */

const frontWall =
  createCrystalWall(
    boxSize,
    boxSize,
    0.12,
    0,
    boxSize / 2,
    half
  );


/* Techo */

const roof =
  createCrystalWall(
    boxSize,
    0.12,
    boxSize,
    0,
    boxSize,
    0
  );


/* =====================================================
   BORDES DE CRISTAL
===================================================== */

const cubeGeometry =
  new THREE.BoxGeometry(
    boxSize,
    boxSize,
    boxSize
  );


const edgesGeometry =
  new THREE.EdgesGeometry(
    cubeGeometry
  );


const edgesMaterial =
  new THREE.LineBasicMaterial({

    color:
      0x8be8ff,

    transparent:
      true,

    opacity:
      0.85
  });


const edges =
  new THREE.LineSegments(
    edgesGeometry,
    edgesMaterial
  );


edges.position.y =
  boxSize / 2;

scene.add(
  edges
);


/* =====================================================
   TEXTURA AFELPADA
===================================================== */


/*
   Creamos una textura procedural con ruido.
   Esto se utiliza como bumpMap para que la
   superficie tenga pequeñas irregularidades.
*/

function crearTexturaAfelpada() {

  const canvas =
    document.createElement(
      'canvas'
    );

  canvas.width =
    256;

  canvas.height =
    256;


  const ctx =
    canvas.getContext(
      '2d'
    );


  const imageData =
    ctx.createImageData(
      256,
      256
    );


  for (
    let i = 0;
    i < imageData.data.length;
    i += 4
  ) {

    const ruido =
      Math.floor(
        100 +
        Math.random() * 155
      );


    imageData.data[i] =
      ruido;

    imageData.data[i + 1] =
      ruido;

    imageData.data[i + 2] =
      ruido;

    imageData.data[i + 3] =
      255;
  }


  ctx.putImageData(
    imageData,
    0,
    0
  );


  const texture =
    new THREE.CanvasTexture(
      canvas
    );


  texture.wrapS =
    THREE.RepeatWrapping;

  texture.wrapT =
    THREE.RepeatWrapping;


  texture.repeat.set(
    4,
    4
  );


  return texture;
}


const fuzzyTexture =
  crearTexturaAfelpada();


/* =====================================================
   DATOS DE LAS 10 PELOTAS
===================================================== */

const ballData = [

  {
    color: '#ff6b9d',
    speed: 4.2,
    x: -2.2,
    y: 1.2,
    z: -2.0
  },

  {
    color: '#7dd3fc',
    speed: 4.8,
    x: 1.8,
    y: 2.0,
    z: -1.5
  },

  {
    color: '#c084fc',
    speed: 5.0,
    x: -1.2,
    y: 3.4,
    z: 1.7
  },

  {
    color: '#86efac',
    speed: 4.5,
    x: 2.0,
    y: 4.5,
    z: 1.4
  },

  {
    color: '#facc15',
    speed: 5.2,
    x: -2.1,
    y: 5.3,
    z: 0.5
  },

  {
    color: '#fb923c',
    speed: 4.7,
    x: 0.2,
    y: 1.4,
    z: 2.2
  },

  {
    color: '#f472b6',
    speed: 5.4,
    x: 2.2,
    y: 2.8,
    z: 2.0
  },

  {
    color: '#60a5fa',
    speed: 4.9,
    x: -2.3,
    y: 4.1,
    z: -0.7
  },

  {
    color: '#a3e635',
    speed: 5.1,
    x: 0.8,
    y: 5.1,
    z: -2.1
  },

  {
    color: '#e879f9',
    speed: 5.6,
    x: -0.4,
    y: 3.0,
    z: -2.4
  }

];


/* =====================================================
   CONFIGURACIÓN DE LAS PELOTAS
===================================================== */

const ballRadius =
  0.42;


/*
   Límite interno del cubo.
*/

const ballLimit =
  half -
  ballRadius -
  0.12;


/*
   Array de pelotas.
*/

const balls = [];


/* =====================================================
   CREAR PELOTA
===================================================== */

function crearPelota(
  data,
  index
) {

  const geometry =
    new THREE.SphereGeometry(
      ballRadius,
      48,
      48
    );


  const material =
    new THREE.MeshStandardMaterial({

      color:
        data.color,

      roughness:
        0.92,

      metalness:
        0.02,

      bumpMap:
        fuzzyTexture,

      bumpScale:
        0.08
    });


  const mesh =
    new THREE.Mesh(
      geometry,
      material
    );


  mesh.position.set(
    data.x,
    data.y,
    data.z
  );


  mesh.castShadow =
    true;

  mesh.receiveShadow =
    true;


  scene.add(
    mesh
  );


  /*
     Velocidad aleatoria en las tres
     dimensiones.
  */

  const direccion =
    new THREE.Vector3(
      Math.random() - 0.5,
      Math.random() - 0.5,
      Math.random() - 0.5
    ).normalize();


  const velocity =
    direccion.multiplyScalar(
      data.speed
    );


  const ball = {

    index,

    mesh,

    velocity,

    speed:
      data.speed,

    startPosition:
      mesh.position.clone()
  };


  balls.push(
    ball
  );
}


/* =====================================================
   CREAR LAS 10 PELOTAS
===================================================== */

ballData.forEach(
  (data, index) => {

    crearPelota(
      data,
      index
    );

  }
);


/* =====================================================
   MOVIMIENTO Y COLISIONES
===================================================== */

const gravity =
  0;


/*
   Las pelotas rebotan en las paredes
   del cubo.
*/

function moverPelotas(
  delta
) {

  for (
    const ball of balls
  ) {

    const position =
      ball.mesh.position;


    /*
       Movimiento
    */

    position.x +=
      ball.velocity.x *
      delta;

    position.y +=
      ball.velocity.y *
      delta;

    position.z +=
      ball.velocity.z *
      delta;


    /*
       Gravedad opcional.
       Se mantiene en cero para que
       las pelotas permanezcan
       rebotando por todo el cubo.
    */

    ball.velocity.y +=
      gravity *
      delta;


    /* =====================================
       COLISIÓN X
    ===================================== */

    if (
      position.x >
      ballLimit
    ) {

      position.x =
        ballLimit;

      ball.velocity.x =
        -Math.abs(
          ball.velocity.x
        );
    }


    if (
      position.x <
      -ballLimit
    ) {

      position.x =
        -ballLimit;

      ball.velocity.x =
        Math.abs(
          ball.velocity.x
        );
    }


    /* =====================================
       COLISIÓN Y
    ===================================== */

    if (
      position.y >
      ballLimit
    ) {

      position.y =
        ballLimit;

      ball.velocity.y =
        -Math.abs(
          ball.velocity.y
        );
    }


    if (
      position.y <
      ballRadius + 0.03
    ) {

      position.y =
        ballRadius + 0.03;

      ball.velocity.y =
        Math.abs(
          ball.velocity.y
        );
    }


    /* =====================================
       COLISIÓN Z
    ===================================== */

    if (
      position.z >
      ballLimit
    ) {

      position.z =
        ballLimit;

      ball.velocity.z =
        -Math.abs(
          ball.velocity.z
        );
    }


    if (
      position.z <
      -ballLimit
    ) {

      position.z =
        -ballLimit;

      ball.velocity.z =
        Math.abs(
          ball.velocity.z
        );
    }


    /*
       Mantener velocidad constante
       aunque rebote.
    */

    ball.velocity
      .normalize()
      .multiplyScalar(
        ball.speed
      );


    /*
       Rotación de la pelota
       para dar sensación de movimiento.
    */

    ball.mesh.rotation.x +=
      ball.velocity.z *
      delta *
      0.8;

    ball.mesh.rotation.z +=
      ball.velocity.x *
      delta *
      0.8;
  }


  /*
     Colisiones entre pelotas
  */

  detectarColisionesEntrePelotas();
}


/* =====================================================
   COLISIONES ENTRE PELOTAS
===================================================== */

function detectarColisionesEntrePelotas() {

  const distanciaMinima =
    ballRadius * 2;


  for (
    let i = 0;
    i < balls.length;
    i++
  ) {

    for (
      let j = i + 1;
      j < balls.length;
      j++
    ) {

      const a =
        balls[i];

      const b =
        balls[j];


      const diferencia =
        new THREE.Vector3()
          .subVectors(
            b.mesh.position,
            a.mesh.position
          );


      const distancia =
        diferencia.length();


      if (
        distancia > 0 &&
        distancia < distanciaMinima
      ) {

        const normal =
          diferencia.normalize();


        /*
           Separar las pelotas
        */

        const penetracion =
          distanciaMinima -
          distancia;


        a.mesh.position.addScaledVector(
          normal,
          -penetracion / 2
        );


        b.mesh.position.addScaledVector(
          normal,
          penetracion / 2
        );


        /*
           Intercambio simple de
           velocidades en la dirección
           de la colisión.
        */

        const velocidadA =
          a.velocity.dot(
            normal
          );


        const velocidadB =
          b.velocity.dot(
            normal
          );


        const diferenciaVelocidad =
          velocidadA -
          velocidadB;


        if (
          diferenciaVelocidad > 0
        ) {

          a.velocity.addScaledVector(
            normal,
            -diferenciaVelocidad
          );

          b.velocity.addScaledVector(
            normal,
            diferenciaVelocidad
          );
        }
      }
    }
  }
}


/* =====================================================
   GUI
===================================================== */

const guiContainer =
  document.getElementById(
    'gui-container'
  );


const gui =
  new GUI({

    container:
      guiContainer,

    title:
      'Controles'
  });


/* =====================================================
   CARPETA PELOTAS
===================================================== */

const ballsFolder =
  gui.addFolder(
    '🔮 PELOTAS'
  );


/*
   Crear una carpeta para
   cada una de las 10 pelotas.
*/

balls.forEach(
  (ball, index) => {

    const folder =
      ballsFolder.addFolder(
        `Pelota ${index + 1}`
      );


    const data =
      ballData[index];


    /* X */

    folder
      .add(
        data,
        'x',
        -ballLimit,
        ballLimit,
        0.05
      )
      .name('Posición X')
      .onChange(
        () => {

          ball.mesh.position.x =
            data.x;

        }
      );


    /* Y */

    folder
      .add(
        data,
        'y',
        ballRadius,
        ballLimit,
        0.05
      )
      .name('Posición Y')
      .onChange(
        () => {

          ball.mesh.position.y =
            data.y;

        }
      );


    /* Z */

    folder
      .add(
        data,
        'z',
        -ballLimit,
        ballLimit,
        0.05
      )
      .name('Posición Z')
      .onChange(
        () => {

          ball.mesh.position.z =
            data.z;

        }
      );


    /* Color */

    folder
      .addColor(
        data,
        'color'
      )
      .name('Color')
      .onChange(
        (valor) => {

          ball.mesh.material.color.set(
            valor
          );

        }
      );


    /* Velocidad */

    folder
      .add(
        data,
        'speed',
        1,
        10,
        0.1
      )
      .name('Velocidad')
      .onChange(
        (valor) => {

          ball.speed =
            valor;


          ball.velocity
            .normalize()
            .multiplyScalar(
              ball.speed
            );

        }
      );


    /* Visible */

    data.visible =
      true;


    folder
      .add(
        data,
        'visible'
      )
      .name('Visible')
      .onChange(
        (valor) => {

          ball.mesh.visible =
            valor;

        }
      );

  }
);


/* =====================================================
   CARPETA FOCO
===================================================== */

const lightFolder =
  gui.addFolder(
    '💡 FOCO'
  );


const lightParams = {

  x:
    spotlight.position.x,

  y:
    spotlight.position.y,

  z:
    spotlight.position.z,

  intensidad:
    spotlight.intensity,

  angulo:
    32,

  penumbra:
    0.45
};


/* X */

lightFolder
  .add(
    lightParams,
    'x',
    -8,
    8,
    0.1
  )
  .name('Posición X')
  .onChange(
    actualizarFocoGUI
  );


/* Y */

lightFolder
  .add(
    lightParams,
    'y',
    2,
    14,
    0.1
  )
  .name('Altura Y')
  .onChange(
    actualizarFocoGUI
  );


/* Z */

lightFolder
  .add(
    lightParams,
    'z',
    -8,
    8,
    0.1
  )
  .name('Posición Z')
  .onChange(
    actualizarFocoGUI
  );


/* Intensidad */

lightFolder
  .add(
    lightParams,
    'intensidad',
    0,
    400,
    1
  )
  .name('Intensidad')
  .onChange(
    actualizarFocoGUI
  );


/* Ángulo */

lightFolder
  .add(
    lightParams,
    'angulo',
    10,
    60,
    1
  )
  .name('Ángulo')
  .onChange(
    actualizarFocoGUI
  );


/* Penumbra */

lightFolder
  .add(
    lightParams,
    'penumbra',
    0,
    1,
    0.01
  )
  .name('Suavidad')
  .onChange(
    actualizarFocoGUI
  );


/* =====================================================
   CARPETA ESCENA
===================================================== */

const sceneFolder =
  gui.addFolder(
    '🌎 ESCENA'
  );


const sceneParams = {

  mostrarEjes:
    true,

  mostrarCaja:
    true,

  mostrarFoco:
    true,

  mostrarCuadricula:
    true,

  exposicion:
    1.1
};


/* Exposición */

sceneFolder
  .add(
    sceneParams,
    'exposicion',
    0.3,
    2.5,
    0.01
  )
  .name('Exposición')
  .onChange(
    (valor) => {

      renderer.toneMappingExposure =
        valor;

    }
  );


/* Ejes */

sceneFolder
  .add(
    sceneParams,
    'mostrarEjes'
  )
  .name('Mostrar ejes')
  .onChange(
    actualizarVisibilidad
  );


/* Caja */

sceneFolder
  .add(
    sceneParams,
    'mostrarCaja'
  )
  .name('Mostrar cristal')
  .onChange(
    actualizarVisibilidad
  );


/* Foco */

sceneFolder
  .add(
    sceneParams,
    'mostrarFoco'
  )
  .name('Mostrar foco')
  .onChange(
    actualizarVisibilidad
  );


/* Cuadrícula */

sceneFolder
  .add(
    sceneParams,
    'mostrarCuadricula'
  )
  .name('Mostrar cuadrícula')
  .onChange(
    actualizarVisibilidad
  );


/* =====================================================
   BOTÓN REINICIAR
===================================================== */

const acciones = {

  reiniciar:
    reiniciar
};


gui
  .add(
    acciones,
    'reiniciar'
  )
  .name(
    '🔄 Reiniciar pelotas'
  );


ballsFolder.open();

lightFolder.open();

sceneFolder.open();


/* =====================================================
   ACTUALIZAR FOCO
===================================================== */

function actualizarFocoGUI() {

  spotlight.position.set(

    lightParams.x,

    lightParams.y,

    lightParams.z
  );


  bulb.position.copy(
    spotlight.position
  );


  halo.position.copy(
    spotlight.position
  );


  spotlight.intensity =
    lightParams.intensidad;


  spotlight.angle =
    THREE.MathUtils.degToRad(
      lightParams.angulo
    );


  spotlight.penumbra =
    lightParams.penumbra;


  spotHelper.update();
}


/* =====================================================
   VISIBILIDAD
===================================================== */

function actualizarVisibilidad() {

  axesHelper.visible =
    sceneParams.mostrarEjes;

  frontWall.visible =
    sceneParams.mostrarCaja;

  backWall.visible =
    sceneParams.mostrarCaja;

  leftWall.visible =
    sceneParams.mostrarCaja;

  rightWall.visible =
    sceneParams.mostrarCaja;

  roof.visible =
    sceneParams.mostrarCaja;

  edges.visible =
    sceneParams.mostrarCaja;

  bulb.visible =
    sceneParams.mostrarFoco;

  halo.visible =
    sceneParams.mostrarFoco;

  spotHelper.visible =
    sceneParams.mostrarFoco;

  grid.visible =
    sceneParams.mostrarCuadricula;
}


/* =====================================================
   EJES
===================================================== */

const axesHelper =
  new THREE.AxesHelper(
    5
  );

scene.add(
  axesHelper
);


/* =====================================================
   MOUSE PARA MOVER EL FOCO
===================================================== */

const raycaster =
  new THREE.Raycaster();


const mouse =
  new THREE.Vector2();


/*
   Plano horizontal invisible.

   Se utiliza para convertir la posición
   del mouse en coordenadas X/Z.
*/

const dragPlane =
  new THREE.Plane(
    new THREE.Vector3(
      0,
      1,
      0
    ),
    0
  );


const intersection =
  new THREE.Vector3();


let draggingLight =
  false;


/* =====================================================
   DETECTAR CLICK SOBRE EL FOCO
===================================================== */

renderer.domElement.addEventListener(
  'pointerdown',
  (event) => {

    const rect =
      renderer.domElement.getBoundingClientRect();


    mouse.x =
      (
        (event.clientX - rect.left) /
        rect.width
      ) *
      2 -
      1;


    mouse.y =
      -(
        (event.clientY - rect.top) /
        rect.height
      ) *
      2 +
      1;


    raycaster.setFromCamera(
      mouse,
      camera
    );


    const objetos =
      raycaster.intersectObject(
        bulb
      );


    if (
      objetos.length > 0
    ) {

      draggingLight =
        true;


      controls.enabled =
        false;


      document.body.classList.add(
        'dragging-light'
      );


      renderer.domElement.setPointerCapture(
        event.pointerId
      );

    }

  }
);


/* =====================================================
   MOVER FOCO CON EL MOUSE
===================================================== */

renderer.domElement.addEventListener(
  'pointermove',
  (event) => {

    if (
      !draggingLight
    ) {

      return;
    }


    const rect =
      renderer.domElement.getBoundingClientRect();


    mouse.x =
      (
        (event.clientX - rect.left) /
        rect.width
      ) *
      2 -
      1;


    mouse.y =
      -(
        (event.clientY - rect.top) /
        rect.height
      ) *
      2 +
      1;


    raycaster.setFromCamera(
      mouse,
      camera
    );


    /*
       Intersección del mouse
       con el plano horizontal.
    */

    if (
      raycaster.ray.intersectPlane(
        dragPlane,
        intersection
      )
    ) {

      /*
         Limitar el foco al área
         de la escena.
      */

      lightParams.x =
        THREE.MathUtils.clamp(
          intersection.x,
          -8,
          8
        );


      lightParams.z =
        THREE.MathUtils.clamp(
          intersection.z,
          -8,
          8
        );


      actualizarFocoGUI();


      actualizarGUI(
        lightFolder
      );
    }

  }
);


/* =====================================================
   SOLTAR FOCO
===================================================== */

renderer.domElement.addEventListener(
  'pointerup',
  (event) => {

    if (
      draggingLight
    ) {

      draggingLight =
        false;


      controls.enabled =
        true;


      document.body.classList.remove(
        'dragging-light'
      );


      try {

        renderer.domElement.releasePointerCapture(
          event.pointerId
        );

      } catch {

        // No hacer nada.

      }
    }

  }
);


/* =====================================================
   RUEDA DEL MOUSE
   SUBIR / BAJAR FOCO
===================================================== */

renderer.domElement.addEventListener(
  'wheel',
  (event) => {

    if (
      !draggingLight
    ) {

      return;
    }


    event.preventDefault();


    lightParams.y +=
      event.deltaY > 0
        ? -0.25
        : 0.25;


    lightParams.y =
      THREE.MathUtils.clamp(
        lightParams.y,
        2,
        14
      );


    actualizarFocoGUI();


    actualizarGUI(
      lightFolder
    );

  },
  {
    passive: false
  }
);


/* =====================================================
   ACTUALIZAR GUI
===================================================== */

function actualizarGUI(
  folder
) {

  folder
    .controllersRecursive()
    .forEach(
      controller => {

        controller.updateDisplay();

      }
    );
}


/* =====================================================
   REINICIAR
===================================================== */

function reiniciar() {

  balls.forEach(
    (ball, index) => {

      const data =
        ballData[index];


      ball.mesh.position.set(

        data.x,

        data.y,

        data.z

      );


      const direccion =
        new THREE.Vector3(
          Math.random() - 0.5,
          Math.random() - 0.5,
          Math.random() - 0.5
        ).normalize();


      ball.velocity =
        direccion.multiplyScalar(
          ball.speed
        );

    }
  );

}


/* =====================================================
   INFORMACIÓN
===================================================== */

function actualizarInformacion() {

  const lightText =
    document.getElementById(
      'light-position'
    );


  lightText.textContent =

    `Foco: X ${spotlight.position.x.toFixed(2)} | ` +

    `Y ${spotlight.position.y.toFixed(2)} | ` +

    `Z ${spotlight.position.z.toFixed(2)}`;
}


/* =====================================================
   ETIQUETAS DE EJES
===================================================== */

const labelX =
  document.getElementById(
    'label-x'
  );

const labelY =
  document.getElementById(
    'label-y'
  );

const labelZ =
  document.getElementById(
    'label-z'
  );


function actualizarEtiqueta(
  posicion,
  elemento
) {

  const vector =
    posicion.clone();


  vector.project(
    camera
  );


  const x =
    (
      vector.x *
      0.5 +
      0.5
    ) *
    window.innerWidth;


  const y =
    (
      -vector.y *
      0.5 +
      0.5
    ) *
    window.innerHeight;


  elemento.style.transform =

    `translate(-50%, -50%) ` +

    `translate(${x}px, ${y}px)`;
}


/* =====================================================
   ANIMACIÓN
===================================================== */

const clock =
  new THREE.Clock();


function animate() {

  requestAnimationFrame(
    animate
  );


  const delta =
    Math.min(
      clock.getDelta(),
      0.05
    );


  /*
     Mover las 10 pelotas
  */

  moverPelotas(
    delta
  );


  /*
     Actualizar cámara
  */

  controls.update();


  /*
     Actualizar foco
  */

  spotHelper.update();


  /*
     Etiquetas
  */

  actualizarEtiqueta(
    new THREE.Vector3(
      5,
      0,
      0
    ),
    labelX
  );


  actualizarEtiqueta(
    new THREE.Vector3(
      0,
      5,
      0
    ),
    labelY
  );


  actualizarEtiqueta(
    new THREE.Vector3(
      0,
      0,
      5
    ),
    labelZ
  );


  /*
     Información
  */

  actualizarInformacion();


  /*
     Render
  */

  renderer.render(
    scene,
    camera
  );
}


/* =====================================================
   RESPONSIVE
===================================================== */

window.addEventListener(
  'resize',
  () => {

    camera.aspect =
      window.innerWidth /
      window.innerHeight;


    camera.updateProjectionMatrix();


    renderer.setPixelRatio(
      Math.min(
        window.devicePixelRatio,
        2
      )
    );


    renderer.setSize(
      window.innerWidth,
      window.innerHeight
    );

  }
);


/* =====================================================
   INICIALIZACIÓN
===================================================== */

actualizarFocoGUI();

actualizarVisibilidad();

animate();