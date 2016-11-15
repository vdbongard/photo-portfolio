import React from "react";
import {browserHistory, Link} from "react-router";
import TrackerReact from "meteor/ultimatejs:tracker-react";
import {Roles} from "meteor/alanning:roles";
import Albums from "../../api/albums";

export default class MainLayout extends TrackerReact(React.Component) {

    constructor(props) {
        super(props);

        this.state = {
            subscription: {
                albums: Meteor.subscribe('albums')
            },
            showAlbumInput: false,
            albumInput: ""
        };

        this.renderAlbumLinks = this.renderAlbumLinks.bind(this);
        this.onClick_logout = this.onClick_logout.bind(this);
        this.toggleAlbumInput = this.toggleAlbumInput.bind(this);
        this.onSubmit_addAlbum = this.onSubmit_addAlbum.bind(this);
        this.onChange_albumInput = this.onChange_albumInput.bind(this);
    }

    componentWillUnmount() {
        this.state.subscription.albums.stop();
    }

    renderAlbumLinks() {
        return Albums.find({}).fetch().reverse().map((album) => {
            return (
                <Link to={"/album/" + album._id} activeClassName="active" key={album._id}>{album.name}</Link>
            )
        });
    }

    renderLinks() {
        const links = [{
            to: "/photos",
            i: "fa-picture-o",
            name: "Photos"
        }];

        if (Roles.userIsInRole(Meteor.userId(), 'admin')) {
            links.push(
                {
                    to: "/upload",
                    i: "fa-cloud-upload",
                    name: "Upload"
                },
                {
                    to: "/users",
                    i: "fa-users",
                    name: "Users"
                },
                {
                    to: "/settings",
                    i: "fa-cog",
                    name: "Settings"
                });
        }

        return links.map((link, index) => {
            return (
                <Link to={link.to} activeClassName="active" key={index}><i
                    className={"fa " + link.i}/><span>{link.name}</span></Link>
            );
        });
    }

    onClick_logout(event) {
        event.preventDefault();
        Meteor.logout(() => {
            browserHistory.push("/");
        });
    }

    toggleAlbumInput() {
        let state = !this.state.showAlbumInput;
        this.setState({showAlbumInput: state});
    }

    onSubmit_addAlbum(event) {
        event.preventDefault();
        const albumName = this.state.albumInput;
        if (albumName !== '') {
            Meteor.call('album.create', albumName, error => {
                error ? console.log(error) : console.log("Album successfully created!");
            });
            this.toggleAlbumInput();
        }
    }

    onChange_albumInput(event) {
        this.setState({albumInput: event.target.value.trim()});
    }

    render() {
        let albumInput = this.state.showAlbumInput &&
            <form onSubmit={this.onSubmit_addAlbum} className="sidebar__albumInputWrapper"><input type="text"
                                                                                                  ref={element => element && element.focus()}
                                                                                                  onChange={this.onChange_albumInput}/>
            </form>;

        return (
            <nav className="sidebar hide-on-small-only" ref="sidebar">
                <h4 className="sidebar__heading">Navigation</h4>
                {this.renderLinks()}

                <h4 className="sidebar__heading">
                    Albums
                    <i className="fa fa-plus sidebar__icon" onClick={this.toggleAlbumInput}/>
                </h4>
                {albumInput}
                {this.renderAlbumLinks()}

                <button className="sidebar__logout" onClick={this.onClick_logout}>Logout</button>

            </nav>
        );
    }
}