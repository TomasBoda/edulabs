import React from "react";
import { withRouter, Link } from "react-router-dom";

import { setStorageItem, getStorageItem, removeStorageItem, isLogged } from "../config/Config";

import Api from "../config/Api";
import Loading from "../components/Loading";
import Panel from "../components/Panel";
import Heading from "../components/Heading";
import Box from "../components/Box";

import "../styles/subjects.css";

import Icon from "../assets/login-icon.svg";

class Subjects extends React.Component {

    state = {
        subjects: [],

        isTeacher: false,

        loading: true
    }

    constructor() {
        super();

        this.loadData = this.loadData.bind(this);
        this.isTeacher = this.isTeacher.bind(this);
    }

    async isTeacher() {
        const token = getStorageItem("token");
        const call = await Api.getUser(token);

        if (call.user && call.user.role === "teacher") return true;

        return false;
    }

    async loadData() {
        this.setState({ loading: true });

        const token = getStorageItem("token");

        const call = await Api.getUserSubjects(token);

        if (call.subjects) {
            var fetchedSubjects = [];

            for (let i = 0; i < call.subjects.length; i++) {
                const subjectId = call.subjects[i];
                const subject = await Api.getSubject(subjectId, token);
                fetchedSubjects.push(subject.subject);
            }

            this.setState({
                loading: false,
                subjects: fetchedSubjects
            });
        }
    }

    async componentDidMount() {
        this.loadData();

        const teacher = await this.isTeacher();
        this.setState({ isTeacher: teacher });
    }

    render() {
        return(
            <div className="screen" id="subjects">
                <Heading title="Subjects" />

                <Panel
                    title="Dive into your subjects"
                    text="All your subjects in one place. Take a look at the results you achieved or the subjects you teach."
                    image={Icon}
                />

                {this.state.loading ? <div className="fill-space"><Loading /></div> : (
                    <div className="body-panel">
                        {this.state.subjects.map((subject, index) => (
                            <Box
                                //delay={index * 150}
                                withAnimation
                                item={subject}
                                onClick={() => this.state.isTeacher ? this.props.history.push("/subjects/" + subject.id + "/classrooms") : this.props.history.push("/subjects/" + subject.id)}
                            />
                        ))}
                    </div>
                )}
            </div>
        )
    }
}

export default withRouter(Subjects);