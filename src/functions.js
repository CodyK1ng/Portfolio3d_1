



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
  const lerpSpeed = .1;
  if (bRingsRot === 'spin'){
    if (InnerRing?.rotation && OuterRing?.rotation){
      InnerRing.rotation.y += 0.02;
      InnerRing.rotation.x += 0.01;
      OuterRing.rotation.y -= 0.01;
      OuterRing.rotation.x -= 0.01;
    }; 
  }else if (bRingsRot === 'stop'){
    if (InnerRing?.rotation && OuterRing?.rotation) {
      InnerRing.rotation.x *= 0.9;
      InnerRing.rotation.y *= 0.9;
      OuterRing.rotation.x *= 0.9;
      OuterRing.rotation.y *= 0.9;
    };

  }else{
    return
  }
  

};