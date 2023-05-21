import React from "react";

export default function History() {
    // func redux ...

    return (
        <div className="History">
            <div className="History_User Neomorth">
                <img className="User_Photo" width={50} height={50} src="" alt="" />
                <p>Username</p>
                <p>Все сообщения в других  группах</p>
            </div>
            <div className="History_UserMessage Neomorth">
                {/* MessageComponent */}
                <div className="Message">
                    <h1>В GroupMessage</h1>
                    <p>text</p>
                    <p className="Message_Data">00.00.0000 00:00:00</p>
                </div>
            </div>
        </div>
    )
}