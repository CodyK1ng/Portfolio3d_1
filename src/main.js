import './style.css'
import * as THREE from 'three';
import { ThreeMFLoader } from 'three/examples/jsm/Addons.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { textureLoad } from 'three/tsl';


const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector( '#bg' ),
});


const cameraHome = { x: 0, y: 40, z: 100 };
camera.position.copy( cameraHome );
camera.rotation.set( -.1, 0, 0 );
const cameraHomeRot = new THREE.Quaternion().copy(camera.quaternion);


renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.render( scene, camera );

const torGeometry = new THREE.TorusGeometry( 10, 3, 16, 100 )
torGeometry.center();
const torMaterial = new THREE.MeshStandardMaterial( {color: "rgba(218, 10, 59, 1)" } );
const torus = new THREE.Mesh( torGeometry, torMaterial );
torus.position.y += 15;
torus.userData.tags = [ "clickable", "Scroll" ];
scene.add(torus)

const sphGeometry = new THREE.SphereGeometry( 4, 40 )
const sphMaterial = new THREE.MeshStandardMaterial( {color: "rgb(41, 191, 36)" } )
const sphere = new THREE.Mesh(sphGeometry, sphMaterial);
sphere.position.set( 40, 40, 0 );
sphere.userData.tags = [ "clickable", "Scroll" ];
scene.add(sphere);



const pointLight = new THREE.PointLight(0xffffff, 10)
pointLight.position.set( 0, 16, 0 )
const ambientLight = new THREE.AmbientLight(0xffffff)
scene.add(pointLight, ambientLight)


const lightHelper = new THREE.PointLightHelper(pointLight)
const gridHelper = new THREE.GridHelper(200, 50);
scene.add(lightHelper, gridHelper)

/* const controls = new OrbitControls(camera, renderer.domElement); */
const scrollableObjects = [];
scene.traverse((object) => {

  if (object.userData?.tags?.includes("Scroll")) {
    scrollableObjects.push(object);
  }
});












const starGeometry = new THREE.SphereGeometry( 0.25, 24, 24 );
const starMaterial = new THREE.MeshStandardMaterial( { color: "rgba(113, 240, 240, 0.83)" } );
function addStar( a ) {
  const star = new THREE.Mesh( starGeometry , starMaterial );

  const [x,y,z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread( a ) );

  star.position.set(x, y, z);
  scene.add(star);
}
Array(400).fill().forEach(() => addStar( 300 ));






const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
window.addEventListener( 'click', (event) => {
  mouse.x = (event.clientX/window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY/ window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse,camera);
  const intersects = raycaster.intersectObjects(scene.children);
  console.log("clicked")
  
  if (intersects.length > 0) {
    
    const target = intersects[0].object;
    
    if ((target.userData?.tags?.includes( "clickable" ) || !camera.position.equals(cameraHome)) && !moving) {
      const target = intersects[0].object;
      moveCameraTo(target.position.clone());

    }
    
  }else {
    if (!camera.position.equals(cameraHome) && !moving) {
      moveCameraTo(cameraHome.position);
    }
  }
  
});


let targetCamPos = new THREE.Vector3();
let moving = false;
let newLook = false;
function moveCameraTo(targetPosition) {
  scrollable = false;
  if (camera.position.equals(cameraHome)) {
    const offset = new THREE.Vector3();
    camera.getWorldDirection(offset);
    targetCamPos.copy(targetPosition).addScaledVector(offset, -20);
    newLook = true;
    moving = true;
  }else {
    targetCamPos.set(cameraHome.x, cameraHome.y, cameraHome.z);
    newLook = false;
    moving = true;
  }
}


let scrollable = false;
let scrollTargetY = camera.position.y;
let scrollCurrentY = camera.position.y;


window.addEventListener( 'wheel', (event) => {
  if (scrollable){
    for (const obj of scrollableObjects) {
      obj.position.y += event.deltaY * 0.01;
    }
  }
});










function animate() {
  requestAnimationFrame( animate );

  if(moving) {
    camera.position.lerp(targetCamPos, 0.02);
    if (newLook){
      const targetLook = new THREE.Vector3(
        targetCamPos.x ,
        targetCamPos.y ,
        targetCamPos.z + 10
      );
      const dummy = new THREE.Object3D();
      dummy.position.copy(targetCamPos);
     
      dummy.lookAt(targetLook);

      camera.quaternion.slerp(dummy.quaternion, 0.001);
    }else {
      camera.quaternion.slerp(cameraHomeRot, 0.001);
    }

    if (camera.position.distanceTo(targetCamPos) <= .01) {
      moving = false;
      console.log("done moving")
      scrollable = true;
      if (!newLook){
        camera.position.copy(targetCamPos);
        scrollable = false;
      }
    }else{
      console.log(
      "CAM:", camera.position,
      "TARGET:", targetCamPos,
      "distance", camera.position.distanceTo(targetCamPos)
      );
    }
  }


  scrollTargetY = THREE.MathUtils.clamp(scrollTargetY, -50, 150);
  scrollCurrentY = THREE.MathUtils.lerp(scrollCurrentY, scrollTargetY, 0.1);
  /*camera.position.y = scrollCurrentY;*/


  torus.rotation.y += 0.01;
  sphere.rotation.y += 0.01;

  /*controls.update();*/

  renderer.render( scene, camera );
}

animate()