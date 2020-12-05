import React, {useState} from 'react'; 
import {Socket} from './Socket.jsx';
import {volu} from './OptionMenu.jsx';
import {fnt} from './OptionMenu.jsx';
import {brc} from './OptionMenu.jsx';

const button={
    fontWeight:'bold',
    fontStyle:'italic',
    width:210,
    border:brc,
    fontSize:fnt,
};

export function AchievementButton(){
    
    function handleClick(event){
        return(window.location = "achievement_menu.html");
    }
    
    return(
        <div>
            <button style={button} onClick={handleClick}>Achievement Menu</button>
        </div>
    );
}