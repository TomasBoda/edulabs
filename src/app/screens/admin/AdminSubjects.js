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
import SubjectIcon from "../../assets/subject-icon.svg";

class AdminSubjects extends React.Component {

    state = {
        edit: false,
        type: "add-subject",

        subjects: [],

        loading: true
    }

    constructor() {
        super();

        this.loadData = this.loadData.bind(this);
    }

    async loadData() {
        this.setState({ loading: true });

        const token = getStorageItem("token");

        const call = await Api.getAdminSubjects(token);

        if (call.subjects) {
            var subjects = call.subjects;
            subjects.sort((a, b) => {
                return a.name.localeCompare(b.name);
            });

            this.setState({
                subjects: subjects,
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
                <Heading title="Subjects" />

                <Panel
                    title="Administrate your subjects"
                    text="All your subjects in one place. Create new subjects, manage them and update them as your school grows."
                    image={Icon}
                />

                {this.state.edit ? (
                    <Edit
                        type={this.state.type}
                        close={() => this.setState({ edit: false }, () => this.loadData())}
                    />
                ) : null}

                <div className="body-panel">
                    <Box
                        item={{ name: "Add subject" }}
                        icon={AddIcon}
                        onClick={() => this.setState({ edit: true })}
                    />

                    {this.state.subjects.map((subject) => (
                        <Box
                            item={subject}
                            onClick={() => {}}
                            icon={Icon}
                        />
                    ))}
                </div>
            </div>
        )
    }
}

export default withRouter(AdminSubjects);