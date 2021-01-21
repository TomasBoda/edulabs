import React, { useEffect } from "react";
import { withRouter } from "react-router-dom";

import "../styles/heading.css";

function Heading(props) {
    var rawDate = new Date().toString().split(" ");
    var date = rawDate[0] + " " +  rawDate[2] + ", " + rawDate[1] + " " + rawDate[3];

    return (
        <div className="top-heading">
            {props.withArrow ? <ion-icon name="arrow-back-outline" onClick={() => props.history.goBack()}></ion-icon> : null}
            <div className="title-large">{props.title}</div>
            <div style={{ flex: 1 }} />
            <div className="date">{date}</div>
        </div>
    )
}

export default withRouter(Heading);