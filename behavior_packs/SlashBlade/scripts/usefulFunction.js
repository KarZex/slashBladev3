import { world, system, Entity  } from "@minecraft/server";

//world.getEntity(`a`).getVelocity()

export function absVector3( V ){
    let abs_x = V.x * V.x;
    let abs_y = V.y * V.y;
    let abs_z = V.z * V.z;
    return Math.sqrt(abs_x + abs_y + abs_z)
}

export function DistanceVector3( V1,V2 ){
    let distance_x = (V2.x - V1.x) * (V2.x - V1.x);
    let distance_y = (V2.y - V1.y) * (V2.y - V1.y);
    let distance_z = (V2.z - V1.z) * (V2.z - V1.z)
    return Math.sqrt(distance_x + distance_y + distance_z)
}

export function isMoving(user){
    const v = user.getVelocity();
    return (absVector3(v) > 0.01)
}
