import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { open } from '../../features/redux/openChatSlice';
import { close } from '../../features/redux/openMessageSlice';
import { setIdChat } from '../../features/redux/idChatSlice';

export default function GroupList(props) {
    // redux
    const dispatch = useDispatch()
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
                    group.push(element.nameFrom);
                }
        });
    }

    // group selection
    const activeGroup = async (id) => {
        for(let i = 0; i <= group.length; i++){
            // group html elelement
            let element = await document.getElementById(i);

            // group message html element
            let elementMessage = await document.getElementById("message"+i);

            if(element){
                if(id === i){
                    // set style active group
                    element.style.backgroundColor = "#353535";
                } else{
                    // clear style  other group
                    element.style.backgroundColor = null;
                }
            }
            if(elementMessage){
                // clear style group message 
                elementMessage.style.backgroundColor = null;
            }
        }
    }

    return(
        <div className='GroupListAll'>
            {group.filter((element, index) => {
                return group.indexOf(element) === index;
            }).map((data, index) => {
                return (
                    <div className="GroupList" id={index} key={index}  onClick = {() => {
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