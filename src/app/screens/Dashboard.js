import React from "react";
import { withRouter } from "react-router-dom";

import { setStorageItem, getStorageItem, removeStorageItem, isLogged } from "../config/Config";

import Api from "../config/Api";
import Loading from "../components/Loading";
import Panel from "../components/Panel";
import Heading from "../components/Heading";

import "../styles/dashboard.css";

import Icon from "../assets/dashboard-icon.svg";
import PanelIcon from "../assets/subjects-icon.svg";

class Dashboard extends React.Component {

    state = {
        user: {}
    }

    constructor() {
        super();

        this.getUser = this.getUser.bind(this);
    }

    async getUser() {
        const token = getStorageItem("token");

        const user = await Api.getUser(token);

        console.log(user);

        if (user.user) {
            this.setState({ user: user.user });
            console.log(user);
        }
    }

    componentDidMount() {
        if (isLogged()) {
            this.getUser();
        } else {
            this.props.history.push("/");
        }
    }

    render() {
        var rawDate = new Date().toString().split(" ");
        var date = rawDate[0] + " " +  rawDate[2] + ", " + rawDate[1] + " " + rawDate[3];

        const user = this.state.user;

        return(
            <div className="screen" id="dashboard">
                <Heading title="Dashboard" />

                <Panel
                    title={"Welcome back, " + user.firstname}
                    text="Welcome back to EduLabs. A place where education prospers, a place where teachers help their students get the best out of their skills and help them grow."
                    image={PanelIcon}
                />

                <div className="body-panel">
                    <div className="average panel">
                        <div className="title-small">Results</div>
                    </div>

                    <div className="homework panel">
                        <div className="title-small">Homework</div>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(Dashboard);