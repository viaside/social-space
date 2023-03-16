import convertDate from "../../features/convertDate";
import { useSelector, useDispatch } from 'react-redux';
import { close } from '../../features/redux/openMessageSlice';
import { useState } from "react";

export default function ChannelOpen(props) {
    const openMessage = useSelector((state) => state.openMessage.value)
    const idMessage = useSelector((state) => state.idMessage.value)
    const dispatch = useDispatch()
    const [Answer, setAnswer] = useState();
    const [Comment, setComment] = useState();

    let message = [];

    if(props.data != null){
        props.data.forEach(element => {
            if(element.messageId === idMessage && (element.type === "channel" || element.type === "superchannel")){
                let data = [element.text, convertDate(element.date), element.chatId, element.messageId, element.username, element.answers, element.comments];
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
        return(
            <div className = "OpenChat">   
                <p>От: { message[0][4] }</p>
                <p>Сообщения: { message[0][0] }</p>
                <p>Время: { message[0][1] }</p>
                <p>Ответы:</p>
                    { message[0][5] != undefined ? message[0][5].reverse().map((answer) => {
                        return(
                            <div>
                                <p className = "text">{ answer.split("/")[0] }</p>
                                <p className = "time">{ answer.split("/")[1] }</p> 
                            </div>
                        )
                    }) : <p>Ответов нету</p>}
                <textarea onChange={(event) => textHandlerAnswer(event) } name="message" id="message"></textarea>
                <button onClick={() => sendMessage()}>Ответить</button>
                <p>Коментарии:</p>
                    { message[0][6] != undefined ? message[0][6].reverse().map((comments) => {
                        return(
                            <div>
                                <p className = "text">{ comments.split("/")[0] }</p>
                                <p className = "time">{ comments.split("/")[1] }</p> 
                            </div>
                        )
                    }) : <p>Коментарий нету</p>}
                <textarea onChange={(event) => textHandlerComent(event) } name="message" id="message"></textarea>
                <button onClick={() => sendComment()}>Написать комментарий</button>
                <button onClick={() => dispatch(close())}>Закрыть</button>
            </div>
        );
    }
}