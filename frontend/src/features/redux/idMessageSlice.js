import { createSlice } from '@reduxjs/toolkit'

export const idMessageSlice = createSlice({
  name: 'idMessage',
  initialState: {
    value: null,
  },
  reducers: {
    setMessageChat: (state, value) => {
      state.value = value.payload
    },
    clearMessageChat: (state) => {
      state.value = null
    },
  },
})

export const { setMessageChat, clearMessageChat } = idMessageSlice.actions

export default idMessageSlice.reducer