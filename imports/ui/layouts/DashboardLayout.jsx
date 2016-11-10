import React from 'react';
import Sidebar from '../components/Sidebar';

export default class DashboardLayout extends React.Component {

    render() {
        return (
            <div id="dashboard-layout">
                <Sidebar />
                <div className="content">
                    {this.props.children}
                </div>
            </div>
        );
    }
}