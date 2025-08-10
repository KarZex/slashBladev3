import { world, system, Entity,ItemComponentTypes  } from "@minecraft/server";
import { bladeData } from "./blade";
import { bladeImmuneEntities } from "./config"
import { print,isMoving,isSpeedMoving,setBladeDamage,callDamage,playBladeSound } from "./usefulFunction"

//Attacks

export function summonBladeShadow(user,color,thita){
    const spawn = user.dimension.spawnEntity(`zex:bladeshadow`,user.location);
    spawn.triggerEvent(`${color}`);
    spawn.setProperty(`zex:rotate`,thita);
    spawn.setRotation({y:user.getRotation().y,x:0});
}

export function rangeAttack(user,damage,knockback,knockbackpower,range,Isfire,combo){
    const victims = user.dimension.getEntities({location:user.location,maxDistance:range,excludeTypes:bladeImmuneEntities });
	if( victims.length > 1 ){
		setBladeDamage(1,user);
		for( let i = 0; i < victims.length; i++ ){
			if( victims[i].nameTag != user.nameTag ){
				try{
					victims[i].applyDamage( damage,{ cause:`override`,damagingEntity:user });
					victims[i].applyKnockback(0,0,0,0);
				}
				catch{}
				if(knockback == true){
					victims[i].applyKnockback(user.getViewDirection().x,user.getViewDirection().z,2,knockbackpower);
					victims[i].dimension.spawnParticle(`minecraft:critical_hit_emitter`,{x:victims[i].location.x,y:victims[i].location.y+1,z:victims[i].location.z});
				}
				world.scoreboard.getObjective(`blade`).addScore(user,7 * ( 1 + 0.5 * combo));
				if( Isfire ){
					victims[i].setOnFire(5);
				}
			}
		}
	}
	else{
	}
}

