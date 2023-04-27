import { useState } from "react";
import packagejson from "../../../../../package.json";

export default function MemberInfo(props) {
    const [IsChange, SetChange] = useState(false);
    const [NewRole, SetNewRole] = useState("");
    
    const {GroupId,MemberData} = props;

    const handleSubmit = (event) =>  {
        ChangeRoleMember(GroupId, MemberData.id+":"+MemberData.role , NewRole);
        event.preventDefault();
        SetChange(false);
    }
        
    const KickMember = () => {
        fetch(packagejson.ipurl + "/api/user/KickMember/" + GroupId + "&" + MemberData.id + ":" + MemberData.role);
    }

    const ChangeRoleMember = () => {
        fetch(packagejson.ipurl + "/api/user/ChangeRole/" + GroupId + "&" + MemberData.id + ":" + MemberData.role + "&" + NewRole);
    }
    
    return( 
        <div style={{border: "solid 2px #005BFF", borderRadius: 20,width: "65vw" }}>
            <h1>{ MemberData.login }</h1>
            <p>Роль: { MemberData.role }</p>
            { IsChange?
            <form onSubmit={handleSubmit}>
                <label>
                Выберите новую роль:
                <select value={NewRole} onChange={(event) => SetNewRole(event.target.value)}>
                    <option value="null">null</option>
                    <option value="Admin">Admin</option>
                    <option value="Redactor">Redactor</option>
                    <option value="Halper">Halper</option>
                </select>
                </label>
                <input type="submit" value="Сохранить" />
            </form> : null }
            <p>Список групп участника: { MemberData.group.map((element, index) => {return element.split(":")[1] }).join([', '])}</p>
            <button onClick={() => {SetChange(true)}}>Изменить Роль</button>
            <button onClick={() => KickMember(MemberData.id+":"+MemberData.role)}>Выгнать</button>
        </div>
    )
}