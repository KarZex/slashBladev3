import { world, system, EquipmentSlot, EntityComponentTypes, TicksPerSecond, ItemComponentTypes,EnchantmentType, EntityDamageCause, EnchantmentTypes, EffectType, EffectTypes, Effect, EntityIsShakingComponent  } from "@minecraft/server";
import { ActionFormData, ModalFormData } from "@minecraft/server-ui";
import { bladeData } from "./blade";
import { classReg, drive, slashdimension } from "./saData";
import "./compornents";
import { playBladeSound,isMoving , absVector3,roundTo,print,setBladeDamage,callDamage  } from "./usefulFunction";
import { rapidSlash,risingStar,bladeComboG1,bladeComboG2,bladeComboG3,bladeComboG3_C,bladeComboG4_A,bladeComboG4_B,bladeComboA1,bladeComboA2,bladeComboA3,bladeComboA3_B,bladeComboA4_B  } from "./attacks";
import { bladeImmuneEntities,bladeNoEnemyStepEntities,SNEAK_TIME } from "./config";

const Rank = [ `D`,`C`,`B`,`A`,`1S`,`2S`,`3S`,`3S` ];

world.beforeEvents.playerInteractWithEntity.subscribe( e => {
	if( e.target.typeId == "zex:bladeshadow" ){
		e.cancel = true;
	}
} )

world.afterEvents.entityHurt.subscribe( e => {
	if( e.hurtEntity.typeId == `player` && e.hurtEntity.getComponent(EntityComponentTypes.Equippable).getEquipment(EquipmentSlot.Mainhand).typeId.includes(`blade:`) ){
		const sneak = world.scoreboard.getObjective(`sneaking`).getScore(user);
		if( 1 <= sneak && sneak < SNEAK_TIME ){
			for( let i = 0; i < 30; i++ ){//random.totem
				e.hurtEntity.dimension.spawnParticle(`minecraft:totem_particle`);
				e.hurtEntity.dimension.playSound(`random.totem`,e.hurtEntity.location);
			}
			
		}
	}
} )

world.beforeEvents.playerBreakBlock.subscribe( e => {
	const block = e.block;
	const dimensiontype = e.dimension.id;
	const dimension = world.getDimension(dimensiontype);
	if( (block.typeId.includes(`short_grass`) || block.typeId.includes(`tall_grass`)) && world.gameRules.doTileDrops ){
		system.run(() => {
			dimension.runCommand(`loot spawn ${block.location.x+0.5} ${block.location.y+0.5} ${block.location.z+0.5} loot "blocks/seeds"`);
		});
	}
} )

world.afterEvents.entityHurt.subscribe( e => {
	const player = e.hurtEntity;
	if( player.typeId == `minecraft:player` ){
		world.scoreboard.getObjective(`blade`).addScore(player,-16);
	} 
} )

function bladeInstant( user,blade ){
	const bladeId = blade.typeId.split(`:`)[1];
	if (bladeData[`${bladeId}`].hasOwnProperty(`ench1`)){
		user.runCommand(`enchant @s ${bladeData[`${bladeId}`][`ench1`][`id`]} ${bladeData[`${bladeId}`][`ench1`][`lvl`]}`);
	}
	if (bladeData[`${bladeId}`].hasOwnProperty(`ench2`)){
		user.runCommand(`enchant @s ${bladeData[`${bladeId}`][`ench2`][`id`]} ${bladeData[`${bladeId}`][`ench2`][`lvl`]}`);
	}
	if (bladeData[`${bladeId}`].hasOwnProperty(`ench3`)){
		user.runCommand(`enchant @s ${bladeData[`${bladeId}`][`ench3`][`id`]} ${bladeData[`${bladeId}`][`ench3`][`lvl`]}`);
	}
	if (bladeData[`${bladeId}`].hasOwnProperty(`ench4`)){
		user.runCommand(`enchant @s ${bladeData[`${bladeId}`][`ench4`][`id`]} ${bladeData[`${bladeId}`][`ench4`][`lvl`]}`);
	}
	if( bladeData[`${bladeId}`].hasOwnProperty(`ench5`) ){
		user.runCommand(`enchant @s ${bladeData[`${bladeId}`][`ench5`][`id`]} ${bladeData[`${bladeId}`][`ench5`][`lvl`]}`);
	}
	if( bladeData[`${bladeId}`].hasOwnProperty(`insa`) ){
		blade.setDynamicProperty("sa",`${bladeData[`${bladeId}`][`insa`]}`);
	}
	blade.setDynamicProperty("killCount",0);
	blade.setDynamicProperty("ProudSoul",0);
	blade.setDynamicProperty("Refine",0);
	if( user.getDynamicProperty("userXp") == undefined ){
		user.setDynamicProperty("userXp",0);
	}
	blade.setDynamicProperty("damage",bladeData[`${bladeId}`][`damage`]);
	blade.setDynamicProperty("damagemax",bladeData[`${bladeId}`][`damageplus`]);
	const attack = bladeData[`${bladeId}`][`damage`];
	const mac = bladeData[`${bladeId}`][`damageplus`];
	blade.setLore([
		`§rKillCount: ${blade.getDynamicProperty("killCount")}`,
		`§rProudSoul: ${blade.getDynamicProperty("ProudSoul")}`,
		`§rRefine: ${blade.getDynamicProperty("Refine")}`,
		`§rSA: ${blade.getDynamicProperty("sa")}`,
		`§r§4RankAttackDamage`,
		`§r§6B-SS§r/§cSSS§r/§5Limit`,
		`§r§6+${attack}.0§r/§c+${attack}.0§r/§5+${mac}.0`
	]);
}

