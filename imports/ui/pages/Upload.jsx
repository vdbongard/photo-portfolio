import React from 'react';
import Dropzone from '../components/Dropzone';

export default class Upload extends React.Component {

    constructor(props) {
        super(props);

        this.onSubmit_createAlbumForm = this.onSubmit_createAlbumForm.bind(this);
    }

    onSubmit_createAlbumForm(event) {
        event.preventDefault();
        const albumName = this.refs.albumName.value.trim();
        if (albumName !== '') {
            Meteor.call('album.create', albumName, error=>{
                error ? console.log(error) : console.log("Album successfully created!");
            });
        }
    }

    render() {
        return (
            <div className="upload">
                <h1>Upload</h1>
                <Dropzone/>
                <div className="card">
                    <h1 className="card-title">Create Album</h1>
                    <form id="createAlbumForm" onSubmit={this.onSubmit_createAlbumForm}>
                        <input type="text" ref="albumName" className="input" placeholder="Name" required/>
                        <input type="submit" value="Create" className="btn-large"/>
                    </form>
                </div>
            </div>
        );
    }
}