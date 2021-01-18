import React from "react";
import { Link, withRouter } from "react-router-dom";

import { setStorageItem, getStorageItem, removeStorageItem, isLogged } from "../../config/Config";

import Api from "../../config/Api";
import Loading from "../../components/Loading";
import Panel from "../../components/Panel";
import Heading from "../../components/Heading";
import Box from "../../components/Box";
import Edit from "../../components/Edit";
import Popup from "../../components/Popup";

import "../../styles/admin.css";

import Icon from "../../assets/login-icon.svg";
import ProfileIcon from "../../assets/profile-icon.svg";

class AdminUser extends React.Component {

    state = {
        user: {},

        firstname: "",
        lastname: "",
        email: "",
        role: "",
        admin: 0,

        selectedStudentClassroom: "",
        selectedStudentSubjects: [],

        selectedTeacherSubjects: [],

        classrooms: [],
        subjects: [],

        teacherData: [],

        loading: true,
    }

    constructor() {
        super();

        this.loadUserData = this.loadUserData.bind(this);
        
        this.loadStudentSubjects = this.loadStudentSubjects.bind(this);
        this.loadStudentClassrooms = this.loadStudentClassrooms.bind(this);
        this.addStudentSubject = this.addStudentSubject.bind(this);
        this.removeStudentSubject = this.removeStudentSubject.bind(this);
        this.changeStudentClassroom = this.changeStudentClassroom.bind(this);

        this.addTeacherSubject = this.addTeacherSubject.bind(this);
        this.removeTeacherSubject = this.removeTeacherSubject.bind(this);
        this.loadTeacherSubjectsAndClassrooms = this.loadTeacherSubjectsAndClassrooms.bind(this);
        this.isTeached = this.isTeached.bind(this);
    }

    //////////////////////////////////

    async addStudentSubject(subjectId) {
        const token = getStorageItem("token");
        const userId = this.props.match.params.id;

        const call = await Api.addAdminStudentSubject({
            userId: userId,
            subjectId: subjectId,
            classroomId: this.state.selectedStudentClassroom
        }, token);

        if (call.message === "Subject added successfully") {
            this.loadStudentSubjects();
        }
    }

    async removeStudentSubject(subjectId) {
        const token = getStorageItem("token");
        const userId = this.props.match.params.id;

        const call = await Api.removeAdminStudentSubject({
            userId: userId,
            subjectId: subjectId,
            classroomId: this.state.selectedStudentClassroom
        }, token);

        if (call.message === "Subject removed successfully") {
            this.loadStudentSubjects();
        }
    }

    async changeStudentClassroom(classroomId) {
        const token = getStorageItem("token");
        const userId = this.props.match.params.id;

        const call = await Api.changeAdminStudentClassroom({
            userId: userId,
            classroomId: classroomId
        }, token);

        if (call.message === "Classroom changed successfully") {
            this.loadUserData();
        }
    }

    async loadUserData() {
        const token = getStorageItem("token");
        const id = this.props.match.params.id;

        const call = await Api.getAdminUser(id, token);

        if (call.user) {
            this.setState({
                firstname: call.user.firstname,
                lastname: call.user.lastname,
                email: call.user.email,
                role: call.user.role,
                admin: call.user.admin,
            });

            if (call.user.role === "student") {
                this.setState({ selectedStudentClassroom: call.user.classroom });
            }
        }
    }

    async loadStudentSubjects() {
        const token = getStorageItem("token");
        const id = this.props.match.params.id;

        const allSubjects = await Api.getAdminSubjects(token);
        const studentSubjects = await Api.getAdminUserSubjects(id, token);

        if (allSubjects.subjects && studentSubjects.subjects) {
            const subjects = allSubjects.subjects;
            subjects.sort((a, b) => {
                return a.name.localeCompare(b.name);
            });

            this.setState({
                subjects: subjects,
                selectedStudentSubjects: studentSubjects.subjects
            });
        }
    }

    async loadStudentClassrooms() {
        const token = getStorageItem("token");

        const allClassrooms = await Api.getAdminClassrooms(token);

        if (allClassrooms.classrooms) {
            const classrooms = allClassrooms.classrooms;
            classrooms.sort((a, b) => {
                return a.name.localeCompare(b.name);
            });

            this.setState({
                classrooms: classrooms
            });
        }
    }

    ///////////////////////////////////

    async addTeacherSubject(subjectId, classroomId) {
        const token = getStorageItem("token");
        const userId = this.props.match.params.id;

        const call = await Api.addAdminTeacherSubject({
            userId: userId,
            subjectId: subjectId,
            classroomId: classroomId
        }, token);

        if (call.message === "Subject added successfully") {
            this.loadTeacherSubjectsAndClassrooms();
        }
    }

    async removeTeacherSubject(subjectId, classroomId) {
        const token = getStorageItem("token");
        const userId = this.props.match.params.id;

        const call = await Api.removeAdminTeacherSubject({
            userId: userId,
            subjectId: subjectId,
            classroomId: classroomId
        }, token);

        if (call.message === "Subject removed successfully") {
            this.loadTeacherSubjectsAndClassrooms();
        }
    }

    isTeached(classroomId, subjectId) {
        for (let i = 0; i < this.state.teacherData.length; i++) {
            const item = this.state.teacherData[i];

            if (item.classroom_id === classroomId && item.subject_id === subjectId) {
                return true;
            }
        }

        return false;
    }

