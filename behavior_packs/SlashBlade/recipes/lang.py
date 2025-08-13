import json
import os
#read all file with all sub directory .json file
def search_json(obj, target):
    results = []

    def recursive_search(o, path=""):
        if isinstance(o, dict):
            for k, v in o.items():
                new_path = f"{path}.{k}" if path else k
                if target == k or target == v:
                    results.append((new_path, v))
                recursive_search(v, new_path)
        elif isinstance(o, list):
            for i, item in enumerate(o):
                item_path = f"{path}[{i}]"
                recursive_search(item, item_path)
        else:
            if target == o:
                results.append((path, o))

    recursive_search(obj)
    return results


def replace_value(obj, old, new):
    if isinstance(obj, dict):
        return {k: replace_value(v, old, new) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [replace_value(item, old, new) for item in obj]
    elif obj == old:
        return new
    else:
        return obj


directory = './' 
item_names = ""
for root, dirs, files in os.walk(directory):
    for file in files:
        if file.endswith('.json'):
            file_path = os.path.join(root, file)
            with open(file_path, 'r', encoding='utf-8') as f:
                try:
                    data = json.load(f)
                    if( len(search_json(data,"minecraft:egg")) > 0 ):
                        data_blue = replace_value(data,"minecraft:egg", "minecraft:egg_blue")
                        data_brown = replace_value(data,"minecraft:egg", "minecraft:egg_brown")
                        file_path_blue = file_path.replace(".json","_blue.json")
                        file_path_brown = file_path.replace(".json","_brown.json")
                        with open(file_path_blue,"w") as f:
                            idaaaa = data_blue["minecraft:recipe_shaped"]["description"]["identifier"]
                            data_blue["minecraft:recipe_shaped"]["description"]["identifier"] = idaaaa + "_blue"
                            json.dump(data_blue,f,indent=2)
                        with open(file_path_brown,"w") as f:
                            idaaaa = data_brown["minecraft:recipe_shaped"]["description"]["identifier"]
                            data_brown["minecraft:recipe_shaped"]["description"]["identifier"] = idaaaa + "_brown"
                            json.dump(data_brown,f,indent=2)


                except json.JSONDecodeError as e:
                    print(f"Error decoding JSON from {file_path}: {e}")
            




with open("en_US.lang", "w", encoding='utf-8') as lang_file:
    lang_file.write(item_names)
