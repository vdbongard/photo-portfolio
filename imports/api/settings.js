import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';
import {check} from 'meteor/check';

const AppSettings = new Mongo.Collection('settings');

if (Meteor.isServer) {
    Meteor.publish('settings', function () {
        return AppSettings.find({});
    });
}

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

export default AppSettings;