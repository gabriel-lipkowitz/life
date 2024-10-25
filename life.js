// // import gsap from 'gsap'
// // import * as THREE from "three";
// // import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
// // // import { RotateControls } from 'three/addons/controls/DragControls.js';
// // import { loadCurveFromJSON } from './curveTools/CurveMethods.js'
// // import getStarfield from "./src/getStarfield.js";
// // import { getFresnelMat } from "./src/getFresnelMat.js";
// // import ThreeGlobe from 'three-globe';
// // import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
// // import { TrackballControls } from 'three/addons/controls/TrackballControls.js';
// // import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';
// // import {Tween, Group} from '@tweenjs/tween.js'
// // import PositionAlongPathState from './positionAlongPathTools/PositionAlongPathState.js';
// // import { handleScroll, updatePosition, handleScrollTarget, updatePositionTarget } from './positionAlongPathTools/PositionAlongPathMethods.js'

// import * as THREE from 'three';
// import ThreeGlobe from 'three-globe'
// import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three/examples/jsm/loaders/GLTFLoader.js';
// import {Tween, Group} from 'https://unpkg.com/@tweenjs/tween.js@23.1.3/dist/tween.esm.js'


// const models = {
//     'stanford': './models/stanford.glb',
//     'singapore': './models/singapore.glb',
//     'uk': './models/uk.glb',
//     'california': './models/california.glb',
//     'princeton': './models/pton.glb',
//     'swiss': './models/swiss.glb',
//     'france': './models/france.glb',
//     'germany': './models/germany.glb',
//     'holland': './models/holland.glb',
//     'hungary': './models/hungary.glb',
//     'austria': './models/austria.glb',
//     'italy': './models/italy.glb',
//     'us': './models/us.glb',
//     'uva': './models/uva.glb',
//     'imperial': './models/imperial.glb',
//     'czech': './models/czech.glb',
//     'mexico': './models/mexico.glb',
//   };



// const modelCache = {};
// const loader = new GLTFLoader();
// let camera, renderer, scene, canvas;
// let rotationVelocity = 0;

// const mouse = {
//   x: undefined,
//   y: undefined
// }

// var mouseDown = false,
// mouseX = 0,
// mouseY = 0;


// const raycaster = new THREE.Raycaster();
// const mouseVector = new THREE.Vector2();

// function setModelScale(type, x, y, z) {
//   const model = modelCache[type];
//   if (model) {
//       model.scale.set(x, y, z);
//   } else {
//       console.warn(`Model of type ${type} not found.`);
//   }
// }

// const loadedModels = new Map();

// function preloadModels(callback) {
//     const typeEntries = Object.entries(models);
//     let loadedCount = 0;

//     // Load models based on types
//     typeEntries.forEach(([type, url]) => {
//         loader.load(url, gltf => {
//             const model = gltf.scene;
//             model.scale.set(0,0,0); // Initial scale
//             model.position.set(0, 0, -1);
            
//             // Iterate over labelToTypeMap to store clones in modelCache for each label
//             Object.keys(labelToTypeMap).forEach(label => {
//                 if (labelToTypeMap[label] === type) {
//                     modelCache[label] = model.clone();
//                 }
//             });

//             loadedCount++;
//             if (loadedCount === typeEntries.length) {
//                 callback(); // All models are loaded, call the callback
//             }
//         }, undefined, error => {
//             console.error(`Failed to load model ${type}:`, error);
//         });
//     });
// }

// // function preloadModels(callback) {
// //     const typeEntries = Object.entries(models);
// //     let loadedCount = 0;

// //     // Load models based on types
// //     typeEntries.forEach(([type, url]) => {
// //         loader.load(url, gltf => {
// //             const model = gltf.scene;
// //             model.scale.set(0, 0, 0); // Initial scale
// //             model.position.set(0, 0, -1);
            
// //             // Iterate over labelToTypeMap to store clones in modelCache for each label
// //             Object.keys(labelToTypeMap).forEach(label => {
// //                 if (labelToTypeMap[label] === type) {
// //                     modelCache[label] = model.clone();
// //                 }
// //             });

// //             loadedCount++;
// //             if (loadedCount === typeEntries.length) {
// //                 callback(); // All models are loaded, call the callback
// //             }
// //         }, undefined, error => {
// //             console.error(`Failed to load model ${type}:`, error);
// //         });
// //     });
// // }

// const cameraSettings = {
//   'Charlottesville': { x: -154, y: 122, z: 33, xr: -1.3, yr: -0.9, zr: -1.2  },
//   'Princeton': { x: -147, y: 130, z: 40, xr: -1.3, yr: -0.82, zr: -1.2  },
//   'London': { x: -3.0416446700265904, y: 155.88, z: 125.2, xr: -0.893, yr: -0.015, zr: -0.018  },
//   'Stanford': { x: -133, y: 124, z: -82, xr: -2.1, yr: -0.73, zr: 2.35 },
//   'Pacific': { x: 48.912407009105515, y: 44.825156102123174, z: -293.54302200383574, xr: -2.9900593868884555, yr: 0.16325237830984943, zr: 3.116779062839908 },
//   'Singapore': { x: 193, y: 5.54, z: -48.6, xr: -3, yr: 1.3, zr: 3 }
// };

// const cityPositions = {
//   'Charlottesville': new THREE.Vector3(-154, 122, 33),
//   'Princeton': new THREE.Vector3(-147, 130, 40),
//   'London': new THREE.Vector3(-3.0416446700265904, 155.88, 125.2),
//   'Stanford': new THREE.Vector3(-133, 124, -82),
//   'Pacific': new THREE.Vector3(48.912407009105515, 44.825156102123174, -293.54302200383574),
//   'Singapore': new THREE.Vector3(193, 5.54, -48.6)
// };

// const cityPairs = [
//     { from: 'Ithaca', to: 'Charlottesville', delay: 0, group: 'charlottesville' },
//     { from: 'Charlottesville', to: 'Washington, DC', delay: 0, group: 'charlottesville' },  // Washington, D.C. -> dc
//     { from: 'Charlottesville', to: 'Princeton', delay: 0, group: 'charlottesville' },
//     { from: 'Charlottesville', to: 'Outer Banks', delay: 0, group: 'charlottesville' },
//     { from: 'Charlottesville', to: 'Paris', delay: 0, group: 'charlottesville' },
//     { from: 'Paris', to: 'Geneva', delay: 0, group: 'charlottesville' },
//     { from: 'Geneva', to: 'Charlottesville', delay: 0, group: 'charlottesville' },
//     { from: 'Charlottesville', to: 'Radford', delay: 0, group: 'charlottesville' },
//     { from: 'Charlottesville', to: 'Orlando', delay: 0, group: 'charlottesville' },
//   ];


//   const views = {
//     'princeton': { lat: 40.3430, lng: -50.0, visits: 5, duration: 5, start: 10.5 }, // Farther east over the Atlantic
//     'stanford': { lat: 37.4275, lng: -90.0, visits: 5, duration: 5, start: 20.5 }, // Much more centrally over the USA
//     'singapore': { lat: 1.3521, lng: 103.8198, visits: 5, duration: 5, start: 25.5 }, // Unchanged
//     'london': { lat: 51.5074, lng: 0.0, visits: 5, duration: 5, start: 15.5 }, // Right over the middle of the Atlantic, closer to the prime meridian
//     'charlottesville': { lat: 38.0293, lng: -55.0, visits: 5, duration: 10, start: 0.5 } // Much farther east over the Atlantic
// };

