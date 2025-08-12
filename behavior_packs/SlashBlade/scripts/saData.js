import { world, system, EquipmentSlot, EntityComponentTypes, TicksPerSecond, ItemComponentTypes,EnchantmentType  } from "@minecraft/server";
import { ActionFormData, ModalFormData } from "@minecraft/server-ui";
import { bladeData } from "./blade";
import { bladeImmuneEntities} from "./config"

const dimension = world.getDimension(`overworld`);

export class drive {
  cost = 10
  damage = 6;
  fireSa( blade, user ){
    user.dimension.playSound(`swingblade.sab`,user.location,{ pitch:1, volume:3 });
    const power = 0.1;
    const O = user.location;
    const V = user.getViewDirection();
    const FirePos = {
      x: O.x,
      y: O.y + 1.125,
      z: O.z 
    }
    const shootView = {
      x: V.x * power,
      y: V.y * power,
      z: V.z * power 
    }
    const fire = user.dimension.spawnEntity(`safire:drive`,FirePos);
    fire.getComponent(`minecraft:projectile`).owner = user
    fire.getComponent(`minecraft:projectile`).shoot( shootView );
  }
}

export class slashdimension {
  cost = 10
  fireSa( blade, user ){
    const pos = user.getViewDirection()
    const range = 5;
    const O = {
      x:user.location.x + range * pos.x,
      y:user.location.y + 1.62 + range * pos.y,
      z:user.location.z + range * pos.z
    };
		const victims = user.dimension.getEntities({location:O,maxDistance:19,excludeTypes:bladeImmuneEntities });
    if( victims.length > 0 && victims[0].nameTag != user.nameTag ){
      const attackPos = victims[0].location;
      const fire = user.dimension.spawnEntity(`safire:slashdim`,{ x:attackPos.x,y:attackPos.y+1,z:attackPos.z });
			world.scoreboard.getObjective(`printlevel`).setScore(user,100);
      fire.setDynamicProperty(`zex:owner`,user.nameTag);
      user.dimension.playSound(`mob.wither.hurt`,O,{ pitch:0.55, volume:3 });
    }
    else{
      const fire = user.dimension.spawnEntity(`safire:slashdim`,O);
      fire.setDynamicProperty(`zex:owner`,user.nameTag);
      user.dimension.playSound(`mob.wither.hurt`,O,{ pitch:0.55, volume:3 });
    }
  }
}

export class vdrive {
  cost = 10
  damage = 6
  fireSa( blade, user ){
    user.playSound(`swingblade.sab`);
    const power = 0.1;
    const O = user.location;
    const V = user.getViewDirection();
    const FirePos = {
      x: O.x,
      y: O.y + 1.125,
      z: O.z 
    }
    const shootView = {
      x: V.x * power,
      y: V.y * power,
      z: V.z * power 
    }
    const fire = user.dimension.spawnEntity(`safire:vdrive`,FirePos);
    fire.getComponent(`minecraft:projectile`).owner = user
    fire.getComponent(`minecraft:projectile`).shoot( shootView );
  }
}

export class spear {
  cost = 10
  fireSa( blade, user ){
    user.playSound(`random.explode`);
    world.scoreboard.getObjective(`around`).setScore(user,10);
    const d = user.getViewDirection();
    user.applyKnockback(d.x,d.z,4,0)
  }
}

