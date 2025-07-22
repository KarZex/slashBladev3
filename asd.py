import os
import json

path = "behavior_packs/SlashBlade/items"
resource_item_texture = "resource_packs/SlashBlade/textures/item_texture.json"

resource_item_texture_json = json.load(open(resource_item_texture, "r"))
x=0
for cur_dir, dirs, files in os.walk(path):
    for file in files:
        if not file.endswith('.json'):
            continue
        
        try:
            print(file)
            fjson = json.load(open(os.path.join(cur_dir, file),"r"))
            item_texture = fjson["minecraft:item"]["components"]["minecraft:icon"]
            if resource_item_texture_json["texture_data"].get("{}".format(item_texture)) is None:
                resource_item_texture_json["texture_data"]["{}".format(item_texture)] = {
                    "textures": "textures/items/{}".format(item_texture)
                }
        except Exception as e:
            print(e)
            print(file)
            continue

    x += 1


json.dump(resource_item_texture_json, open(resource_item_texture, "w"), indent=2)
    