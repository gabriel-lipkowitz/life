import gsap from 'gsap'
import * as THREE from "three";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
// import { RotateControls } from 'three/addons/controls/DragControls.js';

import getStarfield from "./src/getStarfield.js";
import { getFresnelMat } from "./src/getFresnelMat.js";
import ThreeGlobe from 'three-globe';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { TrackballControls } from 'three/addons/controls/TrackballControls.js';

const EARTH_RADIUS_KM = 6371; // km
    const SAT_SIZE = 80;

    const Globe = new ThreeGlobe()
      .globeImageUrl('//unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
      .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png');

    const CLOUDS_IMG_URL = './img/clouds.png'; // from https://github.com/turban/webgl-earth
    const CLOUDS_ALT = 0.004;
    const CLOUDS_ROTATION_SPEED = -0.6; // deg/frame

    const Clouds = new THREE.Mesh(new THREE.SphereGeometry(Globe.getGlobeRadius() * (1 + CLOUDS_ALT), 75, 75));
    new THREE.TextureLoader().load(CLOUDS_IMG_URL, cloudsTexture => {
      Clouds.material = new THREE.MeshPhongMaterial({ map: cloudsTexture, transparent: true });
    });

    Globe.add(Clouds);

    
    // Setup renderer
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Setup scene
    const scene = new THREE.Scene();
    scene.add(Globe);
    scene.add(new THREE.AmbientLight(0xcccccc, Math.PI));
    scene.add(new THREE.DirectionalLight(0xffffff, 0.6 * Math.PI));

    // Setup camera
    const camera = new THREE.PerspectiveCamera();
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    camera.position.z = 500;

    // Add camera controls
    const tbControls = new TrackballControls(camera, renderer.domElement);
    tbControls.minDistance = 101;
    tbControls.rotateSpeed = 5;
    tbControls.zoomSpeed = 0.8;

    const loader = new GLTFLoader();

      let model

    loader.load( './models/princeton.glb', function ( gltf ) {

        model = gltf.scene;  // 'model' is the root scene node of the GLB file
    
        // Scale the model
        const scale = 2.5
        model.scale.set(scale, scale, scale); // Double the size of the model in all dimensions
    
        Globe.add(model);

        let center = Globe.position

        console.log(center)

        // Calculate the direction vector from the model to the center
        let direction = center.clone().sub(model.position);
        // Use the direction to orient the model
        model.lookAt(center);
        
        // startCloudsRotation();
        
    
        // Add the scaled model to the scene
        // scene.add(model);
    
    }, undefined, function ( error ) {
    
        console.error( error );
    
    } );

    
    function startCloudsRotation() {
        function rotateClouds() {
            if (model) {
                model.rotation.z += CLOUDS_ROTATION_SPEED * Math.PI / 180;
            }
            requestAnimationFrame(rotateClouds);
        }
        rotateClouds();
    }
    
    // Kick-off renderer
    (function animate() { // IIFE
      // Frame cycle
      tbControls.update();
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    })();