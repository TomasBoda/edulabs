import React, { useState } from "react";

import "../styles/header.css";

export default function Header() {

    const [showing, setShowing] = useState(false);

    return(
        <div id="header">
            {/*<ion-icon name="menu-outline" onClick={() => {
                if (showing) {
                    hideMenu();
                    setShowing(false);
                } else {
                    showMenu();
                    setShowing(true);
                }
            }}></ion-icon>*/}

            <div className="hamburger-button" onClick={() => {
                    if (showing) {
                        hideMenu();
                        setShowing(false);
                    } else {
                        showMenu();
                        setShowing(true);
                    }
                }}>
                <div className="hamburger" id="hamburger">
                    <div className="line" id="hamburger-line-1" />
                    <div className="line" id="hamburger-line-2" />
                    <div className="line" id="hamburger-line-3" />
                </div>
            </div>

            <div style={{ flex: 1 }} />
        </div>
    )
}

export const showMenu = () => {
    var menu = document.getElementById("menu");

    menu.style.left = "0px";
    document.getElementById("hamburger-line-1").style.width = "90%";
    document.getElementById("hamburger-line-2").style.width = "70%";
    document.getElementById("hamburger-line-3").style.width = "40%";
}

export const hideMenu = () => {
    var menu = document.getElementById("menu");

    menu.style.left = "-100vw";
    document.getElementById("hamburger-line-1").style.width = "100%";
    document.getElementById("hamburger-line-2").style.width = "100%";
    document.getElementById("hamburger-line-3").style.width = "100%";
}