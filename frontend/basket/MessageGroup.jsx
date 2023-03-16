import { Component} from "react";
import convertDate from '../src/features/convertDate';
import getMessage from "../src/features/getMessage";

export default class MessageGroup extends Component {
    constructor(){
        super();
        this.state= {
            data: [],
            isOpenMessage: false,
            messageElement: <></>,
            text: ""
        }

        this.textHandler = this.textHandler.bind(this);
    }
    
    componentDidMount() {
        getMessage().then(result => this.setState({data: result}));
        
        const timer = setInterval(() => {getMessage().then(result => this.setState({data: result}))}, 5000);
        return () => clearTimeout(timer); 
    }

    
    
    textHandler(event) {
        this.setState({ text: event.target.value })
    }

    async openMessageElement(){
        await this.setState({isOpenMessage: true});
    }
    async closeMessageElement(){
        await this.setState({isOpenMessage: false});
    }


    async MessageElement(title, username, date, messageText, chatId, messageId){
        window.scrollTo(0,0);
        const sendMessage = () =>{
            fetch("https://localhost:7013/api/telegram/sendMessage/" + chatId + "&" + this.state.text + "&" + messageId);
            this.setState({text: ""});

        }

        if(this.state.isOpenMessage === true){
            this.setState({ messageElement: 
                <div className="OpenChat">
                    <h1>{ title }</h1>
                    <p>От: { username }</p>
                    <p>Сообщения: { messageText }</p>
                    <p>Время: { date }  </p>
                    <p>Ответ:</p>   
                    <textarea onChange={(event) => this.textHandler(event) } name="message" id="message"></textarea>
                    <button onClick={() => { sendMessage() } }>Ответить</button>
                </div>
            });
        } else{
            this.setState({ messageElement: <></>});
        }
    }
    render() {
        return(
            <div className="Chat">
                <div>
                    {this.state.data.map(data => {
                        if(data != null){
                            if(data.type === "group"){
                                return <div className="ChatElement" key = {data.id} onClick = {async () => {
                                    await this.openMessageElement(); 
                                    this.MessageElement(data.title ,data.username, convertDate(data.date), data.text, data.chatId, data.messageId); 
                                }}>
                                    <p>В: { data.nameFrom }</p>
                                    <p>От: { data.username }</p>
                                    <p>Время: { convertDate(data.date) }  </p>
                                    <p>Сообщения: { data.text }</p>
                                </div>
                            } else{
                                return null
                            }
                        } else{
                            return null
                        }
                    }
                    )}
                </div>
                <div>
                    {this.state.messageElement}
                </div>
            </div>
        );
    }
}