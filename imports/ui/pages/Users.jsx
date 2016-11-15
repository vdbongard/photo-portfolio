import React, {Component} from "react";
import TrackerReact from "meteor/ultimatejs:tracker-react";
import User from "../components/User";

export default class Users extends TrackerReact(Component) {

    constructor(props) {
        super(props);

        this.state = {
            subscription: {
                users: Meteor.subscribe('allUsers'),
            }
        };
    }

    componentWillUnmount() {
        this.state.subscription.users.stop();
    }

    renderUsers() {
        let allUsers = Meteor.users.find({}).fetch();
        return allUsers.map((user) => {
            return <User user={user} key={user._id}/>
        });
    }

    render() {
        if (!this.state.subscription.users.ready()) return null;
        return (
            <div className="users">
                <h1>Users</h1>
                <div className="table-wrapper">
                    <table>
                        <thead>
                        <tr>
                            <th>Email Address</th>
                            <th>Role</th>
                            <th>Created At</th>
                            <th>Remove</th>
                        </tr>
                        </thead>
                        <tbody>
                        {this.renderUsers()}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}