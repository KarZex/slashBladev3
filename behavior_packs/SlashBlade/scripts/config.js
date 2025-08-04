import { world,BlockPermutation, Block,EntityComponentTypes,EquipmentSlot, system } from "@minecraft/server";

//抜刀剣の攻撃を無効化するエンティティ
//The list of entities that are immune to blade attacks
export const bladeImmuneEntities = [
    `armor_stand`,
    `area_effect_cloud`,
    `bat`,
    `bee`,
    `item`,
    `xp_orb`,
    `moo_shroom`,
    `wandering_trader`,
    `llama`,
    `lightning_bolt`,
    `villager`,
    `cow`,
    `pig`,
    `sheep`,
    `chicken`,
    `horse`,
    `donkey`,
    `allay`,
    `cat`,
    `fox`,
    `ocelot`,
    `parrot`,
    `rabbit`,
    `turtle`,
    `wolf`,
    `iron_golem`,
    `snow_golem`
]