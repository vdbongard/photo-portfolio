import React from "react";
import {Accounts} from "meteor/accounts-base";
import {Session} from "meteor/session";
import {browserHistory, Link} from "react-router";
import TrackerReact from "meteor/ultimatejs:tracker-react";

export default class Verification extends TrackerReact(React.Component) {

    componentWillMount() {
        if (doneCallback){
            console.log("Calling doneCallback()");
            doneCallback();
            doneCallback = null;
        }
        setTimeout(()=> {
            if (this.props.location.pathname === '/verification') browserHistory.push("/photos");
        }, 10000);
    }

    render() {
        return (
            <div className="verification">
                <div className="card hcenter">
                    <h1 className="card-title tal">{Session.get('verification') || "Please click on a verification link!"}</h1>
                    <p>Redirection in 10 seconds or click <Link to="/photos">here</Link></p>
                </div>
            </div>
        );
    }
}

let doneCallback;

Accounts.onEmailVerificationLink((token, done) => {
    browserHistory.push("/verification");
    Accounts.verifyEmail(token, (error) => {
        if (error) {
            console.log(error);
            Session.set('verification', error.reason);
        }
        else {
            console.log("Verification successful");
            Session.set('verification', 'Verification successful');
        }
    });
    doneCallback = done;
});