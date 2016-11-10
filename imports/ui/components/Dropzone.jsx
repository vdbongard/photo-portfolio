import React from 'react';
import TrackerReact from 'meteor/ultimatejs:tracker-react';

import ProgressBar from '../components/ProgressBar';

import Images from '../../api/images';

export default class Dropzone extends TrackerReact(React.Component) {

    constructor(props) {
        super(props);

        this.state = {
            hover: false,
            currentUpload: false,
            file: false
        };

        this.onChange = this.onChange.bind(this);
        this.onDragOver = this.onDragOver.bind(this);
        this.onDragLeave = this.onDragLeave.bind(this);
    }

    onChange(e) {
        e.preventDefault();

        let self = this;

        if (e.currentTarget.files && e.currentTarget.files[0]) {
            // We upload only one file, in case
            // multiple files were selected
            var upload = Images.insert({
                file: e.currentTarget.files[0],
                streams: 'dynamic',
                chunkSize: 'dynamic',
                meta: {
                    album: this.props.album
                }
            }, false);

            upload.on('start', function () {
                self.setState({currentUpload: this});
            });

            upload.on('end', function (error, fileObj) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('File "' + fileObj.name + '" successfully uploaded');
                    self.setState({file: fileObj});
                }
                // Meteor.setTimeout(()=>self.setState({currentUpload: false}), 3000);
            });

            upload.start();
        }
    }

    onDragOver() {
        if (!this.state.hover) {
            this.setState({hover: true});
            console.log("onDragOver");
        }
    }

    onDragLeave() {
        if (this.state.hover) {
            this.setState({hover: false});
            console.log("onDragLeave");
        }
    }

    render() {
        let dropzone__inner = "dropzone__inner " + (this.state.hover ? "dragover" : "");


        let awsUpload = Images.find({_id: this.state.file._id}).fetch()[0];
        let awsProgress = [];

        if (awsUpload && awsUpload.versions) {
            awsProgress[0] = awsUpload.versions.thumbnail40 && awsUpload.versions.thumbnail40.meta && awsUpload.versions.thumbnail40.meta.progress && awsUpload.versions.thumbnail40.meta.progress.percent || 0;
            awsProgress[1] = awsUpload.versions.preview && awsUpload.versions.preview.meta && awsUpload.versions.preview.meta.progress && awsUpload.versions.preview.meta.progress.percent || 0;
            awsProgress[2] = awsUpload.versions.original && awsUpload.versions.original.meta && awsUpload.versions.original.meta.progress && awsUpload.versions.original.meta.progress.percent || 0;
        }
        let uploadProgress = this.state.currentUpload && this.state.currentUpload.progress.get();

        let progress = ((uploadProgress + awsProgress[0] + awsProgress[1] + awsProgress[2])/4)||0;

        return (
            <div className="dropzone">
                <div className="dropzone__input">
                    <div className={dropzone__inner}>
                        <i className="fa fa-cloud-upload"/>
                        <p>Drag and drop a file here or click</p>
                    </div>
                    <input multiple type="file" className="dropzone__upload"
                           onChange={this.onChange}
                           onDragOver={this.onDragOver}
                           onDragLeave={this.onDragLeave}
                           onDrop={this.onDragLeave}/>
                </div>
                {this.state.currentUpload &&
                <div className="dropzone__currentUpload">
                    <ProgressBar progress={progress}>{progress}%</ProgressBar>
                </div>
                }
            </div>
        );
    }
}