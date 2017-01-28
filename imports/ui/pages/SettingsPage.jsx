import React from "react";
import SetEmail from "../components/ChangeEmail";
import SetPassword from "../components/ChangePassword";
import Settings from "../components/Settings";

export default () =>
    <div className="settings-page">
        <h1>Settings</h1>
        <div className="flex wrap">
            <Settings />
            <SetPassword />
            <SetEmail />
        </div>
    </div>;