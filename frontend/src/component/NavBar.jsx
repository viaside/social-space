import React from "react";
import lightLogo from "../illustration/lightLogo.svg";
import getCookie from "../features/getCookie";

export default function NavBar() {
    return(
        <div className="NavBar">
            <div>
                <img src={lightLogo} alt="" width="70vh" />
                <a href="/Chat">Чаты</a>
                <a href="/Group">Группы</a>
                {/* <a href="/Channel">Каналы</a> */}
                <a href="/Stats">Статистика</a>
            </div>
            <div>
                <a className="avatarNavBar" href="/Profile">{ getCookie("username")[0].toUpperCase()  }</a>
            </div>
        </div>
    );
}