export class circleslash {
  cost = 20
  damage = 6
  fireSa( blade, user ){
    user.playSound(`swingblade.sab`);
    let FirePos = user.location;
    const viewLocation = user.getViewDirection();
    FirePos.y = FirePos.y + 1;
    for( let i = 0; i < 6; i++ ){
      let shot = { 
        x:(Math.cos(i * Math.PI / 3) * viewLocation.x - Math.sin(i * Math.PI / 3) * viewLocation.z)*0.1,
        y:0,
        z:(Math.sin(i * Math.PI / 3) * viewLocation.x + Math.cos(i * Math.PI / 3) * viewLocation.z)*0.1
      };
      const fire = user.dimension.spawnEntity(`safire:drive`,FirePos);
      fire.getComponent(`minecraft:projectile`).owner = user
      fire.getComponent(`minecraft:projectile`).shoot( shot );
    }
  }
}
export class flamethrower {
  cost = 20
  damage = 2
  fireSa( blade, user ){
    user.playSound(`swingblade.sab`);
    let FirePos = user.location;
    const viewLocation = user.getViewDirection();
    FirePos.y = FirePos.y + 1;
    for( let i = 0; i < 16; i++ ){
      const fire = user.dimension.spawnEntity(`safire:flamethrower`,FirePos);
      fire.getComponent(`minecraft:projectile`).owner = user
      fire.getComponent(`minecraft:projectile`).shoot( viewLocation,{  uncertainty:8 } );
    }
  }
}

export class waveedge {
  cost = 20
  damage = 6
  fireSa( blade, user ){
    user.playSound(`swingblade.sab`);
    let FirePos = user.location;
    const viewLocation = user.getViewDirection();
    FirePos.y = FirePos.y + 1;
    for( let i = 0; i < 4; i++ ){
      let a = (0.05 * (i + 1));
      let shot = {
        x:viewLocation.x * a,
        y:viewLocation.y * a,
        z:viewLocation.z * a
      }
      const fire = user.dimension.spawnEntity(`safire:vdrive`,FirePos);
      fire.getComponent(`minecraft:projectile`).owner = user
      fire.getComponent(`minecraft:projectile`).shoot( shot,{  uncertainty:0 } );
    }
  }
}

export class fireup {
  cost = 10
  fireSa( blade, user ){
    user.playSound(`swingblade.sab`);
    world.scoreboard.getObjective(`blade`).addScore(user,10);
    user.dimension.spawnParticle(`minecraft:totem_particle`,user.location);
    user.addEffect(`minecraft:strength`,100,{ amplifier:1 });
  }
}

export class lighting_swords {
  cost = 10
  fireSa( blade, user ){
    const pos = user.getViewDirection()
    const range = 5;
    const O = {x:user.location.x + range * pos.x,y:user.location.y + 1.5 + range * pos.y,z:user.location.z + range * pos.z};
    const victims = user.dimension.getEntities({location:O,maxDistance:19,excludeTypes:bladeImmuneEntities,closest:1 });
    if( victims.length > 0 ){
      const attackPos = victims[0].location;
      user.dimension.spawnEntity(`minecraft:lightning_bolt`,attackPos);
      victims[0].applyDamage( 6,{ cause:`entityAttack`,damagingEntity:user });
      user.dimension.spawnParticle(`zex:slashdimension_particle`,attackPos);
      user.playSound(`swingblade.sab`);
    }
    else{
      user.dimension.spawnParticle(`zex:slashdimension_particle`,O);
      user.playSound(`swingblade.sab`);
    }
  }
}

export class water_drive {
  cost = 10
  fireSa( blade, user ){
    user.playSound(`random.explode`);
    world.scoreboard.getObjective(`around`).setScore(user,10);
    const d = user.getViewDirection();
    user.applyKnockback(d.x,d.z,4,0);
  }
}

export class absorb {
  cost = 10
  damage = 6
  async fireSa( blade, user ){
    user.playSound(`swingblade.sab`);
    let FirePos = user.location
    FirePos.y = FirePos.y + 1.125
    for( let i = 0; i < 5; i++ ){
      const fire = user.dimension.spawnEntity(`safire:absorb`,FirePos);
      fire.getComponent(`minecraft:projectile`).owner = user
      fire.getComponent(`minecraft:projectile`).shoot( user.getViewDirection() );
      await system.waitTicks(1);
    }
  }
}

export const classReg = {
  drive,
  slashdimension,
  vdrive,
  spear,
  circleslash,
  flamethrower,
  waveedge,
  fireup,
  lighting_swords,
  water_drive,
  absorb
}