from dungeon_model import Monsters, Players

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
    initiative_mod = monst_info['dex']
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
                       int=int)

    return monster