function bladeSoulcal( user,blade ){
	const xp = user.getTotalXp();
	const bladeId = blade.typeId.split(`:`)[1];
	const Tblade = user.getComponent(EntityComponentTypes.Equippable).getEquipment(EquipmentSlot.Mainhand);
	if ( Tblade.getComponent(ItemComponentTypes.Durability).damage < blade.getDynamicProperty(`currentDurability`) ){
		blade.setDynamicProperty("currentDurability",Tblade.getComponent(ItemComponentTypes.Durability).damage);
		const Refine = blade.getDynamicProperty("Refine") + 1;
		blade.setDynamicProperty("Refine",Refine);
		blade.setDynamicProperty("damagemax",bladeData[`${bladeId}`][`damageplus`] + Refine);
		const lore = blade.getLore();
		lore[2] = `§rRefine: ${Refine}`;
		lore[6] = `§r§6+${bladeData[`${bladeId}`][`damage`]}.0§r/§c+${blade.getDynamicProperty("damage")}.0§r/§5+${blade.getDynamicProperty("damagemax")}.0`;
		blade.setLore(lore);
	}
	if ( blade.getDynamicProperty(`damagemax`) - bladeData[`${bladeId}`][`damage`] < user.level ){
		blade.setDynamicProperty("damage",blade.getDynamicProperty(`damagemax`));
		const lore = blade.getLore();
		lore[6] = `§r§6+${bladeData[`${bladeId}`][`damage`]}.0§r/§c+${blade.getDynamicProperty("damage")}.0§r/§5+${blade.getDynamicProperty("damagemax")}.0`;
		blade.setLore(lore);
	}
	else{
		blade.setDynamicProperty("damage",user.level + bladeData[`${bladeId}`][`damage`]);
		const lore = blade.getLore();
		lore[6] = `§r§6+${bladeData[`${bladeId}`][`damage`]}.0§r/§c+${blade.getDynamicProperty("damage")}.0§r/§5+${blade.getDynamicProperty("damagemax")}.0`;
		blade.setLore(lore);
	}
	if( xp > user.getDynamicProperty("userXp") ){
		const soul = blade.getDynamicProperty("ProudSoul") + (xp - user.getDynamicProperty("userXp")) * 5;
		const lore = blade.getLore();
		lore[1] = `§rProudSoul: ${soul}`;
		blade.setLore(lore);
		blade.setDynamicProperty("ProudSoul", soul );
		user.setDynamicProperty("userXp",xp);
	}
	else{
		user.setDynamicProperty("userXp",xp);
	}
}


