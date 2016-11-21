import React from "react";
import {browserHistory} from "react-router";
import {Meteor} from "meteor/meteor";
import TrackerReact from "meteor/ultimatejs:tracker-react";
import {Roles} from "meteor/alanning:roles";

export default class Authentication extends TrackerReact(React.Component) {

    constructor(props) {
        super(props);

        if (Roles.subscription.ready() && !Roles.userIsInRole(Meteor.userId(), 'admin')) {
            browserHistory.replace("/notfound");
        }
    }

    componentWillUpdate() {
        if (Roles.subscription.ready() && !Roles.userIsInRole(Meteor.userId(), 'admin')) {
            browserHistory.replace("/notfound");
        }
    }

    render() {
        // force TrackerReact to rerender and call react lifecycle hooks
        if (Roles.subscription.ready() && !Roles.userIsInRole(Meteor.userId(), 'admin')) {
        }

        return (
            <div>
                {this.props.children}
            </div>
        );
    }
}