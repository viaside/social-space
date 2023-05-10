import { configureStore } from "@reduxjs/toolkit";
import MessageSlice from "./slice/MessageSlice";

export default configureStore({
    reducer: {
        MessageSlice: MessageSlice,
    },
})