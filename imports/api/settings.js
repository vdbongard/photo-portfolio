import {Meteor} from "meteor/meteor";
import {Mongo} from "meteor/mongo";

const AppSettings = new Mongo.Collection('settings');

Meteor.methods({
    'settings.createDefault'() {
        if (AppSettings.findOne({}) == null) {
            AppSettings.insert({
                allowRegistration: false
            });
            console.log("insert default");
        }
    },
    'settings.toggleAllowRegistration'() {
        let ar = AppSettings.findOne({});
        if(Roles.userIsInRole(this.userId, 'admin')) AppSettings.update(ar._id, {$set: {allowRegistration: !ar.allowRegistration}});
    }
});

if (Meteor.isServer) {
    Meteor.publish('settings', function () {
        return AppSettings.find({});
    });
}

export default AppSettings;