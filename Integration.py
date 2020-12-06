"""
    Launches the Flask app
"""
import os
from os.path import join, dirname
from settings import db, app, socketio
from inventory import get_user_inventory, get_asc_inventory, get_dsc_inventory, search_bar, filter_by_type
from progress import saveProgress, loadProgress
import models
import flask
# tests

# game logic
import game.game
import game.game_io
from game.game import game
from game.game_io import deconstruct_player
from game.player import Player


# For shop, checks if item has been purchased.
item = 0
# Used to check if user bought item again.
times = 1

def player_info():
    """ Send playerinfo to js. Currently sends dummy data. """
    player_info = {
        "user_party": ["player1", "player2", "player10"],
        "user_inventory": ["coins", "sword", "shield"],
        "user_chatlog": [
            "welcome to the world",
            "attack",
            "user attacks, hitting the blob for 10pts",
        ],
    }
    if item == 1:
        x = player_info["user_inventory"]
        global times
        if times == 0:
            x.extend(["Health Pack"])
            times += 1
        else:
            x.extend(["Health Pack"] * times)
            times += 1

        print(x)
        player_info["user_inventory"] = x
    socketio.emit("player info", player_info)

userlist = [1]
idlist = [""]

@socketio.on("google login")
def google_login(data):
    """ Google Login """
    # idinfo contains dictionary of user info
    userdat = data["UserInfo"]
    profiledat = userdat["profileObj"]
    em = profiledat["email"]
    all_email = [username.email for username in db.session.query(models.username).all()]
    if em not in all_email:
        user = models.username(email=em)
        db.session.add(user)
        db.session.commit()
        init_achievements(em)
    userid = db.session.query(models.username).filter_by(email=em).first()
    userlist.append(userid.id)
    
    #Used to distinguish users, for database user calls 
    flask.session["user_id"] = em
    idlist.append(em)
    
    
    #check if user has character
    socketio.emit("has character", False)

def send_party(): 
    #TODO get party from database 
    
    #DUMMY DATA
    user_party=["player1", "player2", "player10"]
    socketio.emit('user party', user_party)
    
def send_chatlog():
    #TODO get chatlog from database
    
    #DUMMY DATA
    user_chatlog=[
            "welcome to the world",
            "attack",
            "user attacks, hitting the blob for 10pts"
    ]
    socketio.emit('user chatlog', user_chatlog)


@socketio.on("user input")
def parse_user_input(data):
    """ Parse user inputs in order to interact with game logic """
    print(
        data["input"]
    )


@socketio.on("get party")
def get_party():
    send_party()
    
@socketio.on("get inventory")
def get_inventory():
    inventory = get_user_inventory()
    send_inventory(inventory)

def send_inventory(inventory):
    socketio.emit('user inventory', inventory)

@socketio.on("get chatlog")
def get_chatlog():
    #TODO get chatlog from database
    
    #DUMMY DATA
    user_chatlog=[
            "welcome to the world",
            "attack",
            "user attacks, hitting the blob for 10pts"
    ]
    send_chatlog()

# Test atm for the shop
@socketio.on("item purchased")
def item_purchased():
    """ Purchase item """
    global item
    item = 1
    player_info()
    update_achievements('item')
    

@socketio.on("user new character")
def character_creation(data):
    """ Create character """
    player = Player()
    player.id = data["name"]
    player.gen = data["gen"]
    player.character_class = data["classType"]
    # data includes character attributes: name, gender and character class
    if data["classType"] == "Jock":
        player.make_jock()
    elif data["classType"] == "Bookworm":
        player.make_bookworm()
    elif data["classType"] == "NEET":
        player.make_neet()
    USER = userlist[-1]
    email = db.session.query(models.username).filter_by(id=USER).first()
    userid = email.id
    dbplayer = models.character(
        user_id=userid,
        character_class=data["classType"],
        character_name=data["name"],
        gender=data["gen"],
        strength=player.strength,
        dex=player.dex,
        con=player.con,
        intel=player.intel,
        cha=player.cha,
        luck=player.luk,
        max_health=player.max_health,
        health=player.health,
        max_mana=player.max_mana,
        mana=player.mana,
        money=player.money,
    )
    db.session.add(dbplayer)
    db.session.commit()


