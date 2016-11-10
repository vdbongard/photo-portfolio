import React from 'react';
import {Accounts} from 'meteor/accounts-base';
import {Meteor} from 'meteor/meteor';

export default class ChangePassword extends React.Component {
    componentWillUnmount() {
    }

    constructor(props) {
        super(props);

        this.changePassword = this.changePassword.bind(this);
    }

    changePassword(e) {
        e.preventDefault();

        const currentPassword = this.refs.currentPassword.value;
        const password = this.refs.password.value;
        const confirmPassword = this.refs.confirmPassword.value;

        this.refs.currentPassword.value = '';
        this.refs.password.value = '';
        this.refs.confirmPassword.value = '';

        if (password === '') console.log("Password must not be empty!");
        else if (password !== confirmPassword) console.log("Passwords must be equal!");
        else
            Accounts.changePassword(currentPassword, password, (error) => {
                if (error) console.log(error);
                else console.log("Your password has been changed!");

            });
    }

    render() {
        return (
            <div className="changePassword card">
                <h2 className="card-title">Change Password</h2>
                <form id="changePasswordForm" onSubmit={this.changePassword}>
                    <input type="password" ref="currentPassword" className="input" placeholder="Current Password"
                           required/>
                    <input type="password" ref="password" className="input" placeholder="New Password" required/>
                    <input type="password" ref="confirmPassword" className="input" placeholder="Confirm New Password"
                           required/>
                    <input type="submit" value="Change" className="btn-large"/>
                </form>
            </div>
        );
    }
}