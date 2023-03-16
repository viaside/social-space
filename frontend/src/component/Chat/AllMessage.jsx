import convertDate from "../../features/convertDate";
import getProfilePhoto from "../../features/getProfilePhoto";
import { useSelector } from 'react-redux';
import { useState } from "react";

export default function AllMessage(props) {
    const openChat = useSelector((state) => state.openChat.value)
    const idChat = useSelector((state) => state.idChat.value)

    let message = [];
    let userPhoto;

    if(props.data != null){
        props.data.forEach(async element => {
            if(element.username === idChat && element.type !== "private"){
                let data = [element.text, convertDate(element.date), element.chatId, element.messageId, element.username, element.answers, element.nameFrom, element.userPhoto, element.textPhotos];
                message.push(data);
            } else{
                let data = [undefined, convertDate(element.date), element.chatId, element.messageId, element.username, element.answers, element.nameFrom, element.userPhoto, element.textPhotos];
                message.push(data);
            }
            });
    }

    message.forEach(element => {
        if(element[4] === idChat){
            userPhoto = element[7];
        }
    });

    let chat = document.querySelector("#ChatInfo2");
    if(chat != null){
        if(chat.scrollTop === 0){
            chat.scrollTop = Math.pow(10,10);
        };
    }

    if(openChat === false){
        return null
    } else{
        return(
            <div className = "AllMessageChat">   
                <img src={userPhoto} alt="av" width={120} className="avatar"/>
                <h1>{ idChat }</h1>
                <p>Все сообщения в группах:</p>
                <div className = "ChatInfo" id="ChatInfo2" >
                    {message.reverse().map(data => {
                        if(data[0] !== undefined){
                            return (
                                <div className = "ChatInfoElement" key={data[3]}> 
                                    <div className = "ChatInfoElementMessage">
                                        <p className = "text">В - { data[6] }</p>
                                        <img src={ data[8] } alt="" />
                                        <p className = "text">{ data[0] }</p>
                                        <p className = "time">{ data[1] }</p>
                                    </div>
                                </div>
                            )
                    }})}
                </div>
            </div>
        );
    }
}