async function bladeSwing( user,blade,IsOnGround,sound ){   
	let sound2 = `item.trident.throw`;
	if( sound != `swingblade.c` ){
		sound2 = sound;
	}
	if(IsOnGround == true){
		world.scoreboard.getObjective(`groundcomboA`).addScore(user,1);
		const combo = world.scoreboard.getObjective(`groundcomboA`).getScore(user);
		const time =  user.getDynamicProperty(`BladeStartOn`);
		if( combo == 1 ){
			bladeComboG1(user,blade,sound);
		}
		if( combo == 2 ){
			bladeComboG2(user,blade,sound);
		}
		if( combo == 3 && time > 20 ){
			bladeComboG3(user,blade,sound2);
		}
		if( combo == 3 && time <= 20 ){
			bladeComboG3_C(user,blade,sound2);
		}
		if( combo == 4 && time > 20 ){
			bladeComboG4_A(user,blade,sound2);
		}
		if( combo == 4 && time <= 20 ){
			bladeComboG4_B(user,blade,sound2);
		}
		world.scoreboard.getObjective(`combocool`).setScore(user,40);
	}
	else if(IsOnGround == false){
		user.addEffect(`slow_falling`,40,{ amplifier:1 });
		user.addEffect(`levitation`,2,{ amplifier:16 });
		world.scoreboard.getObjective(`aircomboA`).addScore(user,1);
		const combo = world.scoreboard.getObjective(`aircomboA`).getScore(user);
		const time =  user.getDynamicProperty(`BladeStartOn`);
		if( combo == 1 ){
			bladeComboA1(user,blade,sound2);
		}
		if( combo == 2 ){
			bladeComboA2(user,blade,sound2);
		}
		if( combo == 3 && time > 25 ){
			bladeComboA3(user,blade,sound2);
		}
		if( combo == 3 && time <= 25 ){
			bladeComboA3_B(user,blade,sound2);
		}
		else if( combo == 4 ){
			bladeComboA4_B(user,blade,sound2);
		}
		world.scoreboard.getObjective(`combocool`).setScore(user,40);
	}
}
function bladeSwingProjectile( user ){
	////({location:user.location,maxDistance:1.5,closest:1,excludeNames:[ user.nameTag ] });
	const victims = user.dimension.getEntities({location:user.location,maxDistance:5,excludeNames:[ user.nameTag ] });
	if( victims.length > 0 ){
		for( let i = 0; i < victims.length; i++ ){
			if( victims[i].hasComponent(EntityComponentTypes.Projectile) ){
				if( victims[i].getComponent(EntityComponentTypes.Projectile).owner != undefined && victims[i].getComponent(EntityComponentTypes.Projectile).owner.nameTag == user.nameTag ){
					continue;
				}
				else{
					victims[i].getComponent(EntityComponentTypes.Projectile).owner = user;
					const V_0 = victims[i].getVelocity();
					//reflect the projectile
					const V_t = {
						x: V_0.x * -1.5,
						y: V_0.y * -1.5,
						z: V_0.z * -1.5
					}
					victims[i].clearVelocity();
					victims[i].applyImpulse(V_t);

				}
			}
		}
	}
}

world.afterEvents.itemStartUse.subscribe( async e => {
	const player = e.source;
	const blade = player.getComponent(EntityComponentTypes.Equippable).getEquipmentSlot(EquipmentSlot.Mainhand);
	if ( blade.typeId.includes(`blade:`) ){
		const time =  world.scoreboard.getObjective(`combocool`).getScore(player);
		player.setDynamicProperty(`BladeStartOn`,time);
		//print(time)
	}

} )

