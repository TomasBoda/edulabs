import React from "react";
import { withRouter } from "react-router-dom";

import { setStorageItem, getStorageItem, removeStorageItem, isLogged } from "../config/Config";

import Api from "../config/Api";
import Loading from "../components/Loading";
import Panel from "../components/Panel";
import Heading from "../components/Heading";
import Box from "../components/Box";
import Edit from "../components/Edit";

import "../styles/classroom.css";

import Icon from "../assets/login-icon.svg";
import ProfileIcon from "../assets/profile-icon.svg";

class Classroom extends React.Component {

    state = {
        edit: false,
        type: "add-grade",

        classroom: {},
        subject: {},
        students: [],

        currentUser: "",

        loading: true
    }

    constructor() {
        super();

        this.loadData = this.loadData.bind(this);
        this.loadClassroom = this.loadClassroom.bind(this);
        this.loadSubject = this.loadSubject.bind(this);
        this.loadStudents = this.loadStudents.bind(this);
    }

    async loadData() {
        this.loadClassroom();
        this.loadSubject();
        this.loadStudents();
    }

    async loadStudents() {
        this.setState({ loading: true });

        const token = getStorageItem("token");
        const classroomId = this.props.match.params.classroomId;
        const subjectId = this.props.match.params.id;

        const call = await Api.getTeacherClassroomStudentsBySubject(classroomId, subjectId, token);

        if (call.students) {
            var fetchedStudents = [];

            for (let i = 0; i < call.students.length; i++) {
                const id = call.students[i].user_id;
                const student = await Api.getTeacherUser(id, token);

                const grades = await Api.getGradesByUserAndSubject(student.user.id, subjectId, token);

                function add(a, b) {
                    return a + b.value;
                }

                const average = grades.grades.reduce(add, 0) / grades.grades.length;

                if (student.user.role === "student") {
                    fetchedStudents.push({
                        ...student.user,
                        grades: grades.grades,
                        average: average
                    });
                }

                var students = fetchedStudents;
                students.sort((a, b) => {
                    return a.lastname.localeCompare(b.lastname);
                });
            }

            this.setState({
                students: students,
                loading: false
            });
        }
    }

    async loadClassroom() {
        const token = getStorageItem("token");
        const classroomId = this.props.match.params.classroomId;

        const call = await Api.getClassroom(classroomId, token);

        if (call.classroom) {
            console.log(call.classroom)
            this.setState({ classroom: call.classroom });
        }
    }

    async loadSubject() {
        const token = getStorageItem("token");
        const subjectId = this.props.match.params.id;

        const call = await Api.getSubject(subjectId, token);

        if (call.subject) {
            console.log(call.subject)
            this.setState({ subject: call.subject });
        }
    }

    componentDidMount() {
        this.loadData();
    }

    render() {
        return(
            <div className="screen" id="classroom">
                <Heading title={this.state.subject.name + " - " + this.state.classroom.name} />

                <Panel
                    title={"Manage your classroom"}
                    text="Manage your classroom in one place. Evaluate your student's results and help them get the best out of their skills."
                    image={Icon}
                />

                {this.state.edit ? (
                    <Edit
                        type={this.state.type}
                        userId={this.state.currentUser}
                        subjectId={this.props.match.params.id}
                        close={() => this.setState({ edit: false })}
                        finish={() => this.setState({ edit: false }, () => this.loadData())}
                    />
                ) : null}

                {this.state.loading ? <div className="fill-space"><Loading /></div> : (
                    <div className="body-panel">
                        {this.state.students.map((student) => {
                            return <div className="student">
                                <div className="info-panel">
                                    <img className="image" src={ProfileIcon} />
                                    <div className="name">{student.firstname + " " + student.lastname}</div>
                                </div>

                                <div className="grades">
                                    {student.grades.length > 0 ? (
                                        student.grades.map((grade) => (
                                            <div className="grade">{grade.value.toFixed(1) + "%"}</div>
                                        ))
                                        ) : <div className="message" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>No grades</div>}
                                </div>

                                <div className="add-panel">
                                    <div className="average" style={student.average ? {} : { margin: 0 }}>{student.average ? student.average.toFixed(1) + "%" : null}</div>
                                    <div className="button" onClick={() => this.setState({ currentUser: student.id }, () => this.setState({ edit: true }))}>Add grade</div>
                                </div>
                            </div>
                        })}
                    </div>
                )}
            </div>
        )
    }
}

export default withRouter(Classroom);