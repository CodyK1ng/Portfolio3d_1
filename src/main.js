import './style.css'
import * as THREE from 'three';
import { ThreeMFLoader } from 'three/examples/jsm/Addons.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { glslFn, textureLoad } from 'three/tsl';
import * as func from './functions.js';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';
import { SphereGeometry } from 'three/webgpu';

// X = Left/Right
// Y = Up/Down 
// Z = Foward/Backward 

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector( '#bg' ),
});


let button_b1, rSmall_b1, rBig_b1, buildFrame, buildGInner, buildGOuter, buildOrb, buildEnergy; 
let bRingsRot = 'spin';
let button1Check;
const modelsToLoad = {
  buttonMain_1: '/Meshes/Button_middle.glb',
  buttonRingSmall_1: '/Meshes/Button_sides_1.glb',
  buttonRingBig_1: '/Meshes/Button_sides_2.glb',

  buildFrame: '/Meshes/Building_Frame.glb',
  buildGuardInner: '/Meshes/Building_Guards_Inner.glb',
  buildGuardOuter: '/Meshes/Building_Guards_Outter.glb',
  buildOrb: '/Meshes/Building_Orb.glb',
  buildEnergy: '/Meshes/Building_Energy.glb',
}
const loader = new GLTFLoader();
const loadedModels = {};
const loadModel = (key, path) => {
  return new Promise ((resolve) => {
    loader.load( path, (gltf) => {
      loadedModels[key] = gltf.scene;
      loadedModels[key].scale.set(1,1,1);
      if (key.includes("button")) {
        loadedModels[key].rotation.set(-5,0,0);
        if(key.includes("Main")){
          loadedModels[key].position.set(-5, -5,-10);
          button_b1 = gltf.scene;
          camera.add(loadedModels[key]);
          button1Check = key;
          button_b1.traverse((child) =>{
            if (child.isMesh) {
              child.userData.tags =  [ "clickable" , "button" , key];
            }
          });
        }else if (key.includes("RingSmall")) {
          rSmall_b1 = gltf.scene;
        }else if (key.includes("RingBig")) {
          rBig_b1 = gltf.scene;
        };
      };

      if (key.includes("build")){
        if (key.includes("Guard")){
          if (key.includes("Inner")){
            buildGInner = gltf.scene;
          }else if (key.includes("Outer")){
            buildGOuter = gltf.scene;
          }
        }else if (key.includes('Orb')){
          buildOrb = gltf.scene;
        }else if (key.includes('Frame')){
          scene.add(loadedModels[key]);
          buildFrame = gltf.scene;
          gltf.scene.position.set(0,30,0);
        }else if (key.includes('Energy')){
          buildEnergy = gltf.scene;
        }

      };
      resolve(gltf.scene);
    }); 

  });
};
const clickableOjects = [];
Promise.all(Object.entries(modelsToLoad).map(([key, path]) => loadModel(key, path))).then(() => {
  scene.traverse((child=>{
    // this is for the mouse over array where things that can't be clicked won't get moused over
    if (child.userData?.tags?.includes("clickable")) clickableOjects.push(child);
  }));
  button_b1.add(rBig_b1,rSmall_b1);

  buildFrame.add(buildGInner, buildGOuter, buildOrb, buildEnergy);
});




const cameraHome = new THREE.Object3D();
camera.position.set( 0, 40 , 100 );

cameraHome.position.copy( camera.position );
cameraHome.rotation.copy( camera.rotation );
camera.rotation.set( -.1, 0, 0 );



renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.render( scene, camera );
scene.add(camera);




// Re-center of rotation hidden box
const hiddenHomeBox = new THREE.Mesh(
  new THREE.BoxGeometry( 10 , 10 , 10 ),
  new THREE.MeshStandardMaterial({color: "rgba(255, 0, 212, 1)" })
);
hiddenHomeBox.position.set( 0, 35 , 0 ); 


const box2 = func.addGeometry("box","rgba(249, 242, 244, 1)", 0, -5,-10, .3);
box2.rotation.set(5,0,0);
camera.add(box2);

const box3 = func.addGeometry("box", "rgba(249, 242, 244, 1)",5, -5,-10, .3);
box3.rotation.set(5,0,0);
camera.add(box3);




// Button locations boxes
const box4 = func.addGeometry("box", "rgba(0, 221, 255, 1)", -50, 30, 0);
scene.add(box4);



// Just some random 3d objects
const sphere1 = func.addGeometry("sphere", "rgb(230, 22, 227)", 40, 40, 0);
scene.add(sphere1);




function lights(){
  const pointLight = new THREE.PointLight(0xffffff, 10);
  pointLight.position.set( 0, 16, 0 );
  const directionalLight = new THREE.DirectionalLight(0xffffff);
  directionalLight.position.set( 0 , 60 , 0);
  directionalLight.target.position.copy( sphere1.position );
  const ambientLight = new THREE.AmbientLight(0xffffff, 10);


  const lightHelper = new THREE.DirectionalLightHelper(directionalLight)
  scene.add(pointLight, directionalLight, ambientLight);
  scene.add(lightHelper)
};
lights();

