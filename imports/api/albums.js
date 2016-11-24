import {Meteor} from "meteor/meteor";
import {Mongo} from "meteor/mongo";
import {check} from "meteor/check";
import {Roles} from "meteor/alanning:roles";
import Images from "./images";

Meteor.methods({
    'album.create'(name) {
        check(name, String);
        if (Roles.userIsInRole(this.userId, 'admin')) {
            return albumId = Albums.insert({
                name: name
            }, (error) => {
                error && console.log(error);
            });
        } else throw new Meteor.Error(403, "Not authorized to create album");
    },
    'album.remove'(albumId) {
        check(albumId, String);
        if (Roles.userIsInRole(this.userId, 'admin')) {
            Albums.remove({
                _id: albumId
            }, (error) => {
                error && console.log(error);
            });
            Meteor.call('images.removeAlbum', albumId, (error) => {
                error && console.log(error);
            });
        } else throw new Meteor.Error(403, "Not authorized to remove album");
    },
    'album.rename'(albumId, name) {
        check(albumId, String);
        check(name, String);
        if (Roles.userIsInRole(this.userId, 'admin')) {
            Albums.update({
                _id: albumId
            }, {
                name: name
            }, (error) => {
                error && console.log(error);
            });
        } else throw new Meteor.Error(403, "Not authorized to rename album");
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

const Albums = new Mongo.Collection('albums');

export default Albums;