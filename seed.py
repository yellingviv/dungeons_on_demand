"""utility script to load database with test data"""

from sqlalchemy import func
from dungeon_model import DMs, Games, Rooms, Players, Monsters,
                          Monster_Actions, Player_Actions
from dungeon_model import connect_to_db, db
from server import app
