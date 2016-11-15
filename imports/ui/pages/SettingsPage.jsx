import React, {Component} from "react";
import TrackerReact from "meteor/ultimatejs:tracker-react";
import SetEmail from "../components/ChangeEmail";
import SetPassword from "../components/ChangePassword";
import Settings from "../components/Settings";

export default class SettingsPage extends TrackerReact(React.Component) {

    render() {

        return (
            <div className="settings-page">
                <h1>Settings</h1>
                <div className="flex wrap">
                    <SetPassword />
                    <SetEmail />
                    <Settings />
                </div>
            </div>
        );
    }
}