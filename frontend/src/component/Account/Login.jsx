import { Component } from "react";
import getCookie from "../../features/getCookie";

export default class Login extends Component {
    constructor(){
        super();
        this.state= {
            isLogin: null,
            Login: "",
            Password: "",
        }

        this.Login = this.Login.bind(this);
        this.Password = this.Password.bind(this);
        this.login = this.login.bind(this);
    }
    
    async componentDidMount() {
        await this.setState({ isLogin: getCookie("isLogin") });
    }

    Login(event) {
        this.setState({ Login: event.target.value })
    }

    Password(event) {
        this.setState({ Password: event.target.value })
    }

    login(){
        fetch('https://localhost:7013/api/User/Login', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                Login: this.state.Login,
                Password: this.state.Password
            })
        })
        .then((Response) => Response.json())
        .then((result) => {
            if (result["message"] !== "Success") {
                alert("Неправельный логин или пароль");
            }
            else {
                let date = new Date(Date.now() + 86400e3 * 30);
                date = date.toUTCString();
                document.cookie = "userId=" + result.responseData + "; expires=" + date;
                document.cookie = "isLogin=true; expires=" + date;
                window.location.reload();
            }
        })
    }
            
    render() {
        if(this.state.isLogin !== "true"){
            return(
                <div>
                    <h1>Вход</h1>
                    <div className="form">
                        <label>Логин</label>
                        <input onChange={this.Login} type="text"/>
                        <label>Пароль</label>
                        <input onChange={this.Password} type="password"/>
                        <button onClick={this.login}>Войти</button>
                    </div>
                </div>
            );
        }
    }
}