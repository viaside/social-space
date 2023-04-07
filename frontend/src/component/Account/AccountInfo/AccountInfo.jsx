import { Component } from "react";
import getCookie from "../../../features/getCookie";
import packagejson from "../../../../package.json";

export default class AccountInfo extends Component {
    constructor(){
        super();
        // state
        this.state= {
            data: [],
            login: null,
            password: null,
            newLogin: null,
            newPassword: null,
        }

        this.logOut = this.logOut.bind(this);

        this.Login = this.Login.bind(this);
        this.Password = this.Password.bind(this);
        this.saveChanges = this.saveChanges.bind(this);
    }
    
    async componentDidMount() {
        // get user info 
        fetch(packagejson.ipurl + '/api/user/GetInfo/' + getCookie("userId"))
        .then((Response) => Response.json())
        .then(async (Result) => {
            // set user info
            this.setState({ data: Result.responseData });
            let login = document.getElementById("username");
            let password = document.getElementById("password")

            login.value = Result.responseData.login;
            password.value = Result.responseData.password;
        });
    }

    // logout handler
    logOut(){
        // clear cookie
        document.cookie = "userId=" + null;
        document.cookie = "isLogin=false";
        window.location.reload();
    }

    // login input handler
    Login(event){
        this.setState({ login: event.target.value })
    }

    // password input handler
    Password(event){
        this.setState({ password: event.target.value })
    }

    // save user changer
    async saveChanges(){
        // set new info 
        if(!this.state.login){
            await this.setState({ newLogin: this.state.data["login"] });
        } else{
            await this.setState({ newLogin: this.state.login });
        }

        if(!this.state.password){
            await this.setState({ newPassword: this.state.data["password"] });
        } else{
            await this.setState({ newPassword: this.state.password });
        }

        // save changes
        await fetch(packagejson.ipurl + '/api/user/ChangeInfo', {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: getCookie("userId"),
                Login: this.state.newLogin,
                Password: this.state.newPassword,
            })
        }).then((Response) => Response.json())
            .then((Result) => {
                let res = JSON.stringify(Result);
                if (res === '{"success":false}') {
                    alert("error");
                }
                else {
                    // set cookie username
                    alert("изменения успешно сохранены");
                    let date = new Date(Date.now() + 86400e3 * 30);
                    date = date.toUTCString();
                    document.cookie = "username=" + this.state.newLogin + "; expires=" + date;
                }
        })
    }

    render() {
        return(
            <div>
                <div className="AccountUserInfo">
                    <label htmlFor="username">Имя: </label>
                    <input onChange={this.Login} type="text" name="username" id="username"/>
                </div>
                <div className="AccountUserInfo">
                    <label htmlFor="password">Пароль: </label>
                    <input onChange={this.Password} type="text" name="password" id="password"/>
                </div>
                <button onClick={this.saveChanges}>Сохранить</button>
                <button onClick={this.logOut}>Выйти</button>
            </div>
        );
    }
}