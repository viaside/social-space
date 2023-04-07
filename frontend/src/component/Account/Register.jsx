import { Component } from "react";
import getCookie from "../../features/getCookie";
import packagejson from "../../../package.json";

export default class Register extends Component {
    constructor(){
        super();
        // state
        this.state= {
            isLogin: null,
            Login: "",
            Password: "",
        }

        this.Login = this.Login.bind(this);
        this.Password = this.Password.bind(this);
        this.register = this.register.bind(this);
    }
    
    async componentDidMount() {
        // set login state from cookie
        await this.setState({ isLogin: getCookie("isLogin") });
    }

    // login input handler
    Login(event) {
        this.setState({ Login: event.target.value })
    }

    // password input handler
    Password(event) {
        this.setState({ Password: event.target.value })
    }

    // user register
    register(){
        // register
        fetch(packagejson.ipurl + '/api/User/Registr', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                Login: this.state.Login,
                Password: this.state.Password,
            })
        })
        .then((Response) => Response.json())
        .then((Result) => {
            let res = JSON.stringify(Result);
            if (res === '{"success":false}') {
                alert('Invalid User');
            }
            else {
                alert('successfull register')
            }
        })
    }

    render() {
        if(this.state.isLogin !== "true"){
            return(
                <div>
                    <h1>Регистрация</h1>
                    <div className="form">
                        <label>Логин</label>
                        <input onChange={this.Login} type="text" />
                        <label>Пароль</label>
                        <input onChange={this.Password} type="password"/>
                        <button onClick={this.register}>Создать аккаунт</button>
                    </div>
                </div>
                );
        }
    }
}