world.afterEvents.itemReleaseUse.subscribe( async e => {
	const user = e.source;
	const bladecool = world.scoreboard.getObjective(`bladecool`).getScore(user);
	const blade = user.getComponent(EntityComponentTypes.Equippable).getEquipmentSlot(EquipmentSlot.Mainhand);
	const Tblade = user.getComponent(EntityComponentTypes.Equippable).getEquipment(EquipmentSlot.Mainhand);
	const dmgCom = Tblade.getComponent(ItemComponentTypes.Durability);	
	if ( e.itemStack.typeId.includes(`blade:`) & bladecool == 0 && e.useDuration > 100010 && dmgCom.damage < dmgCom.maxDurability ){
		const bladeId = e.itemStack.typeId.split(`:`)[1];
		const sound = bladeData[`${bladeId}`][`sound`];
		const color = bladeData[`${bladeId}`][`color`];
		if( user.isSneaking && (user.isOnGround)  ){
			const targets = user.dimension.getEntities({ location:user.location,excludeTypes: bladeImmuneEntities,closest:1,maxDistance:1.5,excludeNames:[ user.nameTag ] });
			if( targets.length > 0 ){
				const targetEntity = targets[0];
				risingStar(user,targetEntity,blade,sound,color);
			}
			else{
				rapidSlash(user,blade,sound,color);
			}
			world.scoreboard.getObjective(`combocool`).setScore(user,40);
		}
		else if( user.isSneaking && !user.isOnGround ){
			while( true ){
				if( !user.isOnGround ){
					user.applyKnockback(0,0,0,-5);
					world.scoreboard.getObjective(`around`).setScore(user,8);
					user.addEffect(`resistance`,8,{ amplifier:255 });
					user.dimension.spawnParticle(`minecraft:large_explosion`,user.location);
					await system.waitTicks(1);
				}
				else{
					break;
				}

			}
		}
		else {
			bladeSwing( user,blade,user.isOnGround,sound,color );
		}
	}
	else if( e.itemStack.typeId.includes(`blade:`) && blade.getDynamicProperty("sa") != undefined && e.useDuration <= 100010 && dmgCom.damage < dmgCom.maxDurability ){
		const classRef = classReg[blade.getDynamicProperty("sa")];
		const sa = new classRef();
		if( sa.cost <= blade.getDynamicProperty("ProudSoul") ){
			setBladeDamage(1,user);
			const soul = blade.getDynamicProperty("ProudSoul") - sa.cost;
			blade.setDynamicProperty("ProudSoul", soul );
			const lore = blade.getLore();
			lore[1] = `§rProudSoul: ${soul}`;
			blade.setLore(lore);
			sa.fireSa( blade,user );

		}
	}
	else if ( dmgCom.damage == dmgCom.maxDurability ){
		const xp = user.level;
		const ProudSoul = blade.getDynamicProperty("ProudSoul");
		const damage = dmgCom.damage;
		const bladeId = e.itemStack.typeId.split(`:`)[1];
		if( ProudSoul/5 >= damage){
			const soul = Tblade.getDynamicProperty("ProudSoul") - damage*5
			Tblade.setDynamicProperty("ProudSoul",soul);
			dmgCom.damage = 0;
			const lore = Tblade.getLore();
			lore[1] = `§rProudSoul: ${soul}`;
			Tblade.setDynamicProperty("currentDurability",Tblade.getComponent(ItemComponentTypes.Durability).damage);
			const Refine = Tblade.getDynamicProperty("Refine") + 1;
			Tblade.setDynamicProperty("Refine",Refine);
			Tblade.setDynamicProperty("damagemax",bladeData[`${bladeId}`][`damageplus`] + Refine);
			lore[2] = `§rRefine: ${Refine}`;
			lore[6] = `§r§6+${bladeData[`${bladeId}`][`damage`]}.0§r/§c+${Tblade.getDynamicProperty("damage")}.0§r/§5+${Tblade.getDynamicProperty("damagemax")}.0`;
			Tblade.setLore(lore);
			user.getComponent("minecraft:inventory").container.setItem(user.selectedSlotIndex, Tblade);
		}
		else{
			dmgCom.damage = dmgCom.maxDurability - Math.floor(ProudSoul/5);
			Tblade.setDynamicProperty("ProudSoul",0);
			user.getComponent("minecraft:inventory").container.setItem(user.selectedSlotIndex, Tblade);
			const lore = Tblade.getLore();
			lore[1] = `§rProudSoul: 0`;
			Tblade.setDynamicProperty("currentDurability",Tblade.getComponent(ItemComponentTypes.Durability).damage);
			const Refine = Tblade.getDynamicProperty("Refine") + 1;
			Tblade.setDynamicProperty("Refine",Refine);
			Tblade.setDynamicProperty("damagemax",bladeData[`${bladeId}`][`damageplus`] + Refine);
			lore[2] = `§rRefine: ${Refine}`;
			lore[6] = `§r§6+${bladeData[`${bladeId}`][`damage`]}.0§r/§c+${Tblade.getDynamicProperty("damage")}.0§r/§5+${Tblade.getDynamicProperty("damagemax")}.0`;
			Tblade.setLore(lore);
			user.getComponent("minecraft:inventory").container.setItem(user.selectedSlotIndex, Tblade);
		}
	}
} )

