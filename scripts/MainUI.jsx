import React from 'react'; 
import { Chatbox } from './Chatbox.jsx';
import { InventoryList } from './InventoryList.jsx'; 
import { PartyList } from './PartyList.jsx';
import { AchievementButton } from './AchievementButton.jsx';
import {Socket} from './Socket.jsx'; 

export function MainUI(){
    return(
        <div>
            <AchievementButton/>
            <PartyList /> 
            <InventoryList />
            <Chatbox /> 
        </div>     
    );
}