import { useEffect, useState } from "react";
import packagejson from "../../../../../package.json";

export default function GroupInfo(props) {    
    const {GroupId, ShowMemberInfo} = props;

    const [GroupData, SetGroupData] = useState([]);

    useEffect(() => {
        if(GroupId){
            fetch(packagejson.ipurl + "/api/user/getGroup/" + GroupId)
            .then((Response) => Response.json())
            .then(async (Result) => { 
                let newArray = Object.assign({}, Result.responseData);
                fetch(packagejson.ipurl + "/api/user/GetGroupMembersInfo/" + GroupId)
                .then((Response) => Response.json())
                .then((Result) => {
                    newArray.members = Result.responseData;
                    newArray.members.map((element, index) => {
                        element.group.map((el) => {
                            if(el.split(":")[0] === GroupId){
                                element.role = el.split(":")[2];
                            }
                        });
                    })
                    SetGroupData(newArray);
                });
            });
        }
    }, [props])

    git config --global user.email "ivanvoloshiin@mail.ru"
    git config --global user.name "ivan"

    return( 
        <div>
            <h1>{ GroupData.name }</h1>
            <div className="GroupMembers">
                {GroupData.members ? GroupData.members.map((element, index) => {
                    return (
                        <div key={ index } style={{display: "flex", alignItems: "center", justifyContent: "space-between"}} onClick={() => ShowMemberInfo(element)}>
                            <h1>{ index+1 }</h1>
                            <p>{ element.login }</p>
                            <p style={{color: "#005BFF"}}>{ element.role }</p>
                        </div>
                    )
                }): null}
            </div>
        </div>
    )
}