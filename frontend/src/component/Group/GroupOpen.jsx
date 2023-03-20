import convertDate from "../../features/convertDate";
import getCookie from "../../features/getCookie";
import { useSelector, useDispatch } from 'react-redux';
import { close } from '../../features/redux/openMessageSlice';
import { useState } from "react";

export default function GroupOpen(props) {
    const openMessage = useSelector((state) => state.openMessage.value)
    const idMessage = useSelector((state) => state.idMessage.value)
    const dispatch = useDispatch()
    const [Answer, setAnswer] = useState();
    const [Comment, setComment] = useState();
    const [showfullScreenImage, setShowFullScreenImage] = useState(false);
    
    let message = [];
    
    if(props.data != null){
        props.data.forEach(element => {
            if(element.messageId === idMessage && (element.type === "group" || element.type === "supergroup")){
                let data = [element.text, convertDate(element.date), element.chatId, element.messageId, element.username, element.answers, element.comments, element.userPhoto, element.textPhotos];
                message.push(data);
            }
        });
    }
    
    const sendMessage = async () => {
        if(Answer){
            let botId = await fetch('https://localhost:7013/api/user/GetInfo/' + getCookie("userId"))
            .then((Response) => Response.json())
            .then(async (Result) => { return Result.responseData["usingBots"].toString().split('----')[0] });
    
            let element = document.getElementById("message");
            element.value = "";
            setAnswer(null);

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
                    Text: Answer.toString(), 
                })
            });
        } else{
            alert("Напишите ответ")
        }
    }

    const sendComment = async () => {
        if(Comment){
            fetch("https://localhost:7013/api/telegram/AddComment/" + message[0][3] + "&" + Comment);
    
            let element = document.getElementById("comment");
            element.value = "";
            setComment(null)
        } else{
            alert("Напишите комментарий")
        }
    }
    
    const textHandlerAnswer = (event) => {
        setAnswer(event.target.value);
    }
    
    const textHandlerComent = (event) => {
        setComment(event.target.value);
    }

    const handleKeyPressAnswer = (e) => {
        if(e.key === "Enter"){
            sendMessage();
        }
    } 

    const handleKeyPressComment = (e) => {
        if(e.key === "Enter"){
            sendComment();
        }
    } 

    
    if(openMessage === false){
        return null
    } else{
        const fullScreenImage = <div className="fullScreenImage"> <img src={message[0][8]} alt="" onClick={() => setShowFullScreenImage(!showfullScreenImage)} /> </div>;
        return(
            <div className="GroupMessage">   
                { showfullScreenImage === true ? fullScreenImage : null }
                <div className="GroupMessageInfo">
                    <img src={ message[0][7] } alt="avatar" className="avatar" width={100} height={100}/>
                    <div className="text">
                        <p className="userName">{ message[0][4] }</p>
                        <div className="GroupMessageText">
                            <p>{ message[0][0] }</p>
                            <img src={ message[0][8] } alt="" width={80} onClick={() => setShowFullScreenImage(!showfullScreenImage)} />
                            <p className="time">{ message[0][1] }</p>
                        </div>
                    </div>
                </div>
                <div className="groupAnswerComment">
                    <div>
                        <h1>Ответы</h1>
                        <div className="groupBlockChat">
                            { message[0][5]? message[0][5].reverse().map((answer, index) => {
                                return(
                                    <div className="groupMessage" key={index}>
                                        <p className = "text">{ answer.split('/')[0] }</p>
                                        <p className = "time">{ answer.split('/')[1] }</p>
                                    </div>
                                )
                            }) : null}
                        </div>
                        <div>
                            <input onChange={(event) => textHandlerAnswer(event) } onKeyDown={handleKeyPressAnswer} name="message" id="message" placeholder="Напишите ответ..."></input>
                            <button onClick={() => sendMessage()}>Ответить</button>
                        </div>
                    </div>
                    <div>
                        <h1>Комментарий</h1>
                        <div className="groupBlockChat">
                            { message[0][6]? message[0][6].reverse().map((comments, index) => {
                                return(
                                    <div className="groupMessage" key={index}>
                                        <p className = "text">{ comments.split('/')[0] }</p>
                                        <p className = "time">{ comments.split('/')[1] }</p>
                                    </div>
                                )
                            }) : null}
                        </div>
                        <div className="answer">
                            <input onChange={(event) => textHandlerComent(event) } onKeyDown={handleKeyPressComment} name="comment" id="comment" placeholder="Напишите комментарий..."></input>
                            <button onClick={() => sendComment()}>Написать комментарий</button>
                        </div>
                    </div>
                </div>
                <button onClick={() => dispatch(close())} className="close">Закрыть</button>
            </div>
        );
    }
}