import React from "react";
import { withRouter } from "react-router-dom";

import { setStorageItem, getStorageItem, removeStorageItem, isLogged } from "../config/Config";

import Api from "../config/Api";
import Loading from "../components/Loading";
import Panel from "../components/Panel";
import Heading from "../components/Heading";
import Box from "../components/Box";

import "../styles/classrooms.css";

import Icon from "../assets/login-icon.svg";
import ClassIcon from "../assets/class-icon.svg";

class Classrooms extends React.Component {

    state = {
        subject: {},
        classrooms: [],

        loading: true
    }

    constructor() {
        super();

        this.loadData = this.loadData.bind(this);
        this.loadSubject = this.loadSubject.bind(this);
    }

    async loadData() {
        const token = getStorageItem("token");
        const subjectId = this.props.match.params.id;

        const call = await Api.getTeacherClassroomsBySubject(subjectId, token);

        if (call.classrooms) {
            var fetchedClassrooms = [];

            for (let i = 0; i < call.classrooms.length; i++) {
                const classroomId = call.classrooms[i];
                const classroom = await Api.getClassroom(classroomId, token);
                fetchedClassrooms.push(classroom.classroom);
            }

            console.log(fetchedClassrooms);

            this.setState({ classrooms: fetchedClassrooms });
        }
    }

    async loadSubject() {
        const token = getStorageItem("token");
        const subjectId = this.props.match.params.id;

        const call = await Api.getSubject(subjectId, token);

        if (call.subject) {
            this.setState({ subject: call.subject });
        }
    }

    componentDidMount() {
        this.loadSubject();
        this.loadData();
    }

    render() {
        return(
            <div className="screen" id="classrooms">
                <Heading title={this.state.subject.name} />

                <Panel
                    title={"Manage your classrooms"}
                    text="All the classrooms you teach in one place. Dive into your classrooms and manage your students and their results."
                    image={Icon}
                />

                <div className="body-panel">
                    {this.state.classrooms.map((classroom) => (
                        <Box
                            item={classroom}
                            onClick={() => this.props.history.push("/subjects/" + this.state.subject.id + "/classrooms/" + classroom.id)}
                            icon={ClassIcon}
                        />
                    ))}
                </div>
            </div>
        )
    }
}

export default withRouter(Classrooms);