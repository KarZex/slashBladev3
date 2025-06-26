import { world, system, EquipmentSlot, EntityComponentTypes, TicksPerSecond, ItemComponentTypes,EnchantmentType  } from "@minecraft/server";
import { ActionFormData, ModalFormData } from "@minecraft/server-ui";
import { bladeData } from "./blade";
import { classReg, drive, slashdimension } from "./saData";
import "./compornents";

const Rank = [ `D`,`C`,`B`,`A`,`1S`,`2S`,`3S`,`3S` ];

function print( text ){
	world.sendMessage(`§a[debug]§r:${text}`)
}

function callDamage( blade, score ){
	const bladeId = blade.typeId.split(`:`)[1];
	const atk = bladeData[`${bladeId}`][`damage`];
	const atkPlus = blade.getDynamicProperty("damage");
	const overkill = blade.getDynamicProperty("killCount") >= 1000;
	if( score < 32 * 2 ){
		return 2;
	}
	else if( score >= 32 * 2 && score < 32 * 4 ){
		return atk;
	}
	else if( score >= 32 * 4 && score < 150 && overkill == false ){
		return atk;
	}
	else if( score >= 32 * 4 && score < 150 && overkill == true ){
		return atkPlus;
	}
	else if ( score >= 150 ){
		return atkPlus;
	}
}

function bladeInstant( user,blade ){
	const bladeId = blade.typeId.split(`:`)[1];
	world.sendMessage(`${bladeId}`);
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
		world.sendMessage(`${bladeData[`${bladeId}`][`insa`]}`);
		blade.setDynamicProperty("sa",`${bladeData[`${bladeId}`][`insa`]}`);
	}
	blade.setDynamicProperty("killCount",0);
	blade.setDynamicProperty("ProudSoul",0);
	if( user.getDynamicProperty("userXp") == undefined ){
		user.setDynamicProperty("userXp",0);
	}
	blade.setDynamicProperty("damage",bladeData[`${bladeId}`][`damage`]);
	blade.setDynamicProperty("damagemax",bladeData[`${bladeId}`][`damageplus`]);
	const attack = bladeData[`${bladeId}`][`damage`];
	const mac = bladeData[`${bladeId}`][`damageplus`];
	blade.setLore([`§rKillCount: ${blade.getDynamicProperty("killCount")}`,`§rProudSoul: ${blade.getDynamicProperty("ProudSoul")}`,`§rSA: ${blade.getDynamicProperty("sa")}`,`§r§4RankAttackDamage`,`§r§6B-SS§r/§cSSS§r/§5Limit`,`§r§6+${attack}.0§r/§c+${attack}.0§r/§5+${mac}.0`]);
	world.sendMessage(`${blade.getDynamicProperty("killCount")},${blade.getDynamicProperty("sa")}`);
}

