import React from "react";

import "../styles/panel.css";

import PanelIcon from "../assets/subjects-icon.svg";

export default function Panel(props) {
    return(
        <div className="dashboard-panel">
            <div className="info-panel">
                <div className="title-large">{props.title}</div>
                <div className="text-small">
                    {props.text}
                </div>
            </div>

            <img className="image" src={/*props.image*/ PanelIcon} />
        </div>
    )
}