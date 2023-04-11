import { Component } from "react";
import getMessage from "../../features/getMessage";
import getCookie from "../../features/getCookie";
import GroupList from "./GroupList";
import GroupOpenMessage from "./GroupOpenMessage";
import GroupOpen from "./GroupOpen"
import loader from "../../illustration/loader.svg";


export default class Group extends Component {
    constructor(){
        super();
        this.state= {
            data: [],
        }
    }
    
    componentDidMount() {
        getMessage().then(result => this.setState({data: result}));
    }

    render() {
        if(getCookie("isLogin") === "false"){
            return <div><h1>Войдите</h1></div>
        } else{
            if(this.state.data){
                if(this.state.data.length !== 0){
                    return(
                        <div className="Chat">
                            <GroupList/>
                            <GroupOpenMessage/>
                            <GroupOpen/>
                        </div>
                    );
                } else{
                    return(
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