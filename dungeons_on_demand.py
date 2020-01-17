from flask import Flask, render_template, redirect, request, flash, session
from dungeon_model import connect_to_db, db, DMs, Games, Rooms,
                        Players, Player_actions, Monster_Actions, Monsters
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

create dm account
    username, autoincrement id
    hash password and store the hash!!

log in to dm account
    hash=pwd.hash('thepassword')
    pwd.verify('thepassword', hash) #returns true or false
    #figure out how to hash on the front end and just pass the hash, so I only store hashes
    #maybe use a front end JS library instead and just save the hash on creation?
    add to session cookie that verified
    directs to DM screen with list of games and their Rooms
    button for new game on side, button for new room in each game room list

log out of dm account
    dump that session cookie
    redirect to log in screen

create new game
    input player information
    give it a name
    return to game list showing the new game available

create new room
    associated with a game
    pass level and number of monsters
    return monster info from api
    give positioning of monsters
    put the room id, game id into the session cookie

retrieve room
    loads up monster stats, initiative list, player info
    puts room id, game id into session cookie

roll initiative
    rolls for monsters and players based on mods
    creates list of initiative rolls, writes to db

roll monster damage
    randomize on number of dice and type
    return the damage value

calculate damage received
    total damage and armor class modifier
    for monster, check if damage more than HP and if yes, return "dead", if no, update HP
    return damage received

close room
    save room status preserves the room as it is and makes the monsters reloadable
    complete room flags that the room is done and not to be re-entered, removes from playable list
    dumps room id and game id from session cookie
    returns to game listing page

update HP
    done manually by the DM for players

calculate player stats
    every time a player makes an attack, recalculate:
    #or should this just be done when the view is changed to the stats page?
        most damage done to monsters
        most killing blows
        average damage per player (of the group, and individually)
        total kills
        available for that room and also for the whole game, toggle switch? tab?

change view
    changes which layer is currently visible -- game board, player stats
