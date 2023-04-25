import { Component } from "react";
import getCookie from "../../../features/getCookie";
import packagejson from "../../../../package.json";

export default class AccountGroup extends Component {
    constructor(){
        super();
        this.state= {
            data: [],
            Name: [],
            Group: [],
            GroupInfo: <></>
        }

        this.SetName = this.SetName.bind(this);

        this.CreateGroup = this.CreateGroup.bind(this);
        this.ConnectGroup = this.ConnectGroup.bind(this);
        this.ChangeGroup = this.ChangeGroup.bind(this);
    }
    
    async componentDidMount() {
        // get user info
        fetch(packagejson.ipurl + '/api/user/GetInfo/' + getCookie("userId"))
        .then((Response) => Response.json())
        .then(async (Result) => {
            // set user info
            this.setState({ data: Result.responseData });
            this.setState({ Group: Result.responseData.group });
            this.ChangeGroup(Result.responseData.group[0])
        })
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


    async ChangeGroup(Group){
        const responseGroup = await fetch(packagejson.ipurl + "/api/user/GetGroup/" +  Group.split(":")[0]);
        const GroupData = (await responseGroup.json()).responseData;

        let MembersData = []; 
        
        if(GroupData.members){
            await Promise.all(GroupData.members.map(async element => {
                let responseMembers = await fetch(packagejson.ipurl + "/api/user/GetInfo/" + element.split(":")[0]);
                MembersData.push((await responseMembers.json()).responseData);
            }));
        }
        
        this.setState({GroupInfo: 
            <div>
                <h1>Название группы - {GroupData.name}</h1>
                <div>
                    <h1>Участники:</h1>
                    {MembersData? MembersData.sort((a,b) => {
                        if(a.id > b.id){
                            return 1;
                        }
                        if(a.id < b.id){
                            return -1
                        }
                        return 0
                    }).map((element, index) => {
                        console.log(GroupData.members[index]);
                        return (
                            <div key={ index } style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
                                <h1>{ index+1 }</h1>
                                <div>
                                    <h1>Ник - { element.login }</h1>
                                    <h1>Роль - { GroupData.members[index].split(":")[1] }</h1>
                                </div>
                            </div>
                        )
                    }): null}
                </div>
            </div>
        });
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
                <div style={{display: "flex", justifyContent: "center", alignItems: "center" }}>
                    { this.state.Group? this.state.Group.map((el, index) => {
                        return <button onClick={() => this.ChangeGroup(el)} key={ index }>{el.split(":")[1]}</button>
                    }): "Пусто"}
                </div>
                <div>
                    {this.state.GroupInfo}
                </div>
            </div>
        );
    }
}