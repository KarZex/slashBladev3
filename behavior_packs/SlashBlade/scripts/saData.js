import { world, system, EquipmentSlot, EntityComponentTypes, TicksPerSecond, ItemComponentTypes,EnchantmentType  } from "@minecraft/server";
import { ActionFormData, ModalFormData } from "@minecraft/server-ui";
import { bladeData } from "./blade";
import { bladeImmuneEntities} from "./config"
import { summonBladeShadow3,rangeAttack } from "./attacks"
import { callDamage,Vector2Sub,getVector3E,absVector3 } from "./usefulFunction"
 
//const dimension = world.getDimension(`overworld`);

export class drive {
  cost = 10
  damage = 6;
  fireSa( blade, user ){
    //user.dimension.playSound(`swingblade.sab`,user.location,{ pitch:1, volume:3 });
    const power = 0.1;
    const O = user.location;
    const V = user.getViewDirection();
    const FirePos = {
      x: O.x,
      y: O.y + 1.62,
      z: O.z 
    }
    const shootView = {
      x: V.x * power,
      y: V.y * power,
      z: V.z * power 
    }
    const fire = user.dimension.spawnEntity(`safire:drive`,FirePos);
    fire.getComponent(`minecraft:projectile`).owner = user;
    fire.setDynamicProperty(`color`,bladeData[`${blade.typeId.split(`:`)[1]}`][`color`]);
    fire.setDynamicProperty(`dmg`,bladeData[`${blade.typeId.split(`:`)[1]}`][`damage`]);
    fire.setDynamicProperty(`rotate`,user.getRotation().y)
    //fire.setRotation({y:user.getRotation().y,x:0});
    fire.getComponent(`minecraft:projectile`).shoot( shootView );
    user.dimension.playSound(`mob.wither.hurt`,O,{ pitch:0.55, volume:3 });
    //fire.setRotation({y:user.getRotation().y,x:0});
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
      fire.setDynamicProperty(`zex:owner`,user.id);
      user.dimension.playSound(`mob.wither.hurt`,O,{ pitch:0.55, volume:3 });
    }
    else{
      const fire = user.dimension.spawnEntity(`safire:slashdim`,O);
      fire.setDynamicProperty(`zex:owner`,user.id);
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
    //world.scoreboard.getObjective(`around`).setScore(user,10);
    const d = user.getViewDirection();
    const abs_v = 4;
    user.applyKnockback({x:abs_v*d.x,z:abs_v*d.z},0);
  }
}

