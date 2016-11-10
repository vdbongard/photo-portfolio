import React from 'react';
import ReactDOM from 'react-dom';
import {Accounts} from 'meteor/accounts-base';
import {browserHistory} from 'react-router';
// import TrackerReact from 'meteor/ultimatejs:tracker-react';

// do i need tracker react here?? why is it here??
// export default class ResetPassword extends TrackerReact(Component) {
export default class ResetPassword extends React.Component {

    constructor(props) {
        super(props);

        this.onSubmit_resetPasswordForm = this.onSubmit_resetPasswordForm.bind(this);
    }

    onSubmit_resetPasswordForm(event) {
        event.preventDefault();
        const password = ReactDOM.findDOMNode(this.refs.resetPassword).value;
        const confirmPassword = ReactDOM.findDOMNode(this.refs.resetPasswordConfirm).value;

        if (password === '') console.log("Password must not be empty!");
        else if (password !== confirmPassword) console.log("Passwords don't match!");
        else {
            Accounts.resetPassword(Accounts._resetPasswordToken, password, (error)=> {
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
    }

    render() {
        return (
            <div className="reset-password">
                <div className="card">
                    <h1 className="card-title">Reset Password</h1>
                    <form id="resetPasswordForm" onSubmit={this.onSubmit_resetPasswordForm}>
                        <input type="password" ref="resetPassword" className="input" placeholder="New password" required/>
                        <input type="password" ref="resetPasswordConfirm" className="input"
                               placeholder="Confirm new password" required/>
                        <input type="submit" value="Change" className="btn-large"/>
                    </form>
                </div>
            </div>
        );
    }
}

var doneCallback;

Accounts.onResetPasswordLink((token, done) => {
    browserHistory.push("/reset");
    doneCallback = done;
});