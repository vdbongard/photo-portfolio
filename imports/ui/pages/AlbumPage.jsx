import React from "react";
import TrackerReact from "meteor/ultimatejs:tracker-react";
import Album from "../components/Album";
import Images from "../../api/images";
import Albums from "../../api/albums";

export default class AlbumPage extends TrackerReact(React.Component) {

    constructor(props) {
        super(props);

        this.state = {
            subscription: {
                albumWithImages: Meteor.subscribe('albumWithImages', this.props.params.albumId)
            }
        };
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.params.albumId !== nextProps.params.albumId) {
            this.state.subscription.albumWithImages.stop();
            this.setState({
                subscription: {
                    albumWithImages: Meteor.subscribe('albumWithImages', nextProps.params.albumId)
                }
            });
        }
    }

    componentWillUnmount() {
        this.state.subscription.albumWithImages.stop();
    }

    getImages() {
        return Images.find({}).fetch();
    }

    removeImage(id) {
        Meteor.call('images.remove', {_id: id}, (error)=> {
            error && console.log(error);
        });
    }

    getAlbum = () => {
        return Albums.findOne({_id: this.props.params.albumId});
    };

    onChange = (e) => {
        e.preventDefault();

        let self = this;

        if (e.currentTarget.files && e.currentTarget.files[0]) {
            _.each(e.currentTarget.files, function(file) {
                let upload = Images.insert({
                    file: file,
                    streams: 'dynamic',
                    chunkSize: 'dynamic',
                    meta: {
                        album: self.props.params.albumId
                    }
                }, false);

                upload.on('start', function () {
                    console.log(this);
                });

                upload.on('end', function (error, fileObj) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('File "' + fileObj.name + '" successfully uploaded');
                    }
                });

                upload.start();
            });
        }
    };

    render() {
        if (!this.state.subscription.albumWithImages.ready()) return null;

        const album = this.getAlbum();
        const images = this.getImages();
        return (
            <div className="albumPage">
                <Album title={album && album.name} images={images} removeImage={this.removeImage}
                       albumId={this.props.params.albumId} showSettings/>
                <label htmlFor="uploadToAlbum" className="btn-fab">+
                    <input multiple type="file" id="uploadToAlbum" className="hidden" onChange={this.onChange}/>
                </label>
            </div>
        );
    }
}