import { world,BlockPermutation, Block,EntityComponentTypes,EquipmentSlot, system } from "@minecraft/server";

function slashBlade7CropsInteractEvent( event ){
    const user = event.player;
    const block = event.block;
    const item = user.getComponent(EntityComponentTypes.Equippable).getEquipmentSlot(EquipmentSlot.Mainhand);
    if ( item.typeId == `minecraft:bone_meal` ){
        const level =  event.block.permutation.getState(`zex:growth`);
        if( level < 7 ){
            block.setPermutation(block.permutation.withState(`zex:growth`,1 + level));
            event.dimension.spawnParticle(`minecraft:crop_growth_emitter`,{x:block.location.x+0.5,y:block.location.y,z:block.location.z+0.5});
        }
    }
}
function slashBlade7CropsGrowingEvent( event ){
    const block = event.block;
    const level =  event.block.permutation.getState(`zex:growth`);
    if( level < 7 ){
        block.setPermutation(block.permutation.withState(`zex:growth`,1 + level));
    }
}

function slashBladePepperInteractEvent( event ){
    const user = event.player;
    const block = event.block;
    try{
        const item = user.getComponent(EntityComponentTypes.Equippable).getEquipmentSlot(EquipmentSlot.Mainhand);
        if ( item.typeId == `minecraft:bone_meal` ){
            const level =  event.block.permutation.getState(`zex:growth`);
            if( level < 5 ){
                block.setPermutation(block.permutation.withState(`zex:growth`,1 + level));
                event.dimension.spawnParticle(`minecraft:crop_growth_emitter`,{x:block.location.x+0.5,y:block.location.y,z:block.location.z+0.5});
            }
        }
        else if ( item.typeId == `zex:peppercorn_red` ){
            const level =  event.block.permutation.getState(`zex:growth`);
            if( level == 6 ){
                block.setPermutation(block.permutation.withState(`zex:growth`,0));
            }
        }
    } 
    catch{
        const level =  event.block.permutation.getState(`zex:growth`);
        if( level == 4 ){
            block.setPermutation(block.permutation.withState(`zex:growth`,2)); 
            event.dimension.runCommand(`loot spawn ${block.location.x+0.5} ${block.location.y} ${block.location.z+0.5} loot "blocks/peppercorn_green_loot"`);
        }
        else if( level == 5 ){
            block.setPermutation(block.permutation.withState(`zex:growth`,2));
            event.dimension.runCommand(`loot spawn ${block.location.x+0.5} ${block.location.y} ${block.location.z+0.5} loot "blocks/peppercorn_red_loot"`);
        }
    }
}
function slashBladePepperGrowingEvent( event ){
    const block = event.block;
    const level =  event.block.permutation.getState(`zex:growth`);
    if( level < 5 ){
        block.setPermutation(block.permutation.withState(`zex:growth`,1 + level));
    }
}
async function slashBladePepperPlaceEvent( event ){
    const block = event.block;
    await system.waitTicks(1);
    const level =  event.block.permutation.getState(`zex:growth`);
    block.setPermutation(block.permutation.withState(`zex:growth`,6));
}
function slashBladeCampfireEvent( event ){
    const user = event.player;
    const block = event.block;
    const item = user.getComponent(EntityComponentTypes.Equippable).getEquipmentSlot(EquipmentSlot.Mainhand);
    if ( item.typeId == `zex:cooking_pot` ){
        event.dimension.setBlockType(block.location,`zex:campfire_cooking_pot`);
    }
}

function slashBladeCookingPotFireEvent( event ){
    const block = event.block;
    const level =  event.block.permutation.getState(`zex:isFire`);
    if( level > 0 ){
        block.setPermutation(block.permutation.withState(`zex:isFire`,0));
    }
}
function slashBladeCookingPotStartFireEvent( event ){
    const user = event.player;
    const block = event.block;
    const item = user.getComponent(EntityComponentTypes.Equippable).getEquipmentSlot(EquipmentSlot.Mainhand);
    if ( item.typeId == `minecraft:flint_and_steel` ){
        block.setPermutation(block.permutation.withState(`zex:isFire`,1));
    }
}
function slashBladeCookingPotparticleEvent( event ){
    const block = event.block;
    event.dimension.spawnParticle(`minecraft:mobflame_single`,{x:block.location.x+0.5,y:block.location.y,z:block.location.z+0.5});
}

function slashBladeCookingPotLiqEvent( event ){
    const user = event.player;
    const block = event.block;
    const item = user.getComponent(EntityComponentTypes.Equippable).getEquipmentSlot(EquipmentSlot.Mainhand);
    if ( item.typeId == `minecraft:water_bucket` ){
        block.setPermutation(block.permutation.withState(`zex:water`,"water"));
        user.runCommand(`replaceitem entity @s slot.weapon.mainhand 0 minecraft:bucket`);
    }
    else if ( item.typeId == `zex:oil_bucket` ){
        block.setPermutation(block.permutation.withState(`zex:water`,"oil"));
        user.runCommand(`replaceitem entity @s slot.weapon.mainhand 0 minecraft:bucket`);
    }
}
function slashBladeCookingPotLiqXEvent( event ){
    const block = event.block;
    const level =  event.block.permutation.getState(`zex:water`);
    if ( level != `nothing` ){
        block.setPermutation(block.permutation.withState(`zex:water`,"nothing"));
    }
}


world.beforeEvents.worldInitialize.subscribe( e => {
    e.blockComponentRegistry.registerCustomComponent(`zex:glowth7`,{onPlayerInteract: slashBlade7CropsInteractEvent});
    e.blockComponentRegistry.registerCustomComponent(`zex:growing7`,{onRandomTick: slashBlade7CropsGrowingEvent});
    e.blockComponentRegistry.registerCustomComponent(`zex:campfire`,{onPlayerInteract: slashBladeCampfireEvent});
    e.blockComponentRegistry.registerCustomComponent(`zex:campfire_cooking_pot_fire_start`,{onPlayerInteract: slashBladeCookingPotStartFireEvent});
    e.blockComponentRegistry.registerCustomComponent(`zex:campfire_cooking_pot_fire`,{onRandomTick: slashBladeCookingPotFireEvent});
    e.blockComponentRegistry.registerCustomComponent(`zex:campfire_cooking_pot_liq`,{onPlayerInteract: slashBladeCookingPotLiqEvent});
    e.blockComponentRegistry.registerCustomComponent(`zex:campfire_cooking_pot_liqX`,{onRandomTick: slashBladeCookingPotLiqXEvent});
    e.blockComponentRegistry.registerCustomComponent(`zex:campfire_particle`,{onTick: slashBladeCookingPotparticleEvent});
    e.blockComponentRegistry.registerCustomComponent(`zex:pepper_splint_glowth`,{onPlayerInteract: slashBladePepperInteractEvent});
    e.blockComponentRegistry.registerCustomComponent(`zex:pepper_splint_growing`,{onRandomTick: slashBladePepperGrowingEvent});
    e.blockComponentRegistry.registerCustomComponent(`zex:pepper_splint_place`,{beforeOnPlayerPlace: slashBladePepperPlaceEvent});
} )