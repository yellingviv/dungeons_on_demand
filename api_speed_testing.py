"""another test script to figure out the different speed options that will be returned"""

import requests
import json
import re
from random import choice

URL = 'https://api.open5e.com/monsters/'

def get_speed_list():
    """call the API to get all the speeds"""

    response = requests.get(URL)
    response_json = json.loads(response.text)
    monst_dict = dict(response_json)
    monsters = monst_dict['results']

    monsters_walk = []
    monsters_climb = []
    monsters_burrow = []
    monsters_fly = []
    monsters_swim = []
    speeds = {}
    for monster in monsters:
        if monster['speed'].get('walk'):
            monsters_walk.append(monster['type'])
        if monster['speed'].get('climb'):
            monsters_climb.append(monster['type'])
        if monster['speed'].get('burrow'):
            monsters_burrow.append(monster['type'])
        if monster['speed'].get('fly'):
            if monster['speed'].get('hover'):
                monsters_fly.append(monster['type'] + '+HOV')
            else:
                monsters_fly.append(monster['type'])
        if monster['speed'].get('swim'):
            monsters_swim.append(monster['type'])
    speeds['walk'] = monsters_walk
    speeds['climb'] = monsters_climb
    speeds['burrow'] = monsters_burrow
    speeds['fly'] = monsters_fly
    speeds['swim'] = monsters_swim

    return speeds

def test_monster_model():
    """call the API to get some monster options and parse speeds"""

    response = requests.get(URL)
    response_json = json.loads(response.text)
    monst_dict = dict(response_json)
    monsters = monst_dict['results']

    test_monster = choice(monsters)

    type = test_monster['name']
    size = test_monster['size']
    ac = test_monster['armor_class']
    hp = test_monster['hit_points']
    dice_info = re.split(r'\D+', test_monster['hit_dice'])
    if len(dice_info) == 3:
        dice_num, dice_type, bonus = dice_info
    elif len(dice_info) == 2:
        dice_num, dice_type = dice_info
        bonus = 0
    walk = test_monster['speed'].get('walk', 0)
    burrow = test_monster['speed'].get('burrow', 0)
    swim = test_monster['speed'].get('swim', 0)
    fly = test_monster['speed'].get('fly', 0)
    hover = test_monster['speed'].get('hover', False)

    print('Type: ', type)
    print('Size: ', size)
    print('AC: ', ac)
    print('HP: ', hp)
    print('Hit dice: ' + str(dice_num) + ' d' + str(dice_type), '+' + str(bonus))
    print('Walking: ', walk)
    print('Burrowing: ', burrow)
    print('Swimming: ', swim)
    print('Flying: ' + str(fly) +',', 'Hovering: ', hover)