world.afterEvents.entityHitEntity.subscribe( e => {
	const attacker = e.damagingEntity;
	const victim = e.hitEntity;
	if( attacker.typeId == `minecraft:player` ){
		if( attacker.getComponent(EntityComponentTypes.Equippable).getEquipment(EquipmentSlot.Mainhand).typeId.includes(`blade:`) ){
			const score = world.scoreboard.getObjective(`blade`).getScore( attacker );
			const blade = attacker.getComponent(EntityComponentTypes.Equippable).getEquipmentSlot(EquipmentSlot.Mainhand);
			e.hitEntity.applyDamage(callDamage(blade,score),{ cause:EntityDamageCause.entityAttack,damagingEntity:attacker })
			setBladeDamage(1,attacker);
			const vict = e.hitEntity;
			world.scoreboard.getObjective(`blade`).addScore(attacker,7);
			world.scoreboard.getObjective(`printlevel`).setScore(attacker,100);
			if( world.scoreboard.getObjective(`meleeup`).getScore( attacker ) == 0 ){
				vict.applyKnockback(0,0,0,0.5);
				world.scoreboard.getObjective(`meleeup`).setScore( attacker,15 );
			}
			else{
				const vect = attacker.getViewDirection();
				vict.applyKnockback(vect.x,vect.z,2,-0.25);
			}
		}

	}
} )

world.afterEvents.projectileHitEntity.subscribe( e => {
	const vict = e.getEntityHit().entity;
	const attacker = e.source;
	if( e.projectile.typeId.includes("absorb") ){
		if( attacker.nameTag != vict.nameTag ){
			e.projectile.remove();
			const classRef = classReg[`${e.projectile.typeId.split(`:`)[1]}`];
			const sa = new classRef();
			const dmg = callDamage(attacker.getComponent(EntityComponentTypes.Equippable).getEquipmentSlot(EquipmentSlot.Mainhand),world.scoreboard.getObjective(`blade`).getScore(attacker));
			vict.applyDamage(dmg,{ cause:`magic`,damagingEntity:e.source });
			world.scoreboard.getObjective(`blade`).addScore(e.source,10);
			world.scoreboard.getObjective(`printlevel`).setScore(e.source,100);
			e.dimension.spawnParticle(`minecraft:crop_growth_emitter`,attacker.location);
			const PHealth = attacker.getComponent(EntityComponentTypes.Health).currentValue;
			const PMHealth = attacker.getComponent(EntityComponentTypes.Health).effectiveMax;
			attacker.getComponent(EntityComponentTypes.Health).setCurrentValue(Math.min(PHealth + dmg,PMHealth));
		}
	}
	else if( e.projectile.typeId == "safire:drive" ){
		const classRef = classReg[`${e.projectile.typeId.split(`:`)[1]}`];
		const sa = new classRef();
		const dmg = sa.damage + callDamage(attacker.getComponent(EntityComponentTypes.Equippable).getEquipmentSlot(EquipmentSlot.Mainhand),world.scoreboard.getObjective(`blade`).getScore(attacker));;
		let vict = e.getEntityHit().entity;
		vict.applyDamage(dmg,{ cause:`override`,damagingEntity:e.source });
		let gunName = e.projectile.typeId
		world.scoreboard.getObjective(`blade`).addScore(e.source,7);
		world.scoreboard.getObjective(`printlevel`).setScore(e.source,100);
	}
	else if( e.projectile.typeId == "safire:vdrive" ){
		const classRef = classReg[`${e.projectile.typeId.split(`:`)[1]}`];
		const sa = new classRef();
		const dmg = sa.damage + callDamage(attacker.getComponent(EntityComponentTypes.Equippable).getEquipmentSlot(EquipmentSlot.Mainhand),world.scoreboard.getObjective(`blade`).getScore(attacker));;
		let vict = e.getEntityHit().entity;
		vict.applyDamage(dmg,{ cause:`override`,damagingEntity:e.source });
		let gunName = e.projectile.typeId;
		vict.applyKnockback(0,0,0,1);
		world.scoreboard.getObjective(`blade`).addScore(e.source,7);
		world.scoreboard.getObjective(`printlevel`).setScore(e.source,100);
	}
	else if( e.projectile.typeId == "safire:flamethrower" ){
		const classRef = classReg[`${e.projectile.typeId.split(`:`)[1]}`];
		const sa = new classRef();
		const dmg = sa.damage + callDamage(attacker.getComponent(EntityComponentTypes.Equippable).getEquipmentSlot(EquipmentSlot.Mainhand),world.scoreboard.getObjective(`blade`).getScore(attacker));;
		let vict = e.getEntityHit().entity;
		vict.applyDamage(dmg,{ cause:`override`,damagingEntity:e.source });
		vict.setOnFire(5);
		let gunName = e.projectile.typeId;
		world.scoreboard.getObjective(`blade`).addScore(e.source,7);
		world.scoreboard.getObjective(`printlevel`).setScore(e.source,100);
	}
})

