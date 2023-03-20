import { Component } from "react";
import getMessage from "../../features/getMessage";
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
        const timer = setInterval(() => {getMessage().then(result => this.setState({data: result}))}, 5000);
        return () => clearTimeout(timer); 
    }

    render() {
        if(this.state.data.length !== 0){
            return(
                <div className="Chat">
                    <div>
                        <GroupList data = { this.state.data }/>
                    </div>
                    <div>
                        <GroupOpenMessage data = { this.state.data }/>
                    </div>
                    <div>
                        <GroupOpen data = { this.state.data }/>
                    </div>
                </div>
            );
        } else{
            return(
                <div className="loading">
                    <img src={loader} alt="" width={300}/>
                </div>
            )
        }
    }
}