import React from "react";

import Loading from "./Loading";

import "../styles/popup.css";

export default function Popup(props) {
    const loading = props.loading;
    const title = props.title;
    const close = props.close;

    return(
        <div className="popup">
            {loading ? <div className="panel"><Loading /></div> : (
                <div className="panel">
                    <div className="title">{title}</div>
                    <div className="button" onClick={close}>Zavrieť</div>
                </div>
            )}
        </div>
    )
}