import React from "react";
import {Accounts} from "meteor/accounts-base";
import {Meteor} from "meteor/meteor";

export default class ChangeEmail extends React.Component {

    changeEmail = (e) => {
        e.preventDefault();

        const currentPassword = this.currentPassword.value;
        const email = this.email.value;

        if (email === '') console.log("Email must not be empty!");
        else if (currentPassword === '') console.log("Password must not be empty!");
        else {
            Accounts.changePassword(currentPassword, currentPassword, (error) => {
                if (error) console.log(error);
                else {
                    this.email.value = '';
                    this.currentPassword.value = '';
                    Meteor.call('changeEmail', email, (error) => {
                        if (error) console.log(error);
                    });
                }
            });
        }
    };

    render() {
        return (
            <div className="changeEmail card">
                <h2 className="card-title">Change Email</h2>
                <form id="changeEmailForm" onSubmit={this.changeEmail}>
                    <input type="password" ref={el => this.currentPassword = el} className="input"
                           placeholder="Current Password"
                           required/>
                    <input type="email" ref={el => this.email = el} className="input" placeholder="Email" required/>
                    <input type="submit" value="Change" className="btn-large"/>
                </form>
            </div>
        );
    }
}