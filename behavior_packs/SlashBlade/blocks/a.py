import os
import json

for file in os.listdir('.'):
    if not file.endswith('.json'):
        continue
    
    try:
        data_json = json.load(open("a.json","r"))
        print(file)
        fjson = json.load(open(file,"r"))
        data_json["minecraft:block"]["description"]["identifier"] = fjson["minecraft:block"]["description"]["identifier"]
        if "minecraft:material_instances" in fjson["minecraft:block"]["components"]:
            data_json["minecraft:block"]["components"]["minecraft:material_instances"] = fjson["minecraft:block"]["components"]["minecraft:material_instances"]

        if "minecraft:loot" in fjson["minecraft:block"]["components"]:
            data_json["minecraft:block"]["components"]["minecraft:loot"] = fjson["minecraft:block"]["components"]["minecraft:loot"]

        
        if "minecraft:geometry" in fjson["minecraft:block"]["components"]:
            data_json["minecraft:block"]["components"]["minecraft:geometry"] = fjson["minecraft:block"]["components"]["minecraft:geometry"]
        elif "minecraft:unit_cube" in fjson["minecraft:block"]["components"]:
            data_json["minecraft:block"]["components"]["minecraft:geometry"] = "minecraft:geometry.full_block"

        if "minecraft:block_light_emission" in fjson["minecraft:block"]["components"]:
            data_json["minecraft:block"]["components"]["minecraft:light_emission"] = 15

        if "minecraft:block_light_absorption" in fjson["minecraft:block"]["components"]:
            data_json["minecraft:block"]["components"]["minecraft:light_dampening"] = 0

        if "minecraft:aim_collision" in fjson["minecraft:block"]["components"]:
            data_json["minecraft:block"]["components"]["minecraft:selection_box"] = fjson["minecraft:block"]["components"]["minecraft:aim_collision"]

        if "minecraft:block_collision" in fjson["minecraft:block"]["components"]:
            data_json["minecraft:block"]["components"]["minecraft:collision_box"] = fjson["minecraft:block"]["components"]["minecraft:block_collision"]

        if "minecraft:destroy_time" in fjson["minecraft:block"]["components"]:
            data_json["minecraft:block"]["components"]["minecraft:destructible_by_mining"] = {}
            data_json["minecraft:block"]["components"]["minecraft:destructible_by_mining"]["seconds_to_destroy"] = fjson["minecraft:block"]["components"]["minecraft:destroy_time"]
        
        json.dump(data_json,open("{}".format(file),"w"),indent=2)
    except Exception as e:
        print(e)
        print(file)
        continue
    


    