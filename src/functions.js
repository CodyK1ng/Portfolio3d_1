import * as THREE from 'three';



export function CameraDirOff(Direction = 'jupiter', offset){
  if (Direction === 'left' ){
    offset.x += -1;
    offset.z = 0;
    return offset;
  }else if (Direction === 'right' ){
    offset.x += 1;
    offset.z = 0;
    return offset;
  }else if (Direction === "jupiter" ) {
    console.log("jupiter is acending");
    return offset;
  
  }else if (Direction === null){
    console.log("cameraDirOff = null");
    return offset;
  }
  else{
    console.log("CameraDirOff not working");
    return offset;
  }
};


export function buttonRingRots(InnerRing , OuterRing, bRingsRot = 'spin'){
  if (bRingsRot === 'spin'){
    if (InnerRing?.rotation && OuterRing?.rotation){
      InnerRing.rotation.y += 0.02;
      InnerRing.rotation.x += 0.01;
      OuterRing.rotation.y -= 0.01;
      OuterRing.rotation.x -= 0.01;
    }; 
  }else if (bRingsRot === 'stop'){
    if (InnerRing?.rotation && OuterRing?.rotation) {
      InnerRing.rotation.x *= 0.97;
      // InnerRing.rotation.y *= 0.9;
      OuterRing.rotation.x *= 0.97;
      // OuterRing.rotation.y *= 0.9;
    };

  }else{
    return
  }
};



export function addStar( a , scene) {
  const starGeometry = new THREE.SphereGeometry( 0.25, 24, 24 );
  const starMaterial = new THREE.MeshStandardMaterial( { color: "rgba(113, 240, 240, 1)" } );
  const star = new THREE.Mesh( starGeometry , starMaterial );

  const [x,y,z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread( a ) );

  star.position.set(x, y, z);
  scene.add(star);
}

export function addGeometry(type, colour , x , y , z, size = 1){
  let geometry;
  switch (type){
    case "sphere":
      geometry = new THREE.SphereGeometry( 4 * size, 40 * size, 40 * size);
      break;
    case "box":
      geometry = new THREE.BoxGeometry( 4 * size, 4 * size, 4 * size);
      break;
    case "torus":
      geometry = new THREE.TorusGeometry( 3 * size, 1 * size, 16 * size, 100);
      break;
  };
  const meshes = new THREE.Mesh(
    geometry,
    new THREE.MeshStandardMaterial( {color: colour } )
  );
  meshes.position.set( x, y, z );
  if (type === "box"){
    meshes.userData.tags = [ "clickable", "box" ];
  }else{
    meshes.userData.tags = [ "clickable", "scroll" ];
  };
  return meshes;
};


export function rotBuildGuards(inner, outer){


};