import React, {useState} from 'react'; 
import {Socket} from './Socket.jsx';

const h1={
    textAlign: 'center',
    padding: 50,
    margin: 50,
    fontWeight: 'bold',
    fontStyle: 'italic',
    borderWidth: 5,
    background: 'linear-gradient(darkviolet,darkblue)',
    borderRadius:10,
};


function Achievements(){
    const[title, setTitle] = useState('Click an Achievement to view your progress'); 
    const[progress, setProgress] = useState('');
    function retrieve_achievement(id){
        console.log('Asking server for achievement stats for '+id);
        Socket.emit('get achievement');
        Socket.on('achievement', (data)=>{
                setTitle(data['title']);
                setProgress(data['progress']);
        }); 
        console.log('Received achievement stats from server for '+ id);
    }
    function handleClick(event){
        event.preventDefault();
        console.log('Setting stats for the achievement '+event.target.id);
        retrieve_achievement(event.target.id);
    }
    return(
            <div>
                <h1 style={h1}>Achievement Menu</h1>
                <h2> { title } </h2>
                <h3> { progress } </h3>
                <br></br>
                <button id='money' onClick={handleClick}>heist</button>
                <br></br>
                <button id='health' onClick={handleClick}>surgeon</button>
                <br></br>
                <button id='wins' onClick={handleClick}>winnning streak</button>
                <br></br>
                <button id='damage' onClick={handleClick}>soul seeker</button>
                <br></br>
                <button id='items' onClick={handleClick}>swagger</button>
            </div>
    );
}
export function AchievementUI(){
    return(
        <Achievements /> 
    ); 
}