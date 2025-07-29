import { world,BlockPermutation, Block,EntityComponentTypes,EquipmentSlot, system } from "@minecraft/server";

function slashBlade7CropsInteractEvent( event ){
    const user = event.player;
    const block = event.block;
    const item = user.getComponent(EntityComponentTypes.Equippable).getEquipmentSlot(EquipmentSlot.Mainhand);
    if ( item.typeId == `minecraft:bone_meal` ){
        const level =  event.block.permutation.getState(`zex:growth`);
        if( level < 7 ){
            const nextLlevel = Math.min(7,level + Math.floor(1+ Math.random() * 3));
            block.setPermutation(block.permutation.withState(`zex:growth`,nextLlevel));
            event.dimension.spawnParticle(`minecraft:crop_growth_emitter`,{x:block.location.x+0.5,y:block.location.y,z:block.location.z+0.5});
        }
    }
}
function slashBlade7CropsGrowingEvent( event ){
    const block = event.block;
    const level =  event.block.permutation.getState(`zex:growth`);
    const rand = Math.random();
        if( level < 7 && rand < 1/4  ){
        block.setPermutation(block.permutation.withState(`zex:growth`,1 + level));
    }
}

function slashBlade6CropsInteractEvent( event ){
    const user = event.player;
    const block = event.block;
    const item = user.getComponent(EntityComponentTypes.Equippable).getEquipmentSlot(EquipmentSlot.Mainhand);
    if ( item.typeId == `minecraft:bone_meal` ){
        const level =  event.block.permutation.getState(`zex:growth`);
        if( level < 6 ){
            const nextLlevel = Math.min(6,level + Math.floor( 1 + Math.random() * 3));
            block.setPermutation(block.permutation.withState(`zex:growth`,nextLlevel));
            event.dimension.spawnParticle(`minecraft:crop_growth_emitter`,{x:block.location.x+0.5,y:block.location.y,z:block.location.z+0.5});
        }
    }
}
function slashBlade6CropsGrowingEvent( event ){
    const block = event.block;
    const level =  event.block.permutation.getState(`zex:growth`);
    const rand = Math.random();
    if( level < 6 && rand < 1/4  ){
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
                const nextLlevel = Math.min(5,level + Math.floor(1+ Math.random() * 2));
                block.setPermutation(block.permutation.withState(`zex:growth`,nextLlevel));
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
    const rand = Math.random();
    if( level < 5 && rand < 1/4  ){
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
    const rand = Math.random();
    if ( level != `nothing` && rand < 1/8 ){
        block.setPermutation(block.permutation.withState(`zex:water`,"nothing"));
    }
}
function slashBladeStandInteractEvent( event ){
    const user = event.player;
    const block = event.block;
    const item = user.getComponent(EntityComponentTypes.Equippable).getEquipmentSlot(EquipmentSlot.Mainhand);
    const view =  event.block.permutation.getState(`minecraft:cardinal_direction`);
    if ( item.typeId.includes(`blade:`) ){
        try{
            const e = user.dimension.getEntities({
                maxDistance:1,
                location:block.location,
                type:`zex:bladestand1`
            })
            for( let p of e ){
                p.remove();
            }
        }catch{}
        const summon = user.dimension.spawnEntity(`zex:bladestand1`,{x:block.location.x+0.5,y:block.location.y,z:block.location.z+0.5});
        //summon.getComponent(EntityComponentTypes.Equippable).setEquipment(`mainhand`,item);
        summon.runCommand(`replaceitem entity @s slot.weapon.mainhand 0 ${item.typeId}`);
        summon.addEffect(`invisibility`,19999999,{ showParticles:false });
        if( view == "north" ){
            summon.teleport({x:block.location.x+0.5,y:block.location.y,z:block.location.z+0.5},{ rotation:{ x:0,y:180 } })
        }
        else if( view == "west" ){
            summon.teleport({x:block.location.x+0.5,y:block.location.y,z:block.location.z+0.5},{ rotation:{ x:0,y:90 } })
        }
        else if( view == "east" ){
            summon.teleport({x:block.location.x+0.5,y:block.location.y,z:block.location.z+0.5},{ rotation:{ x:0,y:-90 } })
        }
    }
}
function slashBladeStandInteract2Event( event ){
    const user = event.player;
    const block = event.block;
    const item = user.getComponent(EntityComponentTypes.Equippable).getEquipmentSlot(EquipmentSlot.Mainhand);
    const view =  event.block.permutation.getState(`minecraft:cardinal_direction`);
    if ( item.typeId.includes(`blade:`) ){
        try{
            const e = user.dimension.getEntities({
                maxDistance:1,
                location:block.location,
                type:`zex:bladestand2`
            })
            for( let p of e ){
                p.remove();
            }
        }catch{}
        const summon = user.dimension.spawnEntity(`zex:bladestand2`,{x:block.location.x+0.5,y:block.location.y,z:block.location.z+0.5});
        //summon.getComponent(EntityComponentTypes.Equippable).setEquipment(`mainhand`,item);
        summon.runCommand(`replaceitem entity @s slot.weapon.mainhand 0 ${item.typeId}`);
        summon.addEffect(`invisibility`,19999999,{ showParticles:false });
        if( view == "north" ){
            summon.teleport({x:block.location.x+0.5,y:block.location.y,z:block.location.z+0.5},{ rotation:{ x:0,y:180 } })
        }
        else if( view == "west" ){
            summon.teleport({x:block.location.x+0.5,y:block.location.y,z:block.location.z+0.5},{ rotation:{ x:0,y:90 } })
        }
        else if( view == "east" ){
            summon.teleport({x:block.location.x+0.5,y:block.location.y,z:block.location.z+0.5},{ rotation:{ x:0,y:-90 } })
        }
    }
}

function slashBladeStandBreakEvent( event ){
    const d = event.dimension;
    const block = event.block;
    try{
        const e = d.getEntities({
            maxDistance:1,
            location:block.location,
            type:`zex:bladestand1`
        })
        for( let p of e ){
            p.remove();
        }
    }catch{}
}
function slashBladeStandBreak2Event( event ){
    const d = event.dimension;
    const block = event.block;
    try{
        const e = d.getEntities({
            maxDistance:1,
            location:block.location,
            type:`zex:bladestand2`
        })
        for( let p of e ){
            p.remove();
        }
    }catch{}
}
function slashBladeNoodleEvent( event ){
    const d = event.dimension;
    const block = event.block;
    const level =  event.block.permutation.getState(`zex:noodle`);
    const rand = Math.random();
    if( level == 0 && rand < 1/8 ){
        block.setPermutation(block.permutation.withState(`zex:noodle`,1));
    }
}
function slashBladeNoodleCutEvent( event ){
    const user = event.player;
    const d = event.dimension;
    const block = event.block;
    const blockType = block.typeId.split(`:`)[1];
    const item = user.getComponent(EntityComponentTypes.Equippable).getEquipmentSlot(EquipmentSlot.Mainhand);
    if( item.typeId.includes(`blade:`) ){
        event.dimension.runCommand(`loot spawn ${block.location.x+0.5} ${block.location.y} ${block.location.z+0.5} loot "blocks/${blockType}_raw"`);
        event.dimension.setBlockType(block.location,`minecraft:air`);
    }
}

world.beforeEvents.worldInitialize.subscribe( e => {
    e.blockComponentRegistry.registerCustomComponent(`zex:glowth7`,{onPlayerInteract: slashBlade7CropsInteractEvent});
    e.blockComponentRegistry.registerCustomComponent(`zex:growing7`,{onRandomTick: slashBlade7CropsGrowingEvent});
    e.blockComponentRegistry.registerCustomComponent(`zex:glowth6`,{onPlayerInteract: slashBlade6CropsInteractEvent});
    e.blockComponentRegistry.registerCustomComponent(`zex:growing6`,{onRandomTick: slashBlade6CropsGrowingEvent});
    e.blockComponentRegistry.registerCustomComponent(`zex:campfire`,{onPlayerInteract: slashBladeCampfireEvent});
    e.blockComponentRegistry.registerCustomComponent(`zex:campfire_cooking_pot_fire_start`,{onPlayerInteract: slashBladeCookingPotStartFireEvent});
    e.blockComponentRegistry.registerCustomComponent(`zex:campfire_cooking_pot_fire`,{onRandomTick: slashBladeCookingPotFireEvent});
    e.blockComponentRegistry.registerCustomComponent(`zex:campfire_cooking_pot_liq`,{onPlayerInteract: slashBladeCookingPotLiqEvent});
    e.blockComponentRegistry.registerCustomComponent(`zex:campfire_cooking_pot_liqX`,{onRandomTick: slashBladeCookingPotLiqXEvent});
    e.blockComponentRegistry.registerCustomComponent(`zex:campfire_particle`,{onTick: slashBladeCookingPotparticleEvent});
    e.blockComponentRegistry.registerCustomComponent(`zex:pepper_splint_glowth`,{onPlayerInteract: slashBladePepperInteractEvent});
    e.blockComponentRegistry.registerCustomComponent(`zex:pepper_splint_growing`,{onRandomTick: slashBladePepperGrowingEvent});
    e.blockComponentRegistry.registerCustomComponent(`zex:pepper_splint_place`,{beforeOnPlayerPlace: slashBladePepperPlaceEvent});
    e.blockComponentRegistry.registerCustomComponent(`zex:bladestand1`,{onPlayerInteract: slashBladeStandInteractEvent});
    e.blockComponentRegistry.registerCustomComponent(`zex:bladestand2`,{onPlayerInteract: slashBladeStandInteract2Event});
    e.blockComponentRegistry.registerCustomComponent(`zex:bladestand1b`,{onPlayerDestroy: slashBladeStandBreakEvent});
    e.blockComponentRegistry.registerCustomComponent(`zex:bladestand2b`,{onPlayerDestroy: slashBladeStandBreak2Event});
    e.blockComponentRegistry.registerCustomComponent(`zex:noodle`,{onStepOn: slashBladeNoodleEvent});
    e.blockComponentRegistry.registerCustomComponent(`zex:noodle2`,{onPlayerInteract: slashBladeNoodleCutEvent});
} )