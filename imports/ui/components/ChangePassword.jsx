import React from "react";
import {Accounts} from "meteor/accounts-base";

export default class ChangePassword extends React.Component {

    changePassword = (e) => {
        e.preventDefault();

        const currentPassword = this.currentPassword.value;
        const password = this.password.value;
        const confirmPassword = this.confirmPassword.value;

        if (password === '') console.log("Password must not be empty!");
        else if (password !== confirmPassword) console.log("Passwords must be equal!");
        else {
            Accounts.changePassword(currentPassword, password, (error) => {
                if (error) console.log(error);
                else {
                    this.currentPassword.value = '';
                    this.password.value = '';
                    this.confirmPassword.value = '';
                    console.log("Your password has been changed!");
                }
            });
        }
    };

    render() {
        return (
            <div className="changePassword card">
                <h2 className="card-title">Change Password</h2>
                <form id="changePasswordForm" onSubmit={this.changePassword}>
                    <input type="password" ref={el => this.currentPassword = el} className="input"
                           placeholder="Current Password"
                           required/>
                    <input type="password" ref={el => this.password = el} className="input" placeholder="New Password"
                           required/>
                    <input type="password" ref={el => this.confirmPassword = el} className="input"
                           placeholder="Confirm New Password"
                           required/>
                    <input type="submit" value="Change" className="btn-large"/>
                </form>
            </div>
        );
    }
}