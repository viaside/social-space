import { Component } from "react";
import getCookie from "../../../features/getCookie";
import packagejson from "../../../../package.json";

export default class AccountSetting extends Component {
    constructor(){
        super();
        this.state= {
            data: [],
        }

    }
    
    async componentDidMount() {
        // get user info
        fetch(packagejson.ipurl + '/api/user/GetInfo/' + getCookie("userId"))
        .then((Response) => Response.json())
        .then(async (Result) => {
            // set user info
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