import React from "react";
import {Accounts} from "meteor/accounts-base";
import {validateEmail} from "../../startup/helper";

export default class Password extends React.Component {

    onSubmit_forgotPasswordForm = (event) => {
        event.preventDefault();
        const email = this.forgotPasswordEmail.value.trim();
        if (email === '') console.log("Email must not be empty!");
        else if (!validateEmail(email)) console.log("This is not a valid email address!");
        else {
            this.submitButton.disabled = true;
            Accounts.forgotPassword({
                email
            }, (error) => {
                if (error) {
                    console.log(error);
                    this.submitButton.disabled = false;
                }
                else console.log("Reset password email has been sent!");
            });
        }
    };

    render() {
        return (
            <div className="password content">
                <div className="card hcenter mt2">
                    <h1 className="card-title">Forgot Password?</h1>
                    <form id="forgotPasswordForm" onSubmit={this.onSubmit_forgotPasswordForm}>
                        <input type="email" ref={el => this.forgotPasswordEmail = el} className="input"
                               placeholder="Email" required/>
                        <input type="submit" ref={el => this.submitButton = el} value="Send Password"
                               className="btn-large"/>
                    </form>
                </div>

            </div>
        );
    }
}