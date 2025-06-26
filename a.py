import json
import csv
import shutil

csv_path = open("blades.csv","r",encoding="utf-8")
csv_reader = csv.reader(csv_path) 
row_count = 0

bladedata_json = json.load(open("tool/bladedata.json","r"))
texture_json = json.load(open("resource_packs/SlashBlade/textures/item_texture.json","r"))
animation_controllers_json = json.load(open("tool/animation_controllers.json","r"))
stand_json = json.load(open("tool/stand.json","r"))
standrp_json = json.load(open("tool/standrp.json","r"))
standrender_json = json.load(open("tool/bladeitem.json","r"))

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
        blade_mate = row[13]


        lang += "item.blade:{}={}\n".format(blade_id,blade_name)

        if( row_count > 1  ):
            anicont += "||"
        anicont += "query.get_equipped_item_name(\'main_hand\') == \'{}\'".format(blade_id)

        bladedata_json["{}".format(blade_id)] = {}
        bladedata_json["{}".format(blade_id)]["damage"] = blade_attack
        bladedata_json["{}".format(blade_id)]["damageplus"] = blade_attack_plus

        stand_json["minecraft:entity"]["component_groups"]["{}".format(blade_id)] = {"minecraft:skin_id": {"value": row_count-1 }}
        newjson = {
          "use_item": False,
          "play_sounds": "enderchest.open",
          "interact_text": "action.gvc.item",
          "on_interact": {
            "filters": {
              "all_of": [
                {
                  "test": "has_equipment",
                  "subject": "other",
                  "domain": "hand",
                  "value": "blade:{}".format(blade_id)
                }
              ]
            },
            "event": "{}".format(blade_id),
            "target": "self"
          }
        }

        stand_json["minecraft:entity"]["components"]["minecraft:interact"]["interactions"].append(newjson)
        stand_json["minecraft:entity"]["events"]["{}".format(blade_id)] = {
            "add": {
                "component_groups": [
                    "{}".format(blade_id)
                ]
            }
        }

        standrp_json["minecraft:client_entity"]["description"]["textures"]["{}".format(blade_id)] = "textures/models/{}".format(blade_id)
        if blade_mate != "":
            standrp_json["minecraft:client_entity"]["description"]["materials"]["{}".format(blade_id)] = "{}".format(blade_mate)
        if blade_geo != "":
            standrp_json["minecraft:client_entity"]["description"]["geometry"]["{}".format(blade_id)] = "geometry.{}".format(blade_geo)
        else:
            standrp_json["minecraft:client_entity"]["description"]["geometry"]["{}".format(blade_id)] = "geometry.{}".format(blade_id)

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

        with open("tool/loot.json","r") as f:
            loot_table = json.load(f)
            loot_table["pools"][0]["entries"][0]["name"] = "blade:{}".format(blade_id)
        
        with open("behavior_packs/SlashBlade/loot_tables/blade/{}.json".format(blade_id),"w") as f:
            json.dump(loot_table,f,indent=2)
            

        with open("tool/ak47.json","r") as f:
            gun_item = json.load(f)
            gun_item["minecraft:attachable"]["description"]["identifier"] = "blade:{}".format(blade_id)
            gun_item["minecraft:attachable"]["description"]["textures"]["default"] = "textures/models/{}".format(blade_id)
            if blade_mate != "":
                gun_item["minecraft:attachable"]["description"]["materials"]["default"] = "{}".format(blade_mate)
            if blade_geo != "":
                gun_item["minecraft:attachable"]["description"]["geometry"]["default"] = "geometry.{}".format(blade_geo)
            else:
                gun_item["minecraft:attachable"]["description"]["geometry"]["default"] = "geometry.{}".format(blade_id)
        with open("resource_packs/SlashBlade/attachables/replace/{}.json".format(blade_id),"w") as f:
            json.dump(gun_item,f,indent=2)

        
        standrender_json["render_controllers"]["controller.render.bladeitem"]["arrays"]["geometries"]["Array.item_geo"].append("geometry.{}".format(blade_id))  
        standrender_json["render_controllers"]["controller.render.bladeitem"]["arrays"]["textures"]["Array.item_texture"].append("texture.{}".format(blade_id))

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

with open("behavior_packs/SlashBlade/entities/bladestand.json","w") as f:
    json.dump(stand_json,f,indent=2)

with open("resource_packs/SlashBlade/entity/bladestand.json","w") as f:
    json.dump(standrp_json,f,indent=2)

with open("resource_packs/SlashBlade/render_controllers/bladeitem.json","w") as f:
    json.dump(standrender_json,f,indent=2)