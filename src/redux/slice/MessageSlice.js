import { createSlice } from '@reduxjs/toolkit';
import info from '../../../package.json';

export const messageSlice = createSlice({
  name: 'message',
  initialState: {
    data: [],
  },
  reducers: {
    update: (state, action) => {
      state.data = action.payload;
    }
  },
})

export const getMessageAsync = (data) => async (dispatch) => {
  try {
    // user bot id
    let botId = await fetch(info.backend + '/api/user/GetInfo/' + 1)
    .then((Response) => Response.json())
    .then(async (Result) => { return Result.responseData["usingBots"] });
    if(botId.length !== 0){
      let Result = [];
      
      for (let i = 0; i < botId.length; i++) {
        // get message from api
        let id = botId[i].toString().split('----')[0];   
        const response = await fetch(info.backend + "/api/telegram/getMessage/" + id);
        const message = await response.json();

        // set message data
        if(Result[0] !== undefined){
            Result = [...Result, ...message.responseData.reverse()];
        } else{
            Result = message.responseData.reverse();
        }
      };


      // sorting message by data
      Result.sort(function(a,b){
        if(a.date < b.date) return 1;
        if(a.date > b.date) return -1;
        return 0;
      });

      dispatch(update(Result));
    }
  } catch (err) {
    throw new Error(err);
  }
};

export const { update } = messageSlice.actions

export default messageSlice.reducer