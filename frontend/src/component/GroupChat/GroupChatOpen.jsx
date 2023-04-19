import getCookie from "../../features/getCookie";
import { useSelector, useDispatch } from 'react-redux';
import { close } from '../../features/redux/openChatSlice';
import { useEffect, useState } from "react";
import packagejson from "../../../package.json";
import { set } from "../../features/redux/dataSlice";
import getMessage from "../../features/getMessage";

export default function GroupChatOpen() {
    // redux states
    const openChat = useSelector((state) => state.openChat.value)
    const idChat = useSelector((state) => state.idChat.value)
    const dispatch = useDispatch()
    const dataRedux = useSelector((state) => state.data.value);    
    
    // states
    const [text, setText] = useState();
    const [showfullScreenImage, setShowFullScreenImage] = useState(false);
    const [idfullScreenImage, setidFullScreenImage] = useState(null);

    // message array
    let message = [];
    // set message array
    if(dataRedux != null){
        dataRedux.forEach(element => {
            if((element.type === "Group" && element.nameFrom === idChat) || (element.type === "Supergroup" && element.nameFrom === idChat)){
                let data = [element.text, element.date, element.chatId, element.messageId, element.username, element.answers, element.textPhoto, element.userAvatar];
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

            getMessage().then((Result) => {dispatch(set(Result))});

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

    const checkMessage = () => {
        getMessage().then((Result) => {dispatch(set(Result))});

        // marks that messages have been viewed 
        for (let i = 0; i < message.length; i++) {
            const element = message[i];
            fetch(packagejson.ipurl + '/api/telegram/CheckMessage/' + element[3]);
        }
    }

    console.log(message)
    if(openChat === false){
        return null
    } else{
        const fullScreenImage = 
        <div className="fullScreenImage">
            <img src={ "data:image/jpeg;base64," + idfullScreenImage} alt="" /> 
            <button onClick={() => setShowFullScreenImage(!showfullScreenImage)}>&#10006;</button>
        </div>;
        return(
            <div className="OpenChat" style={{width: "90vw"}} > 
                { showfullScreenImage === true ? fullScreenImage : null }
                <h1>{idChat}</h1>
                <div id="ChatInfo" className="ChatInfo" style={{marginLeft: 150, marginRight: 150}}>
                        {message.reverse().sort(function(a,b){
                                if(a[1] > b[1]){
                                    return 1;
                                }
                                if(a[1] < b[1]){
                                    return -1;
                                }
                                return 0;
                            }).map((data, index) => { 
                            return (
                                <div key = {index} >
                                    <div className = "GroupChatInfoElement"> 
                                        <img src={ "data:image/jpeg;base64," + data[7]} className="avatar" width={50}/>
                                        <div className="GroupChatMessage">
                                            <p className="userName">@{ data[4] }</p>
                                            <img src={"data:image/jpeg;base64," + data[6] } onClick={() => {setShowFullScreenImage(!showfullScreenImage); setidFullScreenImage(data[6])}}  alt="" />
                                            <p className="text">{ data[0] }</p>
                                            <div className="time">
                                                <p>{ data[1] }</p>
                                            </div>
                                        </div>
                                    </div>
                                    { data[5] ? data[5].slice().reverse().sort(function(a,b){
                                        if(a.split('/')[1] > b.split('/')[1]){
                                            return 1;
                                        }
                                        if(a.split('/')[1] < b.split('/')[1]){
                                            return -1;
                                        }
                                        return 0;
                                    }).map((answer, index) => {
                                        return(
                                            <div className = "ChatAnswerElement" key={index} style={{width: 400}}>
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
                        <button onClick={() => checkMessage()}>Пометить как прочитаное</button>
                    <button onClick={ () => dispatch(close()) }>Закрыть чат</button>
                </div>
            </div>
        );
    }
}