import convertDate from "../../features/convertDate";
import { useSelector, useDispatch } from 'react-redux';
import { close } from '../../features/redux/openChatSlice';
import { useState } from "react";

export default function ChatOpen(props) {
    const openChat = useSelector((state) => state.openChat.value)
    const idChat = useSelector((state) => state.idChat.value)
    const dispatch = useDispatch()
    const [text, setText] = useState();

    let message = [];

    let chat = document.querySelector("#ChatInfo");

    if(props.data != null){
        props.data.forEach(element => {
            if(element.username === idChat && element.type === "private"){
                let data = [element.text, convertDate(element.date), element.chatId, element.messageId, element.username, element.answers, element.textPhotos];
                message.push(data);
            }
        });
    }
    
    const sendMessage = async () => {
        await fetch("https://localhost:7013/api/telegram/sendMessage/" + message[message.length-1][2] + "&" + text + "&" + message[message.length-1][3]);
        
        let element = document.getElementById("message");
        element.value = "";
        
        let chat = await document.querySelector("#ChatInfo");
        if(chat != null){
            chat.scrollTop = Math.pow(10, 10);
        }
    }
    
    const textHandler = (event) => {
        setText(event.target.value);
        chat.scrollTop = Math.pow(10,10);
    }
    
    if(chat != null){
        if(chat.scrollTop === 0){
            chat.scrollTop = Math.pow(10,10);
        };
    }
    
    if(openChat === false){
        return null
    } else{
        return(
            <div className="OpenChat">   
                <h1>{idChat}</h1>
                <div id="ChatInfo" className="ChatInfo">
                    {message.reverse().map(data => { 
                        return (
                            <>
                                <div key = {data[3]} className = "ChatInfoElement"> 
                                    <div className="ChatInfoElementMessage">
                                        <img src={ data[6] } alt="" />
                                        <p className="text">{ data[0] }</p>
                                        <p className="time">{ data[1] }</p>
                                    </div>
                                </div>
                                { data[5] != undefined ? data[5].reverse().sort(function(a,b){
                                    if(a.split('/')[1] > b.split('/')[1]){
                                        return 1;
                                    }
                                    if(a.split('/')[1] < b.split('/')[1]){
                                        return -1;
                                    }
                                    return 0;
                                }).map((answer) => {
                                    return(
                                        <div className = "ChatAnswerElement" key={answer.split("/")[1]}>
                                            <p className = "text">{ answer.split("/")[0] }</p>
                                            <p className = "time">{ answer.split("/")[1] }</p> 
                                        </div>
                                    )
                                }) : null}
                            </>
                        )
                    })}
                </div>
                <div className="answer">
                    <input onChange={(event) => textHandler(event) } name="message" id="message" type={text} placeholder="Напишите сообщение..."></input>
                    <div className="buttons">
                        <button onClick={() => sendMessage()}>Ответить</button>
                        <button onClick={ () => dispatch(close()) }>Закрыть чат</button>
                    </div>
                </div>
            </div>
        );
    }
}