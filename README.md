# Dungeons On Demand

Dungeons on Demand is an encounter generator and tracker for D&D 5e DMs. The site allows DMs to request a given number of creatures and a given difficulty level. The app then returns a randomized selection of monsters and presents the stats on the creatures for the DM to access. In addition, the DM can enter player information (currently name and initiative mod) and the app will roll and order initiative for an encounter. It will also roll to hit and roll damage for the monsters, and track damage dealt to monsters and flag when they are dead.

The deployed beta of the app is available at [dungeondemand.com](https://www.dungeondemand.com).

**Future Features**

Features I would like to implement in the future:
* Tracking of stats by player in combat, such as which player did the most damage, which had the most killing hits, etc.
    * Ideally in the future this would maintain across games to get per encounter stats, and averages for characters throughout a campaign
* Dynamic initiative tracker, rotating through as each player/NPC takes their turn
* Tracking of player information, such as HP, AC, etc, to further streamline combat
* Ability for DM to request specific types of monsters, or for monster groups to uniform
* Ability to save encounters and pick up where you left off

Please fork this repo and make this silly project better. Especially if you have better design skills than I do. Thank you.

**Tech Stack**

Dungeons on Demand is built on a Flask server with a Postgres database serving data to a Python backend via SQLAlchemy. The front end is entirely ReactJS, with a Bootstrap wrapper and some custom CSS for flair.

**Other Resources**

Test data was generated using [mockaroo](https://mockaroo.com).

The API providing the monster information is the [Open5e API](https://open5e.com/).

**Fine Print**

There is basically no copyright on this. Please fork it, please build on it. My code is not very well commented, and for that, I apologize.

This project was my first (and, frankly, probably only) full stack app so be tolerant. It was my final project for the Hackbright Academy part time SWE fellowship and was "completed" in March of 2020.
