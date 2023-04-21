import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { open } from '../../features/redux/openChatSlice';
import { set } from "../../features/redux/dataSlice";
import getMessage from '../../features/getMessage';
import { setIdChat } from '../../features/redux/idChatSlice';
import packagejson from "../../../package.json";

export default function ChatList() {
    // redux
    const dispatch = useDispatch()
    const dataRedux = useSelector((state) => state.data.value);
    const idChat = useSelector((state) => state.idChat.value)

  
    // chats array and user last message
    const chats = [];

    
    // set chats array
    if(dataRedux != null){
        let newData = [...dataRedux];
        newData.sort(function(a,b){ 
            // sort by data
            if(a.date < b.date){ return 1 }
            if(a.date > b.date){ return -1 }
            return 0;
            }).forEach(element => {
                if(element.type === "Private"){
                    if(chats.length !== 0){
                        let paste = true;
                        chats.forEach(el => {
                            if(element.username === el[0]){
                                paste = false;
                            } 
                        });
                        if(paste){
                            let messageCount = 0;
                            newData.forEach((el) => {
                                if(!el.isCheck && el.username === element.username){
                                    messageCount++;
                                }
                            });
                            let newArray = [element.username, element.userAvatar, element.text, element.isCheck, messageCount];
                            chats.push(newArray);
                        }
                    } else {
                        let messageCount = 0;
                        newData.forEach((el) => {
                            if(!el.isCheck && el.username === element.username){
                                messageCount++;
                            }
                        });
                        let newArray = [element.username, element.userAvatar, element.text, element.isCheck, messageCount];
                        chats.push(newArray);
                    }
                }
            });
    }
        
    useEffect(() => {
        let username = idChat;
        chats.forEach(el => {
            let element = document.getElementById(el[0]);
            if(el[0] === username){
                element.style.backgroundColor = "#353535";
            } else{
                element.style.backgroundColor = null;
            }
        });
    }, [dataRedux])


    const activeChat = async (id, username) => {
        // marks that messages have been viewed      
        fetch(packagejson.ipurl + '/api/telegram/CheckMessage/' + id).then(() => {
            getMessage().then((Result) => {dispatch(set(Result))});
        });

        chats.forEach(el => {
            let element = document.getElementById(el[0]);
            if(el[0] === username){
                element.style.backgroundColor = "#353535";
            } else{
                element.style.backgroundColor = null;
            }
        });
    }

    // null avatar handler 
    const nullAvatar = (id, username) => {

        //gag avatar
        let img = document.getElementById(id + "img");
        img.outerHTML = "<p id=" + id +" className='chatAvatarNull'>" + username[0].toUpperCase() + "</p>";
    }

    return(
        <div className='ChatListAll'>   
            {chats.map((data, index) => {
                return (
                    <div className="ChatList" id = {data[0]} key = {index} onClick = {() => {
                        dispatch(open());
                        dispatch(setIdChat(data[0]));
                        activeChat(chats.indexOf(data), data[0]);
                    }}>
                        <div className='avatar'>
                            <img id={index+"img"} src={ "data:image/jpeg;base64," + data[1] }
                             alt="avatar" width={80} onError={()=>{nullAvatar(index, data[0])}}/>
                        </div>
                        <div className='text'>
                            <p className='userName'>{ data[0] }</p>
                            <p className='lastMessage'>{ data[2]? data[2].length >= 100? data[2].substr(0, 50) + " . . ." : data[2]: <p className='gray'>*Изображение</p> }</p>
                        </div>
                            { data[3]? null : <p className='countMarker'>{data[4]}</p> }
                    </div>
                ) 
            })}
        </div>
    );
}