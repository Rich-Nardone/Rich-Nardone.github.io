import os
import models
from settings import db

def init_achievements(uid):
    all_user = [user.user_id for user in db.session.query(models.achievements).all()]
    if uid not in all_user:
        achievements = models.achievements(
            user_id=uid,
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

def get_achievement_reward(userid,a_id):
    a_info = (db.session.query(models.achievements).filter_by(user_id=userid).first())
    if(a_id=="items"):
        a_info.item_prize = '0'
        a_info.item_f = str(int(a_info.item_f)*2)
    elif(a_id=="win"):
        a_info.win_prize = '0'
        a_info.win_f = str(int(a_info.item_f)*2)
    elif(a_id=="damage"):
        a_info.damage_prize = '0'
        a_info.damage_f = str(int(a_info.item_f)*2)
    elif(a_id=="money"):
        a_info.money_prize = '0'
        a_info.money_f = str(int(a_info.item_f)*2)
    db.session.commit()
    
def get_all_achievements(userid):
    a_info = db.session.query(models.achievements).filter_by(user_id=userid).first()
    achievements=[
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
    return achievements
    
def update_achievement(userid,key,num):
    a_info = (db.session.query(models.achievements).filter_by(user_id=userid).first())
    if(key == 'item'):
        a_info.items = str(int(a_info.items)+num)
        db.session.commit()
        if(a_info.items == a_info.item_f):
            a_info.item_prize = '1'
    elif(key == 'win'):
        a_info.wins = str(int(a_info.wins)+num)
        db.session.commit()
        if(a_info.wins == a_info.win_f):
            a_info.win_prize = '1'
    elif(key == 'damage'):
        a_info.damage_dealt = str(int(a_info.damage_dealt)+num)
        db.session.commit()
        if(a_info.damage_dealt == a_info.damage_f):
            a_info.damage_prize = '1'
    elif(key == 'money'):
        a_info.moneys = str(int(a_info.moneys)+num)
        db.session.commit()
        if(a_info.moneys == a_info.money_f):
            a_info.money_prize = '1'
    db.session.commit()