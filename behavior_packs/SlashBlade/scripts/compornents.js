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

world.beforeEvents.worldInitialize.subscribe( e => {
    e.blockComponentRegistry.registerCustomComponent(`zex:glowth`,{onPlayerInteract: slashBladeRiceInteractEvent});
    e.blockComponentRegistry.registerCustomComponent(`zex:growing`,{onRandomTick: slashBladeRiceGrowingEvent});
} )