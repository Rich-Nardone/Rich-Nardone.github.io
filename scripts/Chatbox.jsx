import React, { useState, useEffect } from 'react';
import { Socket } from './Socket';
import { fnt, brc } from './OptionMenu';

const div = {
  width: 1000,
  height: 430,
  position: 'fixed',
  left: 300,
  top: 50,
  display: 'inline',
  background: 'grey',
  border: brc,
  fontSize: fnt,
  boxShadow: '2px 5px black',
  borderRadius: 10,
};
const ul = {
  listStyleType: 'none',
  height: 315,
  textAlign: 'left',
  overflow: 'scroll',
  fontStyle: 'italic',
  fontWeight: 'bold',
  fontSize: fnt,
};
const input={
    fontWeight:'bold',
    fontStyle:'italic',
    border:brc,
    fontSize:fnt,
    width:900,
};
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
const details={
    fontWeight:'bold',
    textAlign:'center',
    fontStyle:'italic',
    fontSize:fnt,
    background:'grey',
}
const secretP = {
  textAlign: 'center',
  fontWeight: 'bold',
  fontStyle: 'italic',
  background: 'grey',
  fontSize: fnt,

};
const body = {
  background: 'grey',
};

export function Chatbox() {
  const [userInput, setInput] = useState('');
  const [money, setMoney] = useState(1000);
  const [chatlog, setChatlog] = useState([]);
  const [shop,setShop] = useState([]);
  const [item,setItem] = useState([]);
  
  
  function retrievePlayerChatlog() {
    useEffect(() => {
      Socket.emit('get chatlog');
      Socket.on('user chatlog', (data) => {
        setChatlog(data);
      });
    }, []);
  }
  function retrievePlayerShop(){
    useEffect(()=>{
      Socket.emit('get shop');
      Socket.on('user shop', (data)=>{
          setShop(data["shop"]);
          setMoney(data["money"]);
      });
    }, []);
  }
  function submitInput(event) {
    event.preventDefault();
    Socket.emit('user input', { input: userInput });
    setChatlog(chatlog =>[...chatlog, userInput])
    document.getElementById('user_text_box').value = '';
  }
  
  function listenChatChange(){
    Socket.on('chatlog updated', (data)=>{
      console.log(data);
      setChatlog(chatlog =>[...chatlog, data['text']])
      
    });
  }
  
  const displayLog = chatlog.map((log, index) => (
    // eslint-disable-next-line react/no-array-index-key
    <li key={index}>
      {' '}
      {log}
      {' '}
    </li>
  ));
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
  function listenChatChange(){
    Socket.on('chatlog updated', (data)=>{
      console.log(data);
    });
  }
  function startGame() {
    Socket.emit('game start');
  }

  retrievePlayerChatlog();
  listenChatChange();
  retrievePlayerShop();
  startGame();
 
  return (
    <div style={div}>
      <div id="chatbox">
        <ul style={ul}>
          {displayLog}
        </ul>
      </div>
      <p style={p}>Possible Actions: &quot;Say&quot;, &quot;Do&quot;, &quot;Attack&quot;</p>
      <details>
        <summary style={details}>Pssst..click me for goods</summary>
        <body style={body}>
          <p style={secretP}>
            {' '}
            Welcome to Ghosty&apos;s Emporium! What can I get ye?
          </p>
          <p style={secretP}>
            Current Money:
            {money}
            {' '}
            Bucks
          </p>
          <form onSubmit={submitPayment}>
              <ul> {display_items} </ul>
              <input type="submit" value="Submit" />
          </form>
          <br />
        </body>
      </details>
      <br />
      <div id="user_buttons">
        <form onSubmit={submitInput}>
          <input style={input} id="user_text_box" type="text" placeholder="What is your command?" onChange={(e) => setInput(e.target.value)} />
          <input type="submit" />
        </form>
      </div>
    </div>
  );
}


export default Chatbox;