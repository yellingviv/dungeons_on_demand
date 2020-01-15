from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

##############################################################################
# Define our db model

class DMs(db.Model):
    """dungeon masters"""
    __tablename__ = "dms"

    dm_id = db.Column(db.Integer, autoincrement=True, primary_key=True, db.ForeignKey('games.dm_id'))
    username = db.Column(db.String(30), nullable=False)
    password = db.Column(db.String(100), nullable=False)

    game = db.relationship("Games")

    def __repr__(self):
        """Provide helpful representation when printed"""
        return f"<DM info: dm_id={self.dm_id} username={self.username}>"


class Games(db.Model):
    """game information"""
    __tablename__ = "games"

    game_id = db.Column(db.Integer, autoincrement=True, primary_key=True,
                        db.ForeignKey('players.game_id'), db.ForeignKey('rooms.game_id'))
    dm_id = db.Column(db.Integer, nullable=False, db.ForeignKey('dms.dm_id'))

    dm = db.relationship("DMs")
    players = db.relationship("Players")
    rooms = db.relationship("Rooms")

    def __repr__(self):
        """Provide helpful representation when printed"""
        return f"<Game info: game_id={self.game_id} associated DM={self.dm_id}>"


class Players(db.Model):
    """tracking player information"""
    """much of this is currently nullable because it is for richer features, not MVP"""
    __tablename__ = "players"

    player_id = db.Column(db.Integer, autoincrement=True, primary_key=True,
                        db.ForeignKey('mstr_actions.player_id'), db.ForeignKey('pl_actions.player_id'))
    name = db.Column(db.String(40))
    game_id = db.Column(db.Integer, nullabe=False, db.ForeignKey('games.game_id'))
    species = db.Column(db.String(40))
    total_hp = db.Column(db.Integer)
    ac = db.Column(db.Integer)
    hit_dice_num = db.Column(db.Integer)
    hit_dice_type = db.Column(db.Integer)
    initiative_mod = db.Column(db.Integer)
    initiative_roll = db.Column(db.Integer, nullable=False)
    speed = db.Column(db.Integer)
    current_square = db.Column(db.Integer)

    monster_actions = db.relationship("Monster_Actions")
    player_actions = db.relationship("Player_Actions")
    games = db.relationship("Games")

    def __repr__(self):
        """Useful information when queried"""
        return f"<Player info: ID={self.player_id} game={self.game_id} initiative={self.initiative_roll}>"


class Rooms(db.Model):
    """store information about the generated room"""
    __tablename__ = "rooms"

    room_id = db.Column(db.Integer, autoincrement=True, primary_key=True,
                    db.ForeignKey('mstr_actions.room_id'), db.ForeignKey('pl_actions.room_id'),
                    db.ForeignKey('monsters.room_id'))
    width = db.Column(db.Integer, nullable=False)
    length = db.Column(db.Integer, nullable=False)
    game_id = db.Column(db.Integer, nullable=False, db.ForeignKey('games.game_id'))
    level = db.Column(db.Integer)

    games = db.relationship("Games")
    monster_actions = db.relationship("Monster_Actions")
    player_actions = db.relationship("Player_Actions")
    monsters = db.relationship("Monsters")

    def __repr__(self):
        return f"<Room info: ID={self.room_id} game={self.game_id} level={self.level}>"


class Player_Actions(db.Model):
    """keep track of each action taken by a player"""
    __tablename__ = "pl_actions"

    action_id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    player_id = db.Column(db.Integer, nullable=False, db.ForeignKey('players.player_id'))
    distance = db.Column(db.Integer)
    monster_id = db.Column(db.Integer, nullable=True, db.ForeignKey('monsters.monster_id'))
    damage = db.Column(db.Integer)
    room_id = db.Column(db.Integer, nullable=False, db.ForeignKey('rooms.room_id'))

    monsters = db.relationship("Monsters")
    players = db.relationship("Players")
    rooms = db.relationship("Rooms")

    def __repr__(self):
        return f"<Player action: {self.action_id}, by player {self.player_id}>"


class Monster_Actions(db.Model):
    """keep track of each action taken by a monster"""
    __tablename__ = "mstr_actions"

    action_id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    monster_id = db.Column(db.Integer, nullable=False, db.ForeignKey('monsters.monster_id'))
    distance = db.Column(db.Integer)
    player_id = db.Column(db.Integer, nullable=True, db.ForeignKey('players.player_id'))
    damage = db.Column(db.Integer)
    room_id = db.Column(db.Integer, nullable=False, db.ForeignKey('rooms.room_id'))

    players = db.relationship("Players")
    monsters = db.relationship("Monsters")
    rooms = db.relationship("Rooms")

    def __repr__(self):
        return f"<Monster action: {self.action_id}, by monster {self.monster_id}>"


class Monsters(db.Model):
    """information about the monsters generated"""
    __tablename__ = "monsters"

    monster_id = db.Column(db.Integer, autoincrement=True, primary_key=True,
                        db.ForeignKey('mstr_actions.monster_id'),
                        db.ForeignKey('pl_actions.monster_id'))
    room_id = db.Column(db.Integer, nullable=False, db.ForeignKey('rooms.room_id'))
    species = db.Column(db.String(50))
    total_hp = db.Column(db.Integer)
    ac = db.Column(db.Integer)
    hit_dice_num = db.Column(db.Integer)
    hit_dice_type = db.Column(db.Integer)
    initiative_mod = db.Column(db.Integer)
    initiative_roll = db.Column(db.Integer)
    speed = db.Column(db.Integer)
    current_square = db.Column(db.Integer)

    monster_actions = db.relationship("Monster_Actions")
    player_actions = db.relationship("Player_Actions")
    rooms = db.relationship("Rooms")

    def __repr__(self):
        return f"<Monster: {self.monster_id}, for room {self.room_id}>"


##############################################################################
# Helper functions

def connect_to_db(app):
    """Connect the database to our Flask app."""

    # Configure to use our PostgreSQL database
    app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql:///dungeons'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    db.app = app
    db.init_app(app)


if __name__ == "__main__":
    # As a convenience, if we run this module interactively, it will leave
    # you in a state of being able to work with the database directly.

    from server import app
    connect_to_db(app)
    print("Connected to DB.")
