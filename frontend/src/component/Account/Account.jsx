import { Component } from "react";
import getCookie from "../../features/getCookie";
import AccountInfo from "./AccountInfo/AccountInfo"
import AccountBots from "./AccountInfo/AccountBots"
import AccountSetting from "./AccountInfo/AccountSetting"
import packagejson from "../../../package.json";
import loader from "../../illustration/loader.svg";

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
        let elInfo = document.getElementById("info")

        //mark deffault active block
        elInfo.style.backgroundColor = "#1E1E1E";
        
    }

    // marks info block
    openInfo(){
        this.setState({Element: <AccountInfo/>})
        let elInfo = document.getElementById("info")
        let elBots = document.getElementById("bots")
        let elSetting = document.getElementById("setting")
        elInfo.style.backgroundColor = "#1E1E1E";
        elBots.style.backgroundColor = "#353535";
        elSetting.style.backgroundColor = "#353535";
    }

    // marks bots block
    openBots(){
        this.setState({Element: <AccountBots/>})
        let elInfo = document.getElementById("info")
        let elBots = document.getElementById("bots")
        let elSetting = document.getElementById("setting")
        elInfo.style.backgroundColor = "#353535";
        elBots.style.backgroundColor = "#1E1E1E";
        elSetting.style.backgroundColor = "#353535";
    }
    
    // marks chat block
    openSetting(){
        this.setState({Element: <AccountSetting/>})
        let elInfo = document.getElementById("info")
        let elBots = document.getElementById("bots")
        let elSetting = document.getElementById("setting")
        elInfo.style.backgroundColor = "#353535";
        elBots.style.backgroundColor = "#353535";
        elSetting.style.backgroundColor = "#1E1E1E";
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
                            <div onClick={this.openInfo} id="info">
                                <h1>Основная информация</h1>
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