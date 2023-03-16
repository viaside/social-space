import { configureStore } from "@reduxjs/toolkit";
import openChatSlice from "../features/redux/openChatSlice";
import openMessageSlice from "../features/redux/openMessageSlice";
import idChatSlice from "../features/redux/idChatSlice";
import idMessageSlice from "../features/redux/idMessageSlice";

export default configureStore({
    reducer: {
        openChat: openChatSlice,
        openMessage: openMessageSlice,
        idChat: idChatSlice,
        idMessage: idMessageSlice,
    },
})