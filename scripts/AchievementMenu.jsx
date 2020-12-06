import React, {useState} from 'react'; 
import {Socket} from './Socket.jsx';
import Typography from '@material-ui/core/Typography';
import Sound from 'react-sound';
import Grid from '@material-ui/core/Grid';
import {fnt} from './OptionMenu.jsx';
import {brc} from './OptionMenu.jsx';

const h1={
    
    color:'white',
    textAlign: 'center',
    padding: 50,
    margin: 50,
    fontWeight: 'bold',
    borderWidth: 5,
    background: 'grey',
    borderRadius:10,
    
};
const div={
    fontSize:20,
    
};
const div2={
    border:brc,
    fontSize:fnt,
    background:'grey',
    display: 'grid',
    gridTemplateColumns:'1fr 1fr 1fr 1fr',
    listStyleType: 'none',
};
const ul={
    border:brc,
    fontSize:fnt,
    background:'black',
    textAlign: 'center',
};
const BackButton={
    textAlign:'center',
    fontWeight:'bold',
    fontStyle:'italic',
    background: 'linear-gradient(green,green)',
    padding: 5,
    margin: 5,
    border:brc,
    borderRadius:10,
    fontSize:fnt,
    position: 'absolute',
    left:   40,
    bottom:   40
    
};
const ClaimButton={
    textAlign:'center',
    fontWeight:'bold',
    fontStyle:'italic',
    background: 'linear-gradient(#e66465, #9198e5)',
    padding: 5,
    margin: 5,
    border:brc,
    borderRadius:10,
    fontSize:fnt,
    
};

function Achievements(){
    const[achievements, setAchievements] = useState([]);
    
    function returnToMain(){
        return(window.location = "main_chat.html");
    }
    
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
               <details key={array[0]+"wrap"} style= {div}>
                    <summary >{array[1]}     {array[3]}/{array[4]}</summary>
                    <p >{array[2]}</p>
                    <br></br>
                    <label  >Progress: {array[3]}/{array[4]}</label>
                    <progress value={array[3]} max={array[4]}></progress>
                    {set_claim_achievement(array[5], array[0])}
                </details>
        );
        return r;
    }
    function set_claim_achievement(flag, id){
        if (flag === '0'){
            return <button id={id} style={ClaimButton} onClick={handleClick} disabled>Finish mission to redeem</button>;
        }
        else if (flag === '1'){
            return <button id={id} style={ClaimButton} onClick={handleClick}>Congrats! Collect your prize</button>;
        }
    }
    function handleClick(event){
        event.preventDefault();
        console.log('Getting reward completing the achievement '+event.target.id);
        Socket.emit('get reward', {'id':event.target.id});
        document.getElementById(event.target.id).disabled =true;
        retrieve_achievement();
    }
    retrieve_achievement();
    return(
            <div style={ div }>
                <Sound
                    url='/static/Index_LoginTheme.mp3'
                    playStatus={Sound.status.PLAYING}
                    volume='50'
                />
                <h1 style={h1}>Achievement Menu</h1>
                <ul style={div2}>
                    {display_achievements}
                </ul>
                <button style={ BackButton } onClick={returnToMain} >Exit Back to Main?</button>
            </div>
    );
}
export function AchievementUI(){
    return(
        <Achievements /> 
    ); 
}