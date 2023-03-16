import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { open } from '../../features/redux/openMessageSlice';
import { setMessageChat } from '../../features/redux/idMessageSlice';
import convertDate from '../../features/convertDate';

export default function ChannelOpenMessage(props) {
    const openChat = useSelector((state) => state.openChat.value)
    const idChat = useSelector((state) => state.idChat.value)
    const dispatch = useDispatch()
  
    let Message = [];

    if(props.data != null){
        props.data.sort(function(a,b){
            if(a.date < b.date){
                return 1;
            }
            if(a.date > b.date){
                return -1;
            }
            return 0;
            }).forEach(element => {
            if((element.type === "channel" && element.nameFrom === idChat) || (element.type === "superchannel" && element.nameFrom === idChat)){
                if(element.text !== null){
                    let data = [element.text, convertDate(element.date), element.chatId, element.messageId, element.username, element.answers, element.comments];
                    Message.push(data);
                }
            }
        });
    }

    if(openChat === true){
        return(
            <div >
            {Message.filter((element, index) => {
                return Message.indexOf(element) === index;
            }).map(data => {
                return (
                    <div className = "ChatElement" onClick = {() => {
                        dispatch(open());
                        dispatch(setMessageChat(data[3]));
                    }}>
                        <p>Сообщения: { data[0] }</p>
                        <p>Время: { data[1] }</p>
                    </div>
                ) 
            }
            )}
            </div>
        );
    } else{
        return null    
    }
}