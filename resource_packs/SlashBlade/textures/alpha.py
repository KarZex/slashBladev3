#no png image warning

import os
import json
path = "item_texture.json"
resource_item_texture_json = json.load(open(path, "r"))

for item in resource_item_texture_json["texture_data"]:
    texture_path = resource_item_texture_json["texture_data"][item]["textures"].replace("textures/", "")
    if not os.path.exists("{texture_path}.png".format(texture_path=texture_path)):
        print(f"Warning! Texture file {texture_path}.png for item {item} does not exist.")
        continue