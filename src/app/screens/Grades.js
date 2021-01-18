import React from "react";
import { Link, withRouter } from "react-router-dom";

import { setStorageItem, getStorageItem, removeStorageItem, isLogged } from "../config/Config";
import { Grade } from "../screens/Subject";

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
        if (isLogged()) {
            this.loadSubjects();
        } else {
            this.props.history.push("/");
        }
    }

    render() {
        const user = this.state.user;

        return(
            <div className="screen" id="grades">
                <Heading title="Grades" />

                <Panel
                    title="Analyse and improve your results"
                    text="Welcome back to EduLabs. You have new assignments, homeworks and grades. Look them up in your notification panel."
                    image={Icon}
                />

                <div className="body-panel">
                    <div className="panel">
                        <div className="title-small">Average grade by subject</div>

                        <div className="grades">
                            {this.state.subjects.map((subject, index) => (
                                <Grade
                                    title={subject.name}
                                    value={subject.average}
                                    style={index === this.state.subjects.length - 1 ? { border: "none" } : null}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(Grades);