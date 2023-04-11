import { createSlice } from '@reduxjs/toolkit';

export const dataSlice = createSlice({
  name: 'data',
  initialState: {
    value: [],
  },
  reducers: {
    set: (state, { payload }) => {
      state.value = payload
    },
  },
})

export const { set } = dataSlice.actions

export default dataSlice.reducer