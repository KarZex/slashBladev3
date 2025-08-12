import { world, system, Entity,ItemComponentTypes,EntityComponentTypes,EquipmentSlot  } from "@minecraft/server";
import { bladeData } from "./blade";
import { bladeImmuneEntities } from "./config"

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
    let distance_z = (V2.z - V1.z) * (V2.z - V1.z);
    return Math.sqrt(distance_x + distance_y + distance_z);
}

export function isMoving(user){
    const v = user.getVelocity();
    return (absVector3(v) > 0.01)
}

export function isSpeedMoving(user){
    const v = user.getVelocity();
    return (absVector3(v) > 0.1)
}

export function roundTo(value, decimals) {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}


export function print( text ){
    world.sendMessage(`§a[debug]§r:${text}`)
}
export function setBladeDamage( damage,user ){
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

export function callDamage( blade, score ){
    const bladeItemEnch = blade.getItem().getComponent(ItemComponentTypes.Enchantable);
    const bladeId = blade.typeId.split(`:`)[1];
    const atk = bladeData[`${bladeId}`][`damage`];
    const atkPlus = blade.getDynamicProperty("damage");
    const overkill = blade.getDynamicProperty("killCount") >= 1000;
    let damage = 0;
    if( score < 32 * 2 ){
        damage = 2;
    }
    else if( score >= 32 * 2 && score < 32 * 4 ){
        damage = atk;
    }
    else if( score >= 32 * 4 && score < 150 && overkill == false ){
        damage = atk;
    }
    else if( score >= 32 * 4 && score < 150 && overkill == true ){
        damage = atkPlus;
    }
    else if ( score >= 150 ){
        damage = atkPlus;
    }
    
    if( bladeItemEnch.hasEnchantment("minecraft:sharpness") ){
        const EnchLevel = bladeItemEnch.getEnchantment("minecraft:sharpness").level;
        damage += EnchLevel * 2;
    }//smite
    if( bladeItemEnch.hasEnchantment("minecraft:smite") ){
        const EnchLevel = bladeItemEnch.getEnchantment("minecraft:smite").level;
        damage += EnchLevel * 2;
    }//smite
    return damage;
}

export function playBladeSound(user,sound){
	if( sound == `item.trident.throw` ){
		user.dimension.playSound( sound,user.location,{ pitch:0.7, volume:3 });
	}
    else{
        user.dimension.playSound( sound,user.location,{ pitch:1, volume:3 });
    }
}