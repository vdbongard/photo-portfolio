import React from 'react';
import {Meteor} from 'meteor/meteor';
import ReactDOM from 'react-dom';

import {routes} from '../imports/startup/client/routes.jsx';

Meteor.startup(() => {
    ReactDOM.render(routes(), document.getElementById('app'));
});