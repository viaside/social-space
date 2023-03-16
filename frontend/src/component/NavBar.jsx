import React from "react";

export default function NavBar() {
    return(
        <div className="NavBar">
            <a href="/Chat">Чаты</a>
            <a href="/Group">Группы</a>
            {/* <a href="/Channel">Каналы</a> */}
            <a href="/Stats">Статистика</a>
            <a href="/Profile">Профиль</a>
        </div>
    );
}