import React from "react";

import Loading from "./Loading";

import "../styles/option.css";

export default function Option(props) {
    const loading = props.loading;
    const title = props.title;
    const onClick = props.onClick;
    const close = props.close;

    return(
        <div className="option">
            {loading ? <div className="panel"><Loading /></div> : (
                <div className="panel">
                    <div className="title">{title}</div>
                    <div className="button-panel">
                        <div className="button" onClick={onClick}>Yes</div>
                        <div style={{ width: 20 }} />
                        <div className="button" onClick={close}>Cancel</div>
                    </div>
                </div>
            )}
        </div>
    )
}