import json
import os

directory_food = "./behavior_packs/SlashBlade/items/food/new"
directory_recipe = "./behavior_packs/SlashBlade/recipes/cooking_pot_water"
directory_texture = "./resource_packs/SlashBlade/textures/item_texture.json"

def set_texture(id):
    resource_item_texture_json = json.load(open(directory_texture, "r"))

    resource_item_texture_json["texture_data"]["{}".format(id)] = { "textures": "textures/items/food/{}".format(id) }

    with open( directory_texture,"w" ) as f:
        json.dump(resource_item_texture_json,f,indent=2)

def create_item(noodle):
    item_names = ""
    for root, dirs, files in os.walk(directory_food):
        for file in files:
            if "ramen" in file:
                file_path = os.path.join(root, file)
                with open(file_path, 'r', encoding='utf-8') as f:
                    try:
                        data = json.load(f)
                        item_id = data["minecraft:item"]["description"]["identifier"]
                        item_id = item_id.split(':')[1]
                        item_id = item_id.replace("ramen", noodle)
                        data["minecraft:item"]["description"]["identifier"] = "zex:{}".format(item_id)
                        data["minecraft:item"]["components"]["minecraft:icon"] = item_id   
                        set_texture(item_id)

                    except json.JSONDecodeError as e:
                        print(f"Error decoding JSON from {file_path}: {e}")
                
                file_path = os.path.join(root, file.replace("ramen", noodle))
                with open(file_path, 'w', encoding='utf-8') as f:
                    json.dump(data, f, indent=2)
    
    for root, dirs, files in os.walk(directory_recipe):
        for file in files:
            if "ramen" in file:
                file_path = os.path.join(root, file)
                with open(file_path, 'r', encoding='utf-8') as f:
                    try:
                        data = json.load(f)
                        data["minecraft:recipe_shaped"]["description"]["identifier"] = data["minecraft:recipe_shaped"]["description"]["identifier"].replace("ramen", noodle)
                        data["minecraft:recipe_shaped"]["key"]["A"]["item"] = data["minecraft:recipe_shaped"]["key"]["A"]["item"].replace("ramen", noodle)
                        data["minecraft:recipe_shaped"]["result"]["item"] = data["minecraft:recipe_shaped"]["result"]["item"].replace("ramen", noodle)


                    except json.JSONDecodeError as e:
                        print(f"Error decoding JSON from {file_path}: {e}")

                file_path = os.path.join(root, file.replace("ramen", noodle))
                with open(file_path, 'w', encoding='utf-8') as f:
                    json.dump(data, f, indent=2)

def main():
    create_item("udon")
    create_item("soba")

if __name__ == "__main__":
    main()