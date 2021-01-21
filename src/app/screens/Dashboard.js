import React from "react";
import { withRouter } from "react-router-dom";

import { setStorageItem, getStorageItem, removeStorageItem, isLogged } from "../config/Config";

import Api from "../config/Api";
import Loading from "../components/Loading";
import Panel from "../components/Panel";
import Heading from "../components/Heading";
import { Grade } from "./Grades";

import "../styles/dashboard.css";

import Icon from "../assets/dashboard-icon.svg";
import PanelIcon from "../assets/subjects-icon.svg";

class Dashboard extends React.Component {

    state = {
        user: {},
        grades: [],

        loading: true
    }

    constructor() {
        super();

        this.getUser = this.getUser.bind(this);
        this.loadGrades = this.loadGrades.bind(this);
    }

    async getUser() {
        const token = getStorageItem("token");

        const user = await Api.getUser(token);

        if (user.user) {
            this.setState({ user: user.user });
        }
    }

    async loadGrades() {
        this.setState({ loading: true });

        const token = getStorageItem("token");

        const call = await Api.getUserGrades(token);

        if (call.grades) {
            const grades = [];

            for (let i = 0; i < call.grades.length; i++) {
                const subject = await Api.getSubject(call.grades[i].subject_id, token);

                if (subject.subject) {
                    grades.push({
                        ...call.grades[i],
                        subject: subject.subject
                    });
                }
            }

            this.setState({
                grades: grades,
                loading: false
            })
        }
    }

    componentDidMount() {
        this.getUser();
        this.loadGrades();
    }

    render() {
        const user = this.state.user;

        return(
            <div className="screen" id="dashboard">
                <Heading title="Dashboard" />

                <Panel
                    title={"Welcome back, " + user.firstname}
                    text="Welcome back to EduLabs. A place where education prospers, a place where teachers help their students get the best out of their skills and help them grow."
                    image={PanelIcon}
                />

                {this.state.loading ? <div className="fill-space"><Loading /></div> : (
                    (user.role === "student" ? (
                        <div className="body-panel">
                            <div className="grade-panel panel animate__animated animate__fadeInUp">
                                <div className="title-small">Results</div>

                                <div className="grades" style={this.state.grades.length === 0 ? { height: 250 } : null}>
                                    {this.state.grades.length > 0 ? (
                                        this.state.grades.map((grade, index) => (
                                            <Grade
                                                title={grade.description}
                                                subjectName={grade.subject.name}
                                                value={grade.value}
                                                style={index === this.state.grades.length - 1 ? { border: "none" } : null}
                                            />
                                        ))) : <div className="message">No grades</div>}
                                </div>
                            </div>

                            <div className="panel homework animate__animated animate__fadeInUp animate__delay-1s">
                                <div className="title-small">Homework</div>
                            </div>
                        </div>
                    ) : null)
                )}
            </div>
        )
    }
}

export default withRouter(Dashboard);