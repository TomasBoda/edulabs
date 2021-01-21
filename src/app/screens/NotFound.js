import React from "react";
import { withRouter } from "react-router-dom";

function NotFound(props) {
    props.history.push("/");

    return null;
}

export default withRouter(NotFound);