import React from 'react';
import { useDispatch } from 'react-redux';
import { open } from '../../features/redux/openChatSlice';
import { close } from '../../features/redux/openMessageSlice';
import { setIdChat } from '../../features/redux/idChatSlice';

export default function GroupList(props) {
    const dispatch = useDispatch()
  
    let group = [];

    if(props.data){
        props.data.sort(function(a,b){
            if(a.date < b.date){
                return 1;
            }
            if(a.date > b.date){
                return -1;
            }
            return 0;
            }).forEach(element => {
            if(element.type === "group" || element.type === "supergroup"){
                group.push(element.nameFrom);
            }
        });
    }

    const activeGroup = async (id) => {
        for(let i = 0; i <= group.length; i++){
            let element = await document.getElementById(i);
            let elementMessage = await document.getElementById("message"+i);
            if(element && elementMessage){
                if(id === i){
                    element.style.backgroundColor = await "#353535";
                } else{
                    element.style.backgroundColor = null;
                }
            }
            elementMessage.style.backgroundColor = null;
        }
    }

    return(
        <div className='ChatListAll'>
            {group.filter((element, index) => {
                return group.indexOf(element) === index;
            }).map((data, index) => {
                return (
                    <div className="ChatList" id={index} key={index} onClick = {() => {
                        dispatch(open());
                        dispatch(close());
                        dispatch(setIdChat(data));
                        activeGroup(index);
                    }}>
                        <h1>{ data }</h1>
                    </div>
                ); 
            })}
        </div>
    );
}