import { Component, useEffect } from "react";
import getCookie from "../../features/getCookie";
import AccountInfo from "./AccountInfo/AccountInfo"
import AccountBots from "./AccountInfo/AccountBots"
import AccountSetting from "./AccountInfo/AccountSetting"
import packagejson from "../../../package.json";
import loader from "../../illustration/loader.svg";
import AccountGroup from "./AccountInfo/AccountGroup";

export default class Profile extends Component {
    constructor(){
        super();
        // states
        this.state= {
            isLogin: null,
            Element: <AccountInfo/>,
            data: null,
        }

        this.openInfo = this.openInfo.bind(this);
        this.openGroup = this.openGroup.bind(this);
        this.openBots = this.openBots.bind(this);
        this.openSetting = this.openSetting.bind(this);
    }
    
    async componentDidMount() {
        fetch(packagejson.ipurl + '/api/user/GetInfo/' + getCookie("userId"))
        .then((Response) => Response.json())
        .then(async (Result) => {
            // set user info
            this.setState({ data: Result.responseData });
        });

        // get login state from cookie
        await this.setState({ isLogin: getCookie("isLogin") });
    }

    // marks info block
    openInfo(){
        let elInfo = document.getElementById("info")
        let elBots = document.getElementById("bots")
        let elSetting = document.getElementById("setting")
        let elGroup = document.getElementById("group")
        this.setState({Element: <AccountInfo/>})
        elInfo.style.backgroundColor = "#1E1E1E";
        elGroup.style.backgroundColor = "#353535";
        elBots.style.backgroundColor = "#353535";
        elSetting.style.backgroundColor = "#353535";
    }

    // marks bots block
    openBots(){
        this.setState({Element: <AccountBots/>})
        let elInfo = document.getElementById("info")
        let elBots = document.getElementById("bots")
        let elSetting = document.getElementById("setting")
        let elGroup = document.getElementById("group")
        elInfo.style.backgroundColor = "#353535";
        elGroup.style.backgroundColor = "#353535";
        elBots.style.backgroundColor = "#1E1E1E";
        elSetting.style.backgroundColor = "#353535";
    }
    
    // marks chat block
    openSetting(){
        this.setState({Element: <AccountSetting/>})
        let elInfo = document.getElementById("info")
        let elBots = document.getElementById("bots")
        let elSetting = document.getElementById("setting")
        let elGroup = document.getElementById("group")
        elInfo.style.backgroundColor = "#353535";
        elGroup.style.backgroundColor = "#353535";
        elBots.style.backgroundColor = "#353535";
        elSetting.style.backgroundColor = "#1E1E1E";
    }

    openGroup(){
        this.setState({Element: <AccountGroup/>});
        let elInfo = document.getElementById("info")
        let elBots = document.getElementById("bots")
        let elSetting = document.getElementById("setting")
        let elGroup = document.getElementById("group")
        elInfo.style.backgroundColor = "#353535";
        elGroup.style.backgroundColor = "#1E1E1E";
        elBots.style.backgroundColor = "#353535";
        elSetting.style.backgroundColor = "#353535";
    }

    render() {
        if(this.state.isLogin === "true"){
            if(this.state.data){
                return(
                    <div className="account">
                        <div className="accountPanel">
                            <div className="UserInfoPanel">
                                <p className="accountAvatar">{getCookie("username")[0].toUpperCase()}</p>
                                <h1>{getCookie("username")}</h1>
                            </div>
                            <div onClick={this.openInfo} id="info" style={{backgroundColor: "#1E1E1E"}}>
                                <h1>Основная информация</h1>
                            </div>
                            <div onClick={this.openGroup} id="group">
                                <h1>Группа</h1>
                            </div>
                            <div onClick={this.openBots} id="bots">
                                <h1>Добавленные боты</h1>
                            </div>
                            <div onClick={this.openSetting} id="setting">
                                <h1>Настройки</h1>
                            </div>
                        </div>
                        <div className="accountElement">
                            { this.state.Element }
                        </div>
                    </div>
                );
            } else{
                return (
                    <div className="loading">
                        <img src={loader} alt="" width={300}/>
                    </div>
                )
            }
        }
    }
}