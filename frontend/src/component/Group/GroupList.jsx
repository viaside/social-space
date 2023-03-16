import React from 'react';
import { useDispatch } from 'react-redux';
import { open } from '../../features/redux/openChatSlice';
import { close } from '../../features/redux/openMessageSlice';
import { setIdChat } from '../../features/redux/idChatSlice';

export default function GroupList(props) {
    const dispatch = useDispatch()
  
    let group = [];

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
            if(element.type === "group" || element.type === "supergroup"){
                group.push(element.nameFrom);
            }
        });
    }
    return(
        <div className='ChatListAll'>
            {group.filter((element, index) => {
                return group.indexOf(element) === index;
            }).map(data => {
                return (
                    <div className="ChatList" onClick = {() => {
                        dispatch(open());
                        dispatch(close());
                        dispatch(setIdChat(data));
                    }}>
                        <h1>{ data }</h1>
                    </div>
                ); 
            })}
        </div>
    );
}