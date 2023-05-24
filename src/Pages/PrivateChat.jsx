import React from "react";

import Messages from "../component/PrivateChat/Messages";
import Dialog from "../component/PrivateChat/Dialog";
import History from "../component/PrivateChat/History";

export default function PrivateChat() {
    return (
        <div style={{display: "flex"}}>
            <Dialog/>
            {/* <Messages/>
            <History/> */}
        </div>
    )
}