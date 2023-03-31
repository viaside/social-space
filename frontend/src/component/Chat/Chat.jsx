import { Component } from "react";
import getMessage from "../../features/getMessage";
import ChatOpen from "./ChatOpen"
import ChatList from "./ChatList";
import AllMessage from './AllMessage';
import loader from "../../illustration/loader.svg";
import getCookie from "../../features/getCookie";


export default class Chat extends Component {
    constructor(){
        super();
        this.state= {
            data: [],
        }
    }
    
    componentDidMount() {
        getMessage().then(result => this.setState({data: result}));
        const timer = setInterval(() => {getMessage().then(result => this.setState({data: result}))}, 10000);
        return () => clearTimeout(timer); 
    }
    render() {
        if(getCookie("isLogin") === "false"){
            return <h1>Войдите</h1>
        } else{
            if(this.state.data){
                if(this.state.data.length !== 0){
                    return(
                        <div className="Chat">
                            <ChatList data = { this.state.data }/>
                            <ChatOpen data = { this.state.data }/>
                            <AllMessage data = { this.state.data }/>
                        </div>
                    );
                } else{
                    return (
                        <div className="loading">
                            <img src={loader} alt="" width={300}/>
                        </div>
                    )
                }
            } else{
                return <h1>Добавьте бота</h1>
            }
        }
    }
}