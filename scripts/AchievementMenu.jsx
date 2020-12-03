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
    const[achievements, setAchievements] = useState([]);
    
    function retrieve_achievement(){
        console.log('Asking server for achievement stats for player');
        React.useEffect(()=>{
            Socket.emit('get achievements');
            Socket.on('achievement', (data)=>{
                    setAchievements(data);
            }); 
        }, []);
        console.log('Received achievement stats from server for player');
    }
    const display_achievements = achievements.map((array)=>
        format_achievement(array)
    );
    function format_achievement(array){
        const r = (
               <details key={array[0]}>
                    <summary>{array[1]}</summary>
                    <p>{array[2]}</p>
                    <label>Progress: {array[3]}/{array[4]}</label>
                    <progress value={array[3]} max={array[4]}></progress>
                    {set_claim_achievement(array[5], array[0])}
                </details>
        );
        return r;
    }
    function set_claim_achievement(flag, id){
        if (flag === '0'){
            return <button id={id} onClick={handleClick} disabled>Finish mission to redeem</button>;
        }
        else if (flag === '1'){
            return <button id={id} onClick={handleClick}>Congrats! Collect your prize</button>;
        }
    }
    function handleClick(event){
        event.preventDefault();
        console.log('Setting stats for the achievement '+event.target.id);
        alert('you win a new car. get off your goat.');
    }
    retrieve_achievement();
    return(
            <div>
                <h1 style={h1}>Achievement Menu</h1>
                <h2> { title } </h2>
                <h3> { progress } </h3>
                <ul>
                    {display_achievements}
                </ul>
            </div>
    );
}
export function AchievementUI(){
    return(
        <Achievements /> 
    ); 
}