    async loadTeacherSubjectsAndClassrooms() {
        const token = getStorageItem("token");
        const id = this.props.match.params.id;

        const subjects = await Api.getAdminSubjects(token);
        const classrooms = await Api.getAdminClassrooms(token);
        const call = await Api.getAdminTeacherSubjectsAndClassrooms(id, token);

        console.log(call.data);
        console.log(classrooms.classrooms);
        console.log(subjects.subjects);

        if (call.data && subjects.subjects && classrooms.classrooms) {
            const fetchedClassrooms = classrooms.classrooms;
            const fetchedSubjects = subjects.subjects;

            fetchedClassrooms.sort((a, b) => {
                return a.name.localeCompare(b.name);
            });

            fetchedSubjects.sort((a, b) => {
                return a.name.localeCompare(b.name);
            });

            this.setState({
                subjects: fetchedSubjects,
                classrooms: fetchedClassrooms,
                teacherData: call.data
            })
        }
    }

    ///////////////////////////////////

    async componentDidMount() {
        await this.loadUserData();

        if (this.state.role === "student") {
            await this.loadStudentClassrooms();
            await this.loadStudentSubjects();
        } else if (this.state.role === "teacher") {
            await this.loadTeacherSubjectsAndClassrooms();
        }
    }

    render() {
        return(
            <div className="screen" id="admin-user">
                <Heading title="User" />

                <div className="body-panel">
                    <div className="panel top-panel">
                        <img className="profile-image" src={ProfileIcon} />

                        <div className="info-panel">
                            <div className="name">{this.state.firstname + " " + this.state.lastname}</div>
                            <div className="role">{this.state.role === "student" ? "Student" : "Teacher"}</div>
                        </div>
                    </div>

                    <div className="bottom-panel">
                        <div className="panel left-panel">
                            <div className="title-small">Personal info</div>

                            <div style={{ height: 15 }} />

                            <input className="input" type="text" placeholder="First name" value={this.state.firstname} onChange={(event) => this.setState({ firstname: event.target.value })} />
                            <input className="input" type="text" placeholder="Last name" value={this.state.lastname} onChange={(event) => this.setState({ lastname: event.target.value })} />
                            <input className="input" type="text" placeholder="E-mail" value={this.state.email} onChange={(event) => this.setState({ email: event.target.value })} />

                            {/*
                            <div style={{ height: 20 }} />

                            <div className="title-small">Role</div>

                            <div style={{ height: 15 }} />

                            <div className="button-panel">
                                <div className={"button" + (this.state.role === "student" ? "" : "-disabled")} onClick={() => this.setState({ role: "student" })}>Student</div>
                                <div style={{ width: 10 }} />
                                <div className={"button" + (this.state.role === "teacher" ? "" : "-disabled")} onClick={() => this.setState({ role: "teacher" })}>Teacher</div>
                            </div>
                            */}

                            <div style={{ height: 20 }} />

                            <div className="title-small">Privileges</div>

                            <div style={{ height: 20 }} />

                            <div className="button-panel">
                                <div className={"button" + (this.state.admin === 1 ? "" : "-disabled")} onClick={() => this.setState({ admin: 1 })}>Admin</div>
                                <div style={{ width: 10 }} />
                                <div className={"button" + (this.state.admin === 0 ? "" : "-disabled")} onClick={() => this.setState({ admin: 0 })}>Regular</div>
                            </div>
                        </div>

                        {this.state.role === "student" ? (
                        <div className="right-panel" id="student-panel">
                            <div className="panel classroom-panel">
                                <div className="title-small">Classroom</div>

                                <div className="list">
                                    {this.state.classrooms.map((classroom) => (
                                        <div className="item" onClick={() => this.changeStudentClassroom(classroom.id)} style={classroom.id === this.state.selectedStudentClassroom ? { backgroundColor: "#5E81F4", color: "white" } : null}>
                                            {classroom.name}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="panel subject-panel">
                                <div className="title-small">Subjects</div>

                                <div className="list">
                                    {this.state.subjects.map((subject) => (
                                        <div className="item" onClick={() => this.state.selectedStudentSubjects.includes(subject.id) ? this.removeStudentSubject(subject.id) : this.addStudentSubject(subject.id)} style={this.state.selectedStudentSubjects.includes(subject.id) ? { backgroundColor: "#5E81F4", color: "white" } : null}>
                                            {subject.name}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        ) : (
                        <div className="right-panel" id="teacher-panel">
                            <div className="panel classroom-panel">
                                <div className="title-small">Classrooms</div>

                                <div className="classrooms">
                                    {this.state.classrooms.map((classroom) => (
                                        <div className="classroom">
                                            <div className="info">
                                                {classroom.name}
                                            </div>

                                            <div className="list">
                                                {this.state.subjects.map((subject) => (
                                                    <div className="item"
                                                        onClick={() => this.isTeached(classroom.id, subject.id) ? this.removeTeacherSubject(subject.id, classroom.id) : this.addTeacherSubject(subject.id, classroom.id)}
                                                        style={this.isTeached(classroom.id, subject.id) ? { backgroundColor: "#5E81F4", color: "white" } : null}
                                                    >
                                                        {subject.name}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        )}
                    </div>
                </div>

                {this.state.popup ? (
                    <Popup
                        loading={this.state.loading}
                        title={this.state.message}
                        close={() => this.setState({ popup: false }, () => this.loadData())}
                    />
                ) : null}
            </div>
        )
    }
}

export default withRouter(AdminUser);