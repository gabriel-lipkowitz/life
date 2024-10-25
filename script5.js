import gsap from 'gsap'
import * as THREE from "three";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
// import { RotateControls } from 'three/addons/controls/DragControls.js';
import { loadCurveFromJSON } from './curveTools/CurveMethods.js'
import getStarfield from "./src/getStarfield.js";
import { getFresnelMat } from "./src/getFresnelMat.js";
import ThreeGlobe from 'three-globe';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { TrackballControls } from 'three/addons/controls/TrackballControls.js';
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';
import {Tween, Group} from '@tweenjs/tween.js'
import PositionAlongPathState from './positionAlongPathTools/PositionAlongPathState.js';
import { handleScroll, updatePosition, handleScrollTarget, updatePositionTarget } from './positionAlongPathTools/PositionAlongPathMethods.js'

const models = {
  'stanfordS': './models/stanfordS.glb',
  'stanfordM': './models/stanfordM.glb',
  'stanfordL': './models/stanfordL.glb',
  'stanfordXL': './models/stanfordXL.glb',
  'singaporeS': './models/singaporeS.glb',
  'charlottesvilleS': './models/charlottesvilleS.glb',
  'charlottesvilleM': './models/charlottesvilleM.glb',
  'charlottesvilleL': './models/charlottesvilleL.glb',
  'charlottesvilleXL': './models/charlottesvilleXL.glb',
  'londonS': './models/londonS.glb',
  'londonM': './models/londonM.glb',
  'londonL': './models/londonL.glb',
  'londonXL': './models/londonXL.glb',
  'princetonS': './models/princetonS.glb',
  'princetonM': './models/princetonM.glb',
  'princetonL': './models/princetonL.glb',
  'princetonXL': './models/princetonXL.glb',
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


function preloadModels(callback) {
  const entries = Object.entries(models);
  let loadedCount = 0;

  entries.forEach(([type, url]) => {
      loader.load(url, gltf => {
          const model = gltf.scene;
          model.scale.set(2, 2, 2);  // Initial scale
          model.position.set(0, 0, -1);
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

// Creating a Catmull-Rom curve through the specified points
// const spline = new THREE.CatmullRomCurve3([
//   cityPositions['Charlottesville'],
//   cityPositions['Princeton'],
//   cityPositions['London'],
//   cityPositions['Stanford'],
//   cityPositions['Pacific'],
//   cityPositions['Singapore']
// ]);   



const cityPairs = [
  { from: 'Charlottesville', to: 'Ithaca', delay: 0, group: 'Charlottesville' },
  { from: 'Charlottesville', to: 'Washington, D.C.', delay: 0, group: 'Charlottesville' },
  { from: 'Charlottesville', to: 'Princeton', delay: 0, group: 'Charlottesville' },
  { from: 'Charlottesville', to: 'Outer Banks', delay: 0, group: 'Charlottesville' },
  { from: 'Charlottesville', to: 'Paris', delay: 0, group: 'Charlottesville' },
  { from: 'Paris', to: 'Geneva', delay: 0, group: 'Charlottesville' },
  { from: 'Geneva', to: 'Charlottesville', delay: 0, group: 'Charlottesville' },
  { from: 'Charlottesville', to: 'Radford', delay: 0, group: 'Charlottesville' },
  { from: 'Charlottesville', to: 'Orlando', delay: 0, group: 'Charlottesville' },
  
];

const cities = {
  'Princeton': { lat: 40.3430, lng: -74.6514, visits: 15 },
  'Stanford': { lat: 37.4275, lng: -122.1697, visits: 15  },
  'Singapore': { lat: 1.3521, lng: 103.8198, visits: 15  },
  'Charlottesville': { lat: 38.0293, lng: -78.4767, visits: 15  },
  'London': { lat: 51.5074, lng: -0.1278, visits: 15  },
  'Paris': { lat: 48.8566, lng: 2.3522, visits: 1  },
  'Geneva': { lat: 46.2044, lng: 6.1432, visits: 1 },
  'Orlando': { lat: 28.5383, lng: -81.3792, visits: 1 },
  'Ithaca': { lat: 42.4430, lng: -76.5019, visits: 3  },
  'Los Angeles': { lat: 34.0522, lng: -118.2437, visits: 5  },
  'Seattle': { lat: 47.6062, lng: -122.3321, visits: 3 },
  'Austin': { lat: 30.2672, lng: -97.7431, visits: 2  },
  'Chicago': { lat: 41.8781, lng: -87.6298, visits: 1  },
  'Ann Arbor': { lat: 42.2808, lng: -83.7430, visits: 1  },
  'New York City': { lat: 40.7128, lng: -74.0060, visits: 10 },
  'Outer Banks': { lat: 35.5582, lng: -75.4665, visits: 1  },
  'San Diego': { lat: 32.7157, lng: -117.1611, visits: 1  },
  'San Francisco': { lat: 37.7749, lng: -122.4194, visits: 10 },
  'Hamburg': { lat: 53.5511, lng: 9.9937, visits: 1  },
  'Trier': { lat: 49.7490, lng: 6.6371, visits: 1  },
  'Amsterdam': { lat: 52.3676, lng: 4.9041, visits: 4 },
  'Cardiff': { lat: 51.4816, lng: -3.1791, visits: 1  },
  'Oxford': { lat: 51.7520, lng: -1.2577, visits: 1  },
  'Cambridge': { lat: 52.2053, lng: 0.1218, visits: 1  },
  'Bath': { lat: 51.3811, lng: -2.3590, visits: 1 },
  'Berlin': { lat: 52.5200, lng: 13.4050, visits: 3 },
  'Honolulu': { lat: 21.3069, lng: -157.8583, visits: 1 },
  'Washington, D.C.': { lat: 38.9072, lng: -77.0369, visits: 10 },
  'Radford': { lat: 37.1318, lng: -80.5764, visits: 1  },
  'Virginia Beach': { lat: 36.8529, lng: -75.9780, visits: 1  },
  'Rotterdam': { lat: 51.9225, lng: 4.4792, visits: 2 }
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
const FLIGHT_TIME = 2000;  // in milliseconds
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
  arcDashInitialGap: index * (FLIGHT_TIME + GAP_TIME) / FLIGHT_TIME, // Sequential delay
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

// function adjustCameraForArc(arc) {
//   if (!arc.cameraAdjusted) {

//     const cameraPosition = cameraSettings[`${arc.from}-${arc.to}`];

//     if (cameraPosition) {
//       console.log("Adjusting camera for: ", arc.from, "to", arc.to);
//       globe.pointOfView(cameraPosition, 2000); // Smooth transition to new POV
//       arc.cameraAdjusted = true;  // Set the flag to true to avoid re-adjusting camera
//     }
//   }
// }

// function adjustCameraForArc(arc) {
//   console.log("adjust")
//   if (!arc.cameraAdjusted) {
    
//     const { startLat, startLng, endLat, endLng } = arc;
//     const { midLat, midLng, distance } = calculateMidpointAndDistance(startLat, startLng, endLat, endLng);

//     // Set a dynamic altitude based on the distance, ensuring both ends of the arc are visible
//     const altitude = Math.max(1.5, distance / 300); // Adjust the divisor based on your globe's scale and size

//     globe.pointOfView({ lat: midLat, lng: midLng, altitude: 2 }, 2000); // Smooth transition to new POV
//     arc.cameraAdjusted = true;  // Set the flag to true to avoid re-adjusting camera
//   }
// }

let globe;

const curvePathJSON = './src/sphere.json'

// Function to initialize the globe and start the visualization
export async function initializeGlobe() {

  globe = new Globe()
        .globeImageUrl('./img/8081_earthspec4k.jpg')
        .objectFacesSurface(true)
        .objectsData([
            { lat: 40.3430, lng: -74.6514, alt: 0, type: 'princetonXL' },  // Princeton
            { lat: 37.4275, lng: -122.1697, type: 'stanfordXL' },   // Stanford
            { lat: 1.3521, lng: 103.8198, type: 'singaporeS' } ,
            { lat: 38.0293, lng: -78.4767,  alt: 500000, type: 'charlottesvilleXL' },  // Charlottesville
            { lat: 51.5074, lng: -0.1278, type: 'londonXL' }, 
            { lat: 45.4642, lng: 9.1900, type: 'princetonS' },    // Milan
            { lat: 45.4408, lng: 12.3155, type: 'princetonS' },   // Venice
            { lat: 41.9028, lng: 12.4964, type: 'princetonS' },   // Rome
            { lat: 43.7696, lng: 11.2558, type: 'princetonS' },   // Florence
            { lat: 48.2082, lng: 16.3738, type: 'princetonS' },   // Vienna
            { lat: 50.0755, lng: 14.4378, type: 'princetonS' },   // Prague
            { lat: 47.4979, lng: 19.0402, type: 'princetonS' },     
            { lat: 42.3601, lng: -71.0589, type: 'princetonM' },  // Boston
            { lat: 44.3106, lng: -69.7795, type: 'princetonS' },   // Augusta
            { lat: 48.8566, lng: 2.3522, type: 'charlottesvilleS' },  // Paris
            { lat: 46.2044, lng: 6.1432, type: 'charlottesvilleS' },  // Geneva
            { lat: 28.5383, lng: -81.3792, type: 'charlottesvilleS' },  // Orlando
            { lat: 42.4430, lng: -76.5019, type: 'charlottesvilleM' },  // Ithaca
            { lat: 34.0522, lng: -118.2437, type: 'stanfordM' },  // Los Angeles
            { lat: 47.6062, lng: -122.3321, type: 'stanfordM' },  // Seattle
            { lat: 30.2672, lng: -97.7431, type: 'stanfordM' },  // Austin
            { lat: 41.8781, lng: -87.6298, type: 'stanfordS' },  // Chicago
            { lat: 42.2808, lng: -83.7430, type: 'stanfordS' },  // Ann Arbor
            { lat: 40.7128, lng: -74.0060, type: 'princetonL' },  // New York City
            { lat: 35.5582, lng: -75.4665, type: 'charlottesvilleS' },  // Outer Banks
            { lat: 32.7157, lng: -117.1611, type: 'stanfordS' },  // San Diego
            { lat: 37.7749, lng: -122.4194, type: 'stanfordL' },  // San Francisco
            { lat: 53.5511, lng: 9.9937, type: 'stanfordS' },  // Hamburg
            { lat: 49.7490, lng: 6.6371, type: 'stanfordS' },  // Trier
            { lat: 52.3676, lng: 4.9041, type: 'stanfordM' },  // Amsterdam
            { lat: 51.4816, lng: -3.1791, type: 'londonS' },  // Cardiff
            { lat: 51.7520, lng: -1.2577, type: 'londonS' },  // Oxford
            { lat: 52.2053, lng: 0.1218, type: 'londonS' },  // Cambridge
            { lat: 51.3811, lng: -2.3590, type: 'stanfordS' },  // Bath
            { lat: 52.5200, lng: 13.4050, type: 'stanfordM' },  // Berlin
            { lat: 21.3069, lng: -157.8583, type: 'stanfordS' },  // Honolulu
            { lat: 38.9072, lng: -77.0369, type: 'charlottesvilleL' }, //DC
            { lat: 37.1318, lng: -80.5764, type: 'charlottesvilleS' },  // Radford
            { lat: 36.8529, lng: -75.9780, type: 'charlottesvilleS' },   // Virginia Beach
            { lat: 51.9225, lng: 4.4792, type: 'stanfordS' },  // Rotterdam
            { lat: 39.2904, lng: -76.6122, type: 'charlottesvilleS' },  // Baltimore
            { lat: 37.8651, lng: -119.5383, type: 'stanfordS' },        // Yosemite
            { lat: 39.0968, lng: -120.0324, type: 'stanfordS' },        // Lake Tahoe
            { lat: 37.5407, lng: -77.4360, type: 'charlottesvilleS' },   // Richmond
            { lat: 18.4655, lng: -66.1057, type: 'princetonS' }, //PR
            { lat: 20.6534, lng: -105.2253, type: 'charlottesvilleM' }  // Puerto Vallarta
        ])
        .objectThreeObject(data => {
            return modelCache[data.type].clone();  // Use a clone of the loaded model
        })
        .arcsData(arcsData)
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
                  return 'white'; // Default color if no match found
          }
      })
      // .arcDashLength(() => 0.5)
      // .arcDashGap(() => 0.5)
      // .arcDashAnimateTime(() => Math.random() * 4000 + 500)
        // .arcDashLength(arc => arc.arcDashLength)
        // .arcDashGap(arc => arc.arcDashGap)
        .arcDashLength(1)
        .arcDashGap(2)
        .arcDashAnimateTime(1000)
        // .arcDashInitialGap(arc => arc.arcDashInitialGap)
        // .arcDashAnimateTime(arc => arc.arcDashAnimateTime)
        (document.getElementById('globeViz'));

        let camera_anim = gsap.timeline();

        let curvePath = await loadCurveFromJSON(scene, curvePathJSON);


        function updateArcs() {
          const currentTime = Date.now();
      
          arcsData.forEach(arc => {
            if (currentTime < arc.removeAfter) {
              if (currentTime > start + arc.arcDashInitialGap * 1500) {
                // console.log(currentTime, start + arc.arcDashInitialGap, arc.removeAfter )
                if (!arc.cameraAdjusted) {


                  // adjustCameraForArc(arc);
                  
                  // arc.cameraAdjusted = true
                }
              }
              
            }
          });
        
          arcsData = arcsData.filter(arc => currentTime < arc.removeAfter);
          globe.arcsData(arcsData);
      
          
          // globe.arcsData(arcsData);  // Update the globe with the current set of arcs
        }
      
        // Periodically check to update arcs
        // setInterval(updateArcs, 100);  // Check every 100 ms



        globe.onObjectClick((obj, event, { lat, lng, altitude }) => {
          console.log(`Clicked on ${obj.label}: Latitude ${lat}, Longitude ${lng}, Altitude ${altitude}`);

          

          // console.log("globe.camera.position", globe.camera().position)
          // console.log("globe.camera.rotation", globe.camera().rotation)

          globe.pointOfView({ lat: lat, lng: lng, altitude: 0 },[0]);

          console.log('object position', globe.camera().position)

          
          
      });

    //   let spline = new THREE.SplineCurve([
    //     new THREE.Vector3(0, 0, 0),
    //     new THREE.Vector3(0, 200, 0),
    //     new THREE.Vector3(150, 150, 0),
    //     new THREE.Vector3(150, 50, 0),
    //     new THREE.Vector3(250, 100, 0),
    //     new THREE.Vector3(250, 300, 0)
    //  ]);

     var camPosIndex = 0;

      // var spline = new THREE.SplineCurve(randomPoints);


      // const t1 = gsap.timeline();

      

      // t1.to(globe.camera().position, {
      //     x: cameraSettings['Charlottesville'].x,
      //     y: cameraSettings['Charlottesville'].y,
      //     z: cameraSettings['Charlottesville'].z,
      //     duration: 2,
      //     ease: "linear"
      //   }, 3)

      // .to(globe.camera().rotation, {
      //   x: cameraSettings['Charlottesville'].xr,
      //   y: cameraSettings['Charlottesville'].yr,
      //   z: cameraSettings['Charlottesville'].zr,
      //   duration: 2,
      //   ease: "linear"
      // }, 3)

      // .to(globe.camera().position, {
      //   x: cameraSettings['Princeton'].x,
      //   y: cameraSettings['Princeton'].y,
      //   z: cameraSettings['Princeton'].z,
      //   duration: 2,
      //   ease: "linear"
      // }, 6)

      // .to(globe.camera().rotation, {
      //   x: cameraSettings['Princeton'].xr,
      //   y: cameraSettings['Princeton'].yr,
      //   z: cameraSettings['Princeton'].zr,
      //   duration: 2,
      //   ease: "linear"
      // }, 6)

      // .to(globe.camera().position, {
      //   x: cameraSettings['London'].x,
      //   y: cameraSettings['London'].y,
      //   z: cameraSettings['London'].z,
      //   duration: 2,
      //   ease: "linear"
      // }, 8)

      // .to(globe.camera().rotation, {
      //   x: cameraSettings['London'].xr,
      //   y: cameraSettings['London'].yr,
      //   z: cameraSettings['London'].zr,
      //   duration: 2,
      //   ease: "linear"
      // }, 8)

      // .to(globe.camera().position, {
      //   x: cameraSettings['Stanford'].x,
      //   y: cameraSettings['Stanford'].y,
      //   z: cameraSettings['Stanford'].z,
      //   duration: 2,
      //   ease: "linear"
      // }, 10)

      // .to(globe.camera().rotation, {
      //   x: cameraSettings['Stanford'].xr,
      //   y: cameraSettings['Stanford'].yr,
      //   z: cameraSettings['Stanford'].zr,
      //   duration: 2,
      //   ease: "linear"
      // }, 10)

      // .to(globe.camera().position, {
      //   x: cameraSettings['Pacific'].x,
      //   y: cameraSettings['Pacific'].y,
      //   z: cameraSettings['Pacific'].z,
      //   duration: 2,
      //   ease: "linear"
      // }, 12)

      // .to(globe.camera().rotation, {
      //   x: cameraSettings['Pacific'].xr,
      //   y: cameraSettings['Pacific'].yr,
      //   z: cameraSettings['Pacific'].zr,
      //   duration: 2,
      //   ease: "linear"
      // }, 12)

      // .to(globe.camera().position, {
      //   x: cameraSettings['Singapore'].x,
      //   y: cameraSettings['Singapore'].y,
      //   z: cameraSettings['Singapore'].z,
      //   duration: 2,
      //   ease: "linear"
      // }, 14)

      // .to(globe.camera().rotation, {
      //   x: cameraSettings['Singapore'].xr,
      //   y: cameraSettings['Singapore'].yr,
      //   z: cameraSettings['Singapore'].zr,
      //   duration: 2,
      //   ease: "linear"
      // }, 14)

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

      globe.scene().add(box)


      

      let isAnimating = false;


      let positionAlongPathState = new PositionAlongPathState();

      function onMouseScroll(event){
        // handleScrollTarget(event, positionAlongPathState);
      }

      window.addEventListener('wheel', onMouseScroll, false);

      function animateModelScale(type, targetScale, duration = 1) {
        const model = modelCache[type];

        

        if (model) {
          // console.log(model)
            gsap.to(model.scale, {
                x: targetScale,
                y: targetScale,
                z: targetScale,
                duration: duration
            });
        }
    }
    
    // Example: Animate the scale of 'charlottesvilleXL' from its current size to 0.5 over 2 seconds
    

      function animate() {

        

        requestAnimationFrame(function loop(time) {

          

        // updatePositionTarget(curvePath, globe.camera(), positionAlongPathState);
        
        console.log("orig pos", globe.camera().position)  

        globe.objectThreeObject(data => {
          return modelCache[data.type].clone();  // Use a clone of the loaded model
        })
        // camPosIndex+=50;

        // if (camPosIndex > 1000000) {
        //   camPosIndex = 0;
        // }
        // var camPos = spline.getPoint(camPosIndex / 10000);
        // var camRot = spline.getTangent(camPosIndex / 10000);

        // globe.camera().position.x = camPos.x;
        // globe.camera().position.y = camPos.y;
        // globe.camera().position.z = camPos.z;
        
        // globe.controls().target = spline.getPoint((camPosIndex+1) / 10000)






      //   if (camPosIndex >= 1200 && !isAnimating) {
      //     isAnimating = true;
      //     gsap.to(globe.controls().target, {
      //         x: londonTarget.x,
      //         y: londonTarget.y,
      //         z: londonTarget.z,
      //         duration: 5, // Duration over which the target changes
      //         ease: "linear",
      //         onUpdate: function() {
      //             // This ensures the controls are aware of the target update
      //             globe.controls().update();
      //         },
      //         onComplete: function() {
      //             isAnimating = false; // Reset flag after animation
      //         }
      //     });
      // }

      // if (camPosIndex < 1200) {
      //     globe.controls().target.copy(ptonTarget);



      // }

        
        
        // globe.camera().lookAt(cityPositions['London']); // Orient camera to look at next point

        // globe.renderer().render(globe.scene(), globe.camera());

        // globe.camera().lookAt();
        
        requestAnimationFrame(loop)

        })


      };

      animateModelScale('londonXL', 5.5, 5);

      animate();
}

preloadModels(initializeGlobe);

    
    