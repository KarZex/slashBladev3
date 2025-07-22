import json
id = str(input())

path = "item_texture.json"
resource_item_texture_json = json.load(open(path, "r"))

resource_item_texture_json["texture_data"]["{}".format(id)] = { "textures": "textures/items/food/{}".format(id) }

with open( path,"w" ) as f:
    json.dump(resource_item_texture_json,f,indent=2)