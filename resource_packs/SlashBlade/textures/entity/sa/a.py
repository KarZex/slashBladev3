import json
import_json = """
{
    "format_version": "1.21.30",
    "minecraft:texture_set": {
        "color": "sa_0",
        "metalness_emissive_roughness": "sa_mer"
    }
}
"""

for i in range(1,16):
    data = json.loads(import_json)
    data["minecraft:texture_set"]["color"] = f"sa_{i-1}"
    #data["minecraft:texture_set"]["metalness_emissive_roughness"] = f"sa_mer_{i-1}"
    with open(f"sa_{i-1}.texture_set.json", "w") as f:
        json.dump(data, f, indent=4)