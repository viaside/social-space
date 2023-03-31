import React from 'react';
import { useDispatch } from 'react-redux';
import { open } from '../../features/redux/openChatSlice';
import { setIdChat } from '../../features/redux/idChatSlice';

export default function ChatList(props) {
    const dispatch = useDispatch()
  
    const chats = [];
    const lastMessage = [];

    if(props.data != null){
        props.data.sort(function(a,b){
                if(a.date < b.date){ return 1 }
                if(a.date > b.date){ return -1 }
                return 0;
            }).forEach(element => {
                if(element.type === "private"){
                    chats.push(element.username + "----" + element.userAvatar);
                    lastMessage.push(element.text);
                }
        });
    }
    
    const activeChat = async (id) => {
        for(let i = 0; i <= chats.length; i++){
            let element = document.getElementById(i);
            if(element){
                if(id === i){
                    element.style.backgroundColor = "#353535";
                } else{
                    element.style.backgroundColor = null;
                }
            }
        }
    }

    const nullAvatar = (id, username) => {
        let img = document.getElementById(id + "img");
        img.outerHTML = "<p id=" + id +" className='chatAvatarNull'>" + username[0].toUpperCase() + "</p>";
    }


    return(
        <div className='ChatListAll'>   
            {chats.sort().filter((element, index, arr) => {
                return !index || element.split('----')[0] !== arr[index-1].split('----')[0];
            }).map((data, index) => {
                return (
                    <div className="ChatList" id = {chats.indexOf(data)} key = {index} onClick = {() => {
                        dispatch(open());
                        dispatch(setIdChat(data.split('----')[0]));
                        activeChat(chats.indexOf(data));
                    }}>
                        <div className='avatar'>
                            <img id={index+"img"} src={ "data:image/jpeg;base64," + data.split('----')[1] }
                             alt="avatar" width={80} onError={()=>{nullAvatar(index, data.split('----')[0])}}/>
                        </div>
                        <div className='text'>
                            <p className='userName'>{ data.split('----')[0] }</p>
                        <p className='lastMessage'>{ lastMessage[chats.indexOf(data)]? lastMessage[chats.indexOf(data)] : <p className='gray'>*Изображение</p> }</p>
                        </div>
                    </div>
                ) 
            })}
        </div>
    );
}