export async function bladeCombo( user,blade,IsOnGround,sound,color ){
	const bladeItemEnch = blade.getItem().getComponent(ItemComponentTypes.Enchantable);
	const level = world.scoreboard.getObjective(`blade`).getScore(user);
	let d = callDamage( blade,level );
	const victims = user.dimension.getEntities({location:user.location,maxDistance:5,excludeTypes:bladeImmuneEntities });
	let knockback = false;
	let knockbackpower = 0.5;
	let comboG = 0;
	let sound2 = `item.trident.throw`
	let sound2Pitch = 0.7;
	if( sound != `swingblade.c` ){
		sound2 = sound;
		sound2Pitch = 1;
	}
	if(IsOnGround == true){
		world.scoreboard.getObjective(`groundcomboA`).addScore(user,1);
		const combo = world.scoreboard.getObjective(`groundcomboA`).getScore(user);
		comboG = combo;
		if( combo == 1 ){
    		user.dimension.playSound( sound,user.location,{ pitch:1, volume:3 });
			const spawn = user.dimension.spawnEntity(`zex:bladeshadow`,user.location);
			spawn.triggerEvent(`${color}`);
			spawn.triggerEvent(`1st`);
			spawn.setRotation({y:user.getRotation().y,x:0});
		}
		if( combo == 2 ){
    		user.dimension.playSound( sound,user.location,{ pitch:1, volume:3 });
			const spawn = user.dimension.spawnEntity(`zex:bladeshadow`,user.location);
			spawn.triggerEvent(`${color}`);
			spawn.triggerEvent(`2nd`);
			spawn.setRotation({y:user.getRotation().y,x:0});
		}
		if( combo >= 3 ){
    		user.dimension.playSound( sound2,user.location,{ pitch:sound2Pitch, volume:3 });
			const spawn = user.dimension.spawnEntity(`zex:bladeshadow`,user.location);
			spawn.triggerEvent(`${color}`);
			spawn.triggerEvent(`1st`);
			spawn.setRotation({y:user.getRotation().y,x:0});
			world.scoreboard.getObjective(`groundcomboA`).setScore(user,0);
			d = d * 1.5;
			user.dimension.spawnParticle(`minecraft:critical_hit_emitter`,{x:user.location.x,y:user.location.y+1,z:user.location.z});
			knockback = true;
		}
		world.scoreboard.getObjective(`combocool`).setScore(user,20);
	}
	else if(IsOnGround == false){
		user.addEffect(`slow_falling`,20,{ amplifier:1 });
		world.scoreboard.getObjective(`aircomboA`).addScore(user,1);
		const combo = world.scoreboard.getObjective(`aircomboA`).getScore(user);
		comboG = combo;
    	user.dimension.playSound( sound2,user.location,{ pitch:sound2Pitch, volume:3 });
		if( combo == 1 ){
			const spawn = user.dimension.spawnEntity(`zex:bladeshadow`,user.location);
			spawn.triggerEvent(`${color}`);
			spawn.triggerEvent(`1st`);
			spawn.setRotation({y:user.getRotation().y,x:0});
		}
		if( combo == 2 ){
			const spawn = user.dimension.spawnEntity(`zex:bladeshadow`,user.location);
			spawn.triggerEvent(`${color}`);
			spawn.triggerEvent(`2nd`);
			spawn.setRotation({y:user.getRotation().y,x:0});
		}
		if( combo == 3 ){
			user.applyKnockback(0,0,0,1);
			const spawn = user.dimension.spawnEntity(`zex:bladeshadow`,user.location);
			spawn.triggerEvent(`${color}`);
			spawn.triggerEvent(`3rd`);
			spawn.setRotation({y:user.getRotation().y,x:0});
			d = d * 1.2;
			user.dimension.spawnParticle(`minecraft:critical_hit_emitter`,{x:user.location.x,y:user.location.y+1,z:user.location.z});
			knockback = true;
			knockbackpower = 1;
		}
		else if( combo >= 4 ){
			world.scoreboard.getObjective(`aircomboA`).setScore(user,0);
			const spawn = user.dimension.spawnEntity(`zex:bladeshadow`,user.location);
			spawn.triggerEvent(`${color}`);
			spawn.triggerEvent(`4th`);
			spawn.setRotation({y:user.getRotation().y,x:0});
			d = d * 1.5;
			user.dimension.spawnParticle(`minecraft:critical_hit_emitter`,{x:user.location.x,y:user.location.y+1,z:user.location.z});
			knockback = true;
			knockbackpower = -1;
		}
		world.scoreboard.getObjective(`combocool`).setScore(user,20);
	}
	if( victims.length > 1 ){
		setBladeDamage(1,user);
		for( let i = 0; i < victims.length; i++ ){
			if( victims[i].nameTag != user.nameTag ){
				try{
					victims[i].applyDamage( d,{ cause:`override`,damagingEntity:user });
					victims[i].applyKnockback(0,0,0,0);
				}
				catch{}
				if(knockback == true){
					victims[i].applyKnockback(user.getViewDirection().x,user.getViewDirection().z,2,knockbackpower);
					victims[i].dimension.spawnParticle(`minecraft:critical_hit_emitter`,{x:victims[i].location.x,y:victims[i].location.y+1,z:victims[i].location.z});
				}
				world.scoreboard.getObjective(`blade`).addScore(user,7 * ( 1 + 0.5 * comboG));
				if( bladeItemEnch.hasEnchantment("minecraft:fire_aspect") ){
					victims[i].setOnFire(5);
				}
			}
		}
	}
	else{
	}
	world.scoreboard.getObjective(`printlevel`).setScore(user,100);
	let i = 0;
	while( true ){
		let nowLocation = {
			x:roundTo(user.location.x,2),
			y:roundTo(user.location.y,2),
			z:roundTo(user.location.z,2)
		}
		if( isMoving(user) ){
			break;
		}
		await system.waitTicks(1);
		i++;
		if( i > 20 ){
			const victims = user.dimension.getEntities({location:user.location,maxDistance:16,excludeTypes:bladeImmuneEntities,excludeNames:[ user.nameTag ] });
			if( victims.length > 1 ){
				world.scoreboard.getObjective(`printlevel`).setScore(user,100);
				world.scoreboard.getObjective(`blade`).addScore(user,32);
				user.playSound(`mob.blaze.shoot`);
				for( let i = 0; i < victims.length; i++ ){
					if( victims[i].nameTag != user.nameTag ){
						victims[i].addEffect(`speed`,600,{ amplifier:1 });
						victims[i].addEffect(`strength`,600,{ amplifier:1 });
						user.dimension.spawnParticle(`minecraft:bleach`,{x:victims[i].location.x,y:victims[i].location.y+1.8,z:victims[i].location.z});
						victims[i].applyDamage( 0.1,{ cause:`override`,damagingEntity:user });
					}
				}
			}
			break;
		}
	}
}


