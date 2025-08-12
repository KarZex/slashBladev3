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
    `snow_golem`,
    `zex:bladestand1`,
    `zex:bladestand2`,
    `zex:chair`,
    `zex:bladeshadow`
]
//エネミーステップを無効化するエンティティ
//The list of entities that are immune to EnemyStep
export const bladeNoEnemyStepEntities = [
    `area_effect_cloud`,
    `item`,
    `xp_orb`,
    `lightning_bolt`,
    `zex:bladestand1`,
    `zex:bladestand2`,
    `zex:chair`,
    `zex:bladeshadow`
]

export const SNEAK_TIME = 2