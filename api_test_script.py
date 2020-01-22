"""script to test and practice getting the desired info from the open5e api"""

import requests
import json
import re
from random import choices

URL = 'https://api.open5e.com/monsters/?challenge_rating='

def get_monster_list(diff, num):
    """call the API to get the list of monsters"""

    call = URL + diff
    response = requests.get(call)
    response_json = json.loads(response.text)
    payload = dict(response_json)
    monst_list = payload['results']
    rand = int(num)
    monst_choices = choices(monst_list, k=rand)

    final_monst_list = []
    for monster in monst_choices:
        monst_info = {}
        monst_info['type'] = monster['slug']
        monst_info['size'] = monster['size']
        monst_info['ac'] = monster['armor_class']
        monst_info['hp'] = monster['hit_points']
        dice = monster['hit_dice']
        dice_info = re.split(r'\D+', dice)
        monst_info['dice_num'], monst_info['dice_type'], monst_info['bonus'] = dice_info
        monst_info['speed'] = monster['speed']
        # speed returns a dict with different types of movement and speed... OH NO
        monst_info['str'] = monster['strength']
        monst_info['dex'] = monster['dexterity']
        monst_info['con'] = monster['constitution']
        monst_info['int'] = monster['intelligence']
        monst_info['wis'] = monster['wisdom']
        monst_info['cha'] = monster['charisma']
        final_monst_list.append(monst_info)

    return final_monst_list


print("Let's call some random monsters for D&D 5e!")
print(" ")
diff = input("How difficult would you like the monsters to be? >>> ")
num = input("How many monsters would you like to receive? >>> ")
print("Okay, summoning your monsters...")
print("...")
print("...")
print("...")
print("Monsters are here!\n", get_monster_list(diff, num))
