from flask import Flask, render_template, redirect, request, flash, session, jsonify
from dungeon_model import connect_to_db, db, DMs, Games, Rooms, Players, Player_Actions, Monster_Actions, Monsters
import requests
import json
import re
from random import choices, randint
from support_functions import instantiate_monster, instantiate_player, initiative_sort

app = Flask(__name__)
app.secret_key = 'DNDDEMANDGEN'

@app.route('/')
def serve_homepage():
    """render the homepage with option to sign in or register"""

    return render_template("base.html")


@app.route('/register', methods=['POST'])
def create_new_user():
    """creates new user account with info from the form"""
    """redirects to homepage and flashes success message"""

    user_info = request.data
    user_json = json.loads(user_info)
    user_dict = dict(user_json)
    username = user_dict['username']
    password = user_dict['password']
    print("here we are let's see what we have: ", username, password)
    response = {'message': ''}
    if db.session.query(DMs).filter_by(username=username).first():
        response['message'] = "Username already in use, please try again."
        response['status'] = "failed"
        return jsonify(response)
    new_DM = DMs(username=username,
                 password=password)
    db.session.add(new_DM)
    db.session.commit()
    DM_id = new_DM.dm_id
    response['message'] = "Successfully created account! Please log in."
    response['status'] = "success"
    print(response)
    return jsonify(response)


@app.route('/login', methods=['POST'])
def user_login():
    """takes username and password hash to validate user"""

    results = {'username': False, 'password': False}
    login_info = request.data
    login_json = json.loads(login_info)
    login_dict = dict(login_json)
    username = login_dict['username']
    password = login_dict['password']
    user = db.session.query(DMs).filter_by(username=username).first()
    print(user)
    if user:
        results['username'] = True
        if user.password == password:
            print("password found: ", password)
            results['password'] = True
            results['dm_id'] = user.dm_id
            results['status'] = "success"
            results['message'] = "Successfully logged in!"
            session['dm_id'] = user.dm_id
            print(results)
            return jsonify(results)
        else:
            results['status'] = "failed"
            results['message'] = "Incorrect password, please try again."
            return jsonify(results)
    else:
        print('user not found, results are: ', results)
        results['status'] = "failed"
        results['message'] = "Username not found, please try again."
        return jsonify(results)


@app.route('/logout')
def user_logout():
    """removes auth from session and redirects user to homepage"""

    session['dm_id'] = ''

    return jsonify(session['dm_id'])


@app.route('/new_character', methods=['POST'])
def new_character():
    """adds new player character to the database"""

    char_data = request.data
    char_json = json.loads(char_data)
    print("character info received from app: ", char_json)
    game_id = char_json[0]
    player_list = []
    for character in char_json[1]:
        player = instantiate_player(character, game_id)
        db.session.add(player)
        db.session.commit()
        char_id = player.player_id
        print("added to the db: ", player)
        player_list.append({'name': player.name,
                            'init': player.initiative_mod,
                            'player_id': char_id})
    print("returning characters to the app: ", player_list)

    return jsonify(player_list)


@app.route('/new_game', methods=['GET'])
def create_new_game():
    """creates a new game instance based on the information provided"""
    """returns the game id to the front end so characters can be instantiated"""

    dm_id = session['dm_id']
    game_name = request.args.get('gameName')
    game = Games(dm_id=dm_id,
                name=game_name)
    db.session.add(game)
    db.session.commit()
    game_id = game.game_id
    print("the game id is:", game_id)
    session['game_id'] = game_id

    return jsonify(game_id)


@app.route('/new_room', methods=['GET'])
def new_room_info():
    """serves form about new room to get info from DM"""
    return render_template("base.html")

