"""utility script to load database with test data"""

from sqlalchemy import func
from dungeon_model import DMs, Games, Rooms, Players, Monsters, Monster_Actions, Player_Actions
from dungeon_model import connect_to_db, db
from dungeons_on_demand import app

def load_dms():
    """fill in the DM table"""

    print("DMs seeding...")
    DMs.query.delete()
    for row in open("test_data/mock_DMs.csv"):
        row = row.rstrip()
        dm_id, username, password = row.split(",")
        dm = DMs(dm_id=dm_id,
                 username=username,
                 password=password)
        db.session.add(dm)
    db.session.commit()

def load_games():
    """fill in the games table"""

    print("Games seeding...")
    Games.query.delete()
    for row in open("test_data/mock_games.csv"):
        row = row.rstrip()
        game_id, dm_id, name = row.split(",")
        game = Games(game_id=game_id,
                     dm_id=dm_id,
                     name=name)
        db.session.add(game)
    db.session.commit()

def load_rooms():
    """fill in the rooms table"""

    print("Rooms seeding...")
    Rooms.query.delete()
    for row in open("test_data/mock_rooms.csv"):
        row = row.rstrip()
        room_id, width, length, game_id, level, complete = row.split(",")
        room = Rooms(room_id=room_id,
                     width=width,
                     length=length,
                     game_id=game_id,
                     level=level,
                     complete=bool(complete.capitalize()))
        db.session.add(room)
    db.session.commit()

def load_players():
    """fill in the players table"""

    print("Players seeding...")
    Players.query.delete()
    for row in open("test_data/mock_players.csv"):
        row = row.rstrip()
        player_info = row.split(",")
        player_id, name, game_id, species, total_hp, ac, hit_dice_num, hit_dice_type,\
        initiative_mod, initiative_roll, speed, current_square = player_info[:12]
        player = Players(player_id=player_id,
                         name=name,
                         game_id=game_id,
                         species=species,
                         total_hp=total_hp,
                         ac=ac,
                         hit_dice_num=hit_dice_num,
                         hit_dice_type=hit_dice_type,
                         initiative_mod=initiative_mod,
                         initiative_roll=initiative_roll,
                         speed=speed,
                         current_square=current_square)
        db.session.add(player)
    db.session.commit()

def load_monsters():
    """fill in the monster table"""

    print("Monsters seeding...")
    Monsters.query.delete()
    for row in open("test_data/mock_monsters.csv"):
        row = row.rstrip()
        monster_info = row.split(",")
        monster_id, room_id, species, total_hp, ac, hit_dice_num, hit_dice_type,\
        initiative_mod, initiative_roll, speed, current_square = monster_info[:11]
        monster = Monsters(monster_id=monster_id,
                           room_id=room_id,
                           species=species,
                           total_hp=total_hp,
                           ac=ac,
                           hit_dice_num=hit_dice_num,
                           hit_dice_type=hit_dice_type,
                           initiative_mod=initiative_mod,
                           initiative_roll=initiative_roll,
                           speed=speed,
                           current_square=current_square)
        db.session.add(monster)
    db.session.commit()

def load_player_actions():
    """fill in the player_actions table"""

    print("Player actions seeding...")
    Player_Actions.query.delete()
    for row in open("test_data/mock_player_actions.csv"):
        row = row.rstrip()
        action_id, player_id, distance, monster_id, damage, room_id = row.split(",")
        action = Player_Actions(action_id=action_id,
                                player_id=player_id,
                                distance=distance,
                                monster_id=monster_id,
                                damage=damage,
                                room_id=room_id)
        db.session.add(action)
    db.session.commit()

def load_monster_actions():
    """fill in the monster_actions table"""

    print("Monster actions seeding...")
    Monster_Actions.query.delete()
    for row in open("test_data/mock_monster_actions.csv"):
        row = row.rstrip()
        action_id, monster_id, distance, player_id, damage, room_id = row.split(",")
        action = Monster_Actions(action_id=action_id,
                                monster_id=monster_id,
                                distance=distance,
                                player_id=player_id,
                                damage=damage,
                                room_id=room_id)
        db.session.add(action)
    db.session.commit()

def set_val_id_increments():
    """set the id to increment from following the seeding"""
    """yes I know this is ugly and janky and horrifying but so it goes"""

    print("Setting new working ids...")

    result = db.session.query(func.max(DMs.dm_id)).one()
    max_id = int(result[0])
    query = "SELECT setval('dms_dm_id_seq', :new_id)"
    db.session.execute(query, {'new_id': max_id + 1})
    db.session.commit()

    result = db.session.query(func.max(Games.game_id)).one()
    max_id = int(result[0])
    query = "SELECT setval('games_game_id_seq', :new_id)"
    db.session.execute(query, {'new_id': max_id + 1})
    db.session.commit()

    result = db.session.query(func.max(Rooms.room_id)).one()
    max_id = int(result[0])
    query = "SELECT setval('rooms_room_id_seq', :new_id)"
    db.session.execute(query, {'new_id': max_id + 1})
    db.session.commit()

    result = db.session.query(func.max(Players.player_id)).one()
    max_id = int(result[0])
    query = "SELECT setval('players_player_id_seq', :new_id)"
    db.session.execute(query, {'new_id': max_id + 1})
    db.session.commit()

    result = db.session.query(func.max(Monsters.monster_id)).one()
    max_id = int(result[0])
    query = "SELECT setval('monsters_monster_id_seq', :new_id)"
    db.session.execute(query, {'new_id': max_id + 1})
    db.session.commit()

    result = db.session.query(func.max(Player_Actions.action_id)).one()
    max_id = int(result[0])
    query = "SELECT setval('pl_actions_action_id_seq', :new_id)"
    db.session.execute(query, {'new_id': max_id + 1})
    db.session.commit()

    result = db.session.query(func.max(Monster_Actions.action_id)).one()
    max_id = int(result[0])
    query = "SELECT setval('mstr_actions_action_id_seq', :new_id)"
    db.session.execute(query, {'new_id': max_id + 1})
    db.session.commit()

if __name__ == "__main__":
    connect_to_db(app)

    # In case tables haven't been created, create them
    db.create_all()

    # FIRE ZE DATA
    load_dms()
    load_games()
    load_rooms()
    load_players()
    load_monsters()
    load_player_actions()
    load_monster_actions()
    set_val_id_increments()
    print("Data seeded!")
