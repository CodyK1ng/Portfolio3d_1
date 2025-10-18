



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
}