export async function bladeComboG1( user,blade,sound ){
    //pre
	const bladeItemEnch = blade.getItem().getComponent(ItemComponentTypes.Enchantable);
	const level = world.scoreboard.getObjective(`blade`).getScore(user);
    const color = bladeData[`${blade.typeId.split(`:`)[1]}`][`color`];
	let d = callDamage( blade,level ) * 0.8;
	let knockback = false;
	let knockbackpower = 0.5;
	let comboG = 1;
    let isFire = false;
    if(bladeItemEnch.hasEnchantment("minecraft:fire_aspect")){
        isFire = true;
    }
    //attack
    rangeAttack(user,d,knockback,knockbackpower,5,isFire,comboG);
    playBladeSound(user,sound);
    summonBladeShadow(user,color,30);
    //after
	world.scoreboard.getObjective(`printlevel`).setScore(user,100);
    provocation(user,comboG);
}

export async function bladeComboG2( user,blade,sound ){
    //pre
	const bladeItemEnch = blade.getItem().getComponent(ItemComponentTypes.Enchantable);
	const level = world.scoreboard.getObjective(`blade`).getScore(user);
    const color = bladeData[`${blade.typeId.split(`:`)[1]}`][`color`];
	let d = callDamage( blade,level ) * 0.8;
	let knockback = false;
	let knockbackpower = 0.5;
	let comboG = 2;
    let isFire = false;
    if(bladeItemEnch.hasEnchantment("minecraft:fire_aspect")){
        isFire = true;
    }
    //attack
    rangeAttack(user,d,knockback,knockbackpower,5,isFire,comboG);
    playBladeSound(user,sound);
    summonBladeShadow(user,color,150);
    //after
	world.scoreboard.getObjective(`printlevel`).setScore(user,100);
    provocation(user,comboG);
}

export async function bladeComboG3( user,blade,sound ){
    //pre
	const bladeItemEnch = blade.getItem().getComponent(ItemComponentTypes.Enchantable);
	const level = world.scoreboard.getObjective(`blade`).getScore(user);
    const color = bladeData[`${blade.typeId.split(`:`)[1]}`][`color`];
	let d = callDamage( blade,level ) / 2;
	let knockback = false;
	let knockbackpower = 0.5;
	let comboG = 3;
    let isFire = false;
    if(bladeItemEnch.hasEnchantment("minecraft:fire_aspect")){
        isFire = true;
    }

    //attack
    rangeAttack(user,d,knockback,knockbackpower,5,isFire,comboG);
    playBladeSound(user,sound);
    summonBladeShadow(user,color,45);
    await system.waitTicks(3);
    rangeAttack(user,d,knockback,knockbackpower,5,isFire,comboG);
    playBladeSound(user,sound);
    summonBladeShadow(user,color,60);
    
    //after
	world.scoreboard.getObjective(`printlevel`).setScore(user,100);
    provocation(user,comboG);
}
export async function bladeComboG3_C( user,blade,sound ){
    //pre
	const bladeItemEnch = blade.getItem().getComponent(ItemComponentTypes.Enchantable);
	const level = world.scoreboard.getObjective(`blade`).getScore(user);
    const color = bladeData[`${blade.typeId.split(`:`)[1]}`][`color`];
	let d = callDamage( blade,level ) * 1.5;
	let knockback = true;
	let knockbackpower = 0.7;
	let comboG = 3;
    let isFire = false;
    if(bladeItemEnch.hasEnchantment("minecraft:fire_aspect")){
        isFire = true;
    }
    //attack
	await system.waitTicks(1);
    rangeAttack(user,d,knockback,knockbackpower,5,isFire,comboG);
    playBladeSound(user,sound);
    summonBladeShadow(user,color,45);
    //after
	world.scoreboard.getObjective(`printlevel`).setScore(user,100);
    world.scoreboard.getObjective(`groundcomboA`).setScore(user,0);
}