world.afterEvents.entityDie.subscribe( e => {
	try{
		const killer = e.damageSource.damagingEntity;
		if( killer.typeId == `minecraft:player` ){
			if( killer.getComponent(EntityComponentTypes.Equippable).getEquipment(EquipmentSlot.Mainhand).typeId.includes(`blade:`) ){
				const loc = e.deadEntity.location;
				const blade = killer.getComponent(EntityComponentTypes.Equippable).getEquipmentSlot(EquipmentSlot.Mainhand);
				const lore = blade.getLore();
				const kill = blade.getDynamicProperty("killCount") + 1;
				blade.setDynamicProperty("killCount",kill);
				if( world.gameRules.doMobLoot ){
					killer.dimension.runCommand(`loot spawn ${loc.x} ${loc.y} ${loc.z} loot ps`);
				}
				if( kill >= 1000 ){
					lore[0] = `§r§4KillCount: ${kill}`;
					lore[5] = `§r§6B-A§r/§cS-SSS§r/§5Limit`
				}
				else {
					lore[0] = `§rKillCount: ${kill}`;
				}
				blade.setLore(lore);
			}

		}
		if( e.deadEntity.typeId == `wither` && world.gameRules.doMobLoot ){
				const loc = e.deadEntity.location;
				killer.dimension.runCommand(`loot spawn ${loc.x} ${loc.y} ${loc.z} loot entities/sange`);
		}
	}catch{}

})


