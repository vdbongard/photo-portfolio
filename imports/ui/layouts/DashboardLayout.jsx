import React from "react";
import Sidebar from "./Sidebar";

export default class DashboardLayout extends React.Component {

    render() {
        return (
            <div id="dashboard-layout">
                <div className="hide-on-small-only">
                    <Sidebar />
                </div>
                <div className="content">
                    {this.props.children}
                </div>
            </div>
        );
    }
}