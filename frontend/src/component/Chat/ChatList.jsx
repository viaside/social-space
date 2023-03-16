import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { open } from '../../features/redux/openChatSlice';
import { setIdChat } from '../../features/redux/idChatSlice';
import getProfilePhoto from '../../features/getProfilePhoto';

export default function ChatList(props) {
    const dispatch = useDispatch()
  
    const chats = [];
    const lastMessage = [];

    const [openChat, setOpenChat] = useState(false);

    if(props.data != null){
        props.data.sort(function(a,b){
                if(a.date < b.date){ return 1 }
                if(a.date > b.date){ return -1 }
                return 0;
            }).forEach(element => {
                if(element.type === "private"){
                    chats.push(element.username + "//-//" + element.userPhoto);
                    lastMessage.push(element.text);
                }
        });
    }
    
    const activeChat = async (id) => {
        for(let i = 0; i <= chats.length; i++){
            let element = document.getElementById(i);
            if(element !== null){
                if(id === i){
                    element.style.backgroundColor = "#353535";
                } else{
                    element.style.backgroundColor = null;
                }
            }
        }
    }
    
    return(
        <div className='ChatListAll'>
            {chats.filter((element, index) => {
                return chats.indexOf(element) === index;
            }).map(data => {
                return (
                    <div className="ChatList" id = {chats.indexOf(data)} key = {chats.indexOf(data)} onClick = {() => {
                        dispatch(open());
                        dispatch(setIdChat(data.split('//-//')[0]));
                        activeChat(chats.indexOf(data));
                    }}>
                        <div className='avatar'>
                            <img src={ data.split('//-//')[1] } alt="avatar" width={70}/>
                        </div>
                        <div className='text'>
                            <p className='userName'>{ data.split('//-//')[0] }</p>
                            <p className='lastMessage'>{ lastMessage[chats.indexOf(data)] }</p>
                        </div>
                    </div>
                ) 
            })}
        </div>
    );
}