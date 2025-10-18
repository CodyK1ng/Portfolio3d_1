import './style.css'
import * as THREE from 'three';
import { ThreeMFLoader } from 'three/examples/jsm/Addons.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { textureLoad } from 'three/tsl';
import * as func from './functions.js';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';


const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector( '#bg' ),
});


let b_1, rSmall_1, rBig_1; 

const modelsToLoad = {
  button_1: '/Meshes/Button_middle.glb',
  bRingSmall_1: '/Meshes/Button_sides_1.glb',
  bRingBig_1: '/Meshes/Button_sides_2.glb',
}
const loader = new GLTFLoader();
const loadedModels = {};
for (const key in modelsToLoad) {
  const path = modelsToLoad[key];
  loader.load(
    path,
    (gltf) => {
      loadedModels[key] = gltf.scene;
      loadedModels[key].rotation.set(5,0,0);
      loadedModels[key].scale.set(1,1,1);
      loadedModels[key].position.set(-5, -5,-10);
      if (key.includes("button")) {
        b_1 = gltf.scene;
        loadedModels[key].userData.tags = ["clickable"];
        camera.add(loadedModels[key]);
        b_1.traverse((child) =>{
          if (child.isMesh) {
            child.userData.tags = ["clickable"];
          }
        });
      }
      if (key.includes("RingSmall")) {
        rSmall_1 = gltf.scene;
        camera.add(rSmall_1);
      };
      if (key.includes("RingBig")) {
        rBig_1 = gltf.scene;
        camera.add(rBig_1);
    
      };

      // if (key === "button1") button1 = gltf.scene;
      // if (key === "button1") button1 = gltf.scene;
      // if (key === "button1") button1 = gltf.scene;
      // if (key === "button1") button1 = gltf.scene;
    }
  ); 
  
};
function childClickable(thing){
  thing.traverse((child) =>{
    if (child.isMesh) {
      thing.userData.tags = ["clickable"];
    };
  });
};



/* 
X = Left/Right
Y = Up/Down 
Z = Foward/Backward 
*/

camera.position.set( 0, 40 , 100 );
const cameraHome = new THREE.Object3D();

cameraHome.position.copy( camera.position );
cameraHome.rotation.copy( camera.rotation );
camera.rotation.set( -.1, 0, 0 );
const cameraHomeRot = new THREE.Quaternion().copy(camera.quaternion);


renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.render( scene, camera );
scene.add(camera);



/*
Re-center of rotation hidden box
*/
const hiddenHomeBox = new THREE.Mesh(
  new THREE.BoxGeometry( 10 , 10 , 10 ),
  new THREE.MeshStandardMaterial({color: "rgba(255, 0, 212, 1)" })
);
hiddenHomeBox.position.set( 0, 35 , 0 ); 



/*
controll buttons
*/
const box1 = new THREE.Mesh(
  new THREE.BoxGeometry(1 ,1,1),
  new THREE.MeshStandardMaterial({color: "rgba(249, 242, 244, 1)" })
);
box1.position.set(-5, -5,-10); 
box1.rotation.set(5,0,0);
box1.userData.tags = ["clickable", "box"];
camera.add(box1);

const box2 = new THREE.Mesh(
  new THREE.BoxGeometry(1 ,1,1),
  new THREE.MeshStandardMaterial({color: "rgba(249, 242, 244, 1)" })
);
box2.position.set(0, -5,-10); 
box2.rotation.set(5,0,0);
box2.userData.tags = ["clickable", "box"];
camera.add(box2);

const box3 = new THREE.Mesh(
  new THREE.BoxGeometry(1 ,1,1),
  new THREE.MeshStandardMaterial({color: "rgba(249, 242, 244, 1)" })
);
box3.position.set(5, -5,-10); 
box3.rotation.set(5,0,0);
box3.userData.tags = [ "clickable" , "box" ];
camera.add(box3);




/*
Button locations boxes
*/
const box4 = new THREE.Mesh(
  new THREE.BoxGeometry( 3 , 3 , 3 ),
  new THREE.MeshStandardMaterial({color: "rgba(0, 221, 255, 1)" })
);
box4.position.set(-50, 30, 0);
scene.add(box4);



/*
Just some random 3d objects
*/
const torus = new THREE.Mesh( 
  new THREE.TorusGeometry( 10, 3, 16, 100 ),  
  new THREE.MeshStandardMaterial( {color: "rgba(218, 10, 59, 1)" } )
);
torus.position.y += 15;
torus.userData.tags = [ "clickable", "scroll" ];
scene.add(torus)

const sphere = new THREE.Mesh(
  new THREE.SphereGeometry( 4, 40 ), 
  new THREE.MeshStandardMaterial( {color: "rgb(41, 191, 36)" } )
);
sphere.position.set( 40, 40, 0 );
sphere.userData.tags = [ "clickable", "scroll" ];
scene.add(sphere);




/*
Lights and stuff
*/
const pointLight = new THREE.PointLight(0xffffff, 10);
pointLight.position.set( 0, 16, 0 );
const directionalLight = new THREE.DirectionalLight(0xffffff);
directionalLight.position.set( 0 , 60 , 0);
directionalLight.target.position.copy( sphere.position );
const ambientLight = new THREE.AmbientLight(0xffffff, 0.05);


const lightHelper = new THREE.DirectionalLightHelper(directionalLight)
scene.add(pointLight, directionalLight, ambientLight);
scene.add(lightHelper)

const scrollableObjects = [];
scene.traverse((object) => {

  if (object.userData?.tags?.includes("scroll")) {
    scrollableObjects.push(object);
  }
});












const starGeometry = new THREE.SphereGeometry( 0.25, 24, 24 );
const starMaterial = new THREE.MeshStandardMaterial( { color: "rgba(113, 240, 240, 1)" } );
function addStar( a ) {
  const star = new THREE.Mesh( starGeometry , starMaterial );

  const [x,y,z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread( a ) );

  star.position.set(x, y, z);
  scene.add(star);
}
Array(400).fill().forEach(() => addStar( 300 ));


const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let hovered = null;
window.addEventListener('mousemove', (event) => {
  mouse.x = (event.clientX/window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY/ window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse,camera);
  const intersects = raycaster.intersectObjects(scene.children, true);

  if (intersects.length > 0) {
    const target = intersects[0].object;

    if (target.userData?.tags?.includes( "clickable" )) {
      if (hovered !== target) {
        if (hovered !== null){
          hovered.material.emissive.set(0x000000);
        }
        hovered = target;
        hovered.material.emissive.set(0x999999);
      }
    }else if (hovered !== null){
      hovered.material.emissive.set(0x000000);
      hovered = null;
    }
  }else{
    if (hovered !== null){
      hovered.material.emissive.set(0x000000);
      hovered = null;
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
      }else{
        moveSet(target);
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
  }


  scrollTargetY = THREE.MathUtils.clamp(scrollTargetY, -50, 150);
  scrollCurrentY = THREE.MathUtils.lerp(scrollCurrentY, scrollTargetY, 0.1);
  if (scrollable){
    objTarget.position.y = scrollCurrentY;
  }
  if (rSmall_1?.rotation && rBig_1?.rotation){
    rSmall_1.rotation.y += 0.02;
    rSmall_1.rotation.x += 0.01;
    rBig_1.rotation.y -= 0.02;
    rBig_1.rotation.x -= 0.01;
  };
  torus.rotation.y += 0.01;
  sphere.rotation.y += 0.01;

  /*controls.update();*/

  renderer.render( scene, camera );
}

animate()