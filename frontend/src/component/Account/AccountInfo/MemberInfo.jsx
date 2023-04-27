import { useState } from "react";

export default function MemberInfo(props) {
    const [IsChange, SetChange] = useState(false);
    const [NewRole, SetNewRole] = useState("");
    
    const {Id, Name, Role, GroupList, KickMember, ChangeRoleMember} = props;

    const handleChange = (event) =>  {
        SetNewRole(event.target.value);
    }

    const handleSubmit = (event) =>  {
        event.preventDefault();
        ChangeRoleMember(Id, NewRole);
    }

    return( 
        <div style={{border: "solid 2px #005BFF", borderRadius: 20,width: "65vw" }}>
            <h1>{ Name }</h1>
            <p>Роль: { Role }</p>
            { IsChange?
            <form onSubmit={() => handleSubmit()}>
                <label>
                Выберите новую роль:
                <select value={NewRole} onChange={() => handleChange}>
                    <option value="Admin">Admin</option>
                    <option value="Redactor">Redactor</option>
                    <option value="Halper">Halper</option>
                </select>
                </label>
                <input type="submit" value="Отправить" />
            </form> : null }
            <p>Список групп участника: { GroupList.map((element, index) => {return element.split(":")[1] }).join([', '])}</p>
            <button onClick={() =>  {SetChange(true)}}>Изменить Роль</button>
            <button onClick={() => KickMember(Id)}>Выгнать</button>
        </div>
    )
}