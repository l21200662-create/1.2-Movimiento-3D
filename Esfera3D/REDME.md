# Práctica 1.2 | Esfera en Caja de Cristal 3D

Simulador interactivo en 3D que modela el movimiento y las colisiones de una esfera dentro de un contenedor transparente con iluminación, sombras y controles en tiempo real.

---

## 👤 Autor

* **Jocelin Ramirez Flores**

---

## 🚀 Características

* **Gráficos 3D**: Renderizado mediante [Three.js](https://threejs.org/) utilizando `WebGLRenderer`.
* **Fondo dinámico**: Integración del canvas 3D con fondos CSS (*radial gradient*) mediante transparencia (`alpha: true`).
* **Controles interactivos**: 
  * Control de cámara en 360° mediante `OrbitControls`.
  * Interfaz gráfica personalizada en tiempo real utilizando `lil-gui`.
* **Proyección de Etiquetas**: Marcadores en HTML/CSS proyectados para señalar los ejes de coordenadas (X, Y, Z).
* **Diseño Adaptativo**: Panel de control y canvas totalmente responsivos para dispositivos móviles y pantallas pequeñas.

---

## 📁 Estructura del Proyecto

```text
.
├── index.html       # Estructura principal e Import Map de módulos JS
├── styles.css       # Estilos generales, layout, gradiente de fondo y lil-gui
├── main.js          # Configuración de escena, cámara, luces, renderer y animación
└── README.md        # Documentación del proyecto