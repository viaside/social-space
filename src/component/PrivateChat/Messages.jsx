import React from "react";

export default function Message() {
    // func redux ...

    return (
        <div className="Messages Neomorth">
            <div>
                <h1>Чат с UserName</h1>
            </div>
            <hr />
            <div className="Messages_MessageBlock">
                {/* MessageComponent */}
                <div className="Message">
                    <h1>В GroupMessage</h1>
                    <p>text</p>
                    <p className="Message_Data">00.00.0000 00:00:00</p>
                </div>
            </div>
            <hr />
            <div>
                <input type="text" name="" id="" />
                <button>Отправить</button>
                <div>
                    <button>Прочитать</button>
                    <button>Прочитать</button>
                </div>
            </div>
        </div>
    )
}