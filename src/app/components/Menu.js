import React from "react";
import { Link, useLocation, useHistory, withRouter } from "react-router-dom";

import { setStorageItem, getStorageItem, removeStorageItem, logout } from "../config/Config";
import { hideMenu } from "./Header";

import Api from "../config/Api";

import "../styles/menu.css";

class Menu extends React.Component {

    state = {
        isAdmin: false,
        role: ""
    }

    constructor() {
        super();

        this.getUserPermissions = this.getUserPermissions.bind(this);
        this.isOpened = this.isOpened.bind(this);
        this.isAdminOpened = this.isAdminOpened.bind(this);
    }

    async getUserPermissions() {
        const token = getStorageItem("token");
        const call = await Api.getUser(token);

        if (call.user) {
            this.setState({
                isAdmin: call.user.admin === 1 ? true : false,
                role: call.user.role
            });
        }
    }

    isOpened(category) {
        if (this.props.location.pathname.includes(category)) return true;

        return false;
    }

    isAdminOpened() {
        if (this.props.location.pathname.includes("admin")) return true;

        return false;
    }

    componentDidMount() {
        this.getUserPermissions();
    }

    render() {
        return(
            <div id="menu">
                <div className="border" />

                <div className="logo">EduLabs</div>

                <div className="navigation">
                    <Link className="item" to="/dashboard" onClick={() => window.innerWidth < 1000 ? hideMenu() : null}>
                        <ion-icon name="school-outline" style={this.isOpened("dashboard") ? { color: "#5E81F4" } : null}></ion-icon>
                        <div className="title" style={this.isOpened("dashboard") ? { color: "#383838" } : null}>Dashboard</div>
                        <div style={{ flex: 1 }} />
                        <div className="selector" style={this.isOpened("dashboard") ? { opacity: 1 } : { opacity: 0 }} />
                    </Link>

                    <Link className="item" to="/subjects" onClick={() => window.innerWidth < 1000 ? hideMenu() : null}>
                        <ion-icon name="albums-outline" style={this.isOpened("subjects") && !this.isAdminOpened() ? { color: "#5E81F4" } : null}></ion-icon>
                        <div className="title" style={this.isOpened("subjects") && !this.isAdminOpened() ? { color: "#383838" } : null}>Subjects</div>
                        <div style={{ flex: 1 }} />
                        <div className="selector" style={this.isOpened("subjects") && !this.isAdminOpened() ? { opacity: 1 } : { opacity: 0 }} />
                    </Link>

                    {this.state.role === "student" ? (
                        <Link className="item" to="/grades" onClick={() => window.innerWidth < 1000 ? hideMenu() : null}>
                            <ion-icon name="list-outline" style={this.isOpened("grades") && !this.isAdminOpened() ? { color: "#5E81F4" } : null}></ion-icon>
                            <div className="title" style={this.isOpened("grades") && !this.isAdminOpened() ? { color: "#383838" } : null}>Grades</div>
                            <div style={{ flex: 1 }} />
                            <div className="selector" style={this.isOpened("grades") && !this.isAdminOpened() ? { opacity: 1 } : { opacity: 0 }} />
                        </Link>
                    ) : null}

                    <div style={{ flex: 1 }} />

                    {this.state.isAdmin ? (
                        <Link className="item" to="/admin" onClick={() => window.innerWidth < 1000 ? hideMenu() : null}>
                            <ion-icon name="cube-outline" style={this.isOpened("admin") ? { color: "#5E81F4" } : null}></ion-icon>
                            <div className="title" style={this.isOpened("admin") ? { color: "#383838" } : null}>Admin</div>
                            <div style={{ flex: 1 }} />
                            <div className="selector" style={this.isOpened("admin") ? { opacity: 1 } : { opacity: 0 }} />
                        </Link>
                    ) : null}

                    <div className="item" onClick={() => {
                        logout();
                        this.props.history.push("/")
                    }}>
                        <ion-icon name="exit-outline"></ion-icon>
                        <div className="title">Logout</div>
                        <div style={{ flex: 1 }} />
                        {/*<div className="selector" style={location.pathname === "/profile" ? { opacity: 1 } : { opacity: 0 }} />*/}
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(Menu);