// const cities = {
//     'Princeton': { lat: 40.3430, lng: -74.6514, visits: 4, duration: 5, start: 10.5 },
//     'Stanford': { lat: 37.4275, lng: -122.1697, visits: 4, duration: 5, start: 20.5 },
//     'Singapore': { lat: 1.3521, lng: 103.8198, visits: 4, duration: 5, start: 25.5 },
//     'Charlottesville': { lat: 38.0293, lng: -78.4767, visits: 4, duration: 10, start: 0.5 },
//     'London': { lat: 51.5074, lng: -0.1278, visits: 4, duration: 5, start: 15.5 },
//     'Paris': { lat: 48.8566, lng: 2.3522, visits: 1, duration: 1, start: 5 },
//     'Geneva': { lat: 46.2044, lng: 6.1432, visits: 1, duration: 1, start: 5.25 },
//     'Orlando': { lat: 28.5383, lng: -81.3792, visits: 1, duration: 1, start: 3.5 },
//     'Ithaca': { lat: 42.4430, lng: -76.5019, visits: 2, duration: 2, start: 0 },
//     'Toms River': { lat: 39.958851, lng: -74.215336, visits: 2, duration: 2, start: 0 },
//     'Los Angeles': { lat: 34.0522, lng: -118.2437, visits: 3, duration: 2.5, start: 23 },
//     'Seattle': { lat: 47.6062, lng: -122.3321, visits: 2, duration: 2.5, start: 22 },
//     'Austin': { lat: 30.2672, lng: -97.7431, visits: 2, duration: 2.5, start: 21 },
//     'Chicago': { lat: 41.8781, lng: -87.6298, visits: 1, duration: 1, start: 23 },
//     'Ann Arbor': { lat: 42.2808, lng: -83.7430, visits: 1, duration: 1, start: 24 },
//     'New York City': { lat: 40.7128, lng: -74.0060, visits: 4, duration: 10, start: 8 },
//     'Outer Banks': { lat: 35.5582, lng: -75.4665, visits: 1, duration: 1, start: 9 },
//     'San Diego': { lat: 32.7157, lng: -117.1611, visits: 1, duration: 1, start: 21 },
//     'San Francisco': { lat: 37.7749, lng: -122.4194, visits: 5, duration: 4, start: 21 },
//     'Hamburg': { lat: 53.5511, lng: 9.9937, visits: 1, duration: 1, start: 22 },
//     'Trier': { lat: 49.7490, lng: 6.6371, visits: 1, duration: 1, start: 25 },
//     'Amsterdam': { lat: 52.3676, lng: 4.9041, visits: 3, duration: 3, start: 22 },
//     'Cardiff': { lat: 51.4816, lng: -3.1791, visits: 1, duration: 1, start: 18 },
//     'Oxford': { lat: 51.7520, lng: -1.2577, visits: 1, duration: 1, start: 17 },
//     'Cambridge': { lat: 52.2053, lng: 0.1218, visits: 1, duration: 1, start: 17.5 },
//     'Bath': { lat: 51.3811, lng: -2.3590, visits: 1, duration: 1, start: 25 },
//     'Berlin': { lat: 52.5200, lng: 13.4050, visits: 3, duration: 2.5, start: 22 },
//     'Honolulu': { lat: 21.3069, lng: -157.8583, visits: 1, duration: 1, start: 25 },
//     'Washington, DC': { lat: 38.9072, lng: -77.0369, visits: 3, duration: 3, start: 4 },
//     'Radford': { lat: 37.1318, lng: -80.5764, visits: 1, duration: 1, start: 2.5 },
//     'Virginia Beach': { lat: 36.8529, lng: -75.9780, visits: 1, duration: 1, start: 2 },
//     'Rotterdam': { lat: 51.9225, lng: 4.4792, visits: 2, duration: 1, start: 22 },
//     'Baltimore': { lat: 39.2904, lng: -76.6122, visits: 1, duration: 1, start: 3 },
//     'Yosemite': { lat: 37.8651, lng: -119.5383, visits: 1.5, duration: 1.5, start: 25 },
//     'Lake Tahoe': { lat: 39.0968, lng: -120.0324, visits: 1.5, duration: 1.5, start: 25 },
//     'Richmond': { lat: 37.5407, lng: -77.4360, visits: 1, duration: 1.5, start: 3 },
//     'Puerto Rico': { lat: 18.4655, lng: -66.1057, visits: 1, duration: 1, start: 15 },
//     'Puerto Vallarta': { lat: 20.6534, lng: -105.2253, visits: 2, duration: 2, start: 4 },
//     'Milan': { lat: 45.4642, lng: 9.1900, visits: 1, duration: 1, start: 15 },
//     'Venice': { lat: 45.4408, lng: 12.3155, visits: 1, duration: 1, start: 15 },
//     'Rome': { lat: 41.9028, lng: 12.4964, visits: 1, duration: 1, start: 15 },
//     'Florence': { lat: 43.7696, lng: 11.2558, visits: 1, duration: 1, start: 15 },
//     'Vienna': { lat: 48.2082, lng: 16.3738, visits: 1, duration: 1, start: 14.5 },
//     'Prague': { lat: 50.0755, lng: 14.4378, visits: 1, duration: 1, start: 14.5 },
//     'Budapest': { lat: 47.4979, lng: 19.0402, visits: 1, duration: 1, start: 14.5 },
//     'Boston': { lat: 42.3601, lng: -71.0589, visits: 1.5, duration: 1.5, start: 12 },
//     'Augusta': { lat: 44.3106, lng: -69.7795, visits: 1, duration: 1, start: 12 }
// };

// const cityCameras = {
//   'Charlottesville': new THREE.Vector3(-154, 122, 33),
//   'Princeton': new THREE.Vector3(-147, 130, 40),
//   'London': new THREE.Vector3(0, 0, 350),
//   'Stanford': new THREE.Vector3(-133, 124, -82),
//   'Pacific': new THREE.Vector3(48.912407009105515, 44.825156102123174, -293.54302200383574),
//   'Singapore': new THREE.Vector3(193, 5.54, -48.6)
// };



// // Total animation time for each arc
// const FLIGHT_TIME = 500;  // in milliseconds
// const GAP_TIME = 4000;  // Gap before starting the next arc
// let start = Date.now()
// let arcsData = cityPairs.map((pair, index) => ({
//   from: pair.from,
//   to: pair.to,
//   group: pair.group,
//   startLat: cities[pair.from].lat,
//   startLng: cities[pair.from].lng,
//   endLat: cities[pair.to].lat,
//   endLng: cities[pair.to].lng,
//   color: 'darkOrange',
//   arcDashInitialGap: pair.delay, // Sequential delay
//   arcDashLength: 1.5,
//   arcDashGap: 1.5,
//   arcDashAnimateTime: FLIGHT_TIME,
//   removeAfter: start + FLIGHT_TIME + index * (FLIGHT_TIME + GAP_TIME) + 1000,
//   cameraAdjusted: false  // When to remove the arc
// }));

// console.log("Calculated removeAfter times:", arcsData.map(arc => arc.removeAfter));

// function adjustCameraForArc(arc) {
//   if (!arc.cameraAdjusted) {
//     const cameraPosition = cameraSettings[`${arc.from}-${arc.to}`];
//     if (cameraPosition) {
//       console.log("Adjusting camera for: ", arc.from, "to", arc.to);

//       gsap.to(globe.camera().position, {
//         x: cameraPosition.x,
//         y: cameraPosition.y,
//         z: cameraPosition.z,
//         duration: 2
//       }
//     )

//     gsap.to(globe.camera().rotation, {
//       x: cameraPosition.xr,
//       y: cameraPosition.yr,
//       z: cameraPosition.zr,
//       duration: 2
//     })
//       // globe.pointOfView(cameraPosition, 2000); // Smooth transition to new POV
//       arc.cameraAdjusted = true;  // Set the flag to true to avoid re-adjusting camera
//     }
//   }
// }

// function calculateMidpointAndDistance(lat1, lng1, lat2, lng2) {
//   const R = 6371; // Earth's radius in kilometers
//   const phi1 = lat1 * Math.PI / 180;
//   const phi2 = lat2 * Math.PI / 180;
//   const deltaPhi = (lat2 - lat1) * Math.PI / 180;
//   const deltaLambda = (lng2 - lng1) * Math.PI / 180;

//   const a = Math.sin(deltaPhi/2) * Math.sin(deltaPhi/2) +
//             Math.cos(phi1) * Math.cos(phi2) *
//             Math.sin(deltaLambda/2) * Math.sin(deltaLambda/2);
//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

//   const distance = R * c; // in kilometers

//   const A = Math.cos(phi2) * Math.sin(deltaLambda);
//   const B = Math.cos(phi1) * Math.sin(phi2) - Math.sin(phi1) * Math.cos(phi2) * Math.cos(deltaLambda);
//   const midLng = lng1 + Math.atan2(A, B) * 180 / Math.PI;

//   const x = Math.cos(phi1) + Math.cos(phi2);
//   const y = Math.sin(phi1) + Math.sin(phi2);
//   const midLat = Math.atan2(y, x) * 180 / Math.PI;

//   return { midLat, midLng, distance };
// }

// let globe;

// const curvePathJSON = './src/sphere.json'



// const labelToTypeMap = {
//     'Princeton': 'princeton',
//     'Stanford': 'stanford',
//     'Singapore': 'singapore',
//     'Charlottesville': 'uva',
//     'London': 'imperial',
//     'Milan': 'italy',
//     'Venice': 'italy',
//     'Rome': 'italy',
//     'Florence': 'italy',
//     'Vienna': 'austria',
//     'Prague': 'czech',
//     'Budapest': 'hungary',
//     'Boston': 'us',
//     'Augusta': 'us',
//     'Paris': 'france',
//     'Geneva': 'swiss',
//     'Orlando': 'us',
//     'Ithaca': 'us',
//     'Los Angeles': 'california',
//     'Toms River': 'us',
//     'Seattle': 'us',
//     'Austin': 'us',
//     'Chicago': 'us',
//     'Ann Arbor': 'us',
//     'New York City': 'us',
//     'Outer Banks': 'us',
//     'San Diego': 'california',
//     'San Francisco': 'california',
//     'Hamburg': 'germany',
//     'Trier': 'germany',
//     'Amsterdam': 'holland',
//     'Cardiff': 'uk',
//     'Oxford': 'uk',
//     'Cambridge': 'uk',
//     'Bath': 'uk',
//     'Berlin': 'germany',
//     'Honolulu': 'us',
//     'Washington, DC': 'us',
//     'Radford': 'us',
//     'Virginia Beach': 'us',
//     'Rotterdam': 'holland',
//     'Baltimore': 'us',
//     'Yosemite': 'california',
//     'Lake Tahoe': 'california',
//     'Richmond': 'us',
//     'Puerto Rico': 'us',
//     'Puerto Vallarta': 'mexico'
// };

// // Function to initialize the globe and start the visualization
// export async function initializeGlobe() {

//     const ARC_REL_LEN = 0.7; // relative to whole arc
//     const FLIGHT_TIME = 1000;

