import React from 'react';
import {Accounts} from 'meteor/accounts-base';
import {browserHistory} from 'react-router';
import {validateEmail} from '../../startup/helper';

export default class Password extends React.Component {

    constructor(props) {
        super(props);

        this.onSubmit_forgotPasswordForm = this.onSubmit_forgotPasswordForm.bind(this);
    }

    onSubmit_forgotPasswordForm(event) {
        event.preventDefault();
        const email = this.refs.forgotPasswordEmail.value.trim();
        if (email === '') console.log("Email must not be empty!");
        else if (!validateEmail(email)) console.log("This is not a valid email address!");
        else {
            Accounts.forgotPassword({
                email
            }, (error) => {
                if (error) console.log(error);
                else console.log("Reset password email has been sent!");
            });
        }

    }

    render() {
        return (
            <div className="password content">
                <div className="card hcenter">
                    <h1 className="card-title">Forgot Password?</h1>
                    <form id="forgotPasswordForm" onSubmit={this.onSubmit_forgotPasswordForm}>
                        <input type="email" ref="forgotPasswordEmail" className="input" placeholder="Email" required/>
                        <input type="submit" value="Send Password" className="btn-large"/>
                    </form>
                </div>

            </div>
        );
    }
}