export async function bladeComboG4_A( user,blade,sound ){
    //pre
	const bladeItemEnch = blade.getItem().getComponent(ItemComponentTypes.Enchantable);
	const level = world.scoreboard.getObjective(`blade`).getScore(user);
    const color = bladeData[`${blade.typeId.split(`:`)[1]}`][`color`];
	let d = callDamage( blade,level ) * 2;
	let knockback = true;
	let knockbackpower = 0.7;
	let comboG = 4;
    let isFire = false;
    if(bladeItemEnch.hasEnchantment("minecraft:fire_aspect")){
        isFire = true;
    }
    //attack
	await system.waitTicks(7);
    rangeAttack(user,d,knockback,knockbackpower,5,isFire,comboG);
    playBladeSound(user,sound);
    summonBladeShadow(user,color,330);
    //after
	world.scoreboard.getObjective(`printlevel`).setScore(user,100);
    world.scoreboard.getObjective(`groundcomboA`).setScore(user,0);
}

export async function bladeComboG4_B( user,blade,sound ){
    //pre
	const bladeItemEnch = blade.getItem().getComponent(ItemComponentTypes.Enchantable);
	const level = world.scoreboard.getObjective(`blade`).getScore(user);
    const color = bladeData[`${blade.typeId.split(`:`)[1]}`][`color`];
	let d = callDamage( blade,level );
	let knockback = true;
	let knockbackpower = 0.5;
	let comboG = 4;
    let isFire = false;
    if(bladeItemEnch.hasEnchantment("minecraft:fire_aspect")){
        isFire = true;
    }
    //attack
	for( let i = 0; i < 6; i++ ){
		rangeAttack(user,d/6,false,0,5,isFire,1);
		playBladeSound(user,sound);
		summonBladeShadow(user,color,90*(i%2)+15+60*Math.random());
		await system.waitTicks(2);
	}
	await system.waitTicks(8);
    rangeAttack(user,d*1.5,knockback,knockbackpower,5,isFire,comboG);
    playBladeSound(user,sound);
    summonBladeShadow(user,color,0);
    //after
	world.scoreboard.getObjective(`printlevel`).setScore(user,100);
    world.scoreboard.getObjective(`groundcomboA`).setScore(user,0);
}
export async function bladeComboA1( user,blade,sound ){
    //pre
	const bladeItemEnch = blade.getItem().getComponent(ItemComponentTypes.Enchantable);
	const level = world.scoreboard.getObjective(`blade`).getScore(user);
    const color = bladeData[`${blade.typeId.split(`:`)[1]}`][`color`];
	let d = callDamage( blade,level );
	let knockback = false;
	let knockbackpower = 0.5;
	let comboG = 1;
    let isFire = false;
    if(bladeItemEnch.hasEnchantment("minecraft:fire_aspect")){
        isFire = true;
    }
    //attack
    rangeAttack(user,d,knockback,knockbackpower,5,isFire,comboG);
    playBladeSound(user,sound);
    summonBladeShadow(user,color,30);
    //after
	world.scoreboard.getObjective(`printlevel`).setScore(user,100);
}
export async function bladeComboA2( user,blade,sound ){
    //pre
	const bladeItemEnch = blade.getItem().getComponent(ItemComponentTypes.Enchantable);
	const level = world.scoreboard.getObjective(`blade`).getScore(user);
    const color = bladeData[`${blade.typeId.split(`:`)[1]}`][`color`];
	let d = callDamage( blade,level );
	let knockback = false;
	let knockbackpower = 0.5;
	let comboG = 2;
    let isFire = false;
    if(bladeItemEnch.hasEnchantment("minecraft:fire_aspect")){
        isFire = true;
    }
    //attack
    rangeAttack(user,d,knockback,knockbackpower,5,isFire,comboG);
    playBladeSound(user,sound);
    summonBladeShadow(user,color,210);
    //after
	world.scoreboard.getObjective(`printlevel`).setScore(user,100);
}
export async function bladeComboA3( user,blade,sound ){
    //pre
	const bladeItemEnch = blade.getItem().getComponent(ItemComponentTypes.Enchantable);
	const level = world.scoreboard.getObjective(`blade`).getScore(user);
    const color = bladeData[`${blade.typeId.split(`:`)[1]}`][`color`];
	let d = callDamage( blade,level );
	let knockback = true;
	let knockbackpower = 0.5;
	let comboG = 3;
    let isFire = false;
    if(bladeItemEnch.hasEnchantment("minecraft:fire_aspect")){
        isFire = true;
    }
    //attack
    rangeAttack(user,d,knockback,knockbackpower,5,isFire,comboG);
    playBladeSound(user,sound);
    summonBladeShadow(user,color,30);
    //after
	world.scoreboard.getObjective(`printlevel`).setScore(user,100);
    world.scoreboard.getObjective(`aircomboA`).setScore(user,0);
}
export async function bladeComboA3_B( user,blade,sound ){
    //pre
	const bladeItemEnch = blade.getItem().getComponent(ItemComponentTypes.Enchantable);
	const level = world.scoreboard.getObjective(`blade`).getScore(user);
    const color = bladeData[`${blade.typeId.split(`:`)[1]}`][`color`];
	let d = callDamage( blade,level )/2;
	let knockback = true;
	let knockbackpower = 1;
	let comboG = 3;
    let isFire = false;
    if(bladeItemEnch.hasEnchantment("minecraft:fire_aspect")){
        isFire = true;
    }
    //attack
    rangeAttack(user,d,false,knockbackpower,5,isFire,comboG/2);
    playBladeSound(user,sound);
    summonBladeShadow(user,color,60);
	await system.waitTicks(3);
	user.applyKnockback(0,0,0,1);
    rangeAttack(user,d,true,1,8,isFire,comboG/2);
    playBladeSound(user,sound);
    summonBladeShadow(user,color,75);
    //after
	world.scoreboard.getObjective(`printlevel`).setScore(user,100);
}
export async function bladeComboA4_B( user,blade,sound ){
    //pre
	const bladeItemEnch = blade.getItem().getComponent(ItemComponentTypes.Enchantable);
	const level = world.scoreboard.getObjective(`blade`).getScore(user);
    const color = bladeData[`${blade.typeId.split(`:`)[1]}`][`color`];
	let d = callDamage( blade,level )*2;
	let knockback = true;
	let knockbackpower = -1;
	let comboG = 4;
    let isFire = false;
    if(bladeItemEnch.hasEnchantment("minecraft:fire_aspect")){
        isFire = true;
    }
    //attack
    rangeAttack(user,d,knockback,knockbackpower,5,isFire,comboG);
    playBladeSound(user,sound);
    summonBladeShadow(user,color,270);
    //after
	world.scoreboard.getObjective(`printlevel`).setScore(user,100);
    world.scoreboard.getObjective(`aircomboA`).setScore(user,0);
}

