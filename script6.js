import gsap from 'gsap'
import * as THREE from "three";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
// import { RotateControls } from 'three/addons/controls/DragControls.js';

import getStarfield from "./src/getStarfield.js";
import { getFresnelMat } from "./src/getFresnelMat.js";
import ThreeGlobe from 'three-globe';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

import { TrackballControls } from 'three/addons/controls/TrackballControls.js';

const models = {
    'princeton': './models/princeton.glb',
    'stanford': './models/stanford.glb',
    'singapore': './models/singapore.glb',
    'charlottesville': './models/charlottesville.glb',
    'london': './models/london.glb',
};

const modelCache = {};
const loader = new GLTFLoader();
let camera, renderer, scene, canvas;
let rotationVelocity = 0;

const mouse = {
    x: undefined,
    y: undefined
}

var mouseDown = false,
mouseX = 0,
mouseY = 0;
  

const raycaster = new THREE.Raycaster();
const mouseVector = new THREE.Vector2();

// Function to preload all models and execute a callback when done
function preloadModels(callback) {
    const entries = Object.entries(models);
    let loadedCount = 0;

    entries.forEach(([type, url]) => {
        loader.load(url, gltf => {
            const model = gltf.scene;
            model.scale.set(2, 2, 2);  // Adjust the scale as necessary
            modelCache[type] = model;
            loadedCount++;
            if (loadedCount === entries.length) {
                callback();  // All models are loaded, call the callback
            }
        }, undefined, error => {
            console.error(`Failed to load model ${type}:`, error);
        });
    });
}

let globe;

// Function to initialize the globe and start the visualization
function initializeGlobe() {
    globe = new ThreeGlobe()
        .globeImageUrl('./img/earth.jpg')
        .objectFacesSurface(true)
        .objectsData([
            { lat: 40.3430, lng: -74.6514, type: 'princeton' },  // Princeton
            { lat: 37.4275, lng: -122.1697, type: 'stanford' },   // Stanford
            { lat: 1.3521, lng: 103.8198, type: 'singapore' } ,
            { lat: 38.0293, lng: -78.4767, type: 'charlottesville' },  // Charlottesville
            { lat: 51.5074, lng: -0.1278, type: 'london' }      // Singapore
        ])
        .objectThreeObject(data => {
            return modelCache[data.type].clone();  // Use a clone of the loaded model
        });

    // Initialize scene and camera as before
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    canvas = renderer.domElement
    
    canvas.addEventListener('mousemove', function (evt) {
        if (!mouseDown) {return}
        evt.preventDefault();
        var deltaX = evt.clientX - mouseX,
            deltaY = evt.clientY - mouseY;
        mouseX = evt.clientX;
        mouseY = evt.clientY;
    
        rotationVelocity = deltaX * 0.002;

        console.log(rotationVelocity)
        
    }, false);
    
    canvas.addEventListener('mousedown', function (evt) {
        evt.preventDefault();
    
        // Update the mouse vector to reflect the current mouse position
        mouseVector.x = (evt.clientX / window.innerWidth) * 2 - 1;
        mouseVector.y = -(evt.clientY / window.innerHeight) * 2 + 1;
    
        // Update the raycaster to use the current camera and mouse vector
        raycaster.setFromCamera(mouseVector, camera);
    
        // Perform the raycasting to check for intersections
        const intersects = raycaster.intersectObjects(scene.children, true);
    
        if (intersects.length > 0) {
            // Set flag for mouse down and update coordinates for use in mousemove
            mouseDown = true;
            mouseX = evt.clientX;
            mouseY = evt.clientY;
    
            // Handle the first intersected object (the closest one)
            console.log('Object clicked:', intersects[0].object);
            
            // Here you can add any specific logic you need when an object is clicked
            handleObjectClick(intersects[0]);
        }
    }, false);
            
    canvas.addEventListener('mouseup', function (evt) {
            
        evt.preventDefault();
            mouseDown = false;
            }, false);
    
    
    

    camera = new THREE.PerspectiveCamera();
        camera.aspect = window.innerWidth/window.innerHeight;
        camera.updateProjectionMatrix();
        camera.position.z = 400;

    scene = new THREE.Scene();
    scene.add(globe);
    scene.add(new THREE.AmbientLight(0xbbbbbb));
    scene.add(new THREE.DirectionalLight(0xffffff, 0.6));

    // Animate the scene
    function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    // globe.rotation.y += 0.01;

    globe.rotation.y += rotationVelocity;
    // cloudsMesh.rotation.y += rotationVelocity;
    
    // Apply damping to the rotation velocity
    rotationVelocity *= 0.95; // Damping factor

    }
    animate();
}

function latLonToVector3(lat, lon, radius = 1) {
    var phi = (90 - lat) * (Math.PI / 180);
    var theta = (lon + 180) * (Math.PI / 180);

    return new THREE.Vector3(
        -radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.cos(phi),
        radius * Math.sin(phi) * Math.sin(theta)
    );
}

function handleObjectClick(object) {
    console.log('Clicked object:', object);

    const clickedPoint = object.point;  // This is already in world coordinates
    
   
   			var a = new THREE.Vector3(0,0,1);
        var b = clickedPoint.normalize();
   
        var q = new THREE.Quaternion();
        
        q.setFromUnitVectors(b, a);
        globe.applyMatrix(new THREE.Matrix4().makeRotationFromQuaternion(q));


}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  window.addEventListener("resize", onWindowResize);

// Start preloading models and initialize the globe once done
preloadModels(initializeGlobe);




