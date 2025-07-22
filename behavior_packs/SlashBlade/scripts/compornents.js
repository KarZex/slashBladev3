import { world,BlockPermutation, Block,EntityComponentTypes,EquipmentSlot } from "@minecraft/server";

function slashBladeRiceInteractEvent( event ){
    const user = event.player;
    const block = event.block;
    const item = user.getComponent(EntityComponentTypes.Equippable).getEquipmentSlot(EquipmentSlot.Mainhand);
    if ( item.typeId == `minecraft:bone_meal` ){
        const level =  event.block.permutation.getState(`zex:growth`);
        if( level < 4 ){
            block.setPermutation(block.permutation.withState(`zex:growth`,1 + level));
            event.dimension.spawnParticle(`minecraft:crop_growth_emitter`,{x:block.location.x+0.5,y:block.location.y,z:block.location.z+0.5});
        }
    }
}
function slashBladeRiceGrowingEvent( event ){
    const block = event.block;
    const level =  event.block.permutation.getState(`zex:growth`);
    if( level < 4 ){
        block.setPermutation(block.permutation.withState(`zex:growth`,1 + level));
    }
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
    e.blockComponentRegistry.registerCustomComponent(`zex:glowth`,{onPlayerInteract: slashBladeRiceInteractEvent});
    e.blockComponentRegistry.registerCustomComponent(`zex:growing`,{onRandomTick: slashBladeRiceGrowingEvent});
    e.blockComponentRegistry.registerCustomComponent(`zex:campfire`,{onPlayerInteract: slashBladeCampfireEvent});
    e.blockComponentRegistry.registerCustomComponent(`zex:campfire_cooking_pot_fire_start`,{onPlayerInteract: slashBladeCookingPotStartFireEvent});
    e.blockComponentRegistry.registerCustomComponent(`zex:campfire_cooking_pot_fire`,{onRandomTick: slashBladeCookingPotFireEvent});
    e.blockComponentRegistry.registerCustomComponent(`zex:campfire_cooking_pot_liq`,{onPlayerInteract: slashBladeCookingPotLiqEvent});
    e.blockComponentRegistry.registerCustomComponent(`zex:campfire_cooking_pot_liqX`,{onRandomTick: slashBladeCookingPotLiqXEvent});
    e.blockComponentRegistry.registerCustomComponent(`zex:campfire_particle`,{onTick: slashBladeCookingPotparticleEvent});
} )