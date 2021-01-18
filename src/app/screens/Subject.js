import React from "react";
import { withRouter, Link } from "react-router-dom";

import { setStorageItem, getStorageItem, removeStorageItem, isLogged } from "../config/Config";

import Api from "../config/Api";
import Loading from "../components/Loading";
import Panel from "../components/Panel";
import Heading from "../components/Heading";

import "../styles/subject.css";

import Icon from "../assets/login-icon.svg";

class Subject extends React.Component {

    state = {
        subject: {},
        grades: [],

        loading: true
    }

    constructor() {
        super();

        this.loadSubject = this.loadSubject.bind(this);
        this.loadGrades = this.loadGrades.bind(this);
    }

    async loadSubject() {
        const id = this.props.match.params.id;
        const token = getStorageItem("token");

        const subject = await Api.getSubject(id, token);

        if (subject.subject) {
            this.setState({ subject: subject.subject, loading: false });
        }
    }

    async loadGrades() {
        const id = this.props.match.params.id;
        const token = getStorageItem("token");

        const grades = await Api.getGrades(id, token);

        if (grades.grades) {
            this.setState({ grades: grades.grades });
        }
    }

    componentDidMount() {
        if (isLogged()) {
            this.loadSubject();
            this.loadGrades();
        } else {
            this.props.history.push("/");
        }
    }

    render() {
        const subject = this.state.subject;

        return(
            <div className="screen" id="subject">
                <Heading title="Subjects" />

                <Panel
                    title={subject.name}
                    text="Welcome back to EduLabs. You have new assignments, homeworks and grades. Look them up in your notification panel."
                    image={Icon}
                />

                {this.state.loading ? (
                    <div className="loading-container">
                        <Loading />
                    </div>
                ) : (
                    <div className="body-panel">
                        <div className="panel panel-1">
                            <div className="title-small">Overview</div>
                        </div>

                        <div className="panel grade-panel">
                            <div className="title-small">Grades</div>

                            <div className="grades">
                                {this.state.grades.length > 0 ? (
                                    this.state.grades.map((grade, index) => (
                                        <Grade
                                            title={grade.description}
                                            value={grade.value}
                                            style={index === this.state.grades.length - 1 ? { border: "none" } : null}
                                        />
                                    ))) : <div className="message">No grades</div>}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        )
    }
}

export function Grade(props) {
    const title = props.title;
    const value = props.value;

    function getColor(value) {
        return value >= 50 ? "#5E81F4" : "#FF6A77";
    }

    return(
        <div className="grade" style={props.style}>
            <div className="description">{title}</div>
            <div style={{ flex: 1 }} />
            {value ? <div className="bar"><div className="filled" style={{ width: (value + "%").toString(), backgroundColor: getColor(value) }} /></div> : null}
            {value ? <div className="value" style={{ color: getColor(value) }}>{value}%</div> : <div className="value" style={{ width: 200 }}>No grades</div>}
        </div>
    )
}

export default withRouter(Subject);