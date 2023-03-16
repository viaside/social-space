import { createSlice } from '@reduxjs/toolkit'

export const openChatSlice = createSlice({
  name: 'openChat',
  initialState: {
    value: false,
  },
  reducers: {
    open: (state) => {
      state.value = true
    },
    close: (state) => {
      state.value = false
    },
  },
})

export const { open, close } = openChatSlice.actions

export default openChatSlice.reducer