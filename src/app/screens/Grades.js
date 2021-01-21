import React, { useState } from "react";
import { Link, withRouter } from "react-router-dom";

import { setStorageItem, getStorageItem, removeStorageItem, isLogged } from "../config/Config";

import Api from "../config/Api";
import Loading from "../components/Loading";
import Panel from "../components/Panel";
import Heading from "../components/Heading";

import "../styles/grades.css";

import Icon from "../assets/login-icon.svg";

class Grades extends React.Component {

    state = {
        subjects: [],

        loading: true
    }

    constructor() {
        super();

        this.loadSubjects = this.loadSubjects.bind(this);
    }

    async loadSubjects() {
        this.setState({ loading: true });

        const token = getStorageItem("token");
        const call = await Api.getUserSubjects(token);

        if (call.subjects) {
            var array = [];

            for (let i = 0; i < call.subjects.length; i++) {
                const getSubject = await Api.getSubject(call.subjects[i], token);
                
                const subjectId = getSubject.subject.id;
                const getGrades = await Api.getGrades(subjectId, token);

                function add(a, b) {
                    return a + b.value;
                }

                const average = getGrades.grades.reduce(add, 0) / getGrades.grades.length;

                const subject = {
                    ...getSubject.subject,
                    grades: getGrades.grades,
                    average: average
                }

                array.push(subject);
            }

            this.setState({
                subjects: array,
                loading: false
            });
        } else {
            this.setState({ loading: false });
            alert("ERROR");
        }
    }

    componentDidMount() {
        this.loadSubjects();
    }

    render() {
        const user = this.state.user;

        return(
            <div className="screen" id="grades">
                <Heading title="Grades" />

                <Panel
                    title="Analyse and improve your results"
                    text="Your average results by subjects, in one place. Analyse your results, consult them with your teachers and improve your skills."
                    image={Icon}
                />

                {this.state.loading ? <div className="fill-space"><Loading /></div> : (
                    <div className="body-panel">
                        <div className="grades">
                            {this.state.subjects.map((subject, index) => (
                                <Grade
                                    withAnimation
                                    delay={index * 50}
                                    title={subject.name}
                                    value={subject.average}
                                    style={index === this.state.subjects.length - 1 ? { border: "none" } : null}
                                />
                            ))}
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
    const delay = props.delay;

    const subjectName = props.subjectName;

    const [render, setRender] = useState(false);

    setTimeout(() => {
        setRender(true)
    }, delay || 0);

    function getColor(value) {
        return value >= 50 ? "#5E81F4" : "#FF6A77";
    }

    if (!render) {
        return null;
    }

    const innerWidth = window.innerWidth;

    return(
        <div className={"grade" + (props.withAnimation ? " animate__animated animate__fadeInUp" : "")} style={props.style}>
            {subjectName && innerWidth > 600 ? <div className="description" style={{ paddingRight: 10, marginRight: 10, borderRight: "2px solid rgba(0, 0, 0, 0.1)", fontWeight: 700 }}>{subjectName}</div> : null}
            <div className="description">{title}</div>
            <div style={{ flex: 1 }} />
            {value ? <div className="bar"><div className="filled" style={{ width: (value + "%").toString(), backgroundColor: getColor(value) }} /></div> : null}
            {value ? <div className="value" style={{ color: getColor(value) }}>{value.toFixed(2)}%</div> : <div className="message" style={{ width: 100, textAlign: "right" }}>No grades</div>}
        </div>
    )
}

export default withRouter(Grades);