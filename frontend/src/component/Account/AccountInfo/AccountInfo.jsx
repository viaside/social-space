import { Component } from "react";
import getCookie from "../../../features/getCookie";

export default class AccountInfo extends Component {
    constructor(){
        super();
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
        fetch('https://localhost:7013/api/user/GetInfo/' + getCookie("userId"))
        .then((Response) => Response.json())
        .then(async (Result) => {
            this.setState({ data: Result.responseData });
            let login = document.getElementById("username");
            let password = document.getElementById("password")

            login.value = Result.responseData.login;
            password.value = Result.responseData.password;
        });
    }

    logOut(){
        document.cookie = "userId=" + null;
        document.cookie = "isLogin=false";
        window.location.reload();
    }

    Login(event){
        this.setState({ login: event.target.value })
    }

    Password(event){
        this.setState({ password: event.target.value })
    }

    async saveChanges(){
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
        await fetch('https://localhost:7013/api/user/ChangeInfo', {
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
                    alert("изменения успешно сохранены");
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