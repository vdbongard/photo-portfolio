import React from "react";
import {Link} from "react-router";
import {Meteor} from "meteor/meteor";
import TrackerReact from "meteor/ultimatejs:tracker-react";

export default class Navigation extends TrackerReact(React.Component) {
    render() {
        return (
            <nav className="navigation">
                {
                    Meteor.user() ?
                    <div>
                        <Link to="/photos" activeClassName="active">Photos</Link>
                    </div>
                        :
                        <Link to="/login" activeClassName="active">Login</Link>
                }
            </nav>
        );
    }
}