export async function provocation(user,score) {
	let i = 0;
	while( true ){
		const ComboA = world.scoreboard.getObjective(`groundcomboA`).getScore(user);
		const combocool = world.scoreboard.getObjective(`combocool`).getScore(user);
		const bladecool = world.scoreboard.getObjective(`bladecool`).getScore(user);
		if( isSpeedMoving(user) || user.isSprinting ||( ComboA != score && ComboA != 0) ){
			//print(`break${i},${score}`);
			break;
		}
		await system.waitTicks(1);
		i++;
		if( bladecool == 0 && combocool == 0 && i > 20 ){
			const victims = user.dimension.getEntities({location:user.location,maxDistance:16,excludeTypes:bladeImmuneEntities,excludeNames:[ user.nameTag ] });
			if( victims.length > 0 ){
				world.scoreboard.getObjective(`printlevel`).setScore(user,100);
				world.scoreboard.getObjective(`blade`).addScore(user,32);
				user.playSound(`mob.blaze.shoot`);
				for( let i = 0; i < victims.length; i++ ){
					if( victims[i].nameTag != user.nameTag ){
						victims[i].addEffect(`speed`,600,{ amplifier:1 });
						victims[i].addEffect(`strength`,600,{ amplifier:1 });
						user.dimension.spawnParticle(`minecraft:bleach`,{x:victims[i].location.x,y:victims[i].location.y+1.8,z:victims[i].location.z});
						victims[i].applyDamage( 0.1,{ cause:`override`,damagingEntity:user });
					}
				}
				//print(`succcess`);
			}
			break;
		}
	}
}