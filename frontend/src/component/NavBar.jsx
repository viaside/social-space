import React, { useEffect, useState } from "react";
import LightLogo from "../illustration/LightLogo.jsx";
import getCookie from "../features/getCookie";
import { useSelector } from "react-redux";

export default function NavBar() {
    const dataRedux = useSelector((state) => state.data.value);

    const [chat, setChat] = useState(0);
    const [group, setGroup] = useState(0);
    
    useEffect(()=>{
        getCount();
    }, [dataRedux]);

    const getCount = async () => {
        let countGroup = 0;
        let countChat = 0;
        for (let i = 0; i < dataRedux.length; i++) {
            const el = dataRedux[i];
            if(el.isCheck === false) {
                if(el.type === "Group" || el.type === "Supergroup"){
                    countGroup = countGroup + 1;
                }
                if(el.type === "Private"){
                     countChat = countChat + 1;
                }
            }
        }
        setGroup(countGroup);
        setChat(countChat);
    }


    if(getCookie("isLogin") === "true"){
        return(
            <div className="NavBar">
                <div>
                    <LightLogo height={40}/>
                    <a href="/Chat">Чаты</a>
                    {chat != 0 ? <p className="countMarker">{ chat }</p> : null}
                    <a href="/Group">Группы</a>
                    {group != 0 ? <p className="countMarker">{ group }</p> : null}
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