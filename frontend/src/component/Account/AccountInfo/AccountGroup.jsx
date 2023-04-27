import { Component } from "react";
import getCookie from "../../../features/getCookie";
import packagejson from "../../../../package.json";
import MemberInfo from "./MemberInfo";

export default class AccountGroup extends Component {
    constructor(){
        super();
        this.state= {
            data: [],
            Name: [],
            Group: [],
            GroupInfo: <></>,
            MemberInfo: <></>
        }

        this.SetName = this.SetName.bind(this);

        this.CreateGroup = this.CreateGroup.bind(this);
        this.ConnectGroup = this.ConnectGroup.bind(this);
        this.ChangeGroup = this.ChangeGroup.bind(this);
        this.ShowInfoMember = this.ShowInfoMember.bind(this);
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
                // set user info
                this.setState({ data: Result.responseData });
                this.setState({ Group: Result.responseData.group });
                this.ChangeGroup(Result.responseData.group[0])
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
                // set user info
                this.setState({ data: Result.responseData });
                this.setState({ Group: Result.responseData.group });
                this.ChangeGroup(Result.responseData.group[0])
            });
        });
    }

    // group name input handler
    SetName(event){
        this.setState({ Name: event.target.value })
    }

    async ShowInfoMember(data){
        const responseMember = await fetch(packagejson.ipurl + "/api/user/GetInfo/" +  data[0]);
        const MemberData = (await responseMember.json()).responseData;
        let isChange = false;
        this.setState({MemberInfo: 
            <MemberInfo Id = {data[0]} Name ={data[1]} Role = {data[2]} 
                        GroupList = {MemberData.group} KickMember = {this.KickMember} ChangeRoleMember = {this.ChangeRoleMember}/>
        })
    }

    async ChangeGroup(Group){
        const responseGroup = await fetch(packagejson.ipurl + "/api/user/GetGroup/" +  Group.split(":")[0]);
        const GroupData = (await responseGroup.json()).responseData;

        let MembersData = [];
        
        await Promise.all(GroupData.members.map(async (element) => {
                let Member;
                const responseGroup = await fetch(packagejson.ipurl + "/api/user/GetInfo/" +  element.split(":")[0]);
                Member = (await responseGroup.json()).responseData;
                MembersData.push([Member.id, Member.login, element.split(":")[1]]);
        }));
        this.setState({MemberInfo: <></>});
        this.setState({GroupInfo: 
        <div>
            <h1>{ GroupData.name }</h1>
            <div className="GroupMembers">
                {MembersData ? MembersData.map((element, index) => {
                    return (
                        <div key={ index } style={{display: "flex", alignItems: "center", justifyContent: "space-between"}} onClick={() => this.ShowInfoMember(element)}>
                            <h1>{ index+1 }</h1>
                            <p>{ element[1] }</p>
                            <p style={{color: "#005BFF"}}>{ element[2] }</p>
                        </div>
                    )
                }): null}
            </div>
        </div>
        })
    }
    
    async KickMember(id){
        await fetch(packagejson.ipurl + "/api/user/KickMember/" + id).then((Result) => {
            fetch(packagejson.ipurl + '/api/user/GetInfo/' + getCookie("userId"))
            .then((Response) => Response.json())
            .then(async (Result) => {
                // set user info
                this.setState({ data: Result.responseData });
                this.setState({ Group: Result.responseData.group });
                this.ChangeGroup(Result.responseData.group[0])
            })
        })
    }

    async ChangeRoleMember(id, NewRole){
        await fetch(packagejson.ipurl + "/api/user/ChangeRoleMember/" + id + "&" + NewRole).then((Result) => {
            fetch(packagejson.ipurl + '/api/user/GetInfo/' + getCookie("userId"))
            .then((Response) => Response.json())
            .then(async (Result) => {
                // set user info
                this.setState({ data: Result.responseData });
                this.setState({ Group: Result.responseData.group });
                this.ChangeGroup(Result.responseData.group[0])
            })
        })
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
                <div className="UserGroup">
                    { this.state.GroupInfo }
                    { this.state.MemberInfo }
                </div>
            </div>
        );
    }
}