//   globe = new Globe()
//         .globeImageUrl('./img/8081_earthspec4k_lines.jpg')
//         .objectFacesSurface(true)
//         .objectsData([
//             { lat: 40.3430, lng: -74.6514, label: 'Princeton' },  // Princeton
//             { lat: 37.4275, lng: -122.1697, label: 'Stanford' },   // Stanford
//             { lat: 1.3521, lng: 103.8198,  label: 'Singapore' } ,
//             { lat: 38.0293, lng: -78.4767, label: 'Charlottesville' },  // Charlottesville
//             { lat: 51.5074, lng: -0.1278, label: 'London' }, 
//             { lat: 45.4642, lng: 9.1900, label: 'Milan' },    // Milan
//             { lat: 45.4408, lng: 12.3155, label: 'Venice' },   // Venice
//             { lat: 41.9028, lng: 12.4964, label: 'Rome' },   // Rome
//             { lat: 43.7696, lng: 11.2558, label: 'Florence' },   // Florence
//             { lat: 48.2082, lng: 16.3738,  label: 'Vienna' },   // Vienna
//             { lat: 50.0755, lng: 14.4378, label: 'Prague' },   // Prague
//             { lat: 47.4979, lng: 19.0402,  label: 'Budapest' },     
//             { lat: 42.3601, lng: -71.0589, label: 'Boston'},  // Boston
//             { lat: 44.3106, lng: -69.7795, label: 'Augusta' },   // Augusta
//             { lat: 48.8566, lng: 2.3522, label: 'Paris' },  // Paris
//             { lat: 46.2044, lng: 6.1432,  label: 'Geneva' },  // Geneva
//             { lat: 28.5383, lng: -81.3792,  label: 'Orlando' },  // Orlando
//             { lat: 42.4430, lng: -76.5019, label: 'Ithaca' },  // Ithaca
//             { lat: 34.0522, lng: -118.2437, label: 'Los Angeles' },  // Los Angeles
//             { lat: 39.958851, lng: -74.215336, label: 'Toms River' },  // Toms River
//             { lat: 47.6062, lng: -122.3321, label: 'Seattle' },  // Seattle
//             { lat: 30.2672, lng: -97.7431, label: 'Austin' },  // Austin
//             { lat: 41.8781, lng: -87.6298,  label: 'Chicago' },  // Chicago
//             { lat: 42.2808, lng: -83.7430,  label: 'Ann Arbor' },  // Ann Arbor
//             { lat: 40.7128, lng: -74.0060, label: 'New York City' },  // New York City
//             { lat: 35.5582, lng: -75.4665, label: 'Outer Banks' },  // Outer Banks
//             { lat: 32.7157, lng: -117.1611, label: 'San Diego' },  // San Diego
//             { lat: 37.7749, lng: -122.4194,  label: 'San Francisco' },  // San Francisco
//             { lat: 53.5511, lng: 9.9937,  label: 'Hamburg' },  // Hamburg
//             { lat: 49.7490, lng: 6.6371,  label: 'Trier' },  // Trier
//             { lat: 52.3676, lng: 4.9041,  label: 'Amsterdam' },  // Amsterdam
//             { lat: 51.4816, lng: -3.1791,  label: 'Cardiff' },  // Cardiff
//             { lat: 51.7520, lng: -1.2577, label: 'Oxford' },  // Oxford
//             { lat: 52.2053, lng: 0.1218,  label: 'Cambridge' },  // Cambridge
//             { lat: 51.3811, lng: -2.3590,  label: 'Bath' },  // Bath
//             { lat: 52.5200, lng: 13.4050, label: 'Berlin' },  // Berlin
//             { lat: 21.3069, lng: -157.8583,  label: 'Honolulu' },  // Honolulu
//             { lat: 38.9072, lng: -77.0369,  label: 'Washington, DC' }, //DC
//             { lat: 37.1318, lng: -80.5764,  label: 'Radford' },  // Radford
//             { lat: 36.8529, lng: -75.9780,  label: 'Virginia Beach' },   // Virginia Beach
//             { lat: 51.9225, lng: 4.4792, label: 'Rotterdam' },  // Rotterdam
//             { lat: 39.2904, lng: -76.6122,  label: 'Baltimore' },  // Baltimore
//             { lat: 37.8651, lng: -119.5383,  label: 'Yosemite' },        // Yosemite
//             { lat: 39.0968, lng: -120.0324, label: 'Lake Tahoe' },        // Lake Tahoe
//             { lat: 37.5407, lng: -77.4360,  label: 'Richmond' },   // Richmond
//             { lat: 18.4655, lng: -66.1057,  label: 'Puerto Rico' }, //PR
//             { lat: 20.6534, lng: -105.2253,  label: 'Puerto Vallarta' }  // Puerto Vallarta
//         ])
//         .objectThreeObject(data => {
//             console.log(data.label)
//             return modelCache[data.label].clone();  // Use a clone of the loaded model
//         })
//         .objectLabel(obj => `<div style="
//             font-family: 'Helvetica', 'Arial', sans-serif;
//             color: black;
//             font-size: 14px;  /* Adjust font size as needed */
//             padding: 5px;
//             background: rgba(255, 255, 255, 0.8); /* Optional: Light background to contrast text */
//             border-radius: 5px;
//             box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.2); /* Optional: shadow for better visibility */
//         ">${obj.label}</div>`)
//         // .arcsData(arcsData)
//         .arcColor(arc => {
//           // Determine color based on the "from" parameter of the arc
//           switch (arc.group) {
//               case 'Charlottesville':
//               case 'charlottesvilleSmall':
//                   return 'darkblue';
//               case 'Princeton':
//               case 'princetonSmall':
//                   return 'orange';
//               case 'Stanford':
//               case 'stanfordSmall':
//                   return 'darkred';
//               case 'London':
//               case 'londonSmall':
//                   return 'lightblue';
//               default:
//                   return 'black'; // Default color if no match found
//           }
//       })
//       // .arcDashLength(() => 0.5)
//       // .arcDashGap(() => 0.5)
//       .arcsTransitionDuration(0)
//       .arcDashLength(ARC_REL_LEN)
//       .arcDashGap(2)
//       .arcDashInitialGap(1)
//       .arcDashAnimateTime(FLIGHT_TIME)
//         // .arcDashLength(arc => arc.arcDashLength)
//         // .arcDashGap(arc => arc.arcDashGap)
//         // .arcDashLength(1)
//         // .arcDashGap(2)
//         // .arcDashAnimateTime(1000)
//         // .arcDashInitialGap(arc => arc.arcDashInitialGap)
//         // .arcDashAnimateTime(arc => arc.arcDashAnimateTime)
//         (document.getElementById('globeViz'));

//         let camera_anim = gsap.timeline();

//         function animateModelScaleSequential({label, increment, delay, duration}) {
        
//             const model = modelCache[label];

//             if (model) {
//                 const currentScaleX = model.scale.x;
//                 const currentScaleY = model.scale.y;
//                 const currentScaleZ = model.scale.z;
        
//                 const targetScaleX = currentScaleX + increment;
//                 const targetScaleY = currentScaleY + increment;
//                 const targetScaleZ = currentScaleZ + increment;
        
//                 console.log("Target Scale:", targetScaleX, targetScaleY, targetScaleZ);
        
//                 console.log("label ", label)
//                 gsap.to(model.scale, {
//                     x: targetScaleX,
//                     y: targetScaleY,
//                     z: targetScaleZ,
//                     duration: duration / 1000,
//                     delay: delay / 1000
//                 });
//             } else {
//                 console.warn(`Object with label ${label} not found.`);
//             }
//         }

//         let prevCoords = { lat: cities['Ithaca'].lat, lng: cities['Ithaca'].lng };

//         // Function to emit arcs
//         function emitArc({ startLat, startLng, endLat, endLng, duration }) {
//             // Update previous coordinates after the duration
//             setTimeout(() => { prevCoords = { lat: endLat, lng: endLng } }, duration);

//             // Add and remove arc after 1 cycle
//             const arc = { startLat, startLng, endLat, endLng };
//             globe.arcsData([...globe.arcsData(), arc]);

//             // Remove the arc after 2 cycles (adjust timing as needed)
//             setTimeout(() => {
//                 globe.arcsData(globe.arcsData().filter(d => d !== arc));
//             }, duration * 2);
//         }

//         // Function to initiate sequential arcs based on cityPairs
//         function sequentialArcs(cityPairs) {
//             let totalDelay = 2000; // Track the cumulative delay for sequential calls

//             cityPairs.forEach((pair, index) => {
//                 const { from, to, delay, duration, incrementCity, durationCity } = pair;
//                 const startCoords = cities[from];
//                 const endCoords = cities[to];

//                 // Schedule arc emission after cumulative delay
//                 setTimeout(() => {
//                     emitArc({
//                         startLat: prevCoords.lat,
//                         startLng: prevCoords.lng,
//                         endLat: endCoords.lat,
//                         endLng: endCoords.lng,
//                         duration: FLIGHT_TIME * duration // You can specify different durations if needed
//                     });

//                     // animateModelScaleSequential({label: to, increment: incrementCity, delay: FLIGHT_TIME, duration: durationCity * 1000})

