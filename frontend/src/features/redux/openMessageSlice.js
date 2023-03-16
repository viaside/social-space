import { createSlice } from '@reduxjs/toolkit'

export const openMessageSlice = createSlice({
  name: 'openMessage',
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

export const { open, close } = openMessageSlice.actions

export default openMessageSlice.reducer