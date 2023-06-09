import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { open } from '../../features/redux/openMessageSlice';
import { set } from "../../features/redux/dataSlice";
import { setMessageChat } from '../../features/redux/idMessageSlice';
import getMessage from '../../features/getMessage';
import packagejson from '../../../package.json';

export default function GroupOpenMessage(props) {
    // redux state
    const openChat = useSelector((state) => state.openChat.value)
    const idChat = useSelector((state) => state.idChat.value)
    const idMessage = useSelector((state) => state.idMessage.value)
    const dataRedux = useSelector((state) => state.data.value);
    const dispatch = useDispatch()
  
    // message array
    let Message = [];

    // set message array
    if(dataRedux != null){
        let newData = [...dataRedux];
        newData.sort(function (a,b) {
            if(a.date<b.date){
                return 1;
            }
            if(a.date>b.date){
                return -1;
            }
            return 0
        }).forEach(element => {
                if((element.type === "Group" && element.nameFrom === idChat) || (element.type === "Supergroup" && element.nameFrom === idChat)){
                    // image presence check
                    if(element.text !== null){
                        let data = [element.text, element.date, element.chatId, element.messageId, element.username, element.answers, element.comments, element.userAvatar, element.textPhoto, element.isCheck, element.status];
                        Message.push(data);
                    } else{
                        let data = ["*Изображение", element.date, element.chatId, element.messageId, element.username, element.answers, element.comments, element.userAvatar, element.textPhoto, element.isCheck, element.status];
                        Message.push(data);
                    }
                }
        });
    }

    // useEffect(() => {
    //     let id = idMessage;
    //     activeMessage(id);
    // }, dataRedux);

    // message selection
    const activeMessage = async (messageId) => {
        // marks that messages have been viewed 
        fetch(packagejson.ipurl + '/api/telegram/CheckMessage/' + messageId).then(() => {
            getMessage().then((Result) => {dispatch(set(Result))})
        });

        Message.forEach(el => {
            let element = document.getElementById(el[3])
            if(el[3] === messageId){
                element.style.backgroundColor = "#353535";
            } else{
                element.style.backgroundColor = null;
            }
        });
    }

    if(openChat === true){
        return(
            <div className='ChatListAll'>
            {Message.map((data, index) => {
                return (
                    <div className="ChatList" id={data[3]} key = {index} onClick = {() => {
                        dispatch(open());
                        dispatch(setMessageChat(data[3]));
                        activeMessage(data[3])
                    }}>
                        <div className='avatar'>
                            <img src={ "data:image/jpeg;base64," + data[7] } alt="avatar" width={70}/>
                        </div>
                        <div className='text'>
                            <p className='userName'>{ data[4] }</p>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <p className='lastMessage'>{ data[0] }</p>
                                {data[9]?null : <p className='messageMarker'></p>}
                            </div>
                        <div>
                            <p style={{textAlign: "right", color: "red"}}>{data[10] === 0 || data[10] === null? "ждет ответа" : null}</p>
                            <p style={{textAlign: "right", color: "yellow"}}>{data[10] === 1? "просмотренно" : null}</p>
                            <p style={{textAlign: "right", color: "green"}}>{data[10] === 2? "в процессе" : null}</p>
                            <p style={{textAlign: "right", color: "gray"}}>{data[10] === 3? "закончен" : null}</p>
                        </div>
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