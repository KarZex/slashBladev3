import json
import csv
import shutil

csv_path = open("blades.csv","r")
csv_reader = csv.reader(csv_path) 
row_count = 0

bladedata_json = json.load(open("tool/bladedata.json","r"))
texture_json = json.load(open("resource_packs/SlashBlade/textures/item_texture.json","r"))
animation_controllers_json = json.load(open("tool/animation_controllers.json","r"))

text = ""
anicont = ""
lang = ""

for row in csv_reader:
    if row_count == 0:
        row_count += 1
        continue
    else:
        blade_id = row[1]
        blade_name = row[0]
        blade_attack = int(row[2])
        blade_attack_plus = int(row[3])
        blade_durability = int(row[4])
        blade_ench1 = row[5]
        blade_ench2 = row[6]
        blade_ench3 = row[7]
        blade_ench4 = row[8]
        blade_ench5 = row[9]
        blade_insa = row[10]
        blade_rare = row[11]
        blade_geo = row[12]


        lang += "item.blade:{}={}\n".format(blade_id,blade_name)

        if( row_count > 1  ):
            anicont += "||"
        anicont += "query.get_equipped_item_name(\'main_hand\') == \'{}\'".format(blade_id)

        bladedata_json["{}".format(blade_id)] = {}
        bladedata_json["{}".format(blade_id)]["damage"] = blade_attack
        bladedata_json["{}".format(blade_id)]["damageplus"] = blade_attack_plus
        if blade_ench1 != "":
            Ench = blade_ench1.split("-")
            print(Ench)
            bladedata_json["{}".format(blade_id)]["ench1"] = {}
            bladedata_json["{}".format(blade_id)]["ench1"]["id"] = Ench[0]
            bladedata_json["{}".format(blade_id)]["ench1"]["lvl"] = int(Ench[1])
        if blade_ench2 != "":
            Ench = blade_ench2.split("-")
            bladedata_json["{}".format(blade_id)]["ench2"] = {}
            bladedata_json["{}".format(blade_id)]["ench2"]["id"] = Ench[0]
            bladedata_json["{}".format(blade_id)]["ench2"]["lvl"] = int(Ench[1])
        if blade_ench3 != "":
            Ench = blade_ench3.split("-")
            bladedata_json["{}".format(blade_id)]["ench3"] = {}
            bladedata_json["{}".format(blade_id)]["ench3"]["id"] = Ench[0]
            bladedata_json["{}".format(blade_id)]["ench3"]["lvl"] = int(Ench[1])
        if blade_ench4 != "":
            Ench = blade_ench4.split("-")
            bladedata_json["{}".format(blade_id)]["ench4"] = {}
            bladedata_json["{}".format(blade_id)]["ench4"]["id"] = Ench[0]
            bladedata_json["{}".format(blade_id)]["ench4"]["lvl"] = int(Ench[1])
        if blade_ench5 != "":
            Ench = blade_ench5.split("-")
            bladedata_json["{}".format(blade_id)]["ench5"] = {}
            bladedata_json["{}".format(blade_id)]["ench5"]["id"] = Ench[0]
            bladedata_json["{}".format(blade_id)]["ench5"]["lvl"] = int(Ench[1])
        if blade_insa != "":
            bladedata_json["{}".format(blade_id)]["insa"] = blade_insa

        with open("tool/blade.json","r") as f:
            gun_item = json.load(f)
            gun_item["minecraft:item"]["description"]["identifier"] = "blade:{}".format(blade_id)
            gun_item["minecraft:item"]["components"]["minecraft:icon"] = "{}".format(blade_id)
            gun_item["minecraft:item"]["components"]["minecraft:damage"]["value"] = blade_attack
            gun_item["minecraft:item"]["components"]["minecraft:durability"]["max_durability"] = blade_durability
            if blade_rare != "":
                gun_item["minecraft:item"]["components"]["minecraft:rarity"] = blade_rare
        
        with open("behavior_packs/SlashBlade/items/blade/{}.json".format(blade_id),"w") as f:
            json.dump(gun_item,f,indent=2)

        texture_json["texture_data"]["{}".format(blade_id)] = {"textures":"textures/items/blade/{}".format(blade_id)}
            

        with open("tool/ak47.json","r") as f:
            gun_item = json.load(f)
            gun_item["minecraft:attachable"]["description"]["identifier"] = "blade:{}".format(blade_id)
            gun_item["minecraft:attachable"]["description"]["textures"]["default"] = "textures/models/{}".format(blade_id)
            if blade_geo != "":
                gun_item["minecraft:attachable"]["description"]["geometry"]["default"] = "geometry.{}".format(blade_geo)
            else:
                gun_item["minecraft:attachable"]["description"]["geometry"]["default"] = "geometry.{}".format(blade_id)
        with open("resource_packs/SlashBlade/attachables/replace/{}.json".format(blade_id),"w") as f:
            json.dump(gun_item,f,indent=2)

        row_count += 1


animation_controllers_json["animation_controllers"]["controller.animation.player.root"]["states"]["third_person"]["animations"][2]["move.arms"] = "!( {} )".format(anicont)
animation_controllers_json["animation_controllers"]["controller.animation.player.root"]["states"]["third_person"]["animations"][16]["use_item_progress"] = "( variable.use_item_interval_progress > 0.0 ) || ( variable.use_item_startup_progress > 0.0 ) && !variable.is_brandishing_spear && !variable.is_holding_spyglass && !query.is_item_name_any('slot.weapon.mainhand', 'minecraft:bow') && !( {} )".format(anicont)
with open("behavior_packs/SlashBlade/scripts/blade.json","w") as f:
    json.dump(bladedata_json,f,indent=2)
with open("behavior_packs/SlashBlade/scripts/blade.json","r") as f:
    export = "import { EntityDamageCause } from \"@minecraft/server\";\nexport const bladeData = " 
    export += f.read()
    export += ";"
with open("behavior_packs/SlashBlade/scripts/blade.js","w") as f:
    f.write(export)

with open("resource_packs/SlashBlade/animation_controllers/player.animation_controllers.json","w") as f:
    json.dump(animation_controllers_json,f,indent=2)

    
with open("resource_packs/SlashBlade/textures/item_texture.json","w") as f:
    json.dump(texture_json,f,indent=2)

with open("resource_packs/SlashBlade/texts/blade.txt","w") as f:
    f.write(lang)