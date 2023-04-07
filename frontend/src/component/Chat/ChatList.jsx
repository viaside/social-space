import React from 'react';
import { useDispatch } from 'react-redux';
import { open } from '../../features/redux/openChatSlice';
import { setIdChat } from '../../features/redux/idChatSlice';
import packagejson from "../../../package.json";

export default function ChatList(props) {
    // redux
    const dispatch = useDispatch()
  
    // chats array and user last message
    const chats = [];
    const lastMessage = [];

    // set chats array
    if(props.data != null){
        props.data.sort(function(a,b){
            // sort by data
            if(a.date < b.date){ return 1 }
            if(a.date > b.date){ return -1 }
            return 0;
            }).forEach(element => {
                if(element.type === "Private"){
                    chats.push(element.username + "----" + element.userAvatar);
                    lastMessage.push(element.text);
                }
        });
    }
    

    const activeChat = async (id) => {
        // marks that messages have been viewed      
        // fetch(packagejson.ipurl + '/api/telegram/CheckMessage/' + id)
        // .then((Response) => Response.json())
        // .then((Result) => {
        //     console.log(Result);
        // });


        for(let i = 0; i <= chats.length; i++){
            // chat html element
            let element = document.getElementById(i);

            if(element){
                if(id === i){
                    // set style active group
                    element.style.backgroundColor = "#353535";
                } else{
                    // claer other group
                    element.style.backgroundColor = null;
                }
            }
        }
    }

    // null avatar handler 
    const nullAvatar = (id, username) => {

        //gag avatar
        let img = document.getElementById(id + "img");
        img.outerHTML = "<p id=" + id +" className='chatAvatarNull'>" + username[0].toUpperCase() + "</p>";
    }

    return(
        <div className='ChatListAll'>   
            {chats.sort().filter((element, index, arr) => {
                return !index || element.split('----')[0] !== arr[index-1].split('----')[0];
            }).map((data, index) => {
                return (
                    <div className="ChatList" id = {index} key = {index} onClick = {() => {
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