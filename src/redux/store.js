import { configureStore } from "@reduxjs/toolkit";
import messageSlice from "./slice/messageSlice";

export default configureStore({
    reducer: {
        Message: messageSlice,
    },
})