import React from "react";
import { withRouter } from "react-router-dom";

import { setStorageItem, getStorageItem, removeStorageItem } from "../config/Config";

import Api from "../config/Api";

import "../styles/login.css";

import IconImage from "../assets/login-icon.svg";
import Popup from "../components/Popup";

class Login extends React.Component {

    state = {
        email: "",
        password: "",

        popup: false,
        loading: false,
        title: "Nesprávne heslo"
    }

    constructor() {
        super();

        this.login = this.login.bind(this);
    }

    async login() {
        this.setState({ popup: true, loading: true });

        const { email, password } = this.state;

        const login = await Api.login({
            email: email,
            password: password
        });

        if (login.token) {
            this.setState({ popup: false });
            setStorageItem("token", login.token);
            this.props.history.push("/dashboard");
        } else {
            this.setState({ loading: false, title: login.message });
        }
    }

    componentDidMount() {
        const token = getStorageItem("token");

        if (token) {
            this.props.history.push("/dashboard");
        }
    }

    render() {
        return(
            <div className="screen" id="login">
                <div className="icon-panel">
                    <img className="icon" src={IconImage} />
                </div>

                <div className="login-panel">
                    <div className="title">Login to EduLabs</div>
                    <div className="text">
                        EduLabs is a platform students as well as teachers love for its simplicity yet powerful features.
                    </div>

                    <input className="input" type="text" value={this.state.email} placeholder="E-mail" onChange={(event) => this.setState({ email: event.target.value })} />
                    <input className="input" type="password" value={this.state.password} placeholder="Password" onChange={(event) => this.setState({ password: event.target.value })} />

                    <br />

                   <div className="button" onClick={() => this.login()}>Login</div>
                </div>

                {this.state.popup ? (
                    <Popup
                        loading={this.state.loading}
                        title={this.state.title}
                        close={() => this.setState({ popup: false })}
                    />
                ) : null}
            </div>
        )
    }
}

export default withRouter(Login);