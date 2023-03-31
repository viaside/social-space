import getCookie from "./getCookie";

export default async function getMessage() {
    let botId = await fetch('https://localhost:7013/api/user/GetInfo/' + getCookie("userId"))
    .then((Response) => Response.json())
    .then(async (Result) => { return Result.responseData["usingBots"] });

    if(botId.length !== 0){
        let Result = [];
        
        for (let i = 0; i < botId.length; i++) {
            let id = botId[i].toString().split('----')[0];   
            const response = await fetch("https://localhost:7013/api/telegram/getMessage/" + id);
            const message = await response.json();
    
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