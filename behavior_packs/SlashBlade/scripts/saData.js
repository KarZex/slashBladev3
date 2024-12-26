import { world, system, EquipmentSlot, EntityComponentTypes, TicksPerSecond, ItemComponentTypes,EnchantmentType  } from "@minecraft/server";
import { ActionFormData, ModalFormData } from "@minecraft/server-ui";
import { bladeData } from "./blade";

export class drive {
  cost = 10
  fireSa( blade, user ){
    user.playSound(`swingblade.sab`);
    let FirePos = user.location
    FirePos.y = FirePos.y + 1.125
    const fire = user.dimension.spawnEntity(`fire:airblade`,FirePos);
    fire.getComponent(`minecraft:projectile`).owner = user
    fire.getComponent(`minecraft:projectile`).shoot( user.getViewDirection() );
  }
}

export class slashdimension {
  cost = 10
  fireSa( blade, user ){
    const pos = user.getViewDirection()
    const range = 4;
    const O = {x:user.location.x + range * pos.x,y:user.location.y + 1.5 + range * pos.y,z:user.location.z + range * pos.z};
    const victims = user.dimension.getEntities({location:O,maxDistance:6})
    user.dimension.spawnParticle(`zex:slashdimension_particle`,O);
    if( victims.length > 1 ){
      for( let i = 0; i < victims.length; i++ ){
        if( victims[i].nameTag != user.nameTag ){
          victims[i].applyDamage( 3,{ cause:`entityAttack`,damagingEntity:user });
          victims[i].teleport(O); 
        }
      }
    }
    user.playSound(`swingblade.sab`);
  }
}

export class vdrive {
  cost = 10
  fireSa( blade, user ){
    user.playSound(`swingblade.sab`);
    let FirePos = user.location
    FirePos.y = FirePos.y + 1.125
    const fire = user.dimension.spawnEntity(`fire:vdrive`,FirePos);
    fire.getComponent(`minecraft:projectile`).owner = user
    fire.getComponent(`minecraft:projectile`).shoot( user.getViewDirection() );
  }
}

export const classReg = {
  drive,
  slashdimension,
  vdrive
}