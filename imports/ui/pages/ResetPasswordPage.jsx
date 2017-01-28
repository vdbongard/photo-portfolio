import React from "react";
import {Accounts} from "meteor/accounts-base";
import {browserHistory} from "react-router";

export default class ResetPassword extends React.Component {

    onSubmit_resetPasswordForm = (event) => {
        event.preventDefault();

        const password = this.resetPassword.value;
        const confirmPassword = this.resetPasswordConfirm.value;

        if (password === '') console.log("Password must not be empty!");
        else if (password !== confirmPassword) console.log("Passwords don't match!");
        else {
            Accounts.resetPassword(Accounts._resetPasswordToken, password, (error) => {
                if (error) console.log(error);
                else {
                    if (doneCallback) {
                        doneCallback();
                        doneCallback = null;
                    }
                    console.log("Your password has been changed. Welcome back!");
                    browserHistory.push("/photos");
                }
            });
        }
    };

    render() {
        return (
            <div className="reset-password">
                <div className="card">
                    <h1 className="card-title">Reset Password</h1>
                    <form id="resetPasswordForm" onSubmit={this.onSubmit_resetPasswordForm}>
                        <input type="password" ref={el => this.resetPassword = el} className="input"
                               placeholder="New password"
                               required/>
                        <input type="password" ref={el => this.resetPasswordConfirm = el} className="input"
                               placeholder="Confirm new password" required/>
                        <input type="submit" value="Change" className="btn-large"/>
                    </form>
                </div>
            </div>
        );
    }
}

let doneCallback;

Accounts.onResetPasswordLink((token, done) => {
    browserHistory.push("/reset");
    doneCallback = done;
});