const scrollableObjects = [];
scene.traverse((object) => {
  if (object.userData?.tags?.includes("scroll")) {
    scrollableObjects.push(object);
  }
});

// Stars
Array(400).fill().forEach(() => func.addStar( 300 , scene));


const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let hovered = null;
window.addEventListener('mousemove', (event) => {
  
  mouse.x = (event.clientX/window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY/ window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse,camera);
  const intersects = raycaster.intersectObjects(clickableOjects, true);

  if (intersects.length > 0) {
    const target = intersects[0].object;

    if (target.userData?.tags?.includes( "clickable" )) {
      if (hovered !== target) {
        if (hovered !== null){
          hovered.material.emissive.set(0x000000);
        }
        
        if (target.userData?.tags?.includes ( "button" )){
          console.log("button tagging");
          if (target.userData?.tags?.includes(button1Check)){
            bRingsRot = 'stop';
          }
        }
        hovered = target;
        hovered.material.emissive.set(0x999999);

      }
    }else if (hovered !== null){
      hovered.material.emissive.set(0x000000);
      hovered = null;
      bRingsRot = 'spin';
    }
  }else{
    if (hovered !== null){
      hovered.material.emissive.set(0x000000);
      hovered = null;
      bRingsRot = 'spin';
    }
  }
});


let objTarget = new THREE.Object3D();
window.addEventListener( 'click', (event) => {
  mouse.x = (event.clientX/window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY/ window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse,camera);
  const intersects = raycaster.intersectObjects(scene.children);
  
  if (intersects.length > 0) {
    
    const target = intersects[0].object;

    if ( target.userData?.tags?.includes ( "clickable" ) && camera.position.equals(cameraHome.position) && !moving) {
      if ( target.userData?.tags?.includes ( "box" )){
        if ( target === box1 ){
          moveSet(box4, 'left');
        }else if ( target === box2 ){
          moveSet(box4, 'right');
        }else if ( target === box3 ){
          console.log( "box3" );
        }
      }else if ( target.userData?.tags?.includes ( "button" ) ){
        console.log(target.userData?.tags);
        if ( target.userData?.tags?.includes ( "button_1")){
          console.log("I'm going to kill myself if I go up north")

        }
        
      }else{
        moveSet(target);
        console.log("else triggered");
        console.log(target.userData?.tags);
        scrollCurrentY = target.position.y;
        scrollTargetY = target.position.y; 
      }
    }else{
      if (!camera.position.equals(cameraHome.position) && !moving) {
        moveSet(cameraHome);
      }
    }
  }else {
    if (!camera.position.equals(cameraHome.position) && !moving) {
      moveSet(cameraHome);
    }
  }
});


let offtype = 'jupiter';
let offset = new THREE.Vector3();
let targetCamPos = new THREE.Vector3();
let moving = false;
function moveCameraTo(target) {
  if (camera.position.equals(cameraHome.position)) {
    camera.getWorldDirection(offset);
    offset = func.CameraDirOff( offtype , offset )
    targetCamPos.copy(target.position).addScaledVector(offset, -20);
    move();
  }else {
    targetCamPos.set(cameraHome.position.x, cameraHome.position.y, cameraHome.position.z);
    move();
  }
}

/*These make me feel safe. I'm never getting rid of them fuck you :)*/
let camP = null;
function moveSet(target, dir = "jupiter") {
  if (camera.position.equals(cameraHome.position)){
    camP = true;
  }else{
    camP = false;
  }
  objTarget = target;
  offtype = dir;
  moveCameraTo(target);
}
function move(){
  moving =  true;
};





let scrollable = false;
let scrollTargetY = 0;
let scrollCurrentY = 0;
window.addEventListener( 'wheel', (event) => {
  if (scrollable){
    scrollTargetY += event.deltaY * 0.01;
  }
});




function animate() {
  requestAnimationFrame( animate );

  if(moving) {
    camera.position.lerp(targetCamPos, 0.02);
    const dummy = new THREE.Object3D();
    dummy.position.copy(camera.position);
    if (camP){
      dummy.lookAt(objTarget.position);
    }else{
      dummy.lookAt(hiddenHomeBox.position);
    }
    dummy.rotateY(Math.PI);

    camera.quaternion.slerp(dummy.quaternion, 0.02);
    /*(camera.lookAt(objTarget.position);*/

    if (camera.position.distanceTo(targetCamPos) <= .01) {
      moving = false;
      if ( objTarget.userData?.tags?.includes("scroll")){
        scrollable = true;
      }else{
        camera.position.copy(targetCamPos)
        scrollable = false;
      }
    }
  };
  if (buildGInner?.rotation && buildGOuter?.rotation){
    buildGInner.rotation.y += 0.03;
    buildGOuter.rotation.y -= 0.01;
  };

  scrollTargetY = THREE.MathUtils.clamp(scrollTargetY, -50, 150);
  scrollCurrentY = THREE.MathUtils.lerp(scrollCurrentY, scrollTargetY, 0.1);

  if (scrollable){
    objTarget.position.y = scrollCurrentY;
  };

  func.buttonRingRots(rSmall_b1, rBig_b1, bRingsRot);

  /*controls.update();*/

  renderer.render( scene, camera );
}

animate()