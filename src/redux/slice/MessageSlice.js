import { createSlice } from '@reduxjs/toolkit';

export const MessageSlice = createSlice({
  name: 'Message',
  initialState: {
    value: Object,
  },
  reducers: {
    update: async () => {
        // user bot id
        let botId = await fetch("https://localhost:8443" + '/api/user/GetInfo/' + 1)
        .then((Response) => Response.json())
        .then(async (Result) => { return Result.responseData["usingBots"] });

        if(botId.length !== 0){
            let Result = [];
            
            for (let i = 0; i < botId.length; i++) {
                // get message from api
                let id = botId[i].toString().split('----')[0];   
                const response = await fetch("https://localhost:8443" + "/api/telegram/getMessage/" + id);
                const message = await response.json();
        
                // set message data
                if(Result[0] !== undefined){
                    Result = [...Result, ...message.responseData.reverse()];
                } else{
                    Result = message.responseData.reverse();
                }
            }
            state.value = Result;
        } else {
            state.value = null;
        }
    },
  },
})

export const { set } = dataSlice.actions

export default dataSlice.reducer