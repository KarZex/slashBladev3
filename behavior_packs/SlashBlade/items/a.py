import os
import json

for file in os.listdir('.'):
    if not file.endswith('.json'):
        continue
    
    try:
        print(file)
        fjson = json.load(open(file,"r"))
        fjson["format_version"] = "1.21.0"
        fjson["minecraft:item"]["description"]["menu_category"] = {"category": "items" }
        if "category" in fjson["minecraft:item"]["description"]:
            del fjson["minecraft:item"]["description"]["category"]
        if "minecraft:creative_category" in fjson["minecraft:item"]["components"]:
            del fjson["minecraft:item"]["components"]["minecraft:creative_category"]
        fjson["minecraft:item"]["components"]["minecraft:icon"] = fjson["minecraft:item"]["components"]["minecraft:icon"]["texture"]
        
        json.dump(fjson,open("{}".format(file),"w"),indent=2)
    except Exception as e:
        print(e)
        print(file)
        continue
    


    