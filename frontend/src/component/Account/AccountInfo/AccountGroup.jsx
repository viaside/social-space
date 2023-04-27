import { Component } from "react";
import getCookie from "../../../features/getCookie";
import packagejson from "../../../../package.json";
import GroupInfo from "./Group/GroupInfo";
import MemberInfo from "./Group/MemberInfo";

export default class AccountGroup extends Component {
    constructor(){
        super();
        this.state= {
            data: [],
            Name: [],
            Group: [],
            ActiveGroupId: 0,
            IsShowMemberInfo: false,
            MemberData: [],
            GroupData: [],
        }

        
        this.SetName = this.SetName.bind(this);
        
        this.CreateGroup = this.CreateGroup.bind(this);
        this.ConnectGroup = this.ConnectGroup.bind(this);
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
            this.setState({ ActiveGroupId: Result.responseData.group[0].split(":")[0]});
        })
    }

    CreateGroup = () => {
        fetch(packagejson.ipurl + "/api/user/AddGroup/" +  this.state.data.id + "&" +  this.state.Name);
    }

    ConnectGroup = () => {
        fetch(packagejson.ipurl + "/api/user/ConnectGroup/" +  this.state.data.id + "&" +  this.state.Name);
    }

    // group name input handler
    SetName(event){
        this.setState({ Name: event.target.value })
    }

    ShowInfoMember(GroupData){
        this.setState({IsShowMemberInfo: !this.state.IsShowMemberInfo});
        this.setState({MemberData: GroupData});
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
                        return <button onClick={() => {
                            this.setState({ActiveGroupId: el.split(":")[0]});
                            this.setState({IsShowMemberInfo: false});
                        }} key={ index }>{el.split(":")[1]}</button>
                    }): "Пусто"}
                </div>
                <div className="UserGroup">
                    <GroupInfo GroupId={this.state.ActiveGroupId} ShowMemberInfo={this.ShowInfoMember}/>
                    { this.state.IsShowMemberInfo? <MemberInfo GroupId={this.state.ActiveGroupId} MemberData={this.state.MemberData}/> : null }
                </div>
            </div>
        );
    }
}