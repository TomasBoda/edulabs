import React from "react";

import { setStorageItem, getStorageItem, removeStorageItem, isLogged } from "../config/Config";

import Api from "../config/Api";
import Loading from "./Loading";

import "../styles/edit.css";

export default class Edit extends React.Component {

    state = {
        loading: false,
        log: false,
        message: "",

        firstname: "",
        lastname: "",
        email: "",
        password: "",
        role: "student",
        admin: 0,

        subjectName: "",

        gradeValue: "",
        gradeDescription: ""
    }

    constructor() {
        super();

        this.createUser = this.createUser.bind(this);
        this.createClassroom = this.createClassroom.bind(this);
        this.createSubject = this.createSubject.bind(this);
        this.createGrade = this.createGrade.bind(this);
    }

    async createUser() {
        this.setState({ loading: true });

        const token = getStorageItem("token");

        if (this.state.firstname.trim() === "" ||
            this.state.lastname.trim() === "" ||
            this.state.email.trim() === "" ||
            this.state.password.trim() === "") {
            this.setState({ loading: false });
            return;
        }

        var data = {
            firstname: this.state.firstname,
            lastname: this.state.lastname,
            email: this.state.email,
            password: this.state.password,
            role: this.props.role,
            admin: this.state.admin,
        }

        if (this.props.role === "student") data["classroom"] = this.props.classroom;

        const call = await Api.createUser(data, token);

        if (call.message === "User registered successfully") {
            this.props.finish();
        } else {
            this.setState({
                loading: false,
                log: true,
                message: call.message
            })
        }
    }

    async createClassroom() {
        this.setState({ loading: true });

        const token = getStorageItem("token");

        if (this.state.classroomName.trim() === "") {
            this.setState({ loading: false });
            return;
        }

        const call = await Api.createClassroom({
            name: this.state.classroomName
        }, token);

        if (call.message === "Classroom created successfully") {
            this.props.finish();
        } else {
            this.setState({
                loading: false,
                log: true,
                message: call.message
            });
        }
    }

    async createSubject() {
        this.setState({ loading: true });

        const token = getStorageItem("token");

        if (this.state.subjectName.trim() === "") {
            this.setState({ loading: false });
            return;
        }

        const call = await Api.createSubject({
            name: this.state.subjectName
        }, token);

        if (call.message === "Subject created successfully") {
            this.props.finish();
        } else {
            this.setState({
                loading: false,
                log: true,
                message: call.message
            });
        }
    }

    async createGrade() {
        this.setState({ loading: true });

        const token = getStorageItem("token");

        if (this.state.gradeValue.trim() === "" || this.state.gradeDescription.trim() === "") {
            this.setState({ loading: false });
            return;
        }

        const call = await Api.createGrade({
            value: this.state.gradeValue,
            description: this.state.gradeDescription,
            userId: this.props.userId,
            subjectId: this.props.subjectId
        }, token);

        if (call.message === "Grade created successfully") {
            this.props.finish();
        } else {
            this.setState({
                loading: false,
                log: true,
                message: call.message
            });
        }
    }

    componentDidMount() {
        
    }

    render() {
        const type = this.props.type;

        if (this.state.loading) {
            return <div className="edit-screen"><div className="edit" style={{ width: "auto" }}><Loading /></div></div>;
        }

        if (this.state.log) {
            return(
                <div className="edit-screen">
                    <div className="edit">
                        <div className="title">{this.state.message}</div>
                        <div className="button" onClick={() => this.props.close()}>Close</div>
                    </div>
                </div>
            )
        }

        if (type === "add-user") {
            return(
                <div className="edit-screen animate__animated animate__fadeIn" id="add-user">
                    <div className="edit animate__animated animate__backInDown">
                        <div className="title">Add {this.props.role}<ion-icon name="close" onClick={() => this.props.close()}></ion-icon></div>

                        <input className="input" type="text" value={this.state.firstname} onChange={(event) => this.setState({ firstname: event.target.value })} placeholder="First name" />
                        <input className="input" type="text" value={this.state.lastname} onChange={(event) => this.setState({ lastname: event.target.value })} placeholder="Last name" />
                        <input className="input" type="text" value={this.state.email} onChange={(event) => this.setState({ email: event.target.value })} placeholder="E-mail" />

                        <br />

                        <input className="input" type="password" value={this.state.password} onChange={(event) => this.setState({ password: event.target.value })} placeholder="Password" />

                        <br />
                        <br />

                        <div className="choice">
                            <div className="item" onClick={() => this.setState({ admin: 1 })} style={this.state.admin === 1 ? { backgroundColor: "#5E81F4", color: "white" } : null}>Admin</div>
                            <div className="item" onClick={() => this.setState({ admin: 0 })} style={this.state.admin === 0 ? { backgroundColor: "#5E81F4", color: "white" } : null}>Regular</div>
                        </div>

                        <br />
                        <br />

                        <div className="button" onClick={() => this.createUser()}>Create</div>
                    </div>
                </div>
            )
        } else if (type === "add-classroom") {
            return(
                <div className="edit-screen animate__animated animate__fadeIn" id="add-classroom">
                    <div className="edit animate__animated animate__backInDown">
                        <div className="title">Create classroom<ion-icon name="close" onClick={() => this.props.close()}></ion-icon></div>

                        <input className="input" type="text" value={this.state.classroomName} onChange={(event) => this.setState({ classroomName: event.target.value })} placeholder="Classroom name" />

                        <br />
                        <br />

                        <div className="button" onClick={() => this.createClassroom()}>Create</div>
                    </div>
                </div>
            )
        } else if (type === "add-subject") {
            return(
                <div className="edit-screen animate__animated animate__fadeIn" id="add-subject">
                    <div className="edit animate__animated animate__backInDown">
                        <div className="title">Create subject<ion-icon name="close" onClick={() => this.props.close()}></ion-icon></div>

                        <input className="input" type="text" value={this.state.subjectName} onChange={(event) => this.setState({ subjectName: event.target.value })} placeholder="Subject name" />

                        <br />
                        <br />

                        <div className="button" onClick={() => this.createSubject()}>Create</div>
                    </div>
                </div>
            )
        } else if (type === "add-grade") {
            return(
                <div className="edit-screen animate__animated animate__fadeIn" id="add-grade">
                    <div className="edit animate__animated animate__backInDown">
                        <div className="title">Create grade<ion-icon name="close" onClick={() => this.props.close()}></ion-icon></div>

                        <input className="input" type="text" value={this.state.gradeValue} onChange={(event) => this.setState({ gradeValue: event.target.value })} placeholder="Grade value in percentage" />
                        <input className="input" type="text" value={this.state.gradeDescription} onChange={(event) => this.setState({ gradeDescription: event.target.value })} placeholder="Grade description" />

                        <br />
                        <br />

                        <div className="button" onClick={() => this.createGrade()}>Create</div>
                    </div>
                </div>
            )
        }
    }
}