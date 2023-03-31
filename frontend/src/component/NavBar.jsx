import React from "react";
import LightLogo from "../illustration/LightLogo.jsx";
import getCookie from "../features/getCookie";

export default function NavBar() {
    if(getCookie("isLogin") === "true"){
        return(
            <div className="NavBar">
                <div>
                    <LightLogo height={40}/>
                    <a href="/Chat">Чаты</a>
                    <a href="/Group">Группы</a>
                    <a href="/Stats">Статистика</a>
                    <a href="/">FAQ</a>
                </div>
                <div>
                    <a className="avatarNavBar" href="/Profile">{ getCookie("username")[0].toUpperCase()  }</a>
                </div>
            </div>
        );
    } else{
        return(
            <div className="NavBar">
                <div>
                    <LightLogo height={40}/>
                    <a href="/">Главная</a>
                </div>
                <div>
                    <a href="/Profile">Войти</a>
                </div>
            </div>
        );
    }
}