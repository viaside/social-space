import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { open } from '../../features/redux/openMessageSlice';
import { setMessageChat } from '../../features/redux/idMessageSlice';
import convertDate from '../../features/convertDate';

export default function GroupOpenMessage(props) {
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
            if((element.type === "group" && element.nameFrom === idChat) || (element.type === "supergroup" && element.nameFrom === idChat)){
                if(element.text !== null){
                    let data = [element.text, convertDate(element.date), element.chatId, element.messageId, element.username, element.answers, element.comments, element.userAvatar, element.textPhoto];
                    Message.push(data);
                } else{
                    let data = ["*Изображение", convertDate(element.date), element.chatId, element.messageId, element.username, element.answers, element.comments, element.userAvatar, element.textPhoto];
                    Message.push(data);
                }
            }
        });
    }

    const activeMessage = async (id) => {
        for(let i = 0; i <= Message.length; i++){
            let element = document.getElementById("message"+i);
            if(element){
                if(id === "message"+i){
                    element.style.backgroundColor = "#353535";
                } else{
                    element.style.backgroundColor = null;
                }
            }
        }
    }

    if(openChat === true){
        return(
            <div className='ChatListAll'>
            {Message.filter((element, index) => {
                return Message.indexOf(element) === index;
            }).map((data, index) => {
                return (
                    <div className="ChatList" id={"message"+index} key = {index} onClick = {() => {
                        dispatch(open());
                        dispatch(setMessageChat(data[3]));
                        activeMessage("message"+index)
                    }}>
                        <div className='avatar'>
                            <img src={ "data:image/jpeg;base64," + data[7] } alt="avatar" width={70}/>
                        </div>
                        <div className='text'>
                            <p className='userName'>{ data[4] }</p>
                            <p className='lastMessage'>{ data[0] }</p>
                        </div>
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