import getCookie from "../../features/getCookie";
import { useSelector, useDispatch } from 'react-redux';
import { close } from '../../features/redux/openChatSlice';
import { useEffect, useState } from "react";
import packagejson from "../../../package.json";

export default function ChatOpen(props) {
    // redux states
    const openChat = useSelector((state) => state.openChat.value)
    const idChat = useSelector((state) => state.idChat.value)
    const dispatch = useDispatch()
    const [text, setText] = useState();

    // states
    const [showfullScreenImage, setShowFullScreenImage] = useState(false);
    const [idfullScreenImage, setidFullScreenImage] = useState(null);

    // message array
    let message = [];

    // set message array
    if(props.data != null){
        props.data.forEach(element => {
            if(element.username === idChat && element.type === "Private"){
                let data = [element.text, element.date, element.chatId, element.messageId, element.username, element.answers, element.textPhoto];
                message.push(data);
            }
        });
    }
    
    // send message to user
    const sendMessage = async () => {
        if(text){
            // get user bot id
            let botId = await fetch(packagejson.ipurl + '/api/user/GetInfo/' + getCookie("userId"))
            .then((Response) => Response.json())
            .then(async (Result) => { return Result.responseData["usingBots"].toString().split('----')[0] });
            
            // send message
            await fetch(packagejson.ipurl + "/api/telegram/sendMessage/", { 
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

            // clear message input
            let element = document.getElementById("message");
            element.value = "";
            setText(null);
            
            // scroll chat to bottom 
            let chat = await document.querySelector("#ChatInfo");
            if(chat != null){
                chat.scrollTop = Math.pow(10, 10);
            }
        } else{
            alert("Напишите сообщение")
        }
    }
    
    // text input handler
    const textHandler = (event) => {
        setText(event.target.value);
        let chat = document.getElementById('ChatInfo');
        if(chat){
            chat.scrollTop = chat.scrollHeight;
        }
    }
    
    // enter press handler
    const handleKeyPress = (e) => {
        if(e.key === "Enter"){
            sendMessage();
        }
    } 

    // scroll to bottom chat
    useEffect(()=>{
        let chat = document.getElementById('ChatInfo');
        if(chat){
            chat.scrollTop = chat.scrollHeight;
        }
    })


    if(openChat === false){
        return null
    } else{
        const fullScreenImage = 
        <div className="fullScreenImage">
            <img src={ "data:image/jpeg;base64," + idfullScreenImage} alt="" /> 
            <button onClick={() => setShowFullScreenImage(!showfullScreenImage)}>&#10006;</button>
        </div>;
        return(
            <div className="OpenChat"> 
                { showfullScreenImage === true ? fullScreenImage : null }
                <h1>Чат с {idChat}</h1>
                <div id="ChatInfo" className="ChatInfo">
                    {message.reverse().map((data, index) => { 
                        return (
                            <div key = {index} >
                                <div className = "ChatInfoElement"> 
                                    <div className="ChatInfoElementMessage">
                                        <img src={"data:image/jpeg;base64," + data[6] } onClick={() => {setShowFullScreenImage(!showfullScreenImage); setidFullScreenImage(data[6])}}  alt="" />
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