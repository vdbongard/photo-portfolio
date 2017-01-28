import React from "react";
import {Accounts} from "meteor/accounts-base";
import {browserHistory} from "react-router";
import {validateEmail} from "../../startup/helper";
import {Roles} from "meteor/alanning:roles";

export default class Register extends React.Component {

    onSubmit_registerForm = (event) => {
        event.preventDefault();

        const email = this.registerEmail.value.trim();
        const password = this.registerPassword.value;
        const confirmPassword = this.confirmPassword.value;

        if (email === '') console.log("Email must not be empty!");
        else if (password === '') console.log("Password must not be empty!");
        else if (password !== confirmPassword) console.log("Passwords don't match!");
        else if (!validateEmail(email)) console.log("This is not a valid email address!");
        else {
            this.submitButton.disabled = true;
            Accounts.createUser({
                email,
                password
            }, (error) => {
                if (error) {
                    console.log(error);
                    this.submitButton.disabled = false;
                }
                else if (Meteor.userId()) {
                    Meteor.call('createUserNormal', Meteor.userId());
                    browserHistory.push("/photos");
                }
            });
        }
    };

    render() {
        return (
            <div className="register content">
                <div className="card hcenter mt2">
                    <h1 className="card-title">Register</h1>
                    <form id="registerForm" onSubmit={this.onSubmit_registerForm}>
                        <input type="email" ref={el => this.registerEmail = el} className="input" placeholder="Email"
                               required/>
                        <input type="password" ref={el => this.registerPassword = el} className="input"
                               placeholder="Password" required/>
                        <input type="password" ref={el => this.confirmPassword = el} className="input"
                               placeholder="Confirm Password"
                               required/>
                        <input type="submit" ref={el => this.submitButton = el} value="Register" className="btn-large"/>
                    </form>
                </div>

            </div>
        );
    }
}