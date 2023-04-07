import getCookie from "./getCookie";
import packagejson from "../../package.json";

export default async function getMessage() {
    // user bot id
    let botId = await fetch(packagejson.ipurl + '/api/user/GetInfo/' + getCookie("userId"))
    .then((Response) => Response.json())
    .then(async (Result) => { return Result.responseData["usingBots"] });

    if(botId.length !== 0){
        let Result = [];
        
        for (let i = 0; i < botId.length; i++) {
            // get message from api
            let id = botId[i].toString().split('----')[0];   
            const response = await fetch(packagejson.ipurl + "/api/telegram/getMessage/" + id);
            const message = await response.json();
    
            // set message data
            if(Result[0] !== undefined){
                Result = [...Result, ...message.responseData.reverse()];
            } else{
                Result = message.responseData.reverse();
            }
        }
        return Result;
    } else {
        return false;
    }

}