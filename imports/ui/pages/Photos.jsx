import React from 'react';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import {Roles} from 'meteor/alanning:roles';

import Album from '../components/Album';

import Images from '../../api/images';
import Albums from '../../api/albums';

export default class Photos extends TrackerReact(React.Component) {

    constructor(props) {
        super(props);

        this.state = {
            subscription: {
                images: Meteor.subscribe('images'),
                albums: Meteor.subscribe('albums')
            }
        };

        this.getAlbumImages = this.getAlbumImages.bind(this);
        this.removeImage = this.removeImage.bind(this);
        this.getAlbums = this.getAlbums.bind(this);
    }

    componentWillUnmount() {
        this.state.subscription.images.stop();
        this.state.subscription.albums.stop();
    }

    getAlbumImages(albumId) {
        return Images.find({"meta.album": albumId}).fetch();
    }

    removeImage(id) {
        Meteor.call('images.remove', {_id: id}, (error)=> {
            error && console.log(error);
        });
    }

    getAlbums() {
        return Albums.find({});
    }

    render() {
        const albums = this.getAlbums();
        const disableRemove = !Roles.userIsInRole(Meteor.userId(), 'admin');

        if(!this.state.subscription.images.ready()||!this.state.subscription.albums.ready()) return <div className="photos-page"></div>;
        return (
            <div className="photos-page">
                {albums.map((album) => {
                    return (
                        <Album title={album.name} images={this.getAlbumImages(album._id)} removeImage={this.removeImage}
                               key={album._id} albumId={album._id} disableRemove={disableRemove}/>
                    )
                })}
                <Album title="Others" images={this.getAlbumImages(null)} removeImage={this.removeImage}/>
                <div className="btn-fab">+</div>
            </div>
        );
    }
}