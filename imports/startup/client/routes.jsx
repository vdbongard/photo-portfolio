import React from 'react';
import {Router, Route, browserHistory, IndexRoute} from 'react-router';
import {Roles} from 'meteor/alanning:roles';

import HeaderLayout from '../../ui/layouts/HeaderLayout';
import DashboardLayout from '../../ui/layouts/DashboardLayout';

import Home from '../../ui/pages/Home';
import Photos from '../../ui/pages/Photos';
import Upload from '../../ui/pages/Upload';
import Users from '../../ui/pages/Users';
import Settings from '../../ui/pages/SettingsPage';
import AlbumPage from '../../ui/pages/AlbumPage';
import NotFound from '../../ui/pages/NotFound';
import Login from'../../ui/pages/Login';
import Register from'../../ui/pages/Register';
import Password from'../../ui/pages/Password';
import Verification from '../../ui/pages/Verification.jsx';
import Reset from '../../ui/pages/ResetPassword';

function requireAuth(nextState, replace) {
    if (!Meteor.userId()) forwardNotAuthorized(nextState, replace);
}

function requireAdmin(nextState, replace) {
    if(!Roles.userIsInRole(Meteor.userId(), 'admin')) forwardNotAuthorized(nextState, replace);
}

function forwardNotAuthorized(nextState, replace) {
    console.log("Not authorized!");
    replace({
        pathname: '/not-found',
        state: {nextPathname: nextState.location.pathname}
    });
}

export const routes = () => (
    <Router onUpdate={() => window.scrollTo(0, 0)} history={browserHistory}>
        <Route path="/" component={HeaderLayout}>
            <IndexRoute component={Home}/>
            <Route path="login" component={Login}/>
            <Route path="register" component={Register}/>
            <Route path="password" component={Password}/>
            <Route path="verification" component={Verification}/>
            <Route path="reset" component={Reset}/>

            <Route component={DashboardLayout} onEnter={requireAuth}>
                <Route path="photos" component={Photos}/>
                <Route path="upload" component={Upload} onEnter={requireAdmin}/>
                <Route path="users" component={Users} onEnter={requireAdmin}/>
                <Route path="settings" component={Settings} onEnter={requireAdmin}/>
                <Route path="album/:albumId" component={AlbumPage}/>
            </Route>

            <Route path="*" component={NotFound}/>
        </Route>
    </Router>
);
