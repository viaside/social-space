import { upload } from "@testing-library/user-event/dist/upload";
import { Component } from "react";
import getCookie from "../../features/getCookie";

export default class Account extends Component {
    constructor(){
        super();
        this.state= {
            isLogin: null,
            Login: "",
            Password: "",
            data: [],
            isAddBots: false,
            BotId: "",
        }

        this.Login = this.Login.bind(this);
        this.Password = this.Password.bind(this);
        this.login = this.login.bind(this);
        this.register = this.register.bind(this);
        this.logOut = this.logOut.bind(this);
        this.addBot = this.addBot.bind(this);
        this.deleteBot = this.deleteBot.bind(this);
        this.BotId = this.BotId.bind(this);
    }
    
    async componentDidMount() {
        await this.setState({ isLogin: getCookie("isLogin") });
        if(this.state.isLogin === "true"){
            fetch('https://localhost:7013/api/user/GetInfo/' + getCookie("userId"))
            .then((Response) => Response.json())
            .then(async (Result) => {
                this.setState({ data: Result.responseData });
            });
        }
    }

    Login(event) {
        this.setState({ Login: event.target.value })
    }

    Password(event) {
        this.setState({ Password: event.target.value })
    }

    BotId(event) {
        this.setState({ BotId: event.target.value })
    }

    register(){
        fetch('https://localhost:7013/api/User/Registr', {
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
            }
        })
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
                document.cookie = "isLogin=true" + "; expires=" + date;
                window.location.reload();
            }
        })
    }
            
    logOut(){
        document.cookie = "userId=" + null;
        document.cookie = "isLogin=false";
        window.location.reload();
    }

    addBot(){
        this.setState({ isAddBots: !this.state.isAddBots })
        if(this.state.isAddBots === true){
            fetch("https://localhost:7013/api/user/AddBot/"+ this.state.data.id +"&"+ this.state.BotId)
            .then((Response) => Response.json())
            .then((result) => {
                console.log(result);
                if(result.responseData === "False"){
                    alert("Бот по данному id не найден")
                } else{
                    window.location.reload();
                }
            })
        }
    }

    deleteBot(id){
        fetch("https://localhost:7013/api/user/DeleteBot/"+ this.state.data.id +"&"+ id)
        .then(window.location.reload());
    }

    render() {
        if(this.state.isLogin === "true"){
            return(
                <div>
                    <h1>Профиль</h1>
                    <hr />
                    <p>Имя: {this.state.data.login} </p>
                    <hr />
                    <p>Пароль: {this.state.data.password} </p>
                    <hr />
                    <p>Боты:</p>
                    {this.state.data.usingBots !== null && this.state.data.usingBots !== undefined? 
                        this.state.data.usingBots.map((el) => { return (
                            <div>
                                <br />
                                <br />
                                <p>Имя - {el.toString().split('----')[0]}</p> 
                                <p>id - {el.toString().split('----')[1]}</p>
                                <button onClick={() => this.deleteBot(el)}>Удалить бота</button>
                                <br />
                                <br />
                            </div>
                        )})
                        : null}
                    {this.state.isAddBots !== false? <div>
                            <input placeholder="Введите id бота" onChange={ this.BotId }/> 
                        </div>: null}
                    <button onClick={ this.addBot }>Добавить бота</button>
                    <hr />
                    <p>Настройки: {this.state.data.settings} </p>
                    <button>Сохранить настройки</button>
                    <hr />
                    <button onClick={this.logOut}>Выйти</button>
                </div>
            );
        } else{
            return(
                <>
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
                </>
            );
        }
    }
}