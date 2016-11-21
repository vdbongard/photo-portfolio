import React from "react";
import {Link, browserHistory} from "react-router";
import {Meteor} from "meteor/meteor";

export default class Login extends React.Component {

    constructor(props) {
        super(props);

        this.onSubmit_loginForm = this.onSubmit_loginForm.bind(this);
    }

    onSubmit_loginForm(event) {
        event.preventDefault();
        const email = this.refs.loginEmail.value.trim();
        const password = this.refs.loginPassword.value;
        if (email !== '' && password !== '') {
            this.refs.submitButton.disabled = true;
            Meteor.loginWithPassword(email, password, function (error) {
                if (error) {
                    console.log(error);
                    this.refs.submitButton.disabled = false;
                }
                else {
                    if (Meteor.userId()) {
                        browserHistory.push("/photos");
                    }
                }
            });
        }
    }

    render() {
        return (
            <div className="login content">
                <div className="card hcenter">
                    <h1 className="card-title">Login</h1>
                    <form id="loginForm" onSubmit={this.onSubmit_loginForm}>
                        <input type="email" ref="loginEmail" className="input" placeholder="Email" required/>
                        <input type="password" ref="loginPassword" className="input" placeholder="Password" required/>
                        <input type="submit" ref="submitButton" value="Login" className="btn-large"/>
                        <div className="flex jc-sa">
                            <Link to="/register">Register</Link>
                            <Link to="/password">Forgot password?</Link>
                        </div>

                    </form>
                </div>
            </div>
        );
    }
}