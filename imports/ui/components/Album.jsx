import React from "react";
import {browserHistory, Link} from "react-router";
import ProgressBar from "../components/ProgressBar";
import {RIEInput} from "riek";
import Images from "../../api/images";

export default class Album extends React.Component {

    static propTypes = {
        title: React.PropTypes.string,
        albumId: React.PropTypes.string,
        images: React.PropTypes.arrayOf(React.PropTypes.object),
        disableRemove: React.PropTypes.bool,
        showSettings: React.PropTypes.bool,
        albumTitleAsLink: React.PropTypes.bool
    };

    constructor(props) {
        super(props);

        this.state = {
            images: this.props.images,
            isOpen: false,
            loading: true,
            error: false,
            hover: false,
            index: 0,
            showSettings: false,
            albumTitle: this.props.title || ""
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({images: nextProps.images});
    }

    removeImage(id) {
        if (Roles.userIsInRole(Meteor.userId(), 'admin')) {
            Meteor.call('images.remove', id, (error) => {
                error && console.log(error);
            });
        }
    };

    openImage = (index) => {
        this.setState({
            isOpen: true,
            index: index
        });
        document.body.classList.add('noscroll');
    };

    closeImage = () => {
        this.setState({
            isOpen: false,
            loading: true,
            error: false
        });
        document.body.classList.remove('noscroll');
    };

    onLoad = () => {
        this.setState({loading: false});
    };

    onError = () => {
        this.setState({loading: false, error: true});
    };

    onDragOver = () => {
        if (!this.state.hover) {
            this.setState({hover: true, showSettings: false});
        }
    };

    onDragLeave = () => {
        if (this.state.hover) {
            this.setState({hover: false});
        }
    };

    onChange = (e) => {
        e.preventDefault();

        if (e.currentTarget.files && e.currentTarget.files[0]) {
            _.each(e.currentTarget.files, (file) => {
                let upload = Images.insert({
                    file: file,
                    streams: 'dynamic',
                    chunkSize: 'dynamic',
                    meta: {
                        album: this.props.albumId
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
    };

    renderImages = () => this.state.images.map((image, index) => {
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
                    <i className="fa fa-times delete" onClick={() => this.removeImage(image._id)}/>}

                    {progressbar}
                </div>
            </div>
        )
    });

    renderLightbox = () => {
        const images = this.state.images;

        let lightbox__innerStyle = {};
        let imgUrl = images[this.state.index] && images[this.state.index].versions.preview && images[this.state.index].versions.preview.meta.pipeFrom;
        if (this.state.loading) {
            lightbox__innerStyle = {
                background: 'url(' + imgUrl + ') 50% no-repeat',
                backgroundSize: 'contain'
            };
        }

        return this.state.isOpen &&
            <div className="lightbox" onClick={this.closeImage}>
                <div className="lightbox__inner" style={lightbox__innerStyle}>
                    {this.state.error && "Error loading image"}
                    <img
                        src={images[this.state.index].versions.big ? images[this.state.index].versions.big.meta.pipeFrom : images[this.state.index].versions.original.meta.pipeFrom}
                        onLoad={this.onLoad} onError={this.onError}
                        className={(this.state.loading || this.state.error) ? "hidden" : ""}/>
                </div>
            </div>
    };

    showSettings = () => {
        this.setState({showSettings: true});
        document.addEventListener('click', this.clickHandler);
    };

    clickHandler = (event) => {
        if (this.refs.album__settings && !this.refs.album__settings.contains(event.target)) {
            this.setState({showSettings: false});
            document.removeEventListener('click', this.clickHandler);
        } else if (!this.refs.album__settings) document.removeEventListener('click', this.clickHandler);
    };

    removeAlbum = () => {
        if (this.props.albumId) {
            Meteor.call('album.remove', this.props.albumId, error => {
                error ? console.log(error) : console.log("Album successfully removed!");
            });
            this.setState({showSettings: false});
            browserHistory.push("/photos");
        }
    };

    onChange_albumTitle = (data) => {
        console.log(data);
        if (this.props.albumId) {
            Meteor.call('album.rename', this.props.albumId, data.text, error => {
                error ? console.log(error) : console.log("Album successfully renamed!");
            });
        }
        return true;
    };

    validate_albumTitle(text) {
        return (text.length > 0 && text.length < 33);
    };

    render() {
        let images = this.state.images;

        const dropzone = this.state.hover && <input multiple type="file" className="album__dropzone"
                                                    onChange={this.onChange} onDragLeave={this.onDragLeave}/>;

        const album__settingsButton = this.props.showSettings &&
            <button className="btn album__settingsButton" onClick={this.showSettings}><i
                className="fa fa-ellipsis-v"/></button>;

        const album__settings = this.state.showSettings &&
            <div className="album__settings" ref="album__settings">
                <div className="album__setting" onClick={this.removeAlbum}>Remove Album</div>
            </div>;

        const album__title = this.props.albumTitleAsLink ?
            <Link to={"/album/" + this.props.albumId}>
                <h2>
                    <span className="album__title nowrap">{this.props.title}</span>
                    <span className="album__count">({images.length} photos)</span>
                </h2>
            </Link> :
            <h2>
                <RIEInput
                    value={this.props.title}
                    change={this.onChange_albumTitle}
                    validate={this.validate_albumTitle}
                    className="album__title nowrap"
                    propName="text"
                    classEditing="editing"
                    classLoading="loading"/>
                <span className="album__count">({images.length} photos)</span>
            </h2>;

        return (
            <div className={this.state.hover ? "album hover" : "album"} onDragOver={this.onDragOver}>
                <div className="album__bar flex jc-sb ai-c">
                    {album__title}
                    {album__settingsButton}
                    {album__settings}
                </div>
                <div className="album__pictures">
                    {this.renderImages()}
                </div>
                {dropzone}
                {this.renderLightbox()}
            </div>
        )
    }
}