//                     // Update prevCoords to the end coordinates of this arc
//                     prevCoords = { lat: endCoords.lat, lng: endCoords.lng };
//                 }, totalDelay);

//                 // Add to the cumulative delay (duration + delay for next arc)
//                 totalDelay += delay * 1000; // Convert delay to milliseconds
//             });
//         }


//         const cityPairs = [
//             { from: 'Ithaca', to: 'Charlottesville', delay: 4, duration: 1, incrementCity: 3, durationCity: 3 },
//             { from: 'Charlottesville', to: 'New York City', delay: 2, duration: 1, incrementCity: 1, durationCity: 1 },
//             { from: 'New York City', to: 'Charlottesville', delay: 2, duration: 1, incrementCity: 1, durationCity: 1 },
//             { from: 'Charlottesville', to: 'Toms River', delay: 2, duration: 1, incrementCity: 1, durationCity: 1 },
//             { from: 'Toms River', to: 'Charlottesville', delay: 2, duration: 1, incrementCity: 1, durationCity: 1 },
//             { from: 'Charlottesville', to: 'Washington, DC', delay: 2, duration: 1, incrementCity: 1, durationCity: 1 },
//             { from: 'Washington, DC', to: 'Charlottesville', delay: 2, duration: 1, incrementCity: 1, durationCity: 1 },
//             { from: 'Charlottesville', to: 'New York City', delay: 2, duration: 1, incrementCity: 1, durationCity: 1 },
//             { from: 'New York City', to: 'Charlottesville', delay: 3, duration: 1, incrementCity: 2, durationCity: 2 },
//             { from: 'Charlottesville', to: 'Toms River', delay: 2, duration: 1, incrementCity: 1, durationCity: 1 },
//             { from: 'Toms River', to: 'Charlottesville', delay: 2, duration: 1, incrementCity: 1, durationCity: 1 },
//             { from: 'Charlottesville', to: 'New York City', delay: 2, duration: 1, incrementCity: 1, durationCity: 1 },
//             { from: 'New York City', to: 'Charlottesville', delay: 2, duration: 1, incrementCity: 1, durationCity: 1 },
//             { from: 'Charlottesville', to: 'Virginia Beach', delay: 2, duration: 1, incrementCity: 1, durationCity: 1 },
//             { from: 'Virginia Beach', to: 'Charlottesville', delay: 2, duration: 1, incrementCity: 1, durationCity: 1 },
//             { from: 'Charlottesville', to: 'Richmond', delay: 2, duration: 1, incrementCity: 1, durationCity: 1 },
//             { from: 'Richmond', to: 'Charlottesville', delay: 2, duration: 1, incrementCity: 1, durationCity: 1 },
//             { from: 'Charlottesville', to: 'Radford', delay: 2, duration: 1, incrementCity: 1, durationCity: 1 },
//             { from: 'Radford', to: 'Charlottesville', delay: 2, duration: 1, incrementCity: 1, durationCity: 1 },
//             { from: 'Charlottesville', to: 'Baltimore', delay: 2, duration: 1, incrementCity: 1, durationCity: 1 },
//             { from: 'Baltimore', to: 'Charlottesville', delay: 2, duration: 1, incrementCity: 1, durationCity: 1 },
//             { from: 'Charlottesville', to: 'Orlando', delay: 2, duration: 1, incrementCity: 1, durationCity: 1 },
//             { from: 'Orlando', to: 'Charlottesville', delay: 2, duration: 1, incrementCity: 1, durationCity: 1 },
            
            
//           ];


// // Start emitting arcs sequentially
// sequentialArcs(cityPairs);


//         function updateArcs() {
//           const currentTime = Date.now();
      
//           arcsData.forEach(arc => {
//             if (currentTime < arc.removeAfter) {
//               if (currentTime > start + arc.arcDashInitialGap * 1500) {
//                 if (!arc.cameraAdjusted) {

//                 }
//               }
              
//             }
//           });
        
//           arcsData = arcsData.filter(arc => currentTime < arc.removeAfter);
//           globe.arcsData(arcsData);
      
//         }

//         globe.onObjectClick((obj, event, { lat, lng, altitude }) => {
//             console.log(`Clicked on ${obj.label}: Latitude ${lat}, Longitude ${lng}, Altitude ${altitude}`);
        
//             // Define the new target position
//             const target = { lat, lng, altitude: 0.5 };
        
//             // Get the current camera position to interpolate from
//             const currentPosition = globe.pointOfView();
        
//             // Animate the transition using gsap
//             gsap.to(currentPosition, {
//                 lat: target.lat,
//                 lng: target.lng,
//                 altitude: target.altitude,  // Adjust the altitude if needed
//                 duration: 2,  // Duration in seconds
//                 ease: "power2.inOut",  // Smooth easing
//                 onUpdate: () => {
//                     // Update the globe camera point of view gradually
//                     globe.pointOfView(currentPosition);
//                 }
//             });
        
//             console.log('object position', globe.camera().position);
//         });

//      var camPosIndex = 0;

//       const londonTarget = new THREE.Vector3(-2.0416446700265904, 82.88, 58.2);
//       const cvilleTarget = new THREE.Vector3(-80.0416446700265904, 62.88, 16.2);
//       const ptonTarget = new THREE.Vector3(-74.0416446700265904, 65.88, 20.2);

//       const spline = new THREE.CatmullRomCurve3([
//         cvilleTarget,
//         ptonTarget,
//         londonTarget
//       ]); 

//       const geometry = new THREE.BoxGeometry(2, 2, 2); // Create a 1x1x1 cube
//       const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 }); // Green color for the cube
//       const box = new THREE.Mesh(geometry, material);

//       box.position.set(londonTarget.x, londonTarget.y, londonTarget.z);
//       box.position.set(cvilleTarget.x, cvilleTarget.y, cvilleTarget.z)
//       box.position.set(ptonTarget.x, ptonTarget.y, ptonTarget.z)

//     //   globe.scene().add(box)


      

//       let isAnimating = false;



//       function onMouseScroll(event){
//         // handleScrollTarget(event, positionAlongPathState);
//       }

//       window.addEventListener('wheel', onMouseScroll, false);

//       function animateModelScale(label) {
        
//         // const model = globe.scene().children.find(obj => obj.userData.label === 'princeton');
//         const targetScale = cities[label].visits

//         const delay = cities[label].start

//         const duration = cities[label].duration

//         const model = modelCache[label];

//         // const model = loadedModels.get('princeton');

//         if (model) {

//             console.log(model)
//             gsap.to(model.scale, {
//                 x: targetScale,
//                 y: targetScale,
//                 z: targetScale,
//                 duration: duration,
//                 delay: delay
//             });
//         } else {
//             console.warn(`Object with label ${label} not found.`);
//         }
//     }

//     var target = cvilleTarget

//       function animate() {

//         const lookAts = [
//             { city: 'charlottesville', lookAt: cvilleTarget, duration: 10000 }, // Duration in milliseconds
//             { city: 'princeton', lookAt: ptonTarget, duration: 5000 },
//             { city: 'london', lookAt: londonTarget, duration: 5000 }
//         ];
    
//         let currentIndex = 0;
//         let lastChangeTime = Date.now();
//         let target = lookAts[0].lookAt;

//         // Helper vector to store the interpolated lookAt position
//         const smoothLookAt = new THREE.Vector3().copy(target);

//         requestAnimationFrame(function loop(time) {

//             const now = Date.now();

//             if (now - lastChangeTime > lookAts[currentIndex].duration) {
//                 currentIndex = (currentIndex + 1) % lookAts.length; // Move to the next target
//                 const newTarget = lookAts[currentIndex].lookAt; // Update to the next lookAt target
    
//                 // Smoothly animate the camera's lookAt using GSAP
//                 gsap.to(smoothLookAt, {
//                     x: newTarget.x,
//                     y: newTarget.y,
//                     z: newTarget.z,
//                     duration: lookAts[currentIndex].duration / 1000, // Convert to seconds for GSAP
//                     ease: "power2.inOut"
//                 });
    
//                 lastChangeTime = now; // Reset the timer
//             }

//         console.log("orig pos", globe.camera().position)  

//         globe.objectThreeObject(data => {
//           return modelCache[data.label].clone();  // Use a clone of the loaded model
//         })

//         // globe.camera().lookAt(target); // Orient camera to look at next point
//         // globe.camera().lookAt(smoothLookAt);
//         globe.renderer().render(globe.scene(), globe.camera());

//         // globe.camera().lookAt();
        
//         requestAnimationFrame(loop)

//         })

        


//       };

//       Object.keys(cities).forEach(label => {
//         animateModelScale(label);
//     });

//     // const t1 = gsap.timeline();

//     // // Define your points of view with durations
//     // const pointsOfView = [
//     //     { city: 'charlottesville', duration: 10 },
//     //     { city: 'princeton', duration: 5 },
//     //     { city: 'london', duration: 5 },
//     //     { city: 'stanford', duration: 5 }
//     // ];

    
    
//     // // Chain the animations using `onStart`
//     // pointsOfView.forEach(pov => {
//     //     t1.to({}, {
//     //         duration: pov.duration,
//     //         onStart: () => {
//     //             const city = views[pov.city];
//     //             globe.pointOfView({ lat: city.lat, lng: city.lng, altitude: 0.5 }, [pov.duration*1000]);
//     //         }
//     //     });
//     // });

