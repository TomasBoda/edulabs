import React from "react";

import "../styles/box.css";

import Icon from "../assets/login-icon.svg";

export default function Box(props) {
    const item = props.item;
    const icon = props.icon;

    return(
        <div className="box" onClick={props.onClick}>
            <img className="image" src={icon ? icon : Icon} />
            <div className="name">{item.name}</div>
        </div>
    )
}