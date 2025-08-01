import { world, system, EquipmentSlot, EntityComponentTypes, TicksPerSecond, ItemComponentTypes,EnchantmentType, EntityDamageCause, EnchantmentTypes  } from "@minecraft/server";
import { ActionFormData, ModalFormData } from "@minecraft/server-ui";
import { bladeData } from "./blade";
import { classReg, drive, slashdimension } from "./saData";
import "./compornents";

const Rank = [ `D`,`C`,`B`,`A`,`1S`,`2S`,`3S`,`3S` ];

const allies = [
	`villager`
]


function print( text ){
	world.sendMessage(`§a[debug]§r:${text}`)
}
function setBladeDamage( damage,user ){
	let chance = 1;
	const bladeSlot = user.getComponent(EntityComponentTypes.Equippable).getEquipmentSlot(EquipmentSlot.Mainhand);
	const Tblade = user.getComponent(EntityComponentTypes.Equippable).getEquipment(EquipmentSlot.Mainhand);
	const bladeItemEnch = Tblade.getComponent(ItemComponentTypes.Enchantable);
	if( bladeItemEnch.hasEnchantment(`minecraft:unbreaking`) ){
		const level = bladeItemEnch.getEnchantment(`minecraft:unbreaking`).level;
		chance = level
	}
	const dmgCom = Tblade.getComponent(ItemComponentTypes.Durability);
	const Adamage = dmgCom.damage + damage;
	const MaxDamage = dmgCom.maxDurability;
	if( Math.random() < 1/chance ){
		if( Adamage < MaxDamage  ){
			Tblade.getComponent(ItemComponentTypes.Durability).damage = Adamage;
			Tblade.setDynamicProperty("currentDurability",Adamage);
			user.getComponent("minecraft:inventory").container.setItem(user.selectedSlotIndex, Tblade);
		}
		else {
			Tblade.getComponent(ItemComponentTypes.Durability).damage = MaxDamage;
			Tblade.setDynamicProperty("currentDurability",MaxDamage);
			user.getComponent("minecraft:inventory").container.setItem(user.selectedSlotIndex, Tblade);
			user.dimension.playSound(`random.break`,user.location);
		}
	}

}

