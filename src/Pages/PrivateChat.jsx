import React from "react";

import Message from "../component/PrivateChat/Message";
import Dialog from "../component/PrivateChat/Dialog";
import History from "../component/PrivateChat/History";

export default function PrivateChat() {
    return (
        <div>
            <Message/>
            <Dialog/>
            <History/>
        </div>
    )
}