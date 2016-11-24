import {Meteor} from "meteor/meteor";
import {Accounts} from "meteor/accounts-base";
import "../imports/api/users";
import "../imports/api/settings";
import "../imports/api/images";
import "../imports/api/albums";

Meteor.startup(() => {
    process.env.MAIL_URL = Meteor.settings.MAIL_URL;

    Accounts.config({
        sendVerificationEmail: true
    });

    Meteor.call('settings.createDefault');
});