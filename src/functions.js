



export function CameraDirOff(Direction, offset){
  if (Direction === 'left' ){
    offset.x += -1;
    offset.z = 0;
    console.log("left is firing");
    return offset;
  }else if (Direction === 'right' ){
    offset.x += 1;
    offset.z = 0;
    console.log("right is firing (its' no doing anything yet");
    return offset;
  }else if (Direction === "jupiter" ) {
    console.log("jupiter is acending");
    return offset;
  }else{
    console.log("CameraDirOff not working");
    return offset;
  }
}