function bladeSoulcal( user,blade ){
	const xp = user.getTotalXp();
	const bladeId = blade.typeId.split(`:`)[1];
	if ( blade.getDynamicProperty(`damagemax`) - bladeData[`${bladeId}`][`damage`] < user.level ){
		blade.setDynamicProperty("damage",blade.getDynamicProperty(`damagemax`));
		const lore = blade.getLore();
		lore[5] = `§r§6+${bladeData[`${bladeId}`][`damage`]}.0§r/§c+${blade.getDynamicProperty("damage")}.0§r/§5+${blade.getDynamicProperty("damagemax")}.0`;
		blade.setLore(lore);
	}
	else{
		blade.setDynamicProperty("damage",user.level + bladeData[`${bladeId}`][`damage`]);
		const lore = blade.getLore();
		lore[5] = `§r§6+${bladeData[`${bladeId}`][`damage`]}.0§r/§c+${blade.getDynamicProperty("damage")}.0§r/§5+${blade.getDynamicProperty("damagemax")}.0`;
		blade.setLore(lore);
	}
	if( xp > user.getDynamicProperty("userXp") ){
		const soul = blade.getDynamicProperty("ProudSoul") + xp - user.getDynamicProperty("userXp");
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

function bladeSwing( user,blade ){
	user.playSound(`swingblade.c`);
	const bladeItemEnch = blade.getItem().getComponent(ItemComponentTypes.Enchantable);
	const level = world.scoreboard.getObjective(`blade`).getScore(user);
	const d = callDamage( blade,level );
	const victimsMob = user.dimension.getEntities({location:user.location,maxDistance:6,families:[ `mob` ] });
	const victimsPlayer = user.dimension.getEntities({location:user.location,maxDistance:6,families:[`player`]});
	const victims = victimsMob.concat(victimsPlayer);
	if( victims.length > 1 ){
		for( let i = 0; i < victims.length; i++ ){
			if( victims[i].nameTag != user.nameTag ){
				victims[i].applyDamage( d,{ cause:`override`,damagingEntity:user });
				world.scoreboard.getObjective(`blade`).addScore(user,7);
				victims[i].applyKnockback(0,0,0,0);
				if( bladeItemEnch.hasEnchantment("minecraft:fire_aspect") ){
					victims[i].setOnFire(5);
				}
			}
		}
	}
	else{
		world.scoreboard.getObjective(`blade`).addScore(user,-10);
	}
	world.scoreboard.getObjective(`printlevel`).setScore(user,100);
}

world.afterEvents.itemReleaseUse.subscribe( e => {
	const user = e.source;
	const blade = user.getComponent(EntityComponentTypes.Equippable).getEquipmentSlot(EquipmentSlot.Mainhand);
	print(e.useDuration)
	if ( e.itemStack.typeId.includes(`blade:`) && e.useDuration > 100000 ){
		if( blade.getDynamicProperty("killCount") == undefined ){
			bladeInstant( user,blade );
		}
		if( user.typeId == `minecraft:player` ){
			bladeSoulcal( user,blade );
		}
		
		if( user.isSneaking && (user.isOnGround || user.isJumping) ){
			user.playSound(`swingblade.c`);
			const v = user.getVelocity();
			let abs_v = v.x*v.x + v.z*v.z;
			if( abs_v > 0.01 ){
				abs_v = 0.01
			}
			const d = user.getViewDirection();
			user.applyKnockback(d.x,d.z,abs_v*500,0)
			user.addEffect(`resistance`,8,{ amplifier:255 });
			user.dimension.spawnParticle(`minecraft:large_explosion`,user.location);
		}
		else if( user.isSneaking && !user.isOnGround && !user.isJumping ){
			user.playSound(`swingblade.c`);
			user.applyKnockback(0,0,0,-5);
			world.scoreboard.getObjective(`around`).setScore(user,8);
			user.addEffect(`resistance`,8,{ amplifier:255 });
			user.dimension.spawnParticle(`minecraft:large_explosion`,user.location);
		}
		else {
			if( user.isJumping){
				user.addEffect(`levitation`,5,{ amplifier:5 });
			}
			bladeSwing( user,blade );
		}
	}
	else if( e.itemStack.typeId.includes(`blade:`) && blade.getDynamicProperty("sa") != undefined && e.useDuration < 100000 ){
		const classRef = classReg[blade.getDynamicProperty("sa")];
		const sa = new classRef();
		if( sa.cost <= blade.getDynamicProperty("ProudSoul") ){
			const soul = blade.getDynamicProperty("ProudSoul") - sa.cost;
			blade.setDynamicProperty("ProudSoul", soul );
			const lore = blade.getLore();
			lore[1] = `§rProudSoul: ${soul}`;
			blade.setLore(lore);
			sa.fireSa( blade,user );
		}
	}
} )

world.afterEvents.entityHitEntity.subscribe( e => {
	const attacker = e.damagingEntity;
	if( attacker.getComponent(EntityComponentTypes.Equippable).getEquipment(EquipmentSlot.Mainhand).typeId.includes(`blade:`) ){
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
} )

world.afterEvents.projectileHitEntity.subscribe( e => {
	if( e.projectile.typeId.includes("safire")){
		const classRef = classReg[`${e.projectile.typeId.split(`:`)[1]}`];
		const sa = new classRef();
		const dmg = sa.damage;
		let vict = e.getEntityHit().entity;
		vict.applyDamage(dmg,{ cause:`override`,damagingEntity:e.source });
		let gunName = e.projectile.typeId
		world.scoreboard.getObjective(`blade`).addScore(e.source,7);
		world.scoreboard.getObjective(`printlevel`).setScore(e.source,100);
	}
})

world.afterEvents.entityDie.subscribe( e => {
	let killer = e.damageSource.damagingEntity;
	const loc = e.deadEntity.location;
	if( killer.getComponent(EntityComponentTypes.Equippable).getEquipment(EquipmentSlot.Mainhand).typeId.includes(`blade:`) ){
		const blade = killer.getComponent(EntityComponentTypes.Equippable).getEquipmentSlot(EquipmentSlot.Mainhand);
		const lore = blade.getLore();
		const kill = blade.getDynamicProperty("killCount") + 1;
		blade.setDynamicProperty("killCount",kill);
		killer.dimension.runCommand(`loot spawn ${loc.x} ${loc.y} ${loc.z} loot ps`);
		if( kill >= 1000 ){
			lore[0] = `§r§4KillCount: ${kill}`;
			lore[4] = `§r§6B-A§r/§cS-SSS§r/§5Limit`
		}
		else {
			lore[0] = `§rKillCount: ${kill}`;
		}
		blade.setLore(lore);
	}
})

world.afterEvents.itemCompleteUse.subscribe( e => {
	if ( e.itemStack.typeId.includes(`blade:`) ){
		const user = e.source;
		const blade = user.getComponent(EntityComponentTypes.Equippable).getEquipmentSlot(EquipmentSlot.Mainhand); 
		if( blade.getDynamicProperty("sa") != undefined ){
			const classRef = classReg[blade.getDynamicProperty("sa")];
			const sa = new classRef();
			if( sa.cost <= blade.getDynamicProperty("ProudSoul") ){
				const soul = blade.getDynamicProperty("ProudSoul") - sa.cost;
				blade.setDynamicProperty("ProudSoul", soul );
				const lore = blade.getLore();
				lore[1] = `§rProudSoul: ${soul}`;
				blade.setLore(lore);
				sa.fireSa( blade,user );
			}
		}
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
		player.runCommand(`title @s actionbar §rair.${Rank[r]}${bar}`)
	}
} )