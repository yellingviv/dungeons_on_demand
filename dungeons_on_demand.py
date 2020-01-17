from flask import Flask, render_template, redirect, request, flash, session
from dungeon_model import connect_to_db, db, DMs, Games, Rooms,
                        Players, Player_actions, Monster_Actions, Monsters
from

app = Flask(__name__)
app.secret_key = "DNDDEMANDGEN"

if __name__ == "__main__":
    connect_to_db(app)
    app.run(port=5000, host='0.0.0.0')

#####
# some pseudo code just to get shit down
#####
