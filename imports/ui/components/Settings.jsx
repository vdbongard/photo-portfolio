import React from "react";
import Toggle from "./Toggle";
import TrackerReact from "meteor/ultimatejs:tracker-react";
import AppSettings from "/imports/api/settings";

export default class Settings extends TrackerReact(React.Component) {

    constructor(props) {
        super(props);

        this.state = {
            subscription: {
                settings: Meteor.subscribe('settings')
            }
        };

        this.allowRegistration = this.allowRegistration.bind(this);
    }

    componentWillUnmount() {
        this.state.subscription.settings.stop();
    }

    allowRegistration() {
        Meteor.call('settings.toggleAllowRegistration');
    }

    render() {
        let allowRegistration = AppSettings.findOne({}) && AppSettings.findOne({}).allowRegistration;

        if (!this.state.subscription.settings.ready()) return null;

        return (
            <div className="settings card">
                <h2 className="card-title">Settings</h2>
                <div className="setting flex between">
                    Allow Registrations? <Toggle onChange={this.allowRegistration} checked={allowRegistration}/>
                </div>
            </div>
        );
    }
}