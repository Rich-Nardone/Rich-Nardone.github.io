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
    function handleClick(event){
        event.preventDefault();
        console.log(event);
        Socket.emit('get achievement');
        
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