@app.route('/show_monsters', methods=['POST'])
def create_new_monsters():
    """pulls a new list of monsters according to DM request and displays them"""

    print("show monsters endpoint has been hit")
    URL = 'https://api.open5e.com/monsters/?challenge_rating='
    monst_request = request.data
    monst_json = json.loads(monst_request)
    monst_dict = dict(monst_json)
    print("received from app: ", monst_dict)
    diff = monst_dict['diff']
    num = monst_dict['num']
    call = URL + diff
    response = requests.get(call)
    response_json = json.loads(response.text)
    payload = dict(response_json)
    monst_list = payload['results']
    rand = int(num)
    monst_choices = choices(monst_list, k=rand)
    print("the monsters: ", monst_choices)

    final_monst_list = []
    for monster in monst_choices:
        monst_info = {}
        monst_info['type'] = monster['name']
        monst_info['size'] = monster['size']
        monst_info['ac'] = monster['armor_class']
        monst_info['hp'] = monster['hit_points']
        # dice returns numDnum+num, so break into number, type, bonus
        dice = monster['hit_dice']
        dice_info = re.split(r'\D+', dice)
        if len(dice_info) == 3:
            monst_info['dice_num'], monst_info['dice_type'], monst_info['bonus'] = dice_info
        elif len(dice_info) == 2:
            # not every monster has a bonus, so if not, set bonus to zero
            monst_info['dice_num'], monst_info['dice_type'] = dice_info
            monst_info['bonus'] = 0
        # speed returns a dict with multiple values so parse out
        # monsters usually don't have all speeds so set to zero if not there
        monst_info['speed'] = monster['speed'].get('walk', 0)
        monst_info['burrow'] = monster['speed'].get('burrow', 0)
        monst_info['swim'] = monster['speed'].get('swim', 0)
        monst_info['fly'] = monster['speed'].get('fly', 0)
        if monster['speed'].get('hover'):
            monst_info['hover'] = 'Yes'
        else:
            monst_info['hover'] = 'No'
        monst_info['str'] = monster['strength']
        monst_info['dex'] = monster['dexterity']
        monst_info['con'] = monster['constitution']
        monst_info['int'] = monster['intelligence']
        monst_info['wis'] = monster['wisdom']
        monst_info['cha'] = monster['charisma']
        # this is a temporary game id so that it can be updated when combat starts
        # monst_info['game_id'] = 'null'
        this_monst = instantiate_monster(monst_info)
        db.session.add(this_monst)
        db.session.commit()
        monst_info['initiative_mod'] = this_monst.initiative_mod
        monst_info['monster_id'] = this_monst.monster_id
        final_monst_list.append(monst_info)
        print("monster ", monst_info['monster_id'], " added to db")
    print("monsters sent to db")

    return jsonify(final_monst_list)


@app.route('/monster_update')
def update_monster_game():
    """add the game id of the newly instantiated game to the extant monsters"""

    game_id = request.args.get('gameId')
    monsters = db.session.query(Monsters).filter(Monsters.game_id.is_(None)).all()
    print("here are my monsters: ", monsters)
    for monster in monsters:
        monster.game_id = game_id
        print("this has been updated: ", monster)
    db.session.commit()
    message = "updated"

    return jsonify(message)


@app.route('/view_monster')
def view_monster():
    """just access a monster record, like you do"""

    game_id = request.args.get('gameId')
    monsters = db.session.query(Monsters).filter(game_id=game_id).all()
    print("here are the monsters in this session: ")
    monst_list = []
    for monster in monsters:
        monst_list.append(monster.monster_id)
    print("This is what we put in monst list: ", monst_list)

    return jsonify(monst_list)


@app.route('/view_player')
def view_player():
    """just access a player record, like you do"""

    game_id = request.args.get('gameId')
    players = db.session.query(Players).filter(game_id=game_id).all()
    print("here are the players in this session: ")
    player_list = []
    for player in players:
        player_list.append(player.player_id)
    print("This is what we put in player list: ", player_list)

    return jsonify(player_list)

@app.route('/load_room')
def load_room():
    """loads up a saved room from the list of available rooms"""

# retrieve room
#     loads up monster stats, initiative list, player info
#     puts room id, game id into session cookie

@app.route('/roll_initiative')
def roll_initiative():
    """rolls initiative for the characters and monsters"""
    """pulls init mod from db, randomizes d20 roll, writes current roll to db"""

    monster_id = request.args.get('monsterId')
    player_id = request.args.get('playerId')
    if monster_id:
        monster = db.session.query(Monsters).filter_by(monster_id=monster_id).first()
        initiative_roll = monster.initiative_mod + randint(1, 20)
        monster.initiative_roll = initiative_roll
    elif player_id:
        player = db.session.query(Players).filter_by(player_id=player_id).first()
        initiative_roll = player.initiative_mod + randint(1, 20)
        player.initiative_roll = initiative_roll
    db.session.commit()

    return jsonify(initiative_roll)


@app.route('/order_initiative')
def initiative_order():
    """pulls all the currently rolled initiative for this game and returns in order"""

    game_id = request.args.get('gameId')
    monsters = db.session.query(Monsters).filter_by(game_id=game_id).all()
    players = db.session.query(Players).filter_by(game_id=game_id).all()
    characters = []
    characters.extend(monsters)
    characters.extend(players)
    print("calling init for: ", characters)
    init_order = []
    for character in characters:
        if character.type == 'mon':
            init_order.append([character.initiative_roll, character.monster_id, "monst"])
        elif character.type == 'pla':
            init_order.append([character.initiative_roll, character.player_id, "player"])
    print("passing this to get sorted: ", init_order)
    ordered_init = initiative_sort(init_order)
    final_init = []
    for i in range(len(ordered_init)):
        if ordered_init[i][2] == 'monst':
            final_init.append({'id': ordered_init[i][1], 'init': ordered_init[i][0], 'type': 'mon'})
        elif ordered_init[i][2] == 'player':
            final_init.append({'id': ordered_init[i][1], 'init': ordered_init[i][0], 'type': 'play'})
    print("final results of initiative ordering: ", final_init)

    return jsonify(final_init)


