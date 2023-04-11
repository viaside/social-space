import getCookie from "../../features/getCookie";
import getMessage from '../../features/getMessage';
import { useSelector, useDispatch } from 'react-redux';
import { set } from "../../features/redux/dataSlice";
import { close } from '../../features/redux/openMessageSlice';
import { useState } from "react";
import packagejson from '../../../package.json';

export default function GroupOpen(props) {
    // redux states
    const openMessage = useSelector((state) => state.openMessage.value);
    const idMessage = useSelector((state) => state.idMessage.value);
    const dataRedux = useSelector((state) => state.data.value);
    const dispatch = useDispatch()

    // states 
    const [Answer, setAnswer] = useState();
    const [Comment, setComment] = useState();
    const [showfullScreenImage, setShowFullScreenImage] = useState(false);
    
    // message array 
    let message = [];
    
    // set message array
    if(dataRedux != null){
        dataRedux.forEach(element => {
            if(element.messageId === idMessage && (element.type === "Group" || element.type === "Supergroup")){
                let data = [element.text, element.date, element.chatId, element.messageId, element.username, element.answers, element.comments, element.userAvatar, element.textPhoto];
                message.push(data);
            }
        });
    }
    

    // send message to user
    const sendMessage = async () => {
        if(Answer){
            // get user bot id 
            let botId = await fetch(packagejson.ipurl + '/api/user/GetInfo/' + getCookie("userId"))
            .then((Response) => Response.json())
            .then(async (Result) => { return Result.responseData["usingBots"].toString().split('----')[0] });
    
            // clear message input
            let element = document.getElementById("message");
            element.value = "";
            setAnswer(null);

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
                    Text: Answer.toString(), 
                })
            });
            getMessage().then((Result) => {dispatch(set(Result))});
        } else{
            alert("Напишите ответ")
        }
    }

    // send local comment
    const sendComment = async () => {
        if(Comment){
            // send local comment
            await fetch(packagejson.ipurl + "/api/telegram/AddComment/", { 
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    MessageId: message[0][3], 
                    Text: Comment, 
                })
            });
    
            // clear comment input
            let element = document.getElementById("comment");
            element.value = "";
            setComment(null);
            getMessage().then((Result) => {dispatch(set(Result))});
        } else{
            alert("Напишите комментарий")
        }
    }
    
    // asnwer input handler 
    const textHandlerAnswer = (event) => {
        setAnswer(event.target.value);
    }
    
    // comment input handler 
    const textHandlerComent = (event) => {
        setComment(event.target.value);
    }
    
    // answer enter press handler  
    const handleKeyPressAnswer = (e) => {
        if(e.key === "Enter"){
            sendMessage();
        }
    } 
    
    // comment enter press handler  
    const handleKeyPressComment = (e) => {
        if(e.key === "Enter"){
            sendComment();
        }
    } 

    
    if(openMessage === false){
        return null
    } else{
        const fullScreenImage = 
        <div className="fullScreenImage"> 
            <img src={ "data:image/jpeg;base64," + message[0][8]} alt=""/> 
            <button onClick={() => setShowFullScreenImage(!showfullScreenImage)}>&#10006;</button>
        </div>;
        return(
            <div className="GroupMessage">   
                { showfullScreenImage === true ? fullScreenImage : null }
                <div className="GroupMessageInfo">
                    <img src={ "data:image/jpeg;base64," + message[0][7] } alt="avatar" className="avatar" width={100} height={100}/>
                    <div className="text">
                        <p className="userName">{ message[0][4] }</p>
                        <div className="GroupMessageText">
                            <p>{ message[0][0] }</p>
                            <img src={ "data:image/jpeg;base64," + message[0][8] } alt="" width={80} onClick={() => setShowFullScreenImage(!showfullScreenImage)} />
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