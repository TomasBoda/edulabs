import React from "react";

import "../styles/heading.css";

export default function Heading(props) {
    var rawDate = new Date().toString().split(" ");
    var date = rawDate[0] + " " +  rawDate[2] + ", " + rawDate[1] + " " + rawDate[3];

    return (
        <div className="top-heading">
            <div className="title-large">{props.title}<div className="date">{date}</div></div>
        </div>
    )
}