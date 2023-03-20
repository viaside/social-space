import convertDate from "../../features/convertDate";
import getCookie from "../../features/getCookie";
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
        if(text){
            let botId = await fetch('https://localhost:7013/api/user/GetInfo/' + getCookie("userId"))
            .then((Response) => Response.json())
            .then(async (Result) => { return Result.responseData["usingBots"].toString().split('----')[0] });
            
            await fetch("https://localhost:7013/api/telegram/sendMessage/", { 
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    BotId: botId.toString(), 
                    ChatId: message[message.length-1][2].toString(), 
                    MessageId: message[message.length-1][3].toString(),
                    Text: text.toString(), 
                })
            });

            let element = document.getElementById("message");
            element.value = "";
            setText(null);
            
            let chat = await document.querySelector("#ChatInfo");
            if(chat != null){
                chat.scrollTop = Math.pow(10, 10);
            }
        } else{
            alert("Напишите сообщение")
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

    const handleKeyPress = (e) => {
        if(e.key === "Enter"){
            sendMessage();
        }
    } 

    if(openChat === false){
        return null
    } else{
        return(
            <div className="OpenChat">   
                <h1>{idChat}</h1>
                <div id="ChatInfo" className="ChatInfo">
                    {message.reverse().map((data, index) => { 
                        return (
                            <div key = {index} >
                                <div className = "ChatInfoElement"> 
                                    <div className="ChatInfoElementMessage">
                                        <img src={ data[6] } alt="" />
                                        <p className="text">{ data[0] }</p>
                                        <p className="time">{ data[1] }</p>
                                    </div>
                                </div>
                                { data[5] ? data[5].reverse().sort(function(a,b){
                                    if(a.split('/')[1] > b.split('/')[1]){
                                        return 1;
                                    }
                                    if(a.split('/')[1] < b.split('/')[1]){
                                        return -1;
                                    }
                                    return 0;
                                }).map((answer, index) => {
                                    return(
                                        <div className = "ChatAnswerElement" key={index}>
                                            <p className = "text">{ answer.split("/")[0] }</p>
                                            <p className = "time">{ answer.split("/")[1] }</p> 
                                        </div>
                                    )
                                }) : null}
                            </div>
                        )
                    })}
                </div>
                <div className="answer">
                    <input onChange={(event) => textHandler(event)} onKeyDown={handleKeyPress} name="message" id="message" type={text} placeholder="Напишите сообщение..."></input>
                    <div className="buttons">
                        <button onClick={() => sendMessage()}>Ответить</button>
                    </div>
                    <button onClick={ () => dispatch(close()) }>Закрыть чат</button>
                </div>
            </div>
        );
    }
}