import { createSlice } from '@reduxjs/toolkit'

export const idChatSlice = createSlice({
  name: 'idPanelProfile',
  initialState: {
    value: null,
  },
  reducers: {
    setIdChat: (state, value) => {
      state.value = value.payload
    },
    clearIdChat: (state) => {
      state.value = null
    },
  },
})

export const { setIdChat, clearIdChat } = idChatSlice.actions

export default idChatSlice.reducer