import React from "react";
import {Accounts} from "meteor/accounts-base";
import {browserHistory} from "react-router";
import {validateEmail} from "../../startup/helper";
import {Roles} from "meteor/alanning:roles";

export default class Register extends React.Component {

    constructor(props) {
        super(props);

        this.onSubmit_registerForm = this.onSubmit_registerForm.bind(this);
    }

    onSubmit_registerForm(event) {
        event.preventDefault();
        const email = this.refs.registerEmail.value.trim();
        const password = this.refs.registerPassword.value;
        const confirmPassword = this.refs.confirmPassword.value;
        if (email === '') console.log("Email must not be empty!");
        else if (password === '') console.log("Password must not be empty!");
        else if (password !== confirmPassword) console.log("Passwords don't match!");
        else if (!validateEmail(email)) console.log("This is not a valid email address!");
        else {
            Accounts.createUser({
                email,
                password
            }, (error) => {
                if (error) console.log(error);
                else if (Meteor.userId()) {
                    Meteor.call('createUserNormal', Meteor.userId());
                    browserHistory.push("/photos");
                }
            });
        }
    }

    render() {
        return (
            <div className="register content">
                <div className="card hcenter">
                    <h1 className="card-title">Register</h1>
                    <form id="registerForm" onSubmit={this.onSubmit_registerForm}>
                        <input type="email" ref="registerEmail" className="input" placeholder="Email" required/>
                        <input type="password" ref="registerPassword" className="input" placeholder="Password" required/>
                        <input type="password" ref="confirmPassword" className="input" placeholder="Confirm Password"
                               required/>
                        <input type="submit" value="Register" className="btn-large"/>
                    </form>
                </div>

            </div>
        );
    }
}