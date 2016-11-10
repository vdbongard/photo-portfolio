import React, {Component} from 'react';
import {Accounts} from 'meteor/accounts-base';
import {Meteor} from 'meteor/meteor';

export default class ChangeEmail extends Component {
    componentWillUnmount() {
    }

    constructor(props) {
        super(props);

        this.changeEmail = this.changeEmail.bind(this);
    }

    changeEmail(e) {
        e.preventDefault();

        const currentPassword = this.refs.currentPassword.value;
        const email = this.refs.email.value;

        this.refs.email.value = '';
        this.refs.currentPassword.value = '';

        if (email === '') console.log("Email must not be empty!");
        else if (currentPassword === '') console.log("Password must not be empty!");
        else {
            Accounts.changePassword(currentPassword, currentPassword, (error) => {
                if (error) console.log(error);
                else {
                    Meteor.call('changeEmail', email, (error) => {
                        if (error) console.log(error);
                    });
                }
            });
        }
    }

    render() {
        return (
            <div className="changeEmail card">
                <h2 className="card-title">Change Email</h2>
                <form id="changeEmailForm" onSubmit={this.changeEmail}>
                    <input type="password" ref="currentPassword" className="input" placeholder="Current Password"
                           required/>
                    <input type="email" ref="email" className="input" placeholder="Email" required/>
                    <input type="submit" value="Change" className="btn-large"/>
                </form>
            </div>
        );
    }
}