world.beforeEvents.playerBreakBlock.subscribe( e => {
	const block = e.block;
	const dimensiontype = e.dimension.id;
	const dimension = world.getDimension(dimensiontype);
	if( block.typeId.includes(`short_grass`) || block.typeId.includes(`tall_grass`) ){
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

async function bladeSwing( user,blade,IsOnGround ){
	user.playSound(`swingblade.c`);
	const bladeItemEnch = blade.getItem().getComponent(ItemComponentTypes.Enchantable);
	const level = world.scoreboard.getObjective(`blade`).getScore(user);
	let d = callDamage( blade,level );
	const victims = user.dimension.getEntities({location:user.location,maxDistance:5,excludeTypes:[`item`,`xp_orb`] });
	let knockback = false;
	let knockbackpower = 0.5;
	let comboG = 0;
	if(IsOnGround == true){
		const combo = world.scoreboard.getObjective(`groundcomboA`).getScore(user);
		comboG = combo;
		world.scoreboard.getObjective(`groundcomboA`).addScore(user,1);
		if( combo >= 3 ){
			world.scoreboard.getObjective(`groundcomboA`).setScore(user,0);
			d = d * 1.5;
			user.dimension.spawnParticle(`minecraft:critical_hit_emitter`,{x:user.location.x,y:user.location.y+1,z:user.location.z});
			knockback = true;
		}
		world.scoreboard.getObjective(`combocool`).setScore(user,20);
	}
	else if(IsOnGround == false){
		const combo = world.scoreboard.getObjective(`aircomboA`).getScore(user);
		comboG = combo;
		world.scoreboard.getObjective(`aircomboA`).addScore(user,1);
		if( combo == 3 ){
			d = d * 1.2;
			user.dimension.spawnParticle(`minecraft:critical_hit_emitter`,{x:user.location.x,y:user.location.y+1,z:user.location.z});
			knockback = true;
			knockbackpower = 1;
		}
		else if( combo >= 4 ){
			world.scoreboard.getObjective(`aircomboA`).setScore(user,0);
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
	const PerLocation = user.location;
	await system.waitTicks(20);
	if( PerLocation == user.location ){
		print(`aaaaaaa`)
	}
}
function bladeSwingProjectile( user ){
	const victims = user.dimension.getEntities({location:user.location,maxDistance:5 });
	if( victims.length > 1 ){
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
world.afterEvents.itemReleaseUse.subscribe( async e => {
	const user = e.source;
	const blade = user.getComponent(EntityComponentTypes.Equippable).getEquipmentSlot(EquipmentSlot.Mainhand);
	const Tblade = user.getComponent(EntityComponentTypes.Equippable).getEquipment(EquipmentSlot.Mainhand);
	const dmgCom = Tblade.getComponent(ItemComponentTypes.Durability);	
	if ( e.itemStack.typeId.includes(`blade:`) && e.useDuration > 100010 && dmgCom.damage < dmgCom.maxDurability ){
		
		if( user.isSneaking && (user.isOnGround || user.isJumping) ){
			user.playSound(`swingblade.c`);
			const v = user.getVelocity();
			let abs_v = 5;
			const d = user.getViewDirection();
			user.applyKnockback(d.x,d.z,abs_v,0)
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
			bladeSwing( user,blade,user.isOnGround );
		}
	}
	else if( e.itemStack.typeId.includes(`blade:`) && blade.getDynamicProperty("sa") != undefined && e.useDuration <= 100010 ){
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
	for( let i = 0; i < 5; i++ ){
		await system.waitTicks(1)
		bladeSwingProjectile( user );
	}
} )

world.afterEvents.entityHitEntity.subscribe( e => {
	const attacker = e.damagingEntity;
	const victim = e.hitEntity;
	if( attacker.typeId == `minecraft:player` ){
		if( attacker.getComponent(EntityComponentTypes.Equippable).getEquipment(EquipmentSlot.Mainhand).typeId.includes(`blade:`) ){
			const score = world.scoreboard.getObjective(`blade`).getScore( attacker );
			const blade = attacker.getComponent(EntityComponentTypes.Equippable).getEquipment(EquipmentSlot.Mainhand);
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
			const dmg = callDamage(attacker.getComponent(EntityComponentTypes.Equippable).getEquipment(EquipmentSlot.Mainhand),world.scoreboard.getObjective(`blade`).getScore(attacker));
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
		const dmg = sa.damage;
		let vict = e.getEntityHit().entity;
		vict.applyDamage(dmg,{ cause:`override`,damagingEntity:e.source });
		let gunName = e.projectile.typeId
		world.scoreboard.getObjective(`blade`).addScore(e.source,7);
		world.scoreboard.getObjective(`printlevel`).setScore(e.source,100);
	}
	else if( e.projectile.typeId == "safire:vdrive" ){
		const classRef = classReg[`${e.projectile.typeId.split(`:`)[1]}`];
		const sa = new classRef();
		const dmg = sa.damage;
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
		const dmg = sa.damage;
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
				killer.dimension.runCommand(`loot spawn ${loc.x} ${loc.y} ${loc.z} loot ps`);
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
			const bladeItemEnch = blade.getItem().getComponent(ItemComponentTypes.Enchantable);
			const victims = fire.dimension.getEntities({location:fire.location,maxDistance:1.5,excludeTypes:[`item`,`xp_orb`] });
			if( victims.length > 1 ){
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
			bladeSoulcal( user,blade );
			if( user.isOnGround ){
				world.scoreboard.getObjective(`aircomboA`).setScore(user,0);
			}
			else if( !user.isOnGround ){
				world.scoreboard.getObjective(`groundcomboA`).setScore(user,0);
			}
		}
	}
})