//         // Define your points of view with durations
//         const lookAts  = [
//             { city: 'charlottesville', lookAt: cvilleTarget },
//             { city: 'princeton', lookAt: ptonTarget },
//             { city: 'london', lookAt: londonTarget }
//         ];
        
      

//     //   animateModelScale('london', 3, 1);
//     //   animateModelScale('londonL', 2, 3, 1);
//     //   animateModelScale('londonM', 2, 3, 1);
//     //   animateModelScale('londonS', 2, 3, 1);

//     //   animateModelScale('stanfordXL', 2, 3, 1);
//     //   animateModelScale('stanfordL', 2, 3, 1);
//     //   animateModelScale('stanfordM', 2, 3, 1);
//     //   animateModelScale('stanfordS', 2, 3, 1);

//     //   animateModelScale('charlottesvilleXL', 2, 3, 1);
//     //   animateModelScale('charlottesvilleL', 2, 3, 1);
//     //   animateModelScale('charlottesvilleM', 2, 3, 1);
//     //   animateModelScale('charlottesvilleS', 2, 3, 1);

//     //   animateModelScale('princetonXL', 2, 3, 1);
//     //   animateModelScale('princetonL', 2, 3, 1);
//     //   animateModelScale('princetonM', 2, 3, 1);
//     //   animateModelScale('princetonS', 2, 3, 1);


//       animate();
// }

// preloadModels(initializeGlobe);

    
import * as THREE from 'three';
import ThreeGlobe from 'three-globe'
import { GLTFLoader } from './GLTFLoader.js';
import {Tween, Group} from 'https://unpkg.com/@tweenjs/tween.js@23.1.3/dist/tween.esm.js'

