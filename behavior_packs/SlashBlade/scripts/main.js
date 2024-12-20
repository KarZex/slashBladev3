import { world, system, EquipmentSlot, EntityComponentTypes, TicksPerSecond  } from "@minecraft/server";
import { ActionFormData, ModalFormData } from "@minecraft/server-ui";
import { gunData } from "./guns";
import { craftData } from "./crafts";
import "./compornents";

world.afterEvents.itemReleaseUse.subscribe( e => {
	if ( e.itemStack.typeId.includes(`blade:`) ){
		const user = e.source;
		const v = user.getVelocity();
		let abs_v = v.x*v.x + v.z*v.z;
		if( abs_v > 0.01 ){
			abs_v = 0.01
		}
		const d = user.getViewDirection();
		world.sendMessage(`${e.useDuration}`);
		world.sendMessage(`x:${d.x} y:${d.y} z:${d.z} v:${abs_v}`);
		if( user.isSneaking && !user.isFlying && !user.isFalling ){

			user.applyKnockback(d.x,d.z,abs_v*500,0)
			user.addEffect(`resistance`,8,{ amplifier:255 });
		}
		else if( e.useDuration > -20 ){
			user.playSound(`swingblade.c`);
			const victims = user.dimension.getEntities({location:user.location,maxDistance:5})
			if( victims.length > 0 ){
				for( let i = 0; i < victims.length; i++ ){
					if( victims[i].nameTag != user.nameTag ){
						victims[i].applyDamage(3,{ cause:`override`,damagingEntity:user });
						victims[i].applyKnockback(0,0,0,0);
						world.scoreboard.getObjective(`blade`).addScore(user,2);
					}
				}
			}
		}
		else{
			e.source.runCommand(`say sa`);
			let FirePos = e.source.location
			FirePos.y = FirePos.y + 1
			const fire = e.source.dimension.spawnEntity(`fire:airblade`,FirePos);
			fire.getComponent(`minecraft:projectile`).owner = e.source
			fire.getComponent(`minecraft:projectile`).shoot( e.source.getViewDirection() );
		}
	}
} )

world.afterEvents.entityHitEntity.subscribe( e => {
	const attacker = e.damagingEntity;
	if( attacker.getComponent(EntityComponentTypes.Equippable).getEquipment(EquipmentSlot.Mainhand).typeId.includes(`blade:`) ){
		const vict = e.hitEntity;
		if( world.scoreboard.getObjective(`meleeup`).getScore( attacker ) == 0 ){
			vict.applyKnockback(0,0,0,0.5);
			world.scoreboard.getObjective(`meleeup`).setScore( attacker,15 );
		}
		else{
			const vect = attacker.getViewDirection();
			vict.applyKnockback(vect.x,vect.z,2,-0.25);
		}
	}
} )

world.afterEvents.itemCompleteUse.subscribe( e => {
	if ( e.itemStack.typeId.includes(`blade:`) ){
		e.source.runCommand(`say a`);
	}
} )

system.afterEvents.scriptEventReceive.subscribe( e => {
	if( e.id == "zex:skinid" ){	
		let M = e.message.split(` `);
		let x =  Number(M[0]);
		let y =  Number(M[1]);
		e.sourceEntity.getComponent(`minecraft:skin_id`).value = x
		e.sourceEntity.getComponent(`minecraft:variant`).value = y
	}
} )

system.runInterval( () => {
	world.getDimension(`minecraft:overworld`).runCommand(`function out/over`);
	world.getDimension(`minecraft:nether`).runCommand(`tag @a[x=-2048,y=0,z=-2048,dx=4096,dy=128,dz=4096] add noout`);
	world.getDimension(`the_end`).runCommand(`function out/end`);
},20 )
