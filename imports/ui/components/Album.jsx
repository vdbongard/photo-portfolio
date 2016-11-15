import React from "react";
import {Link} from "react-router";
import ProgressBar from "../components/ProgressBar";
import Images from "../../api/images";

export default class Album extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            images: this.props.images,
            isOpen: false,
            loading: true,
            error: false,
            hover: false,
            index: 0
        };

        this.removeImage = this.removeImage.bind(this);
        this.openImage = this.openImage.bind(this);
        this.closeImage = this.closeImage.bind(this);
        this.onLoad = this.onLoad.bind(this);
        this.onError = this.onError.bind(this);
        this.onDragOver = this.onDragOver.bind(this);
        this.onDragLeave = this.onDragLeave.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({images: nextProps.images});
    }

    removeImage(id) {
        if (Roles.userIsInRole(Meteor.userId(), 'admin')) {
            Meteor.call('images.remove', {_id: id}, (error) => {
                error && console.log(error);
            });
        }
    }

    openImage(index) {
        this.setState({
            isOpen: true,
            index: index
        });
        document.body.classList.add('noscroll');
    }

    closeImage() {
        this.setState({
            isOpen: false,
            loading: true,
            error: false
        });
        document.body.classList.remove('noscroll');
    }

    onLoad() {
        this.setState({loading: false});
    }

    onError() {
        this.setState({loading: false, error: true});
    }

    onDragOver() {
        if (!this.state.hover) {
            this.setState({hover: true});
        }
    }

    onDragLeave() {
        if (this.state.hover) {
            this.setState({hover: false});
        }
    }

    onChange(e) {
        e.preventDefault();

        let self = this;

        if (e.currentTarget.files && e.currentTarget.files[0]) {
            _.each(e.currentTarget.files, function (file) {
                let upload = Images.insert({
                    file: file,
                    streams: 'dynamic',
                    chunkSize: 'dynamic',
                    meta: {
                        album: self.props.albumId
                    }
                }, false);

                upload.on('start', function () {
                    // console.log(this);
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
        this.onDragLeave();
    }

    render() {
        let images = this.state.images;

        let lightbox__innerStyle = {};
        let imgUrl = images[this.state.index] && images[this.state.index].versions.preview && images[this.state.index].versions.preview.meta.pipeFrom;
        if (this.state.loading) {
            lightbox__innerStyle = {
                background: 'url(' + imgUrl + ') 50% no-repeat',
                backgroundSize: 'contain'
            };
        }

        return (
            <div className={this.state.hover ? "album hover" : "album"} onDragOver={this.onDragOver}>
                <Link to={"/album/" + this.props.albumId}><h2 className="album__title">{this.props.title}
                    <span>({images.length} photos)</span></h2></Link>
                <div className="album__pictures">
                    {images.length > 0 && images.map((image, index) => {
                        let awsUpload = image;
                        let awsProgress = [];
                        let progressbar;

                        if (awsUpload && awsUpload.versions) {
                            awsProgress[0] = awsUpload.versions.thumbnail40 && awsUpload.versions.thumbnail40.meta && awsUpload.versions.thumbnail40.meta.progress && awsUpload.versions.thumbnail40.meta.progress || 0;
                            awsProgress[1] = awsUpload.versions.preview && awsUpload.versions.preview.meta && awsUpload.versions.preview.meta.progress && awsUpload.versions.preview.meta.progress || 0;
                            awsProgress[2] = awsUpload.versions.original && awsUpload.versions.original.meta && awsUpload.versions.original.meta.progress && awsUpload.versions.original.meta.progress || 0;
                        }

                        let total = awsProgress[0].total + awsProgress[1].total + awsProgress[2].total;
                        let progress = Math.round(((awsProgress[0].written + awsProgress[1].written + awsProgress[2].written) / total) * 100);

                        if (awsProgress[0].percent + awsProgress[1].percent + awsProgress[2].percent < 300) {
                            progressbar = <ProgressBar progress={progress}>{progress}%</ProgressBar>;
                        }

                        return (
                            <div className="album__picture" key={image._id}>
                                <div className="album__picture__inner flex center">
                                    {image.versions.original.meta ?
                                        <img src={image.versions.preview.meta.pipeFrom} alt=""
                                             onClick={() => this.openImage(index)}/> : "uploading..."}

                                    {!this.props.disableRemove &&
                                    <i className="fa fa-times delete" onClick={() => this.removeImage(image._id)}></i>}

                                    {progressbar}
                                </div>
                            </div>
                        )
                    })}

                    {this.state.isOpen &&
                    <div className="lightbox" onClick={this.closeImage}>
                        <div className="lightbox__inner" style={lightbox__innerStyle}>
                            {this.state.error && "Error loading image"}
                            <img
                                src={images[this.state.index].versions.big ? images[this.state.index].versions.big.meta.pipeFrom : images[this.state.index].versions.original.meta.pipeFrom}
                                onLoad={this.onLoad} onError={this.onError}
                                className={(this.state.loading || this.state.error) ? "hidden" : ""}/>
                        </div>
                    </div>
                    }
                </div>
                {this.state.hover && <input multiple type="file" className="album__dropzone"
                                            onChange={this.onChange} onDragLeave={this.onDragLeave}/>}
            </div>
        )
    }
}