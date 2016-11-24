import {Meteor} from "meteor/meteor";
import {check} from "meteor/check";
import {Roles} from "meteor/alanning:roles";

Meteor.methods({
    changeEmail(email) {
        check(email, String);

        if (email === '') throw new Meteor.Error("email empty", "Email must not be empty!");
        else {
            Accounts.addEmail(this.userId, email, false, (error) => {
                if (error) throw new Meteor.Error(error.error, error.reason);
            });
            Accounts.removeEmail(this.userId, Meteor.user().emails[0].address, (error) => {
                if (error) throw new Meteor.Error(error.error, error.reason);
            });
            Accounts.sendVerificationEmail(this.userId, email, (error) => {
                if (error) throw new Meteor.Error(error.error, error.reason);
            });
        }
    },
    sendVerificationEmail(email) {
        check(email, String);
        Accounts.sendVerificationEmail(this.userId, email, function (error) {
            if (error) {
                throw new Meteor.Error(error.error, error.reason);
            }
        })
    },
    makeAdmin(userId) {
        check(userId, String);
        if (Roles.userIsInRole(this.userId, 'admin')) Roles.setUserRoles(userId, 'admin');
    },
    makeNormal(userId) {
        check(userId, String);
        if (Roles.userIsInRole(this.userId, 'admin') && this.userId !== userId) Roles.setUserRoles(userId, 'normal');
    },
    createUserNormal(userId) {
        if (Roles.getUsersInRole('admin').fetch().length === 0) Roles.setUserRoles(userId, 'admin');
        else Roles.setUserRoles(userId, 'normal');
    },
    removeUser(userId) {
        check(userId, String);
        if (Roles.userIsInRole(this.userId, 'admin') && this.userId !== userId) Meteor.users.remove(userId);
    }
});

if (Meteor.isServer) {
    Meteor.publish('allUsers', function () {
        if (Roles.userIsInRole(this.userId, ['admin'])) {
            return Meteor.users.find({}, {fields: {services: 0}});
        }
    });
}

// Don't let people write arbitrary data to their 'profile' field from the client
Meteor.users.deny({
    update() {
        return true;
    },
});

Accounts.validateNewUser((user) => {
    if (Roles.userIsInRole(this.userId, 'admin') || Roles.getUsersInRole('admin').fetch().length === 0 || AppSettings.findOne({}).allowRegistration) {
        return true;
    }

    throw new Meteor.Error(403, "Not authorized to create new users");
});