@app.route('/turn_action', methods=['GET'])
def turn_action():
    """cycles through the turn options for a move--player vs. monster passed as arg"""
    """triggered by clicking 'turn' in initiative column when live"""
    """first prompts to move--either click to square, or click on self to stay"""
    """then offers option for attack, calls attack calculation function"""
    """if char_type monster, calculates the damage and returns it"""
    """if char_type player, launches dialog box to get damage from DM"""
    """commits any attack info, movement to db"""
    """calls function to advance to next in the initiative list"""

# track turns
#     highlights the current player on initiative list
#     prompts DM for movement (click done when done)
#     prompts DM if attacking yes or no
#     if yes, prompts for attack rolls if PC and who attacking - calculates damage received
#     if monster attacking, rolls the damage
#     requests target then calculates damage received based on target
#     check if any other moves? if no, continue to next character
#     highlights the next character and loops

@app.route('/roll_monster_attack', methods=['GET'])
def monster_attack():
    """calculates how much damage a monster has done"""

    monster_id = request.args.get('monster_id')
    crit = request.args.get('crit')
    monster = db.session.query(Monsters).filter_by(monster_id=monster_id).first()
    dice_num = monster.hit_dice_num
    dice_type = monster.hit_dice_type
    damage = 0
    print("we got ", monster_id, " with dice of ", dice_num, "d", dice_type, " and crit status of: ", crit)
    if crit:
        roll_num = dice_num * 2
    else:
        roll_num = dice_num
    for i in range(roll_num):
        damage = damage + randint(1, dice_type)
    print("total damage rolled: ", damage)
    if monster.bonus:
        damage = damage + monster.bonus
    print("with bonus: ", damage)

    return jsonify(damage)

@app.route('/roll_monster_damage', methods=['GET'])
def player_attack():
    """calculates how much damage a monster has received"""
    """monster ID, player ID, and damage roll as args in URL"""
    """calculates monster's new total HP and checks if dead or not"""
    """updates monster's HP on sidebar, commits to DB"""

    monster_id = request.args.get('monster_id')
    damage = int(request.args.get('damage'))
    current_hp = int(request.args.get('hp'))
    print("the hp passed in from the app is: ", current_hp)
    # add check for player id later when I have the ability to do that
    # calculate damage based on armor class and total damage, then return the updated HP
    monster = db.session.query(Monsters).filter_by(monster_id=monster_id).first()
    if current_hp == 0:
        current_hp = monster.total_hp
        print("the monster in the db has: ", monster.total_hp)
    print("show me my monster! ", monster)
    print("final current HP is: ", current_hp)
    new_hp = current_hp - damage
    if new_hp < 1:
        monster.species = "Dead"
        monster.total_hp = 0
        db.session.commit()
        new_hp = "dead"

    return jsonify(new_hp)


@app.route('/close_room', methods=['POST'])
def close_room():
    """commits all room status to db for future reference, flags done if needed"""
    """room id, game id, room complete or not passed in body/session"""
    """sets all current squares to db"""
    """dumps room and game id from session"""
    """redirects back to game listing page"""

# close room
#     save room status preserves the room as it is and makes the monsters reloadable
#     complete room flags that the room is done and not to be re-entered, removes from playable list
#     dumps room id and game id from session cookie
#     returns to game listing page
#
# update HP
#     done manually by the DM for players

@app.route('/view_stats')
def view_player_stats():
    """updates stat page with current info for the game"""
    """shows number of kills and damage by each player"""
    """shows by current room and by total campaign"""
    """shows perhaps a chart or two???"""

# calculate player stats
#     every time a player makes an attack, recalculate:
#     #or should this just be done when the view is changed to the stats page?
#         most damage done to monsters
#         most killing blows
#         average damage per player (of the group, and individually)
#         total kills
#         available for that room and also for the whole game, toggle switch? tab?
#
# move character
#     advanced! not MVP!
#     double click on character to activate
#     click on square to move to
#     mouse over other characters to get option to attack
#     if attack, point to roll damage (for PC, can be manually entered)
#     etc

if __name__ == '__main__':

    connect_to_db(app)
    app.run(debug=True, port=5000, host='0.0.0.0')
