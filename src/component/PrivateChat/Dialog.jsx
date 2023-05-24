import React from "react";

export default function Dialog() {
    // func redux ...

    return (
        <div className="Dialog">
            {/* Comp */}
            <div className="Dialog_Element" style={{display: "flex", justifyContent:"space-around", alignItems: "center"}}>
                <img className="User_Photo" width={40} height={40} src="https://png.pngtree.com/thumb_back/fw800/background/20220312/pngtree-white-marble-texture-background-image_1061992.jpg" alt="" />
                    <div style={{display:"flex", flexDirection:"column",}}>
                        <p style={{color: "#5B5B5B", padding:"0px 0px 5px 5px"}}>Username</p>
                        <p className="Dialog_Element_Message" style={{ paddingLeft:"5px"}}>Hello! Vanya, what ...</p>
                    </div>
                <p className="Mark">1</p>
            </div>
        </div>
    )
}