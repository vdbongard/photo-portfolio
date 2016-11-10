import {Meteor} from 'meteor/meteor';
import {Roles} from 'meteor/alanning:roles';
import { FilesCollection } from 'meteor/ostrio:files';

import createThumbnails from '../startup/createThumbnails.js';

let knox, bound, client, Request, cfdomain = {};

if (Meteor.isServer) {
    // Fix CloudFront certificate issue
    // Read: https://github.com/chilts/awssum/issues/164
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

    knox    = Npm.require('knox');
    Request = Npm.require('request');
    bound = Meteor.bindEnvironment(function(callback) {
        return callback();
    });
    cfdomain = 'https://dm26im48b5fvp.cloudfront.net'; // <-- Change to your Cloud Front Domain
    client = knox.createClient(Meteor.settings.aws.s3);
}

const Images = new FilesCollection({
    debug: false, // Change to `true` for debugging
    throttle: false,
    storagePath: 'assets/app/uploads/uploadedFiles',
    collectionName: 'images',
    allowClientCode: false,
    onBeforeUpload: function (file) {
        // Allow upload files under 40MB, and only in png/jpg/jpeg formats
        if (file.size <= 41943040 && /png|jpg|jpeg/i.test(file.ext) && Roles.userIsInRole(this.userId, 'admin')) {
            return true;
        } else {
            return 'Please upload image, with size equal or less than 10MB';
        }
    },
    onBeforeRemove: function () {
        // Allow removal only if
        // current user is signed-in
        // and has role is `admin`
        return Roles.userIsInRole(this.userId, 'admin');
    },
    onAfterUpload: function(fileRef) {
        // In onAfterUpload callback we will move file to AWS:S3
        let self = this;
        createThumbnails(Images, fileRef, ()=> {
            // get new updated file reference
            fileRef = Images.findOne({_id:fileRef._id});
            _.each(fileRef.versions, function(vRef, version) {
                // We use Random.id() instead of real file's _id
                // to secure files from reverse engineering
                // As after viewing this code it will be easy
                // to get access to unlisted and protected files
                let filePath = "images/" + version + "/" + (Random.id()) + "-" + version + "." + fileRef.extension;
                let upload = client.putFile(vRef.path, filePath, function(error, res) {
                    bound(function() {
                        let upd;
                        if (error) {
                            console.error(error);
                        } else {
                            upd = {
                                $set: {},
                                // $unset: {}
                            };
                            upd['$set']["versions." + version + ".meta.pipeFrom"] = cfdomain + '/' + filePath;
                            upd['$set']["versions." + version + ".meta.pipePath"] = filePath;
                            // upd['$unset']["versions." + version + ".meta.progress"] = 1;
                            self.collection.update({
                                _id: fileRef._id
                            }, upd, function(error) {
                                if (error) {
                                    console.error(error);
                                } else {
                                    // Unlink original files from FS
                                    // after successful upload to AWS:S3
                                    self.unlink(self.collection.findOne(fileRef._id), version);
                                    // console.log(fileRef.name+ " " + version + " uploaded");
                                }
                            });
                        }
                    });
                });
                upload.on('progress', function(progress) {
                    bound(function() {
                        upd = {
                            $set: {}
                        };
                        upd['$set']["versions." + version + ".meta.progress"] = progress;
                        self.collection.update({
                            _id: fileRef._id
                        }, upd, function(error) {
                            if (error) {
                                console.error(error);
                            }
                        });
                    });
                });
            });
        });
    },
    interceptDownload: function(http, fileRef, version) {
        let path, ref, ref1, ref2;
        path = (ref = fileRef.versions) != null ? (ref1 = ref[version]) != null ? (ref2 = ref1.meta) != null ? ref2.pipeFrom : void 0 : void 0 : void 0;
        if (path) {
            // If file is moved to S3
            // We will pipe request to S3
            // So, original link will stay always secure
            Request({
                url: path,
                headers: _.pick(http.request.headers, 'range', 'accept-language', 'accept', 'cache-control', 'pragma', 'connection', 'upgrade-insecure-requests', 'user-agent')
            }).pipe(http.response);
            return true;
        } else {
            // While file is not yet uploaded to S3
            // We will serve file from FS
            return false;
        }
    }
});

if (Meteor.isServer) {
    // Intercept File's collection remove method
    // to remove file from S3
    let _origRemove = Images.remove;

    Images.remove = function (search) {
        let cursor = this.collection.find(search);
        cursor.forEach(function (fileRef) {
            _.each(fileRef.versions, function (vRef) {
                let ref;
                if (vRef != null ? (ref = vRef.meta) != null ? ref.pipePath : void 0 : void 0) {
                    client.deleteFile(vRef.meta.pipePath, function (error) {
                        bound(function () {
                            if (error) {
                                console.error(error);
                            }
                        });
                    });
                }
            });
        });
        // Call original method
        _origRemove.call(this, search);
    };
}

Meteor.methods({
    'images.remove'(search) {
        if(Roles.userIsInRole(this.userId, 'admin')) {
            Images.remove(search);
            return true;
        }
        throw new Meteor.Error(403, "Not authorized to remove images");
    }
});

if (Meteor.isServer) {
    Images.denyClient();

    Meteor.publish('images', function(){
        if(Roles.userIsInRole(this.userId, ['admin', 'normal'])) {
            return Images.find().cursor;
        }
    });
}

export default Images;