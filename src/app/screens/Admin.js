import React from "react";
import { Link, withRouter } from "react-router-dom";

import { setStorageItem, getStorageItem, removeStorageItem, isLogged } from "../config/Config";

import Api from "../config/Api";
import Loading from "../components/Loading";
import Panel from "../components/Panel";
import Heading from "../components/Heading";
import Edit from "../components/Edit";
import Box from "../components/Box";

import "../styles/admin.css";

import Icon from "../assets/login-icon.svg";
import ClassroomIcon from "../assets/classroom-icon.svg";
import StudentsIcon from "../assets/students-icon.svg";
import SubjectIcon from "../assets/subject-icon.svg";
import ClassIcon from "../assets/class-icon.svg";

class Admin extends React.Component {

    state = {
        edit: false,
        type: "add-classroom"
    }

    constructor() {
        super();
    }

    render() {
        return(
            <div className="screen" id="admin">
                <Heading title="Admin" />

                <Panel
                    title="Administrate your school"
                    text="Welcome to the administration of your school. Create classrooms and subjects, manage your students and teachers and build a strong foundation for your school."
                    image={Icon}
                />

                {this.state.edit ? (
                    <Edit
                        type={this.state.type}
                        close={() => this.setState({ edit: false })}
                    />
                ) : null}

                <div className="body-panel">
                    <Box
                        withAnimation
                        item={{ name: "Students" }}
                        icon={StudentsIcon}
                        onClick={() => this.props.history.push("/admin/students")}
                    />

                    <Box
                        withAnimation
                        item={{ name: "Teachers" }}
                        icon={ClassroomIcon}
                        onClick={() => this.props.history.push("/admin/teachers")}
                    />

                    <Box
                        withAnimation
                        item={{ name: "Classrooms" }}
                        icon={ClassIcon}
                        onClick={() => this.props.history.push("/admin/classrooms")}
                    />

                    <Box
                        withAnimation
                        item={{ name: "Subjects" }}
                        icon={Icon}
                        onClick={() => this.props.history.push("/admin/subjects")}
                    />
                </div>
            </div>
        )
    }
}

export default withRouter(Admin);