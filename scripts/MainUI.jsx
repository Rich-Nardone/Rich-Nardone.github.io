import React from 'react';
import Sound from 'react-sound';
import { Chatbox } from './Chatbox';
import { InventoryList } from './InventoryList';
import { PartyList } from './PartyList';
import { Socket } from './Socket';
import { volu, fnt, brc } from './OptionMenu';
import { AchievementButton } from './AchievementButton';

const button={
    fontWeight:'bold',
    fontStyle:'italic',
    width:210,
    border:brc,
    fontSize:fnt,
};

export function MainUI(){
    function gotoOptions(){
        console.log("Heading to Options!");
        return(window.location = "options.html");
    }
    
    return(
        <div>
            <Sound
                    url='static/MainChatTheme.mp3'
                    playStatus={Sound.status.PLAYING}
                    volume={volu}
            />
            <AchievementButton />
            <PartyList /> 
            <InventoryList />
            <Chatbox /> 
            <button style={button} onClick={gotoOptions}>Options</button>
         </div>   
    );
}

export default MainUI;
