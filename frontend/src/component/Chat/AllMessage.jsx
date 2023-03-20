import convertDate from "../../features/convertDate";
import { useSelector } from 'react-redux';

export default function AllMessage(props) {
    const openChat = useSelector((state) => state.openChat.value)
    const idChat = useSelector((state) => state.idChat.value)

    let message = [];
    let userPhoto;

    if(props.data != null){
        props.data.forEach(async element => {
            if(element.username === idChat && element.type !== "private"){
                let data = [element.text, convertDate(element.date), element.chatId, element.messageId, element.username, element.answers, element.nameFrom, element.userPhoto, element.textPhotos];
                message.push(data);
            } else{
                let data = [undefined, convertDate(element.date), element.chatId, element.messageId, element.username, element.answers, element.nameFrom, element.userPhoto, element.textPhotos];
                message.push(data);
            }
            });
    }

    message.forEach(element => {
        if(element[4] === idChat){
            userPhoto = element[7];
        }
    });

    let chat = document.querySelector("#ChatInfo2");
    if(chat != null){
        if(chat.scrollTop === 0){
            chat.scrollTop = Math.pow(10,10);
        };
    }

    const nullAvatar = (username) => {
        let img = document.getElementById("allchat");
        console.log(img);
        img.outerHTML = "<p className='chatAvatarNull'>" + username[0].toUpperCase() + "</p>";
    }

    if(openChat === false){
        return null
    } else{
        return(
            <div className = "AllMessageChat">  
                <div className="avatar">
                    <img id="allchat" src={userPhoto} alt="av" width={120} onError={()=>{nullAvatar(idChat)}}/>
                </div> 
                <h1>{ idChat }</h1>
                <p>Все сообщения в группах:</p>
                <div className = "ChatInfo" id="ChatInfo2" >
                    {message.reverse().map((data, index) => {
                        if(data[0]){
                            return (
                                <div className = "ChatInfoElement" key={index}> 
                                    <div className = "ChatInfoElementMessage">
                                        <p className = "text">В - { data[6] }</p>
                                        <img src={ data[8] } alt=""/>
                                        <p className = "text">{ data[0] }</p>
                                        <p className = "time">{ data[1] }</p>
                                    </div>
                                </div>
                        )
                        } else{
                            return null
                        }   
                    })}
                </div>
            </div>
        );
    }
}