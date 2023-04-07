import { useSelector } from 'react-redux';

export default function AllMessage(props) {
    // redux state
    const openChat = useSelector((state) => state.openChat.value)
    const idChat = useSelector((state) => state.idChat.value)

    // mesage array and user photo 
    let message = [];
    let userPhoto;


    // load data
    if(props.data != null){
        props.data.forEach(async element => {
            if(element.username === idChat && element.type !== "Private"){
                let data = [element.text, element.date, element.chatId, element.messageId, element.username, element.answers, element.nameFrom, element.userAvatar, element.textPhoto];
                message.push(data);
            } else{
                let data = [undefined, element.date, element.chatId, element.messageId, element.username, element.answers, element.nameFrom, element.userAvatar, element.textPhoto];
                message.push(data);
            }
            });
    }

    // set correct user avatar
    message.forEach(element => {
        if(element[4] === idChat){
            userPhoto = element[7];
        }
    });

    
    // error load user avatar
    const nullAvatar = (username) => {
        let img = document.getElementById("allchat");
        img.outerHTML = "<p className='chatAvatarNull'>" + username[0].toUpperCase() + "</p>";
    }
    
    // scrolling message list to end
    let chat = document.querySelector("#ChatInfo2");
    if(chat != null){
        if(chat.scrollTop === 0){
            chat.scrollTop = chat.scrollHeight;
        };
    }

    if(openChat === false){
        return null
    } else{
        return(
            <div className = "AllMessageChat"> 
                <div className="AlLMessageUser">
                    <div className="avatar">
                        <img id="allchat" src={ "data:image/jpeg;base64," + userPhoto } alt="av" width={120} onError={()=>{nullAvatar(idChat)}}/>
                    </div> 
                    <p className="userName">{ idChat }</p>
                    <p>Все сообщения в группах:</p>
                </div> 
                <div className = "ChatInfo" id="ChatInfo2" >
                    {message.reverse().map((data, index) => {
                        if(data[0]){
                            return (
                                <div className = "ChatInfoElement" key={index}> 
                                    <div className = "ChatInfoElementMessage">
                                        <p className = "group">В { data[6] }</p>
                                        <img src={ "data:image/jpeg;base64," + data[8] } alt=""/>
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