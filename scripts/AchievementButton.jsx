import React, {useState} from 'react'; 
import {Socket} from './Socket.jsx';

export function AchievementButton(){
    
    function handleClick(event){
        return(window.location = "achievement_menu.html");
    }
    
    return(
        <div>
            <button onClick={handleClick}>Achievement Menu</button>
        </div>
    );
}