def update_achievements(key):
    if(key == 'item'):
        USER = userlist[-1]
        email = db.session.query(models.username).filter_by(id=USER).first()
        userid = email.id
        a_info = (db.session.query(models.achievements).filter_by(user_id=userid).first())
        a_info.items = str(int(a_info.items)+1)
        db.session.commit()
        if(a_info.items == a_info.item_f):
            a_info.item_prize = '1'
            db.session.commit()
    elif(key == 'win'):
        pass
    elif(key == 'damage'):
        pass
    elif(key == 'money'):
        pass
    
def init_achievements(em):
    user = db.session.query(models.username).filter_by(email=em).first()
    userid = user.id
    db.session.commit()
    achievements = models.achievements(
        user_id=userid,
        win_id='wins',
        win_title='King of the land',
        win_description='Reach the final end state three times to claim your custom prize.',
        wins='0',
        win_f='3',
        win_prize = '0',
        damage_id = 'damage',
        damage_title = 'Soul Seeker',
        damage_description = 'Deal damage to your oppenents in battle. Deal 300 points of damage to claim a valueable reward.',
        damage_dealt = '0',
        damage_f = '300',
        damage_prize = '0',
        items_id = 'items',
        item_title = 'Living Lavish',
        item_description = 'Find items around the map or buy items from the shop. Obtain 2 items to claim a valueable reward.',
        items = '0',
        item_f = '2',
        item_prize = '0',
        money_id = 'money',
        money_title = 'Money Laundering',
        money_description = 'Be on the look out for money. Collect $20 to claim a valueable reward.',
        moneys = '0',
        money_f = '20',
        money_prize = '0'
    )
    db.session.add(achievements)
    db.session.commit()
    
@socketio.on("get achievements")
def get_achievement():
    """ get achievements """
    USER = userlist[-1]
    email = db.session.query(models.username).filter_by(id=USER).first()
    userid = email.id
    a_info = (db.session.query(models.achievements).filter_by(user_id=userid).first())
    achievement=[
        [
            a_info.win_id,
            a_info.win_title,
            a_info.win_description,
            a_info.wins,
            a_info.win_f,
            a_info.win_prize
        ],
        [
            a_info.damage_id,
            a_info.damage_title,
            a_info.damage_description,
            a_info.damage_dealt,
            a_info.damage_f,
            a_info.damage_prize
        ],
        [
            a_info.items_id,
            a_info.item_title,
            a_info.item_description,
            a_info.items,
            a_info.item_f,
            a_info.item_prize
        ],
        [
            a_info.money_id,
            a_info.money_title,
            a_info.money_description,
            a_info.moneys,
            a_info.money_f,
            a_info.money_prize
        ]
    ]
    socketio.emit('achievement', achievement)


def send_reward():
   return 0 

@socketio.on("get reward")
def get_reward(data):
    USER = userlist[-1]
    email = db.session.query(models.username).filter_by(id=USER).first()
    userid = email.id
    a_info = (db.session.query(models.achievements).filter_by(user_id=userid).first())
    if(data["id"]=="items"):
        a_info.item_prize = '0'
        a_info.item_f = str(int(a_info.item_f)*2)
        db.session.commit()
        send_reward()
    elif(data["id"]=="win"):
        pass
    elif(data["id"]=="damage"):
        pass
    elif(data["id"]=="money"):
        pass
# ======================================================================================
@app.route("/")
def about():
    """ main page """
    return flask.render_template("landing_page.html")

#=======================================================================================

@app.route("/character_selection.html")
def char_select():
    """ main page """
    return flask.render_template("character_selection.html")

#=======================================================================================

@app.route("/login.html")
def index():
    """ main page """
    return flask.render_template("index.html")

# ======================================================================================
@app.route("/character_creation.html")
def char_create():
    """ character creation page """
    return flask.render_template("character_creation.html")


# =======================================================================================
@app.route("/main_chat.html")
def main():
    """ main chat window """
    return flask.render_template("main_chat.html")
    

#=========================================================================================
@app.route("/options.html")
def options():
    """ main chat window """
    #saveProgress()
    print(idlist[-1] + " YOOOOO")
    return flask.render_template("options.html")


# =======================================================================================
@app.route("/achievement_menu.html")
def achievement_menu():
    """ achievement menu page """
    return flask.render_template("achievement_menu.html")


# =======================================================================================
# RUNS ON THIS HOST AND PORT
if __name__ == "__main__":
    socketio.run(
        app,
        host=os.getenv("IP", "0.0.0.0"),
        port=int(os.getenv("PORT", 8080)),
        debug=True
    )