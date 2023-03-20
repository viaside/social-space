import { Component } from "react";
import getCookie from "../../../features/getCookie";

export default class AccountBots extends Component {
    constructor(){
        super();
        this.state= {
            data: [],
            isAddBots: false,
            BotId: "",
        }

        this.addBot = this.addBot.bind(this);
        this.deleteBot = this.deleteBot.bind(this);
        this.BotId = this.BotId.bind(this);
    }
    
    async componentDidMount() {
        fetch('https://localhost:7013/api/user/GetInfo/' + getCookie("userId"))
        .then((Response) => Response.json())
        .then(async (Result) => {
            this.setState({ data: Result.responseData });
        });
    }
    BotId(event) {
        this.setState({ BotId: event.target.value })
    }
            
    addBot(){
        this.setState({ isAddBots: !this.state.isAddBots })
        if(this.state.isAddBots === true){
            fetch("https://localhost:7013/api/user/AddBot/"+ this.state.data.id +"&"+ this.state.BotId)
            .then((Response) => Response.json())
            .then((result) => {
                console.log(result);
                if(result.responseData === "False"){
                    alert("Бот по данному id не найден")
                } else{
                    window.location.reload();
                }
            })
        }
    }

    deleteBot(id){
        fetch("https://localhost:7013/api/user/DeleteBot/"+ this.state.data.id +"&"+ id)
        .then(window.location.reload());
    }

    render() {
        return(
            <div>
                {this.state.data.usingBots !== null && this.state.data.usingBots !== undefined? 
                    this.state.data.usingBots.map((element, index) => { return (
                        <div key={index} className="bots">
                            <p>Имя - {element.toString().split('----')[1]}</p> 
                            <p>id - {element.toString().split('----')[0]}</p>
                            <button onClick={() => this.deleteBot(element)}>Удалить бота</button>
                        </div>
                )}): null}
                {this.state.isAddBots !== false? 
                    <div>
                        <input placeholder="Введите id бота" onChange={ this.BotId }/> 
                    </div>
                : null}
                <button onClick={ this.addBot }>Добавить бота</button>
            </div>
        );
    }
}