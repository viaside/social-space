import { Component } from "react";
import getCookie from "../../../features/getCookie";
import packagejson from "../../../../package.json";

export default class AccountBots extends Component {
    constructor(){
        super();
        // state
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
        // get user info from cookie
        fetch(packagejson.ipurl + '/api/user/GetInfo/' + getCookie("userId"))
        .then((Response) => Response.json())
        .then(async (Result) => {
            // set user data
            this.setState({ data: Result.responseData });
        });
    }
    
    // botid input handler
    BotId(event) {
        this.setState({ BotId: event.target.value })
    }
     
    // add bot function
    addBot(){
        this.setState({ isAddBots: !this.state.isAddBots });
        if(this.state.isAddBots === true){
            // add bot 
            fetch(packagejson.ipurl + "/api/user/AddBot/"+ this.state.data.id +"&"+ this.state.BotId)
            .then((Response) => Response.json())
            .then((result) => {
                console.log(result);
                if(result.responseData === "False"){
                    alert("Бот по данному id не найден")
                } else{
                    // update user info
                    fetch(packagejson.ipurl + '/api/user/GetInfo/' + getCookie("userId"))
                    .then((Response) => Response.json())
                    .then(async (Result) => {
                        this.setState({ data: Result.responseData });
                    });
                }
            })
        }
    }

    // delet user bot 
    deleteBot(id){
        // delete bot
        fetch(packagejson.ipurl + "/api/user/DeleteBot/"+ this.state.data.id +"&"+ id)
        .then((Response) => Response.json())
        .then(() => {
            // update user info
            fetch(packagejson.ipurl + '/api/user/GetInfo/' + getCookie("userId"))
            .then((Response) => Response.json())
            .then(async (Result) => {
                this.setState({ data: Result.responseData });
            })
        });
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