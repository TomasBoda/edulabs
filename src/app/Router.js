import React from "react";
import { BrowserRouter, Switch, Route, Link } from "react-router-dom";

import Menu from "./components/Menu";

import Admin from "./screens/Admin";
import AdminClassrooms from "./screens/admin/AdminClassrooms";
import AdminClassroom from "./screens/admin/AdminClassroom";
import AdminUser from "./screens/admin/AdminUser";
import AdminStudents from "./screens/admin/AdminStudents";
import AdminTeachers from "./screens/admin/AdminTeachers";
import AdminSubjects from "./screens/admin/AdminSubjects";

import Login from "./screens/Login";
import Dashboard from "./screens/Dashboard";

import Classrooms from "./screens/Classrooms";
import Classroom from "./screens/Classroom";

import Subjects from "./screens/Subjects";
import Subject from "./screens/Subject";

import Grades from "./screens/Grades";

import "./styles/config.css";

export default function Router() {
    return(
        <BrowserRouter basename="/">
            <div className="container">
                <Switch>
                    <Route exact path="/"><Login /></Route>

                    <div className="container">
                        <Menu />
                        
                        <Route exact path="/dashboard"><Dashboard /></Route>

                        <Route exact path="/subjects"><Subjects /></Route>
                        <Route exact path="/subjects/:id"><Subject /></Route>
                        <Route exact path="/subjects/:id/classrooms"><Classrooms /></Route>
                        <Route exact path="/subjects/:id/classrooms/:classroomId"><Classroom /></Route>

                        <Route exact path="/grades"><Grades /></Route>

                        <Route exact path="/admin"><Admin /></Route>
                        <Route exact path="/admin/classrooms"><AdminClassrooms /></Route>
                        <Route exact path="/admin/classrooms/:id"><AdminClassroom /></Route>
                        <Route exact path="/admin/users/:id"><AdminUser /></Route>

                        <Route exact path="/admin/students"><AdminStudents /></Route>
                        <Route exact path="/admin/teachers"><AdminTeachers /></Route>

                        <Route exact path="/admin/subjects"><AdminSubjects /></Route>
                    </div>
                </Switch>
            </div>
        </BrowserRouter>
    )
}