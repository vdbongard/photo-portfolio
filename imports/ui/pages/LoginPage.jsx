import React from "react";
import {Link, browserHistory} from "react-router";
import {Meteor} from "meteor/meteor";

export default class Login extends React.Component {

    onSubmit_loginForm = (event) => {
        event.preventDefault();

        const email = this.loginEmail.value.trim();
        const password = this.loginPassword.value;

        if (email !== '' && password !== '') {
            this.submitButton.disabled = true;
            Meteor.loginWithPassword(email, password, (error) => {
                if (error) {
                    console.log(error);
                    this.submitButton.disabled = false;
                }
                else if (Meteor.userId()) browserHistory.push("/photos");
            });
        }
    };

    render() {
        return (
            <div className="login content">
                <div className="card hcenter mt2">
                    <h1 className="card-title">Login</h1>
                    <form id="loginForm" onSubmit={this.onSubmit_loginForm}>
                        <input type="email" ref={el => this.loginEmail = el} className="input" placeholder="Email"
                               required/>
                        <input type="password" ref={el => this.loginPassword = el} className="input"
                               placeholder="Password" required/>
                        <input type="submit" ref={el => this.submitButton = el} value="Login" className="btn-large"/>
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