import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { open } from '../../features/redux/openChatSlice';
import { close } from '../../features/redux/openMessageSlice';
import { setIdChat } from '../../features/redux/idChatSlice';

export default function GroupChatList(props) {
    // redux
    const dispatch = useDispatch()
    const idChat = useSelector((state) => state.idChat.value);
    const dataRedux = useSelector((state) => state.data.value);

    // group array
    let group = [];

    // set group array
    if(dataRedux){
        let newData = [...dataRedux];
        newData.sort(function(a,b){
            // sort by data
            if(a.date < b.date){
                return 1;
            }
            if(a.date > b.date){
                return -1;
            }
            return 0;
            }).forEach(element => {
                if(element.type === "Group" || element.type === "Supergroup"){
                    if(group.length !== 0){
                        let paste = true;
                        group.forEach(el => {
                            if(element.nameFrom === el[0]){
                                paste = false;
                            } 
                        });
                        if(paste){
                            let messageCount = 0;
                            newData.forEach((el) => {
                                if(!el.isCheck && el.nameFrom === element.nameFrom){
                                    messageCount++;
                                }
                            });
                            let newArray = [element.nameFrom, messageCount];
                            group.push(newArray);
                        }
                    } else {
                        let messageCount = 0;
                        newData.forEach((el) => {
                            if(!el.isCheck && el.nameFrom === element.nameFrom){
                                messageCount++;
                            }
                        });
                        let newArray = [element.nameFrom, messageCount];
                        group.push(newArray);
                    }
                }
        });
    }

    useEffect(() =>{
        let id = idChat;
        activeGroup(id); 
    }, [dataRedux])

    // group selection
    const activeGroup = async (nameFrom) => {
        for(let i = 0; i <= group.length; i++){
            group.forEach(el => {
                let element = document.getElementById(el[0]);
                if(el[0] === nameFrom){
                    element.style.backgroundColor = "#353535";
                } else{
                    element.style.backgroundColor = null;
                }
            });
        }
    }

    return(
        <div className='GroupListAll'>
            {group.filter((element, index) => {
                return group.indexOf(element) === index;
            }).map((data, index) => {
                return (
                    <div className="GroupList" id = {data[0]}  key={index}  onClick = {() => {
                        dispatch(open());
                        dispatch(close());
                        dispatch(setIdChat(data[0]));
                        activeGroup(data[0]);
                    }}>
                        <h1>{ data[0] }</h1>
                        { data[1] === 0? null : <p className='countMarker'>{data[1]}</p> }
                    </div>
                ); 
            })}
        </div>
    );
}