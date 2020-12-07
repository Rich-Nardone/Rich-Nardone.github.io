import React, {useState, useEffect} from 'react'; 
import {Socket} from './Socket.jsx';
import {fnt} from './OptionMenu.jsx';
import {brc} from './OptionMenu.jsx';

const button={
    fontWeight:'bold',
    fontStyle:'italic',
    border:brc,
    fontSize:fnt,
    width:'100'
}  

const div={
    width:1000,
    height:430,
    position: 'fixed',
    left:214.5,
    top:8,
    display: 'inline',
    background:'grey',
    border:brc,
    fontSize:fnt,
    
}
const ul={
    listStyleType:'none',
    height: 315,
    textAlign:'left',
    overflow: 'scroll',
    fontStyle:'italic',
    fontWeight: "bold",
    fontSize:fnt,
    
   
};

const input={
    fontWeight:'bold',
    fontStyle:'italic',
    border:brc,
    fontSize:fnt,
    width:900,
    
}
const p={
    
    padding:0,
    margin:0,
    position: 'relative',
    border:brc,
    fontWeight:'bold',
    textAlign:'center',
    opacity: 0.5,
    fontStyle:'italic',
    
    
}

const secret_p={
    textAlign:'center',
    fontWeight:'bold',
    fontStyle:'italic',
    background:'grey',
    fontSize:fnt,
    
    
    
    
}

const details={
    fontWeight:'bold',
    textAlign:'center',
    fontStyle:'italic',
    fontSize:fnt,
    background:'grey',
}

const body={
    background:'grey',
}


export function Chatbox(props){
    const [userInput, setInput] = useState("");
    const [money,setMoney] = useState(1000);
    const [shop,setShop] = useState([]);
    const [chatlog, setChatlog] = useState([]); 
    const [item,setItem] = useState([]);

    function retrieve_player_chatlog(){
        useEffect(()=>{
            Socket.emit('get chatlog');
            Socket.on('user chatlog', (data)=>{
                setChatlog(data);
            });
        }, []);    
    }
    function retrieve_player_shop(){
        useEffect(()=>{
        Socket.emit('get shop');
            Socket.on('user shop', (data)=>{
                setShop(data["shop"]);
                setMoney(data["money"]);
            });
        }, []);
    }
    function submitInput(event){
        event.preventDefault();
        Socket.emit('user input', {'input': userInput});
        document.getElementById('user_text_box').value = "";
    }
    const display_log = chatlog.map((log,index)=>
        <li key={index}> {log} </li>
    );
    const display_items = shop.map((item,index)=>
        <li key = {index}>
            <input type="radio" name="item" id={item[0]} value={item[1]} onChange={e=>setItem([e.target.id,e.target.value])} />
            <label >{item[0]}     Cost: ${item[1]}</label>
        </li>
    );
    function submitPayment(event){
        event.preventDefault();
        console.log(item[1])
        if(money < item[1]){
            console.log('ouch')
        }
        else{
            setMoney(money-item[1]);
            Socket.emit('item purchased', {'item':item[0],'cost':item[1]});
        }
    }
    
    retrieve_player_chatlog();
    retrieve_player_shop();
    return(
        <div style={div}>
            <div id='chatbox'>
                <ul style={ul}>
                    {display_log}
                </ul>
            </div> 
            <p style={p}>{'Possible Actions: "Say", "Do", "Attack"'}</p>
            <details  style={secret_p}>
                <summary style={details}>Pssst..click me for goods</summary>
                <p style={secret_p}> "Welcome to Ghosty's Emporium! What can I get ye?"</p>
                <p style={secret_p}>Current Money: {money} Bucks</p>
                <br></br>
                <form onSubmit={submitPayment}>
                    <ul> {display_items} </ul>
                    <input type="submit" value="Submit" />
                </form>
            </details>
            <br></br>
            <div id='user_buttons'>
                <form onSubmit={submitInput}>
                    <input style={input} id='user_text_box' type='text' placeholder='What is your command?' onChange={e=>setInput(e.target.value)}/>
                    <input style= {button} type='submit' /> 
                </form>
            </div>
        </div>
    )
}