system.afterEvents.scriptEventReceive.subscribe( e => {
	if( e.id == "zex:skinid" ){	
		let M = e.message.split(` `);
		let x =  Number(M[0]);
		let y =  Number(M[1]);
		e.sourceEntity.getComponent(`minecraft:skin_id`).value = x
		e.sourceEntity.getComponent(`minecraft:variant`).value = y
	}
	else if( e.id == "zex:setsa" ){	
		const user = e.sourceEntity;
		const bladeSlot = user.getComponent(EntityComponentTypes.Equippable).getEquipmentSlot(EquipmentSlot.Mainhand);
		const Tblade = user.getComponent(EntityComponentTypes.Equippable).getEquipment(EquipmentSlot.Mainhand);
		bladeSlot.setDynamicProperty(`sa`,e.message);
		const lore = bladeSlot.getLore();
		lore[3] = `§rSA: ${bladeSlot.getDynamicProperty("sa")}`;
		bladeSlot.setLore(lore);
	}
	else if( e.id == "zex:slashdim" ){	
		try{
			const fire = e.sourceEntity;
			const user = world.getPlayers({name:fire.getDynamicProperty(`zex:owner`)})[0];
			const blade = user.getComponent(EntityComponentTypes.Equippable).getEquipmentSlot(EquipmentSlot.Mainhand);
			const bladeItemEnch = blade.getItem().getComponent(ItemComponentTypes.Enchantable);//({location:user.location,maxDistance:1.5,closest:1,excludeNames:[ user.nameTag ] });
			const victims = fire.dimension.getEntities({location:fire.location,maxDistance:1.5,excludeTypes:bladeImmuneEntities,excludeNames:[ user.nameTag ] });
			if( victims.length > 0 ){
				for( let i = 0; i < victims.length; i++ ){
					if( victims[i].nameTag != user.nameTag ){
						victims[i].applyDamage( 3,{ cause:`override`,damagingEntity:user });
						world.scoreboard.getObjective(`blade`).addScore(user,4);
						if( bladeItemEnch.hasEnchantment("minecraft:fire_aspect") ){
							victims[i].setOnFire(5);
						}
					}
				}
			}
		}
		catch{

		}

	}
	else if( e.id == "zex:printlevel" ){
		const player = e.sourceEntity;
		let score = world.scoreboard.getObjective(`blade`).getScore(player);
		let r = Math.floor(score / 32);
		if(score < 0){ 
			world.scoreboard.getObjective(`blade`).setScore(player,0);
			score = 0;
		 }
		else if(score > 160){ 
			world.scoreboard.getObjective(`blade`).setScore(player,160);
			score = 160;
		}
		let bar = score % 32;
		//S,SS,SSS mode
		if( r >= 4 ){
			bar = score - 32 * 4;
			r = 4 + Math.floor(bar / 11); 
		}

		//type 00, 01, 02, ...
		if( bar < 10 ){
			bar = `0${bar}`
		}
		//prevent over 33 
		else if( bar > 32 ){
			bar = `32`;
		}

		//prevent over 6 
		if( r > 6 ){
			r = 6;
		}
		player.runCommand(`title @s actionbar §rzex.blade.${Rank[r]}${bar}`)
	}
	else if( e.id == "zex:haveBlade" ){
		const user = e.sourceEntity;
		const blade = user.getComponent(EntityComponentTypes.Equippable).getEquipmentSlot(EquipmentSlot.Mainhand);
		const bladeId = e.message;
		if( blade.getDynamicProperty("killCount") == undefined  ){
			bladeInstant( user,blade );
		}
		if( user.typeId == `minecraft:player` ){
			const comboSocre = world.scoreboard.getObjective(`combocool`).getScore(user);
			if( comboSocre == 0 ){
				bladeSoulcal( user,blade );
			}
			if( user.isSprinting && user.isOnGround ){
				if( !user.hasTag(`sprint`) ){
					user.addTag(`sprint`);
					let abs_v = 4;
					let d = user.getViewDirection();
					user.applyKnockback(d.x,d.z,abs_v,0);
					//user.addEffect(`hunger`,20,{ amplifier:20 });
					user.dimension.playSound(`mob.shulker.teleport`,user.location,{ pitch:1.2, volume:3 });
				}
			}
			if( user.isSneaking ){
				if( !isMoving(user) ){
					bladeSwingProjectile( user );
				}
				world.scoreboard.getObjective(`sneaking`).addScore(user,1);
				const sneak = world.scoreboard.getObjective(`sneaking`).getScore(user);
				if( 1 == sneak ){
					user.addEffect(`resistance`,SNEAK_TIME,{ amplifier:255 });
				}
			}
			if( !user.isSneaking && world.scoreboard.getObjective(`sneaking`).getScore(user) != 0 ){
				world.scoreboard.getObjective(`sneaking`).setScore(user,0);
			}
			if( !user.isSprinting ){
				user.removeTag(`sprint`);
			}
			if( user.isOnGround ){
				const Ascore = world.scoreboard.getObjective(`aircomboA`).getScore(user);
				if( Ascore > 0 ){
					world.scoreboard.getObjective(`aircomboA`).setScore(user,0);
					world.scoreboard.getObjective(`combocool`).setScore(user,-99);
				}
				if( user.hasTag(`jumped`) )
					user.removeTag(`jumped`);
			}
			else if( !user.isOnGround ){
				const Gscore = world.scoreboard.getObjective(`groundcomboA`).getScore(user);
				if( Gscore > 0 ){
					world.scoreboard.getObjective(`groundcomboA`).setScore(user,0);
					world.scoreboard.getObjective(`combocool`).setScore(user,-99);
				}
				if( user.isJumping && user.getVelocity().y < 0 ){
					const victims = user.dimension.getEntities({location:user.location,maxDistance:1.5,closest:1,excludeTypes:bladeNoEnemyStepEntities,excludeNames:[ user.nameTag ] });
					if( victims.length > 0 ){
						user.applyKnockback(0,0,0,0.6);
						user.removeTag(`jumped`);
						user.addEffect(`resistance`,10,{ amplifier:20 });
					}
				}
			}

			if( user.isJumping && !user.hasTag(`jumped`) && user.isSneaking && !user.isOnGround && user.getVelocity().y < 0 ){
				//user.clearVelocity();
				user.applyKnockback(0,0,0,-(0.5*user.getVelocity().y)+0.8);
				user.addTag(`jumped`);
				user.dimension.playSound(`mob.shulker.teleport`,user.location,{ pitch:1.2, volume:3 });
			}
		}
	}
})