import { Component } from "react";
import getMessage from "../../features/getMessage";
import ChannelList from "./ChannelList";
import ChannelOpen from "./ChannelOpen"
import ChannelOpenMessage from "./ChannelOpenMessage";


export default class Channel extends Component {
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
        return(
            <div className = "Chat">
                <div>
                    <ChannelList data = { this.state.data }/>
                </div>
                <div>
                    <ChannelOpenMessage data = { this.state.data }/>
                </div>
                <div>
                    <ChannelOpen data = { this.state.data }/>
                </div>
            </div>
        );
    }
}