import { Component } from "react";
import getCookie from "../../../features/getCookie";

export default class AccountSetting extends Component {
    constructor(){
        super();
        this.state= {
            data: [],
        }

    }
    
    async componentDidMount() {
        fetch('https://localhost:7013/api/user/GetInfo/' + getCookie("userId"))
        .then((Response) => Response.json())
        .then(async (Result) => {
            this.setState({ data: Result.responseData });
        });
    }

    render() {
        return(
            <div>
                <p>{this.state.data.settings} </p>
                <button>Сохранить настройки</button>
            </div>
        );
    }
}