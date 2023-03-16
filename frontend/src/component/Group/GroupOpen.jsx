import convertDate from "../../features/convertDate";
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
    
    const sendMessage = () => {
        fetch("https://localhost:7013/api/telegram/sendMessage/" + message[0][2] + "&" + Answer + "&" + message[0][3]);
    }

    const sendComment = () => {
        fetch("https://localhost:7013/api/telegram/AddComment/" + message[0][3] + "&" + Comment);
    }
    
    const textHandlerAnswer = (event) => {
        setAnswer(event.target.value);
    }
    
    const textHandlerComent = (event) => {
        setComment(event.target.value);
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
                            <p>{ message[0][1] }</p>
                        </div>
                    </div>
                </div>
                <div className="groupAnswerComment">
                    <div>
                        <h1>Ответы</h1>
                        <div className="groupBlockChat">
                            { message[0][5] != undefined ? message[0][5].reverse().map((answer) => {
                                return(
                                    <div className="groupMessage">
                                        <p className = "text">{ answer.split('/')[0] }</p>
                                        <p className = "time">{ answer.split('/')[1] }</p>
                                    </div>
                                )
                            }) : null}
                        </div>
                        <input onChange={(event) => textHandlerAnswer(event) } name="message" id="message" placeholder="Напишите ответ..."></input>
                        <button onClick={() => sendMessage()}>Ответить</button>
                    </div>
                    <div>
                        <h1>Комментарий</h1>
                        <div className="groupBlockChat">
                            { message[0][6] != undefined ? message[0][6].reverse().map((comments) => {
                                return(
                                    <div className="groupMessage">
                                        <p className = "text">{ comments.split('/')[0] }</p>
                                        <p className = "time">{ comments.split('/')[1] }</p>
                                    </div>
                                )
                            }) : null}
                        </div>
                        <input onChange={(event) => textHandlerComent(event) } name="message" id="message" placeholder="Напишите комментарий..."></input>
                        <button onClick={() => sendComment()}>Написать комментарий</button>
                    </div>
                </div>
                <button onClick={() => dispatch(close())} className="close">Закрыть</button>
            </div>
        );
    }
}