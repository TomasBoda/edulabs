import React from "react";
import { Link, withRouter } from "react-router-dom";

import { setStorageItem, getStorageItem, removeStorageItem, isLogged } from "../../config/Config";

import Api from "../../config/Api";
import Loading from "../../components/Loading";
import Panel from "../../components/Panel";
import Heading from "../../components/Heading";
import Box from "../../components/Box";
import Edit from "../../components/Edit";

import "../../styles/admin.css";

import Icon from "../../assets/login-icon.svg";
import AddIcon from "../../assets/add-icon.svg";
import ProfileIcon from "../../assets/profile-icon.svg";

class AdminStudents extends React.Component {

    state = {
        students: [],

        loading: true
    }

    constructor() {
        super();

        this.loadData = this.loadData.bind(this);
    }

    async loadData() {
        this.setState({ loading: true });

        const token = getStorageItem("token");

        const call = await Api.getAdminStudents(token);

        if (call.students) {
            var students = call.students;
            students.sort((a, b) => {
                return a.lastname.localeCompare(b.lastname);
            });

            this.setState({
                students: students,
                loading: false
            });
        }
    }

    componentDidMount() {
        this.loadData();
    }

    render() {
        return(
            <div className="screen" id="admin">
                <Heading title="Students" />

                <Panel
                    title="Administrate your students"
                    text="All your students in one place. Manage your students, allocate them into classrooms, set their subjects and update their data as your school grows."
                    image={Icon}
                />

                <div className="body-panel">
                    {this.state.students.map((student) => (
                        <Box
                            item={{ name: student.firstname + " " + student.lastname }}
                            onClick={() => this.props.history.push("/admin/users/" + student.id)}
                            icon={ProfileIcon}
                        />
                    ))}
                </div>
            </div>
        )
    }
}

export default withRouter(AdminStudents);