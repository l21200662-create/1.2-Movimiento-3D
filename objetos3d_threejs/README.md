# Práctica 1.1 — Introducción a objetos 3D con Three.js

## Objetivo

Construir una aplicación Web 3D utilizando HTML, CSS y JavaScript, empleando la biblioteca Three.js para crear y animar objetos tridimensionales.

La aplicación desarrollada contiene una escena 3D con una cámara en perspectiva, un cubo animado y una esfera como segundo objeto. También se implementó la adaptación automática al tamaño de la ventana del navegador.

## Tecnologías utilizadas

* HTML5
* CSS3
* JavaScript
* Three.js
* Visual Studio Code
* Live Server
* Git
* GitHub
* GitHub Pages

## Estructura del proyecto

```text
objetos3d_threejs/
│
├── index.html
├── README.md
│
└── assets/
    ├── css/
    │   └── styles.css
    │
    └── js/
        └── main.js
```

## Descripción de la aplicación

La aplicación utiliza Three.js mediante un CDN y un import map.

Se creó una escena tridimensional que contiene un cubo y una esfera.

El cubo utiliza `BoxGeometry` para definir su forma y `MeshBasicMaterial` para definir su apariencia. Sus dimensiones fueron modificadas para demostrar el efecto de cambiar el ancho, alto y profundidad.

La esfera utiliza `SphereGeometry` y un material de diferente color, además de encontrarse en una posición distinta al cubo.

## Elementos principales de Three.js

### Scene

La escena representa el mundo tridimensional donde se colocan los objetos.

### PerspectiveCamera

La cámara determina el punto de vista desde el cual se observa la escena.

Los parámetros utilizados son:

* FOV: 75
* Aspect: ancho de la ventana / alto de la ventana
* Near: 0.1
* Far: 1000

La posición inicial de la cámara es:

```javascript
camera.position.z = 5;
```

### WebGLRenderer

El renderizador genera la imagen de la escena utilizando la cámara y la muestra en el navegador mediante un elemento canvas.

### BoxGeometry

Define la forma y las dimensiones del cubo.

En esta práctica se utilizaron las dimensiones:

```javascript
new THREE.BoxGeometry(2.2, 1.2, 1.6);
```

### MeshBasicMaterial

Define la apariencia del objeto, incluyendo su color y la opción `wireframe`.

### Mesh

Combina la geometría y el material para crear un objeto renderizable.

## Animación

La aplicación utiliza:

```javascript
renderer.setAnimationLoop(animate);
```

para ejecutar continuamente la función de animación.

El cubo rota sobre los ejes X y Y con diferentes velocidades:

```javascript
cube.rotation.x = time / 1800;
cube.rotation.y = time / 900;
```

La esfera también cuenta con una rotación propia.

## Wireframe

Durante la práctica se probó la propiedad:

```javascript
wireframe: true;
```

Cuando `wireframe` está activado se observan las líneas de la geometría.

Al utilizar:

```javascript
wireframe: false;
```

se muestra la superficie completa del objeto.

## Cámara

Se probó la posición de la cámara en el eje Z para observar el cambio de perspectiva.

Cuando la cámara se acerca a los objetos, estos se observan más grandes. Cuando la cámara se aleja, los objetos se observan más pequeños.

## Diseño adaptable

La aplicación cuenta con un evento `resize` que actualiza el aspecto de la cámara y el tamaño del renderizador cuando cambia el tamaño de la ventana.

Esto permite que la aplicación se adapte a diferentes tamaños de pantalla.

## Ejecución local

Para ejecutar el proyecto:

1. Abrir la carpeta del proyecto en Visual Studio Code.
2. Instalar la extensión Live Server.
3. Abrir el archivo `index.html`.
4. Hacer clic derecho sobre el archivo.
5. Seleccionar **Open with Live Server**.
6. La aplicación se abrirá en el navegador.

No se debe abrir el archivo HTML directamente mediante doble clic, debido al uso de módulos JavaScript y el import map.

## Preguntas de reflexión técnica

### ¿Qué función cumple cada elemento: escena, cámara y renderizador?

La escena representa el mundo tridimensional donde se encuentran los objetos. La cámara determina el punto de vista desde el cual se observa la escena. El renderizador toma la información de la escena y de la cámara y genera la imagen que se muestra en el navegador.

### ¿Por qué el cubo no debe permanecer en la misma posición que la cámara?

El cubo necesita estar separado de la cámara para que pueda ser observado correctamente. Si estuviera en la misma posición, la cámara podría encontrarse dentro del objeto o demasiado cerca de él, impidiendo obtener una vista adecuada.

### ¿Qué relación existe entre geometría, material y malla?

La geometría determina la forma y dimensiones del objeto. El material determina características visuales como el color y el modo de representación. La malla (`Mesh`) combina una geometría y un material para formar un objeto que puede ser colocado dentro de la escena.

### ¿Por qué se utiliza un servidor local en lugar de abrir el HTML directamente?

Se utiliza un servidor local porque los módulos de JavaScript y algunas características utilizadas por Three.js pueden tener restricciones al abrir los archivos directamente mediante `file://`. Live Server proporciona un entorno HTTP local que permite cargar correctamente los módulos.

### ¿Qué ventaja ofrece `setAnimationLoop()` para una animación en el navegador?

`setAnimationLoop()` permite ejecutar continuamente una función encargada de actualizar y renderizar la escena. De esta manera se pueden modificar propiedades de los objetos, como su rotación, para producir una animación continua.

## Autor

**Nombre del alumno:** Jocelin Ramirez Flores

## Captura de la aplicación

La captura de pantalla de la aplicación funcionando se agregará cuando el proyecto esté terminado.

## Repositorio de GitHub

La URL del repositorio se agregará después de publicar el proyecto.

## GitHub Pages

La URL de GitHub Pages se agregará después de realizar el despliegue.