const models = {
    'stanford': './models/stanford.glb',
    'singapore': './models/singapore.glb',
    'uk': './models/uk.glb',
    'california': './models/california.glb',
    'princeton': './models/pton.glb',
    'swiss': './models/swiss.glb',
    'france': './models/france.glb',
    'germany': './models/germany.glb',
    'holland': './models/holland.glb',
    'hungary': './models/hungary.glb',
    'austria': './models/austria.glb',
    'italy': './models/italy.glb',
    'us': './models/us.glb',
    'uva': './models/uva.glb',
    'imperial': './models/imperial.glb',
    'czech': './models/czech.glb',
    'mexico': './models/mexico.glb',
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

function setModelScale(type, x, y, z) {
  const model = modelCache[type];
  if (model) {
      model.scale.set(x, y, z);
  } else {
      console.warn(`Model of type ${type} not found.`);
  }
}

const loadedModels = new Map();

function preloadModels(callback) {
    const typeEntries = Object.entries(models);
    let loadedCount = 0;

    // Load models based on types
    typeEntries.forEach(([type, url]) => {
        loader.load(url, gltf => {
            const model = gltf.scene;
            model.scale.set(0,0,0); // Initial scale
            model.position.set(0, 0, -1);
            
            // Iterate over labelToTypeMap to store clones in modelCache for each label
            Object.keys(labelToTypeMap).forEach(label => {
                if (labelToTypeMap[label] === type) {
                    modelCache[label] = model.clone();
                }
            });

            loadedCount++;
            if (loadedCount === typeEntries.length) {
                callback(); // All models are loaded, call the callback
            }
        }, undefined, error => {
            console.error(`Failed to load model ${type}:`, error);
        });
    });
}

// function preloadModels(callback) {
//     const typeEntries = Object.entries(models);
//     let loadedCount = 0;

//     // Load models based on types
//     typeEntries.forEach(([type, url]) => {
//         loader.load(url, gltf => {
//             const model = gltf.scene;
//             model.scale.set(0, 0, 0); // Initial scale
//             model.position.set(0, 0, -1);
            
//             // Iterate over labelToTypeMap to store clones in modelCache for each label
//             Object.keys(labelToTypeMap).forEach(label => {
//                 if (labelToTypeMap[label] === type) {
//                     modelCache[label] = model.clone();
//                 }
//             });

//             loadedCount++;
//             if (loadedCount === typeEntries.length) {
//                 callback(); // All models are loaded, call the callback
//             }
//         }, undefined, error => {
//             console.error(`Failed to load model ${type}:`, error);
//         });
//     });
// }

const cameraSettings = {
  'Charlottesville': { x: -154, y: 122, z: 33, xr: -1.3, yr: -0.9, zr: -1.2  },
  'Princeton': { x: -147, y: 130, z: 40, xr: -1.3, yr: -0.82, zr: -1.2  },
  'London': { x: -3.0416446700265904, y: 155.88, z: 125.2, xr: -0.893, yr: -0.015, zr: -0.018  },
  'Stanford': { x: -133, y: 124, z: -82, xr: -2.1, yr: -0.73, zr: 2.35 },
  'Pacific': { x: 48.912407009105515, y: 44.825156102123174, z: -293.54302200383574, xr: -2.9900593868884555, yr: 0.16325237830984943, zr: 3.116779062839908 },
  'Singapore': { x: 193, y: 5.54, z: -48.6, xr: -3, yr: 1.3, zr: 3 }
};

const cityPositions = {
  'Charlottesville': new THREE.Vector3(-154, 122, 33),
  'Princeton': new THREE.Vector3(-147, 130, 40),
  'London': new THREE.Vector3(-3.0416446700265904, 155.88, 125.2),
  'Stanford': new THREE.Vector3(-133, 124, -82),
  'Pacific': new THREE.Vector3(48.912407009105515, 44.825156102123174, -293.54302200383574),
  'Singapore': new THREE.Vector3(193, 5.54, -48.6)
};

const cityPairs = [
    { from: 'Ithaca', to: 'Charlottesville', delay: 0, group: 'charlottesville' },
    { from: 'Charlottesville', to: 'Washington, DC', delay: 0, group: 'charlottesville' },  // Washington, D.C. -> dc
    { from: 'Charlottesville', to: 'Princeton', delay: 0, group: 'charlottesville' },
    { from: 'Charlottesville', to: 'Outer Banks', delay: 0, group: 'charlottesville' },
    { from: 'Charlottesville', to: 'Paris', delay: 0, group: 'charlottesville' },
    { from: 'Paris', to: 'Geneva', delay: 0, group: 'charlottesville' },
    { from: 'Geneva', to: 'Charlottesville', delay: 0, group: 'charlottesville' },
    { from: 'Charlottesville', to: 'Radford', delay: 0, group: 'charlottesville' },
    { from: 'Charlottesville', to: 'Orlando', delay: 0, group: 'charlottesville' },
  ];


  const views = {
    'princeton': { lat: 40.3430, lng: -50.0, visits: 5, duration: 5, start: 10.5 }, // Farther east over the Atlantic
    'stanford': { lat: 37.4275, lng: -90.0, visits: 5, duration: 5, start: 20.5 }, // Much more centrally over the USA
    'singapore': { lat: 1.3521, lng: 103.8198, visits: 5, duration: 5, start: 25.5 }, // Unchanged
    'london': { lat: 51.5074, lng: 0.0, visits: 5, duration: 5, start: 15.5 }, // Right over the middle of the Atlantic, closer to the prime meridian
    'charlottesville': { lat: 38.0293, lng: -55.0, visits: 5, duration: 10, start: 0.5 } // Much farther east over the Atlantic
};

const cities = {
    'Princeton': { lat: 40.3430, lng: -74.6514, visits: 4, duration: 5, start: 10.5 },
    'Stanford': { lat: 37.4275, lng: -122.1697, visits: 4, duration: 5, start: 20.5 },
    'Singapore': { lat: 1.3521, lng: 103.8198, visits: 4, duration: 5, start: 25.5 },
    'Charlottesville': { lat: 38.0293, lng: -78.4767, visits: 4, duration: 10, start: 0.5 },
    'London': { lat: 51.5074, lng: -0.1278, visits: 4, duration: 5, start: 15.5 },
    'Paris': { lat: 48.8566, lng: 2.3522, visits: 1, duration: 1, start: 5 },
    'Geneva': { lat: 46.2044, lng: 6.1432, visits: 1, duration: 1, start: 5.25 },
    'Orlando': { lat: 28.5383, lng: -81.3792, visits: 1, duration: 1, start: 3.5 },
    'Ithaca': { lat: 42.4430, lng: -76.5019, visits: 2, duration: 2, start: 0 },
    'Toms River': { lat: 39.958851, lng: -74.215336, visits: 2, duration: 2, start: 0 },
    'Los Angeles': { lat: 34.0522, lng: -118.2437, visits: 3, duration: 2.5, start: 23 },
    'Seattle': { lat: 47.6062, lng: -122.3321, visits: 2, duration: 2.5, start: 22 },
    'Austin': { lat: 30.2672, lng: -97.7431, visits: 2, duration: 2.5, start: 21 },
    'Chicago': { lat: 41.8781, lng: -87.6298, visits: 1, duration: 1, start: 23 },
    'Ann Arbor': { lat: 42.2808, lng: -83.7430, visits: 1, duration: 1, start: 24 },
    'New York City': { lat: 40.7128, lng: -74.0060, visits: 4, duration: 10, start: 8 },
    'Outer Banks': { lat: 35.5582, lng: -75.4665, visits: 1, duration: 1, start: 9 },
    'San Diego': { lat: 32.7157, lng: -117.1611, visits: 1, duration: 1, start: 21 },
    'San Francisco': { lat: 37.7749, lng: -122.4194, visits: 5, duration: 4, start: 21 },
    'Hamburg': { lat: 53.5511, lng: 9.9937, visits: 1, duration: 1, start: 22 },
    'Trier': { lat: 49.7490, lng: 6.6371, visits: 1, duration: 1, start: 25 },
    'Amsterdam': { lat: 52.3676, lng: 4.9041, visits: 3, duration: 3, start: 22 },
    'Cardiff': { lat: 51.4816, lng: -3.1791, visits: 1, duration: 1, start: 18 },
    'Oxford': { lat: 51.7520, lng: -1.2577, visits: 1, duration: 1, start: 17 },
    'Cambridge': { lat: 52.2053, lng: 0.1218, visits: 1, duration: 1, start: 17.5 },
    'Bath': { lat: 51.3811, lng: -2.3590, visits: 1, duration: 1, start: 25 },
    'Berlin': { lat: 52.5200, lng: 13.4050, visits: 3, duration: 2.5, start: 22 },
    'Honolulu': { lat: 21.3069, lng: -157.8583, visits: 1, duration: 1, start: 25 },
    'Washington, DC': { lat: 38.9072, lng: -77.0369, visits: 3, duration: 3, start: 4 },
    'Radford': { lat: 37.1318, lng: -80.5764, visits: 1, duration: 1, start: 2.5 },
    'Virginia Beach': { lat: 36.8529, lng: -75.9780, visits: 1, duration: 1, start: 2 },
    'Rotterdam': { lat: 51.9225, lng: 4.4792, visits: 2, duration: 1, start: 22 },
    'Baltimore': { lat: 39.2904, lng: -76.6122, visits: 1, duration: 1, start: 3 },
    'Yosemite': { lat: 37.8651, lng: -119.5383, visits: 1.5, duration: 1.5, start: 25 },
    'Lake Tahoe': { lat: 39.0968, lng: -120.0324, visits: 1.5, duration: 1.5, start: 25 },
    'Richmond': { lat: 37.5407, lng: -77.4360, visits: 1, duration: 1.5, start: 3 },
    'Puerto Rico': { lat: 18.4655, lng: -66.1057, visits: 1, duration: 1, start: 15 },
    'Puerto Vallarta': { lat: 20.6534, lng: -105.2253, visits: 2, duration: 2, start: 4 },
    'Milan': { lat: 45.4642, lng: 9.1900, visits: 1, duration: 1, start: 15 },
    'Venice': { lat: 45.4408, lng: 12.3155, visits: 1, duration: 1, start: 15 },
    'Rome': { lat: 41.9028, lng: 12.4964, visits: 1, duration: 1, start: 15 },
    'Florence': { lat: 43.7696, lng: 11.2558, visits: 1, duration: 1, start: 15 },
    'Vienna': { lat: 48.2082, lng: 16.3738, visits: 1, duration: 1, start: 14.5 },
    'Prague': { lat: 50.0755, lng: 14.4378, visits: 1, duration: 1, start: 14.5 },
    'Budapest': { lat: 47.4979, lng: 19.0402, visits: 1, duration: 1, start: 14.5 },
    'Boston': { lat: 42.3601, lng: -71.0589, visits: 1.5, duration: 1.5, start: 12 },
    'Augusta': { lat: 44.3106, lng: -69.7795, visits: 1, duration: 1, start: 12 }
};

const cityCameras = {
  'Charlottesville': new THREE.Vector3(-154, 122, 33),
  'Princeton': new THREE.Vector3(-147, 130, 40),
  'London': new THREE.Vector3(0, 0, 350),
  'Stanford': new THREE.Vector3(-133, 124, -82),
  'Pacific': new THREE.Vector3(48.912407009105515, 44.825156102123174, -293.54302200383574),
  'Singapore': new THREE.Vector3(193, 5.54, -48.6)
};



// Total animation time for each arc
const FLIGHT_TIME = 500;  // in milliseconds
const GAP_TIME = 4000;  // Gap before starting the next arc
let start = Date.now()
let arcsData = cityPairs.map((pair, index) => ({
  from: pair.from,
  to: pair.to,
  group: pair.group,
  startLat: cities[pair.from].lat,
  startLng: cities[pair.from].lng,
  endLat: cities[pair.to].lat,
  endLng: cities[pair.to].lng,
  color: 'darkOrange',
  arcDashInitialGap: pair.delay, // Sequential delay
  arcDashLength: 1.5,
  arcDashGap: 1.5,
  arcDashAnimateTime: FLIGHT_TIME,
  removeAfter: start + FLIGHT_TIME + index * (FLIGHT_TIME + GAP_TIME) + 1000,
  cameraAdjusted: false  // When to remove the arc
}));

console.log("Calculated removeAfter times:", arcsData.map(arc => arc.removeAfter));

function adjustCameraForArc(arc) {
  if (!arc.cameraAdjusted) {
    const cameraPosition = cameraSettings[`${arc.from}-${arc.to}`];
    if (cameraPosition) {
      console.log("Adjusting camera for: ", arc.from, "to", arc.to);

      gsap.to(globe.camera().position, {
        x: cameraPosition.x,
        y: cameraPosition.y,
        z: cameraPosition.z,
        duration: 2
      }
    )

    gsap.to(globe.camera().rotation, {
      x: cameraPosition.xr,
      y: cameraPosition.yr,
      z: cameraPosition.zr,
      duration: 2
    })
      // globe.pointOfView(cameraPosition, 2000); // Smooth transition to new POV
      arc.cameraAdjusted = true;  // Set the flag to true to avoid re-adjusting camera
    }
  }
}

function calculateMidpointAndDistance(lat1, lng1, lat2, lng2) {
  const R = 6371; // Earth's radius in kilometers
  const phi1 = lat1 * Math.PI / 180;
  const phi2 = lat2 * Math.PI / 180;
  const deltaPhi = (lat2 - lat1) * Math.PI / 180;
  const deltaLambda = (lng2 - lng1) * Math.PI / 180;

  const a = Math.sin(deltaPhi/2) * Math.sin(deltaPhi/2) +
            Math.cos(phi1) * Math.cos(phi2) *
            Math.sin(deltaLambda/2) * Math.sin(deltaLambda/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  const distance = R * c; // in kilometers

  const A = Math.cos(phi2) * Math.sin(deltaLambda);
  const B = Math.cos(phi1) * Math.sin(phi2) - Math.sin(phi1) * Math.cos(phi2) * Math.cos(deltaLambda);
  const midLng = lng1 + Math.atan2(A, B) * 180 / Math.PI;

  const x = Math.cos(phi1) + Math.cos(phi2);
  const y = Math.sin(phi1) + Math.sin(phi2);
  const midLat = Math.atan2(y, x) * 180 / Math.PI;

  return { midLat, midLng, distance };
}

let globe;

const curvePathJSON = './src/sphere.json'



const labelToTypeMap = {
    'Princeton': 'princeton',
    'Stanford': 'stanford',
    'Singapore': 'singapore',
    'Charlottesville': 'uva',
    'London': 'imperial',
    'Milan': 'italy',
    'Venice': 'italy',
    'Rome': 'italy',
    'Florence': 'italy',
    'Vienna': 'austria',
    'Prague': 'czech',
    'Budapest': 'hungary',
    'Boston': 'us',
    'Augusta': 'us',
    'Paris': 'france',
    'Geneva': 'swiss',
    'Orlando': 'us',
    'Ithaca': 'us',
    'Los Angeles': 'california',
    'Toms River': 'us',
    'Seattle': 'us',
    'Austin': 'us',
    'Chicago': 'us',
    'Ann Arbor': 'us',
    'New York City': 'us',
    'Outer Banks': 'us',
    'San Diego': 'california',
    'San Francisco': 'california',
    'Hamburg': 'germany',
    'Trier': 'germany',
    'Amsterdam': 'holland',
    'Cardiff': 'uk',
    'Oxford': 'uk',
    'Cambridge': 'uk',
    'Bath': 'uk',
    'Berlin': 'germany',
    'Honolulu': 'us',
    'Washington, DC': 'us',
    'Radford': 'us',
    'Virginia Beach': 'us',
    'Rotterdam': 'holland',
    'Baltimore': 'us',
    'Yosemite': 'california',
    'Lake Tahoe': 'california',
    'Richmond': 'us',
    'Puerto Rico': 'us',
    'Puerto Vallarta': 'mexico'
};

// Function to initialize the globe and start the visualization
export async function initializeGlobe() {

    const ARC_REL_LEN = 0.7; // relative to whole arc
    const FLIGHT_TIME = 1000;

  globe = new Globe()
        .globeImageUrl('./img/8081_earthspec4k_lines.jpg')
        .objectFacesSurface(true)
        .objectsData([
            { lat: 40.3430, lng: -74.6514, label: 'Princeton' },  // Princeton
            { lat: 37.4275, lng: -122.1697, label: 'Stanford' },   // Stanford
            { lat: 1.3521, lng: 103.8198,  label: 'Singapore' } ,
            { lat: 38.0293, lng: -78.4767, label: 'Charlottesville' },  // Charlottesville
            { lat: 51.5074, lng: -0.1278, label: 'London' }, 
            { lat: 45.4642, lng: 9.1900, label: 'Milan' },    // Milan
            { lat: 45.4408, lng: 12.3155, label: 'Venice' },   // Venice
            { lat: 41.9028, lng: 12.4964, label: 'Rome' },   // Rome
            { lat: 43.7696, lng: 11.2558, label: 'Florence' },   // Florence
            { lat: 48.2082, lng: 16.3738,  label: 'Vienna' },   // Vienna
            { lat: 50.0755, lng: 14.4378, label: 'Prague' },   // Prague
            { lat: 47.4979, lng: 19.0402,  label: 'Budapest' },     
            { lat: 42.3601, lng: -71.0589, label: 'Boston'},  // Boston
            { lat: 44.3106, lng: -69.7795, label: 'Augusta' },   // Augusta
            { lat: 48.8566, lng: 2.3522, label: 'Paris' },  // Paris
            { lat: 46.2044, lng: 6.1432,  label: 'Geneva' },  // Geneva
            { lat: 28.5383, lng: -81.3792,  label: 'Orlando' },  // Orlando
            { lat: 42.4430, lng: -76.5019, label: 'Ithaca' },  // Ithaca
            { lat: 34.0522, lng: -118.2437, label: 'Los Angeles' },  // Los Angeles
            { lat: 39.958851, lng: -74.215336, label: 'Toms River' },  // Toms River
            { lat: 47.6062, lng: -122.3321, label: 'Seattle' },  // Seattle
            { lat: 30.2672, lng: -97.7431, label: 'Austin' },  // Austin
            { lat: 41.8781, lng: -87.6298,  label: 'Chicago' },  // Chicago
            { lat: 42.2808, lng: -83.7430,  label: 'Ann Arbor' },  // Ann Arbor
            { lat: 40.7128, lng: -74.0060, label: 'New York City' },  // New York City
            { lat: 35.5582, lng: -75.4665, label: 'Outer Banks' },  // Outer Banks
            { lat: 32.7157, lng: -117.1611, label: 'San Diego' },  // San Diego
            { lat: 37.7749, lng: -122.4194,  label: 'San Francisco' },  // San Francisco
            { lat: 53.5511, lng: 9.9937,  label: 'Hamburg' },  // Hamburg
            { lat: 49.7490, lng: 6.6371,  label: 'Trier' },  // Trier
            { lat: 52.3676, lng: 4.9041,  label: 'Amsterdam' },  // Amsterdam
            { lat: 51.4816, lng: -3.1791,  label: 'Cardiff' },  // Cardiff
            { lat: 51.7520, lng: -1.2577, label: 'Oxford' },  // Oxford
            { lat: 52.2053, lng: 0.1218,  label: 'Cambridge' },  // Cambridge
            { lat: 51.3811, lng: -2.3590,  label: 'Bath' },  // Bath
            { lat: 52.5200, lng: 13.4050, label: 'Berlin' },  // Berlin
            { lat: 21.3069, lng: -157.8583,  label: 'Honolulu' },  // Honolulu
            { lat: 38.9072, lng: -77.0369,  label: 'Washington, DC' }, //DC
            { lat: 37.1318, lng: -80.5764,  label: 'Radford' },  // Radford
            { lat: 36.8529, lng: -75.9780,  label: 'Virginia Beach' },   // Virginia Beach
            { lat: 51.9225, lng: 4.4792, label: 'Rotterdam' },  // Rotterdam
            { lat: 39.2904, lng: -76.6122,  label: 'Baltimore' },  // Baltimore
            { lat: 37.8651, lng: -119.5383,  label: 'Yosemite' },        // Yosemite
            { lat: 39.0968, lng: -120.0324, label: 'Lake Tahoe' },        // Lake Tahoe
            { lat: 37.5407, lng: -77.4360,  label: 'Richmond' },   // Richmond
            { lat: 18.4655, lng: -66.1057,  label: 'Puerto Rico' }, //PR
            { lat: 20.6534, lng: -105.2253,  label: 'Puerto Vallarta' }  // Puerto Vallarta
        ])
        .objectThreeObject(data => {
            console.log(data.label)
            return modelCache[data.label].clone();  // Use a clone of the loaded model
        })
        .objectLabel(obj => `<div style="
            font-family: 'Helvetica', 'Arial', sans-serif;
            color: black;
            font-size: 14px;  /* Adjust font size as needed */
            padding: 5px;
            background: rgba(255, 255, 255, 0.8); /* Optional: Light background to contrast text */
            border-radius: 5px;
            box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.2); /* Optional: shadow for better visibility */
        ">${obj.label}</div>`)
        // .arcsData(arcsData)
        .arcColor(arc => {
          // Determine color based on the "from" parameter of the arc
          switch (arc.group) {
              case 'Charlottesville':
              case 'charlottesvilleSmall':
                  return 'darkblue';
              case 'Princeton':
              case 'princetonSmall':
                  return 'orange';
              case 'Stanford':
              case 'stanfordSmall':
                  return 'darkred';
              case 'London':
              case 'londonSmall':
                  return 'lightblue';
              default:
                  return 'black'; // Default color if no match found
          }
      })
      // .arcDashLength(() => 0.5)
      // .arcDashGap(() => 0.5)
      .arcsTransitionDuration(0)
      .arcDashLength(ARC_REL_LEN)
      .arcDashGap(2)
      .arcDashInitialGap(1)
      .arcDashAnimateTime(FLIGHT_TIME)
        // .arcDashLength(arc => arc.arcDashLength)
        // .arcDashGap(arc => arc.arcDashGap)
        // .arcDashLength(1)
        // .arcDashGap(2)
        // .arcDashAnimateTime(1000)
        // .arcDashInitialGap(arc => arc.arcDashInitialGap)
        // .arcDashAnimateTime(arc => arc.arcDashAnimateTime)
        (document.getElementById('globeViz'));

        let camera_anim = gsap.timeline();

        // let curvePath = await loadCurveFromJSON(scene, curvePathJSON);

        function animateModelScaleSequential({label, increment, delay, duration}) {
        
            const model = modelCache[label];

            if (model) {
                const currentScaleX = model.scale.x;
                const currentScaleY = model.scale.y;
                const currentScaleZ = model.scale.z;
        
                const targetScaleX = currentScaleX + increment;
                const targetScaleY = currentScaleY + increment;
                const targetScaleZ = currentScaleZ + increment;
        
                console.log("Target Scale:", targetScaleX, targetScaleY, targetScaleZ);
        
                console.log("label ", label)
                gsap.to(model.scale, {
                    x: targetScaleX,
                    y: targetScaleY,
                    z: targetScaleZ,
                    duration: duration / 1000,
                    delay: delay / 1000
                });
            } else {
                console.warn(`Object with label ${label} not found.`);
            }
        }

        let prevCoords = { lat: cities['Ithaca'].lat, lng: cities['Ithaca'].lng };

        // Function to emit arcs
        function emitArc({ startLat, startLng, endLat, endLng, duration }) {
            // Update previous coordinates after the duration
            setTimeout(() => { prevCoords = { lat: endLat, lng: endLng } }, duration);

            // Add and remove arc after 1 cycle
            const arc = { startLat, startLng, endLat, endLng };
            globe.arcsData([...globe.arcsData(), arc]);

            // Remove the arc after 2 cycles (adjust timing as needed)
            setTimeout(() => {
                globe.arcsData(globe.arcsData().filter(d => d !== arc));
            }, duration * 2);
        }

        // Function to initiate sequential arcs based on cityPairs
        function sequentialArcs(cityPairs) {
            let totalDelay = 2000; // Track the cumulative delay for sequential calls

            cityPairs.forEach((pair, index) => {
                const { from, to, delay, duration, incrementCity, durationCity } = pair;
                const startCoords = cities[from];
                const endCoords = cities[to];

                // Schedule arc emission after cumulative delay
                setTimeout(() => {
                    emitArc({
                        startLat: prevCoords.lat,
                        startLng: prevCoords.lng,
                        endLat: endCoords.lat,
                        endLng: endCoords.lng,
                        duration: FLIGHT_TIME * duration // You can specify different durations if needed
                    });

                    // animateModelScaleSequential({label: to, increment: incrementCity, delay: FLIGHT_TIME, duration: durationCity * 1000})

                    // Update prevCoords to the end coordinates of this arc
                    prevCoords = { lat: endCoords.lat, lng: endCoords.lng };
                }, totalDelay);

                // Add to the cumulative delay (duration + delay for next arc)
                totalDelay += delay * 1000; // Convert delay to milliseconds
            });
        }


        const cityPairs = [
            { from: 'Ithaca', to: 'Charlottesville', delay: 4, duration: 1, incrementCity: 3, durationCity: 3 },
            { from: 'Charlottesville', to: 'New York City', delay: 2, duration: 1, incrementCity: 1, durationCity: 1 },
            { from: 'New York City', to: 'Charlottesville', delay: 2, duration: 1, incrementCity: 1, durationCity: 1 },
            { from: 'Charlottesville', to: 'Toms River', delay: 2, duration: 1, incrementCity: 1, durationCity: 1 },
            { from: 'Toms River', to: 'Charlottesville', delay: 2, duration: 1, incrementCity: 1, durationCity: 1 },
            { from: 'Charlottesville', to: 'Washington, DC', delay: 2, duration: 1, incrementCity: 1, durationCity: 1 },
            { from: 'Washington, DC', to: 'Charlottesville', delay: 2, duration: 1, incrementCity: 1, durationCity: 1 },
            { from: 'Charlottesville', to: 'New York City', delay: 2, duration: 1, incrementCity: 1, durationCity: 1 },
            { from: 'New York City', to: 'Charlottesville', delay: 3, duration: 1, incrementCity: 2, durationCity: 2 },
            { from: 'Charlottesville', to: 'Toms River', delay: 2, duration: 1, incrementCity: 1, durationCity: 1 },
            { from: 'Toms River', to: 'Charlottesville', delay: 2, duration: 1, incrementCity: 1, durationCity: 1 },
            { from: 'Charlottesville', to: 'New York City', delay: 2, duration: 1, incrementCity: 1, durationCity: 1 },
            { from: 'New York City', to: 'Charlottesville', delay: 2, duration: 1, incrementCity: 1, durationCity: 1 },
            { from: 'Charlottesville', to: 'Virginia Beach', delay: 2, duration: 1, incrementCity: 1, durationCity: 1 },
            { from: 'Virginia Beach', to: 'Charlottesville', delay: 2, duration: 1, incrementCity: 1, durationCity: 1 },
            { from: 'Charlottesville', to: 'Richmond', delay: 2, duration: 1, incrementCity: 1, durationCity: 1 },
            { from: 'Richmond', to: 'Charlottesville', delay: 2, duration: 1, incrementCity: 1, durationCity: 1 },
            { from: 'Charlottesville', to: 'Radford', delay: 2, duration: 1, incrementCity: 1, durationCity: 1 },
            { from: 'Radford', to: 'Charlottesville', delay: 2, duration: 1, incrementCity: 1, durationCity: 1 },
            { from: 'Charlottesville', to: 'Baltimore', delay: 2, duration: 1, incrementCity: 1, durationCity: 1 },
            { from: 'Baltimore', to: 'Charlottesville', delay: 2, duration: 1, incrementCity: 1, durationCity: 1 },
            { from: 'Charlottesville', to: 'Orlando', delay: 2, duration: 1, incrementCity: 1, durationCity: 1 },
            { from: 'Orlando', to: 'Charlottesville', delay: 2, duration: 1, incrementCity: 1, durationCity: 1 },
            
            
          ];


// Start emitting arcs sequentially
sequentialArcs(cityPairs);


        function updateArcs() {
          const currentTime = Date.now();
      
          arcsData.forEach(arc => {
            if (currentTime < arc.removeAfter) {
              if (currentTime > start + arc.arcDashInitialGap * 1500) {
                if (!arc.cameraAdjusted) {

                }
              }
              
            }
          });
        
          arcsData = arcsData.filter(arc => currentTime < arc.removeAfter);
          globe.arcsData(arcsData);
      
        }

        globe.onObjectClick((obj, event, { lat, lng, altitude }) => {
            console.log(`Clicked on ${obj.label}: Latitude ${lat}, Longitude ${lng}, Altitude ${altitude}`);
        
            // Define the new target position
            const target = { lat, lng, altitude: 0.5 };
        
            // Get the current camera position to interpolate from
            const currentPosition = globe.pointOfView();
        
            // Animate the transition using gsap
            gsap.to(currentPosition, {
                lat: target.lat,
                lng: target.lng,
                altitude: target.altitude,  // Adjust the altitude if needed
                duration: 2,  // Duration in seconds
                ease: "power2.inOut",  // Smooth easing
                onUpdate: () => {
                    // Update the globe camera point of view gradually
                    globe.pointOfView(currentPosition);
                }
            });
        
            console.log('object position', globe.camera().position);
        });

     var camPosIndex = 0;

      const londonTarget = new THREE.Vector3(-2.0416446700265904, 82.88, 58.2);
      const cvilleTarget = new THREE.Vector3(-80.0416446700265904, 62.88, 16.2);
      const ptonTarget = new THREE.Vector3(-74.0416446700265904, 65.88, 20.2);

      const spline = new THREE.CatmullRomCurve3([
        cvilleTarget,
        ptonTarget,
        londonTarget
      ]); 

      const geometry = new THREE.BoxGeometry(2, 2, 2); // Create a 1x1x1 cube
      const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 }); // Green color for the cube
      const box = new THREE.Mesh(geometry, material);

      box.position.set(londonTarget.x, londonTarget.y, londonTarget.z);
      box.position.set(cvilleTarget.x, cvilleTarget.y, cvilleTarget.z)
      box.position.set(ptonTarget.x, ptonTarget.y, ptonTarget.z)

    //   globe.scene().add(box)


      

      let isAnimating = false;



      function onMouseScroll(event){
        // handleScrollTarget(event, positionAlongPathState);
      }

      window.addEventListener('wheel', onMouseScroll, false);

      function animateModelScale(label) {
        
        // const model = globe.scene().children.find(obj => obj.userData.label === 'princeton');
        const targetScale = cities[label].visits

        const delay = cities[label].start

        const duration = cities[label].duration

        const model = modelCache[label];

        // const model = loadedModels.get('princeton');

        if (model) {

            console.log(model)
            gsap.to(model.scale, {
                x: targetScale,
                y: targetScale,
                z: targetScale,
                duration: duration,
                delay: delay
            });
        } else {
            console.warn(`Object with label ${label} not found.`);
        }
    }

    var target = cvilleTarget

      function animate() {

        const lookAts = [
            { city: 'charlottesville', lookAt: cvilleTarget, duration: 10000 }, // Duration in milliseconds
            { city: 'princeton', lookAt: ptonTarget, duration: 5000 },
            { city: 'london', lookAt: londonTarget, duration: 5000 }
        ];
    
        let currentIndex = 0;
        let lastChangeTime = Date.now();
        let target = lookAts[0].lookAt;

        // Helper vector to store the interpolated lookAt position
        const smoothLookAt = new THREE.Vector3().copy(target);

        requestAnimationFrame(function loop(time) {

            const now = Date.now();

            if (now - lastChangeTime > lookAts[currentIndex].duration) {
                currentIndex = (currentIndex + 1) % lookAts.length; // Move to the next target
                const newTarget = lookAts[currentIndex].lookAt; // Update to the next lookAt target
    
                // Smoothly animate the camera's lookAt using GSAP
                gsap.to(smoothLookAt, {
                    x: newTarget.x,
                    y: newTarget.y,
                    z: newTarget.z,
                    duration: lookAts[currentIndex].duration / 1000, // Convert to seconds for GSAP
                    ease: "power2.inOut"
                });
    
                lastChangeTime = now; // Reset the timer
            }

        console.log("orig pos", globe.camera().position)  

        globe.objectThreeObject(data => {
          return modelCache[data.label].clone();  // Use a clone of the loaded model
        })

        // globe.camera().lookAt(target); // Orient camera to look at next point
        // globe.camera().lookAt(smoothLookAt);
        globe.renderer().render(globe.scene(), globe.camera());

        // globe.camera().lookAt();
        
        requestAnimationFrame(loop)

        })

        


      };

      Object.keys(cities).forEach(label => {
        animateModelScale(label);
    });

    // const t1 = gsap.timeline();

    // // Define your points of view with durations
    // const pointsOfView = [
    //     { city: 'charlottesville', duration: 10 },
    //     { city: 'princeton', duration: 5 },
    //     { city: 'london', duration: 5 },
    //     { city: 'stanford', duration: 5 }
    // ];

    
    
    // // Chain the animations using `onStart`
    // pointsOfView.forEach(pov => {
    //     t1.to({}, {
    //         duration: pov.duration,
    //         onStart: () => {
    //             const city = views[pov.city];
    //             globe.pointOfView({ lat: city.lat, lng: city.lng, altitude: 0.5 }, [pov.duration*1000]);
    //         }
    //     });
    // });

        // Define your points of view with durations
        const lookAts  = [
            { city: 'charlottesville', lookAt: cvilleTarget },
            { city: 'princeton', lookAt: ptonTarget },
            { city: 'london', lookAt: londonTarget }
        ];
        
      

    //   animateModelScale('london', 3, 1);
    //   animateModelScale('londonL', 2, 3, 1);
    //   animateModelScale('londonM', 2, 3, 1);
    //   animateModelScale('londonS', 2, 3, 1);

    //   animateModelScale('stanfordXL', 2, 3, 1);
    //   animateModelScale('stanfordL', 2, 3, 1);
    //   animateModelScale('stanfordM', 2, 3, 1);
    //   animateModelScale('stanfordS', 2, 3, 1);

    //   animateModelScale('charlottesvilleXL', 2, 3, 1);
    //   animateModelScale('charlottesvilleL', 2, 3, 1);
    //   animateModelScale('charlottesvilleM', 2, 3, 1);
    //   animateModelScale('charlottesvilleS', 2, 3, 1);

    //   animateModelScale('princetonXL', 2, 3, 1);
    //   animateModelScale('princetonL', 2, 3, 1);
    //   animateModelScale('princetonM', 2, 3, 1);
    //   animateModelScale('princetonS', 2, 3, 1);


      animate();
}

preloadModels(initializeGlobe);