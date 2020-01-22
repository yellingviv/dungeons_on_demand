from flask import Flask, render_template, redirect, request, flash, session
from dungeon_model import connect_to_db, db, DMs, Games, Rooms, Players, Player_Actions, Monster_Actions, Monsters
from passlib.context import CryptContext

app = Flask(__name__)
app.secret_key = 'DNDDEMANDGEN'

if __name__ == '__main__':
    connect_to_db(app)
    app.run(port=5000, host='0.0.0.0')

pwd = CryptContext(schemes=['bcrypt'], deprecated='auto')

#####
# some pseudo code just to get shit down
#####

@app.route('/')
def serve_homepage():
    """render the homepage with option to sign in or register"""

@app.route('/register', methods=['GET'])
def registration():
    """render the registration page for new users"""

@app.route('/register', methods=['POST'])
def create_new_user():
    """creates new user account with info from the form"""
    """redirects to homepage and flashes success message"""

@app.route('/login', methods=['POST'])
def user_login():
    """takes username and password hash to validate user"""
    """adds auth to session, renders DM homepage with games and rooms"""

@app.route('/logout')
def user_logout():
    """removes auth from session and redirects user to homepage"""

# create dm account
#     username, autoincrement id
#     hash password and store the hash!!
#
# log in to dm account
#     hash=pwd.hash('thepassword')
#     pwd.verify('thepassword', hash) #returns true or false
#     #figure out how to hash on the front end and just pass the hash, so I only store hashes
#     #maybe use a front end JS library instead and just save the hash on creation?
#     #I think I'm actually not going to use this library, I'm changing my mind on it
#     add to session cookie that verified
#     directs to DM screen with list of games and their Rooms
#     button for new game on side, button for new room in each game room list
#
# log out of dm account
#     dump that session cookie
#     redirect to log in screen

@app.route('/new_game', methods=['GET'])
def new_game_info():
    """serves form about new game to get info from DM"""

@app.route('/new_game', methods=['POST'])
def create_new_game():
    """creates a new game instance based on the information provided"""
    """redirects back to DM dashboard with game now shown"""

# create new game
#     input player information
#     give it a name
#     return to game list showing the new game available

@app.route('/new_room', methods=['GET'])
def new_room_info():
    """serves form about new room to get info from DM"""

@app.route('/new_room', methods=['POST'])
def create_new_room():
    """creates new room based on the information provided"""
    """renders page with new room spread and data sidebar"""

# create new room
#     associated with a game
#     pass level and number of monsters
#     return monster info from api
#     give positioning of monsters
#     put the room id, game id into the session cookie

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

# roll initiative
#     rolls for monsters and players based on mods
#     creates list of initiative rolls, writes to db

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
    """receives monster ID and player ID as args in URL"""
    """calculates total damage and damage player took based on AC"""
    """updates player's HP and commits info to db"""

# roll monster damage
#     randomize on number of dice and type
#     return the damage value

@app.route('/roll_monster_damage', methods=['GET'])
def player_attack():
    """calculates how much damage a monster has received"""
    """monster ID, player ID, and damage roll as args in URL"""
    """calculates monster's new total HP and checks if dead or not"""
    """updates monster's HP on sidebar, commits to DB"""

# calculate damage received
#     total damage and armor class modifier
#     for monster, check if damage more than HP and if yes, return "dead", if no, update HP
#     return damage received

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

@app.route('/change_view')
def show_new_view():
    """switches the currently visible layer--board, or stats"""
    """uses CSS classes to toggle visible or not"""
    """sets a flag in the session"""
    """redirects to the appropriate route--view stats, view room"""
# change view
#     changes which layer is currently visible -- game board, player stats
#
# move character
#     advanced! not MVP!
#     double click on character to activate
#     click on square to move to
#     mouse over other characters to get option to attack
#     if attack, point to roll damage (for PC, can be manually entered)
#     etc
