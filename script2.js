import gsap from 'gsap'
import * as THREE from "three";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
// import { RotateControls } from 'three/addons/controls/DragControls.js';

import getStarfield from "./src/getStarfield.js";
import { getFresnelMat } from "./src/getFresnelMat.js";
import ThreeGlobe from 'three-globe';
import { TrackballControls } from 'three/addons/controls/TrackballControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';


// Setup renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('globeViz').appendChild(renderer.domElement);

// Setup scene
const scene = new THREE.Scene();
scene.add(new THREE.AmbientLight(0xcccccc, Math.PI));
scene.add(new THREE.DirectionalLight(0xffffff, 0.6 * Math.PI));

// Setup camera
const camera = new THREE.PerspectiveCamera();
camera.aspect = window.innerWidth/window.innerHeight;
camera.updateProjectionMatrix();
camera.position.z = 400;

const Globe = new ThreeGlobe()
      .globeImageUrl('//unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
      .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png');

scene.add(Globe);

const loader = new GLTFLoader();

loader.load( './models/princeton.glb', function ( gltf ) {

	const model = gltf.scene;  // 'model' is the root scene node of the GLB file

    // Scale the model
    model.scale.set(10, 10, 10); // Double the size of the model in all dimensions
    model.position.set(0,50,20);

    Globe.add(model);

    // Add the scaled model to the scene
    // scene.add(model);

}, undefined, function ( error ) {

	console.error( error );

} );

// Kick-off renderer
(function animate() { // IIFE
    // Frame cycle
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  })();
