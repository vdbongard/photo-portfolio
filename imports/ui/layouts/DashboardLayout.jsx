import React from "react";
import Sidebar from "./Sidebar";

export default ({children}) =>
    <div id="dashboard-layout">
        <Sidebar className="hide-on-small-only"/>
        <div className="content">
            {children}
        </div>
    </div>