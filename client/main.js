import {Meteor} from "meteor/meteor";
import {render} from "react-dom";
import Routes from "../imports/startup/client/routes.jsx";

Meteor.startup(() => {
    render(Routes(), document.getElementById('app'));
});