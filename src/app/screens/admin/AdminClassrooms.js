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
import ClassIcon from "../../assets/class-icon.svg";

class AdminClassrooms extends React.Component {

    state = {
        edit: false,
        type: "add-classroom",

        classrooms: [],

        loading: true
    }

    constructor() {
        super();

        this.loadData = this.loadData.bind(this);
    }

    async loadData() {
        this.setState({ loading: true });

        const token = getStorageItem("token");

        const call = await Api.getAdminClassrooms(token);

        if (call.classrooms) {
            var classrooms = call.classrooms;
            classrooms.sort((a, b) => {
                return a.name.localeCompare(b.name);
            });

            this.setState({
                classrooms: classrooms,
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
                <Heading title="Classrooms" />

                <Panel
                    title="Administrate your classrooms"
                    text="All your classrooms in one place. Create new classrooms, allocate your students into them and build a solid foundation for your school."
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
                        item={{ name: "Add classroom" }}
                        icon={AddIcon}
                        onClick={() => this.setState({ edit: true })}
                    />

                    {this.state.classrooms.map((classroom) => (
                        <Box
                            item={classroom}
                            onClick={() => this.props.history.push({ pathname: "/admin/classrooms/" + classroom.id })}
                            icon={ClassIcon}
                        />
                    ))}
                </div>
            </div>
        )
    }
}

export default withRouter(AdminClassrooms);