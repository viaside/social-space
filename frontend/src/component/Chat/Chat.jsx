import { Component, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
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
        getMessage().then(async (result) => await this.setState({data: result}));
    }
    
    render() {
        if(getCookie("isLogin") === "false"){
            return <h1>Войдите</h1>
        } else{
            if(this.state.data){
                if(this.state.data.length !== 0){
                    return(
                        <div className="Chat">
                            <ChatList/>
                            <ChatOpen/>
                            <AllMessage/>
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