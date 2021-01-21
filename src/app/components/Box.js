import React, { useState } from "react";

import "../styles/box.css";

import Icon from "../assets/login-icon.svg";

export default function Box(props) {
    const item = props.item;
    const icon = props.icon;
    const delay = props.delay;

    const [render, setRender] = useState(false);

    setTimeout(() => {
        setRender(true)
    }, delay || 0);

    if (!render) {
        return null;
    }

    return(
        <div className={"box " + (props.withAnimation === true ? "animate__animated animate__zoomIn" : "")} onClick={props.onClick}>
            {props.withRemove === true ? <ion-icon name="close-outline" onClick={props.onRemoveClick}></ion-icon> : null}

            <img className="image" src={icon ? icon : Icon} />
            <div className="name">{item.name}</div>
        </div>
    )
}