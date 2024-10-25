import gsap from 'gsap'
import * as THREE from "three";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
// import { RotateControls } from 'three/addons/controls/DragControls.js';

import getStarfield from "./src/getStarfield.js";
import { getFresnelMat } from "./src/getFresnelMat.js";
import ThreeGlobe from 'three-globe';

const w = window.innerWidth;
const h = window.innerHeight;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
camera.position.z = 5;
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);
// THREE.ColorManagement.enabled = true;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.outputColorSpace = THREE.LinearSRGBColorSpace;

const textureLoader = new THREE.TextureLoader();
const earthTexture = textureLoader.load('./img/earth.png');

const myGlobe = new ThreeGlobe()
  .globeImageUrl('./img/earth.jpg')

const earthGroup = new THREE.Group();
earthGroup.rotation.z =  23.4 * Math.PI / 180;
// scene.add(earthGroup);
// new OrbitControls(camera, renderer.domElement);
const detail = 15;
const loader = new THREE.TextureLoader();
const geometry = new THREE.IcosahedronGeometry(2, detail);
const material = new THREE.MeshPhongMaterial({
  map: earthTexture,
  specularMap: loader.load("./textures/02_earthspec1k.jpg"),
  bumpMap: loader.load("./textures/01_earthbump1k.jpg"),
  bumpScale: 1.0,
});

const earthMesh = new THREE.Mesh(geometry, material);

// earthGroup.add(earthMesh);
earthGroup.add(myGlobe);

const moonTexture = textureLoader.load('./textures/lroc_color_poles_2k.tif');
const loaderMoon = new THREE.TextureLoader();
const geometryMoon = new THREE.IcosahedronGeometry(0.25, detail);
const materialMoon = new THREE.MeshPhongMaterial({
  map: moonTexture
});

const moonMesh = new THREE.Mesh(geometryMoon, materialMoon);
moonMesh.position.set(-2, 1, -2)
const moonGroup = new THREE.Group();
moonGroup.rotation.z =  43.4 * Math.PI / 180;

moonGroup.add(moonMesh);
scene.add(moonGroup);


const lightsMat = new THREE.MeshBasicMaterial({
  map: loader.load("./textures/03_earthlights1k.jpg"),
  blending: THREE.AdditiveBlending,
});
const lightsMesh = new THREE.Mesh(geometry, lightsMat);
// earthGroup.add(lightsMesh);

const cloudsMat = new THREE.MeshStandardMaterial({
  map: loader.load("./textures/04_earthcloudmap.jpg"),
  transparent: true,
  opacity: 0.1,
  blending: THREE.AdditiveBlending,
  alphaMap: loader.load('./textures/05_earthcloudmaptrans.jpg'),
  // alphaTest: 0.3,
});
const cloudsMesh = new THREE.Mesh(geometry, cloudsMat);
cloudsMesh.scale.setScalar(1.003);
earthGroup.add(cloudsMesh);

const fresnelMat = getFresnelMat();
const glowMesh = new THREE.Mesh(geometry, fresnelMat);
glowMesh.scale.setScalar(1.01);
// earthGroup.add(glowMesh);

const stars = getStarfield({numStars: 2000});
scene.add(stars);

const sunLight = new THREE.DirectionalLight(0xffffff, 5.0);
sunLight.position.set(-2, 0.5, 1.5);
scene.add(sunLight);

const group = new THREE.Group()
group.add(earthGroup)
scene.add(group)
  

  const mouse = {
      x: undefined,
      y: undefined
  }
  
  
// var orbitControls = new OrbitControls(camera, renderer.domElement)

var mouseDown = false,
mouseX = 0,
mouseY = 0;

var canvas = renderer.domElement    

const raycaster = new THREE.Raycaster();
const mouseVector = new THREE.Vector2();

let rotationVelocity = 0;

function animate() {
  requestAnimationFrame(animate);

  earthMesh.rotation.y += 0.002;
  lightsMesh.rotation.y += 0.002;
  cloudsMesh.rotation.y += 0.0023;
  glowMesh.rotation.y += 0.002;
  stars.rotation.y -= 0.0002;
//   moonGroup.rotation.y -= 0.005;

// Apply rotation velocity to the object's rotation
earthMesh.rotation.y += rotationVelocity;
cloudsMesh.rotation.y += rotationVelocity;

// Apply damping to the rotation velocity
rotationVelocity *= 0.95; // Damping factor

  renderer.render(scene, camera);

  
  
//   orbitControls.update();

//   gsap.to(group.rotation, {
//     y: mouse.x * 8,
//     duration: 2
// })
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  window.addEventListener("resize", onWindowResize);
  
animate()



function handleWindowResize () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
//   window.addEventListener('resize', handleWindowResize, false);

// addEventListener('mousemove', (event) => {
//     mouse.x = (event.clientX /  window.innerWidth)
//     mouse.y = (event.clientY /  window.innerHeight)
    
//     })



canvas.addEventListener('mousemove', function (evt) {
    if (!mouseDown) {return}
    evt.preventDefault();
    var deltaX = evt.clientX - mouseX,
        deltaY = evt.clientY - mouseY;
    mouseX = evt.clientX;
    mouseY = evt.clientY;

    // DO SOMETHING HERE WITH X and Y 
    // group.rotation.y += deltaX * 0.002

    rotationVelocity = deltaX * 0.002;
    
}, false);

canvas.addEventListener('mousedown', function (evt) {
        evt.preventDefault();

        mouseVector.x = (evt.clientX / window.innerWidth) * 2 - 1;
        mouseVector.y = - (evt.clientY / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera(mouseVector, camera);

        const intersects = raycaster.intersectObject(earthMesh, true);

        if (intersects.length > 0) {
            mouseDown = true;
            mouseX = evt.clientX;
            mouseY = evt.clientY;
        }
        
        }, false);
        
canvas.addEventListener('mouseup', function (evt) {
        
    evt.preventDefault();
        mouseDown = false;
        }, false);


