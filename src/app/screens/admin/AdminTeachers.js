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

class AdminTeachers extends React.Component {

    state = {
        edit: false,
        type: "add-user",

        teachers: [],

        loading: true
    }

    constructor() {
        super();

        this.loadData = this.loadData.bind(this);
    }

    async loadData() {
        this.setState({ loading: true });

        const token = getStorageItem("token");

        const call = await Api.getAdminTeachers(token);

        if (call.teachers) {
            var teachers = call.teachers;
            teachers.sort((a, b) => {
                return a.lastname.localeCompare(b.lastname);
            });

            this.setState({
                teachers: teachers,
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
                <Heading title="Teachers" />

                <Panel
                    title="Administrate your teachers"
                    text="All your teachers in one place. Manage your teachers, allocate the subjects they teach to individual classrooms and update their data as your school grows."
                    image={Icon}
                />

                {this.state.edit ? (
                    <Edit
                        type={this.state.type}
                        role="teacher"
                        close={() => this.setState({ edit: false }, () => this.loadData())}
                    />
                ) : null}

                <div className="body-panel">
                    <Box
                        item={{ name: "Add teacher" }}
                        icon={AddIcon}
                        onClick={() => this.setState({ edit: true })}
                    />

                    {this.state.teachers.map((teacher) => (
                        <Box
                            item={{ name: teacher.firstname + " " + teacher.lastname }}
                            onClick={() => this.props.history.push("/admin/users/" + teacher.id)}
                            icon={ProfileIcon}
                        />
                    ))}
                </div>
            </div>
        )
    }
}

export default withRouter(AdminTeachers);