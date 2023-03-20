import { Component } from "react";
import getCookie from "../../features/getCookie";
import AccountInfo from "./AccountInfo/AccountInfo"
import AccountBots from "./AccountInfo/AccountBots"
import AccountSetting from "./AccountInfo/AccountSetting"

export default class Profile extends Component {
    constructor(){
        super();
        this.state= {
            isLogin: null,
            Element: <AccountInfo/>,
        }

        this.openInfo = this.openInfo.bind(this);
        this.openBots = this.openBots.bind(this);
        this.openSetting = this.openSetting.bind(this);
    }
    
    async componentDidMount() {
        await this.setState({ isLogin: getCookie("isLogin") });
    }

    openInfo(){
        this.setState({Element: <AccountInfo/>})
    }
    openBots(){
        this.setState({Element: <AccountBots/>})
    }
    
    openSetting(){
        this.setState({Element: <AccountSetting/>})
    }

    render() {
        if(this.state.isLogin === "true"){
            return(
                <div className="account">
                    <div className="accountPanel">
                        <div onClick={this.openInfo}>
                            <h1>Основная информация</h1>
                        </div>
                        <div onClick={this.openBots}>
                            <h1>Добавленые боты</h1>
                        </div>
                        <div onClick={this.openSetting}>
                            <h1>Настройки</h1>
                        </div>
                    </div>
                    <div className="accountElement">
                        { this.state.Element }
                    </div>
                </div>
            );
        }
    }
}