import { Component } from "react";
import getCookie from "../../../features/getCookie";
import packagejson from "../../../../package.json";

export default class AccountGroup extends Component {
    constructor(){
        super();
        this.state= {
            data: [],
            Name: [],
        }

        this.SetName = this.SetName.bind(this);

        this.CreateGroup = this.CreateGroup.bind(this);
        this.ConnectGroup = this.ConnectGroup.bind(this);

    }
    
    async componentDidMount() {
        // get user info
        fetch(packagejson.ipurl + '/api/user/GetInfo/' + getCookie("userId"))
        .then((Response) => Response.json())
        .then(async (Result) => {
            // set user info
            this.setState({ data: Result.responseData });
        });

    }

    CreateGroup = () => {
        fetch(packagejson.ipurl + "/api/user/AddGroup/" +  this.state.data.id + "&" +  this.state.Name)
        .then((Response) => Response.json())
        .then(async (Result) => {
            // set user data
            fetch(packagejson.ipurl + '/api/user/GetInfo/' + getCookie("userId"))
            .then((Response) => Response.json())
            .then(async (Result) => {
                this.setState({ data: Result.responseData });
            });
        });
    }

    ConnectGroup = () => {
        fetch(packagejson.ipurl + "/api/user/ConnectGroup/" +  this.state.data.id + "&" +  this.state.Name)
        .then((Response) => Response.json())
        .then(async (Result) => {
            // set user data
            fetch(packagejson.ipurl + '/api/user/GetInfo/' + getCookie("userId"))
            .then((Response) => Response.json())
            .then(async (Result) => {
                this.setState({ data: Result.responseData });
            });
        });
    }

    // group name input handler
    SetName(event){
        this.setState({ Name: event.target.value })
    }


    render() {
        return(
            <div>
                <h1>Группа</h1>
                <div>
                    <p>Название группы</p>
                    <input onChange={this.SetName} type="text" />
                    <button onClick={this.CreateGroup}>Создать группу</button>
                    <button onClick={this.ConnectGroup}>Присоедениться к группе</button>
                </div>
                <h1>Ваша группа/ы</h1>
                <p>{this.state.data.group}</p>
            </div>
        );
    }
}