export class circleslash {
  cost = 20
  damage = 6
  fireSa( blade, user ){
    //user.dimension.playSound(`mob.wither.hurt`,O,{ pitch:0.55, volume:3 });
    let FirePos = user.location;
    user.dimension.playSound(`mob.wither.hurt`,FirePos,{ pitch:0.55, volume:3 });
    const viewLocation = user.getViewDirection();
    print(`${blade.typeId.split(`:`)[1]}`)
    const color = bladeData[`${blade.typeId.split(`:`)[1]}`]["color"];
    FirePos.y = FirePos.y + 1;
    //user.dimension.spawnParticle(`zex:fire_spiral_particle`,user.location);
    for( let i = 0; i < 6; i++ ){
      let Rotate = user.getRotation().y+60*i;
      if( Rotate >= 180 ){
        Rotate = Rotate - 360;
      }
      
      const pos = {
        x:user.location.x + 3*Math.cos(2*Math.PI*Rotate/360),
        y:user.location.y,
        z:user.location.z + 3*Math.sin(2*Math.PI*Rotate/360)
      }
      summonBladeShadow3(pos,Rotate,user.dimension,color,150);
    }
    const level = world.scoreboard.getObjective(`blade`).getScore(user);
    let damage = callDamage( blade,level ) * 2;
    const victims = user.dimension.getEntities({location:user.location,maxDistance:6,excludeTypes:bladeImmuneEntities,excludeNames:[ user.nameTag ] });
    if( victims.length > 0 ){
      //setBladeDamage(1,user);
      for( let i = 0; i < victims.length; i++ ){
        if( victims[i].nameTag != user.nameTag ){
          try{
            //victims[i].applyKnockback({ x:0,z:0 },0);
            const P0 = user.location;
            const Pi = victims[i].location;
            const abs_v = 6;
            const d = getVector3E(Vector2Sub(P0,Pi));
            victims[i].applyKnockback({ x:abs_v*d.x,z:abs_v*d.z },2);
          }
          catch{}
          victims[i].applyDamage( damage,{ cause:`override`,damagingEntity:user });
          world.scoreboard.getObjective(`blade`).addScore(user,7 * ( 1 + 0.5 * 1));
          //victims[i].setOnFire(10);
        }
      }
    }
  }
}
export class fire_spiral {
  cost = 20
  damage = 2
  fireSa( blade, user ){
    //user.dimension.playSound(`mob.wither.hurt`,O,{ pitch:0.55, volume:3 });
    let FirePos = user.location;
    user.dimension.playSound(`mob.wither.hurt`,FirePos,{ pitch:0.55, volume:3 });
    const viewLocation = user.getViewDirection();
    FirePos.y = FirePos.y + 1;
    user.dimension.spawnParticle(`zex:fire_spiral_particle`,user.location);
    for( let i = 0; i < 6; i++ ){
      let Rotate = user.getRotation().y+60*i;
      if( Rotate >= 180 ){
        Rotate = Rotate - 360;
      }
      
      const pos = {
        x:user.location.x + 3*Math.cos(2*Math.PI*Rotate/360),
        y:user.location.y,
        z:user.location.z + 3*Math.sin(2*Math.PI*Rotate/360)
      }
      summonBladeShadow3(pos,Rotate,user.dimension,"red",150);
    }
    const level = world.scoreboard.getObjective(`blade`).getScore(user);
    let damage = callDamage( blade,level ) * 2;
    const victims = user.dimension.getEntities({location:user.location,maxDistance:6,excludeTypes:bladeImmuneEntities,excludeNames:[ user.nameTag ] });
    if( victims.length > 0 ){
      //setBladeDamage(1,user);
      for( let i = 0; i < victims.length; i++ ){
        if( victims[i].nameTag != user.nameTag ){
          try{
            //victims[i].applyKnockback({ x:0,z:0 },0);
            const P0 = user.location;
            const Pi = victims[i].location;
            const abs_v = 6;
            const d = getVector3E(Vector2Sub(P0,Pi));
            victims[i].applyKnockback({ x:abs_v*d.x,z:abs_v*d.z },2);
          }
          catch{}
          victims[i].applyDamage( damage,{ cause:`override`,damagingEntity:user });
          world.scoreboard.getObjective(`blade`).addScore(user,7 * ( 1 + 0.5 * 1));
          victims[i].setOnFire(10);
        }
      }
    }
  }
}

