import React from "react";
import Sidebar from "./Sidebar";

const DashboardLayout = ({children}) =>
    <div id="dashboard-layout">
        <Sidebar className="hide-on-small-only"/>
        <div className="content">
            {children}
        </div>
    </div>

export default DashboardLayout;