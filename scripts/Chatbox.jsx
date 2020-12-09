import React, { useState, useEffect } from 'react';
import { Socket } from './Socket';
import { fnt, brc } from './OptionMenu';

const div = {
  width: 1000,
  height: 430,
  position: 'fixed',
  left: 214.5,
  top: 8,
  display: 'inline',
  background: 'grey',
  border: brc,
  fontSize: fnt,
}
const button={
    fontWeight:'bold',
    fontStyle:'italic',
    border:brc,
    fontSize:fnt,
    width:'100'
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


      
  function retrieve_player_shop(){
    useEffect(()=>{
    Socket.emit('get shop');
        Socket.on('user shop', (data)=>{
            setShop(data["shop"]);
            setMoney(data["money"]);
        });
    }, []);
  }
  function retrievePlayerChatlog() {
    useEffect(() => {
      Socket.emit('get chatlog');
      Socket.on('user chatlog', (data) => {
        setChatlog(data);
      });
    }, []);
  }

  function submitInput(event) {
    event.preventDefault();
    Socket.emit('user input', { input: userInput });
    document.getElementById('user_text_box').value = '';
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
  function submitPayment() {
    if (money === 0) {
      setMoney(0);
    } else {
      setMoney(money - 500);
      Socket.emit('item purchased');
    }
  }
  
  retrievePlayerChatlog();
  retrieve_player_shop(); 
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


