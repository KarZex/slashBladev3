import { world, system, EquipmentSlot, EntityComponentTypes, TicksPerSecond, ItemComponentTypes,EnchantmentType  } from "@minecraft/server";
import { ActionFormData, ModalFormData } from "@minecraft/server-ui";
import { bladeData } from "./blade";

export class drive {
  cost = 10
  fireSa( blade, user ){
    user.playSound(`swingblade.sab`);
    const soul = blade.getDynamicProperty("ProudSoul") - 10;
    blade.setDynamicProperty("ProudSoul", soul );
    const lore = blade.getLore();
    lore[1] = `§rProudSoul: ${soul}`;
    blade.setLore(lore);
    let FirePos = user.location
    FirePos.y = FirePos.y + 1
    const fire = user.dimension.spawnEntity(`fire:airblade`,FirePos);
    fire.getComponent(`minecraft:projectile`).owner = user
    fire.getComponent(`minecraft:projectile`).shoot( user.getViewDirection() );
  }
}

export class slashdimension {
  cost = 10
  fireSa( blade, user ){
    user.playSound(`swingblade.sab`);
    const soul = blade.getDynamicProperty("ProudSoul") - 10;
    blade.setDynamicProperty("ProudSoul", soul );
    const lore = blade.getLore();
    lore[1] = `§rProudSoul: ${soul}`;
    blade.setLore(lore);
    let FirePos = user.location
    FirePos.y = FirePos.y + 1
    const fire = user.dimension.spawnEntity(`fire:airblade`,FirePos);
    fire.getComponent(`minecraft:projectile`).owner = user
    fire.getComponent(`minecraft:projectile`).shoot( user.getViewDirection() );
  }
}

export const classReg = {
  drive,
  slashdimension
}