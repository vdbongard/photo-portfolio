import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';
import {check} from 'meteor/check';
import {Roles} from 'meteor/alanning:roles';

import Images from './images';

const Albums = new Mongo.Collection('albums');

Meteor.methods({
    'albums.create'(name) {
        check(name, String);
        if (Roles.userIsInRole(this.userId, 'admin')) {
            Albums.insert({
                name: name
            });
        } else throw new Meteor.Error(403, "Not authorized to create album");
    }
});

if (Meteor.isServer) {
    Meteor.publish('albums', function () {
        if (Roles.userIsInRole(this.userId, ['admin', 'normal'])) {
            return Albums.find();
        }
    });
    Meteor.publish('albumWithImages', function (albumId) {
        if (Roles.userIsInRole(this.userId, ['admin', 'normal'])) {
            return [
                Albums.find({_id: albumId}),
                Images.find({"meta.album": albumId}).cursor
            ];
        }
    })
}

export default Albums;