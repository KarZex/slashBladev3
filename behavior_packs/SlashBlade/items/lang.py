import json
import os
#read all file with all sub directory .json file
directory = './' 
item_names = ""
for root, dirs, files in os.walk(directory):
    for file in files:
        if file.endswith('.json'):
            file_path = os.path.join(root, file)
            with open(file_path, 'r', encoding='utf-8') as f:
                try:
                    data = json.load(f)
                    item_id = data["minecraft:item"]["description"]["identifier"]
                    item_name = item_id.split(':')[1]
                    item_name = item_name.replace('_', ' ').title()
                    item_names += "item.{0}={1}\n".format(item_id, item_name)

                except json.JSONDecodeError as e:
                    print(f"Error decoding JSON from {file_path}: {e}")


with open("en_US.lang", "w", encoding='utf-8') as lang_file:
    lang_file.write(item_names)