export class waveedge {
  cost = 20
  damage = 6
  async fireSa( blade, user ){
    user.dimension.playSound(`mob.wither.hurt`,user.location,{ pitch:0.55, volume:3 });
    const viewLocation = user.getViewDirection();
    const color = bladeData[`${blade.typeId.split(`:`)[1]}`]["color"];
    const R = (user.getRotation().y * Math.PI / 180) + Math.PI/2;
    const O = user.location;

    for( let i = 0; i < 8; i++ ){
      let a = (0.05 * (i + 1));
      let FirePos = {
        x:O.x + 4 * i *  Math.cos(R),
        y:O.y,
        z:O.z + 4 * i *  Math.sin(R)
      }
      const level = world.scoreboard.getObjective(`blade`).getScore(user);
      const damage = callDamage( blade,level ) / 2;
      const victims = user.dimension.getEntities({location:FirePos,maxDistance:3,excludeTypes:bladeImmuneEntities,excludeNames:[ user.nameTag ] });
      if( victims.length > 0 ){
        //setBladeDamage(1,user);
        for( let i = 0; i < victims.length; i++ ){
          if( victims[i].nameTag != user.nameTag ){
            victims[i].applyDamage( damage,{ cause:`override`,damagingEntity:user });
            world.scoreboard.getObjective(`blade`).addScore(user,7 * ( 1 + 0.5 * 1));
            try{
              victims[i].applyKnockback({ x: 1 *Math.cos(R),y:1.5,z: 1 *Math.sin(R)})
            }catch{}
          }
        }
      }

      summonBladeShadow3(FirePos,user.getRotation().y,user.dimension,color,30);
      await system.waitTicks(5);
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
  async fireSa( blade, user ){
    const pos = user.getViewDirection();
    const rotatey = user.getRotation().y * Math.PI / 180;
    const range = 5;
    const O = { x:user.location.x,y:user.location.y + 1.5,z:user.location.z };
    //let entities = [];
    for( let i = 0; i < 8; i++ ){
      const pos2 = user.getViewDirection();
      const fireLocation = { x:O.x + Math.sin(rotatey+2*(0.5-i%2)*(Math.PI/2)),y:O.y - 0.2 * Math.floor(i/2)  ,z:O.z + Math.cos(rotatey+2*(0.5-i%2)*(Math.PI/2)) }
      user.dimension.playSound(`mob.endermen.portal`,fireLocation,{ pitch:1.5, volume:3 });
      const fire = user.dimension.spawnEntity(`safire:summonedsword`,fireLocation,{ spawnEvent:`zex:projectile` });
      const color = bladeData[`${blade.typeId.split(`:`)[1]}`]["color"];
      fire.triggerEvent(`${color}`);
      fire.getComponent(`minecraft:projectile`).owner = user;
      fire.getComponent(`minecraft:projectile`).shoot( pos2 );
      await system.waitTicks(1);
      fire.addTag(`lighting_swords`);
      fire.setDynamicProperty(`damage`,2);
      //entities.push(fire);
    }
  }
}

export class explode_swords {
  cost = 10
  async fireSa( blade, user ){
    const pos = user.getViewDirection();
    const rotatey = user.getRotation().y * Math.PI / 180;
    const range = 5;
    const O = { x:user.location.x,y:user.location.y + 1.5,z:user.location.z };
    //let entities = [];
    for( let i = 0; i < 8; i++ ){
      const pos2 = user.getViewDirection();
      const fireLocation = { x:O.x + Math.sin(rotatey+2*(0.5-i%2)*(Math.PI/2)),y:O.y - 0.2 * Math.floor(i/2)  ,z:O.z + Math.cos(rotatey+2*(0.5-i%2)*(Math.PI/2)) }
      user.dimension.playSound(`mob.endermen.portal`,fireLocation,{ pitch:1.5, volume:3 });
      const fire = user.dimension.spawnEntity(`safire:summonedsword`,fireLocation,{ spawnEvent:`zex:projectile` });
      const color = bladeData[`${blade.typeId.split(`:`)[1]}`]["color"];
      fire.triggerEvent(`${color}`);
      fire.getComponent(`minecraft:projectile`).owner = user;
      fire.getComponent(`minecraft:projectile`).shoot( pos2 );
      await system.waitTicks(1);
      fire.addTag(`explode_swords`);
      fire.setDynamicProperty(`damage`,2);
      //entities.push(fire);
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
    //user.dimension.playSound(`mob.wither.hurt`,O,{ pitch:0.55, volume:3 });
    let FirePos = user.location;
    user.dimension.playSound(`mob.wither.hurt`,FirePos,{ pitch:0.55, volume:3 });
    const viewLocation = user.getViewDirection();
    FirePos.y = FirePos.y + 1;
    user.dimension.spawnParticle(`zex:red_ring11`,user.location);
    user.dimension.spawnParticle(`zex:red_ring12`,user.location);
    for( let i = 0; i < 6; i++ ){
      let Rotate = user.getRotation().y+60*i;
      if( Rotate >= 180 ){
        Rotate = Rotate - 360;
      }
      
      const pos = {
        x:user.location.x + 3*Math.cos(2*Math.PI*Rotate/360),
        y:user.location.y,
        z:user.location.z + 3*Math.sin(2*Math.PI*Rotate/360)
      }
      summonBladeShadow3(pos,Rotate,user.dimension,"red",150);
    }
    const level = world.scoreboard.getObjective(`blade`).getScore(user);
    let damage = callDamage( blade,level ) * 2;
    let cs = 0;
    const victims = user.dimension.getEntities({location:user.location,maxDistance:6,excludeTypes:bladeImmuneEntities,excludeNames:[ user.nameTag ] });
    if( victims.length > 0 ){
      //setBladeDamage(1,user);
      for( let i = 0; i < victims.length; i++ ){
        if( victims[i].nameTag != user.nameTag ){
          victims[i].applyDamage( damage,{ cause:`override`,damagingEntity:user });
          world.scoreboard.getObjective(`blade`).addScore(user,7 * ( 1 + 0.5 * 1));
          victims[i].setOnFire(10);
          cs += 1;
        }
      }
      print(`${cs}`);
      user.addEffect(`health_boost`,600,{ amplifier: Math.floor(cs) });
      user.addEffect(`regeneration`,20,{ amplifier: Math.floor(cs*damage) });
    }
  }
}

export const classReg = {
  drive,
  slashdimension,
  vdrive,
  spear,
  circleslash,
  fire_spiral,
  waveedge,
  fireup,
  lighting_swords,
  explode_swords,
  water_drive,
  absorb
}