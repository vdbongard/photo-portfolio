import React from "react";
import {Router, Route, browserHistory, IndexRoute} from "react-router";
import {Roles} from "meteor/alanning:roles";
import HeaderLayout from "../../ui/layouts/HeaderLayout";
import DashboardLayout from "../../ui/layouts/DashboardLayout";
import Home from "../../ui/pages/HomePage";
import Photos from "../../ui/pages/PhotosPage";
import Users from "../../ui/pages/UsersPage";
import Settings from "../../ui/pages/SettingsPage";
import AlbumPage from "../../ui/pages/AlbumPage";
import NotFound from "../../ui/pages/NotFoundPage";
import Login from "../../ui/pages/LoginPage";
import Register from "../../ui/pages/RegisterPage";
import Password from "../../ui/pages/PasswordPage";
import Verification from "../../ui/pages/VerificationPage.jsx";
import Reset from "../../ui/pages/ResetPasswordPage";
import AdminAuthentication from "../../ui/components/AdminAuthentication";

function requireAuth(nextState, replace) {
    if (!Meteor.userId()) {
        console.log("Not authorized!");
        replace({
            pathname: '/not-found',
            state: {nextPathname: nextState.location.pathname}
        });
    }
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

                <Route component={AdminAuthentication}>
                    <Route path="users" component={Users}/>
                    <Route path="settings" component={Settings}/>
                </Route>

                <Route path="album/:albumId" component={AlbumPage}/>
            </Route>
            <Route path="*" component={NotFound}/>
        </Route>
    </Router>
);
