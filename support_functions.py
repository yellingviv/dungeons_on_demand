from dungeon_model import Monsters, Players
import re
import math

def initiative_sort(init_order):
    """sorts all the characters for a given combat by initiative"""

    print("passed into sort function: ", init_order)
    for i in range(len(init_order) - 1):
        check = init_order[i]
        print("the check is: ", check, " and i is: ", i)
        index = i
        while index > 0 and init_order[index - 1][0] > check[0]:
            init_order[index] = init_order[index - 1]
            index = index - 1
        init_order[index] = check
    print("we will return init order as: ", init_order)

    return init_order


def instantiate_player(player_info, game_id):
    """receives info about player and adds to the DB"""

    game_id = game_id
    character = player_info
    name = character['name']
    char_name = name.title()
    char_init = character['init']
    new_character = Players(name=char_name,
                            game_id=game_id,
                            initiative_mod=char_init,
                            type='pla')
    print("we just created: ", new_character)

    return new_character


def instantiate_monster(monst_info):
    """receives dictionary of monster info and adds to DB"""

    # room_id = 10
    species = monst_info['type']
    size = monst_info['size']
    ac = monst_info['ac']
    total_hp = monst_info['hp']
    hit_dice_num = monst_info['dice_num']
    hit_dice_type = monst_info['dice_type']
    bonus = monst_info['bonus']
    speed = monst_info['speed']
    burrow = monst_info['burrow']
    swim = monst_info['swim']
    fly = monst_info['fly']
    hover = monst_info['hover']
    str = monst_info['str']
    dex = monst_info['dex']
    con = monst_info['con']
    wis = monst_info['wis']
    cha = monst_info['cha']
    int = monst_info['int']
    initiative = (monst_info['dex'] - 10) / 2
    initiative_mod = math.trunc(initiative)
    # game_id = monst_info['game_id']
    monster = Monsters(# room_id=room_id,
                       species=species,
                       size=size,
                       total_hp=total_hp,
                       ac=ac,
                       hit_dice_num=hit_dice_num,
                       hit_dice_type=hit_dice_type,
                       bonus=bonus,
                       initiative_mod=initiative_mod,
                       speed=speed,
                       burrow=burrow,
                       swim=swim,
                       fly=fly,
                       hover=hover,
                       str=str,
                       dex=dex,
                       con=con,
                       wis=wis,
                       cha=cha,
                       int=int,
                       type='mon')
                       # game_id=game_id)

    return monster
