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
            }
        };

        this.getAlbums = this.getAlbums.bind(this);
        this.onClick_logout = this.onClick_logout.bind(this);
        this.onClick_addAlbum = this.onClick_addAlbum.bind(this);
    }

    componentWillUnmount() {
        this.state.subscription.albums.stop();
    }

    getAlbums() {
        return Albums.find({}).fetch();
    }

    getLinks() {
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
        return links;
    }

    onClick_logout(event) {
        event.preventDefault();
        Meteor.logout(() => {
            browserHistory.push("/");
        });
    }

    onClick_addAlbum() {
        console.log("add Album");
    }

    render() {
        const links = this.getLinks().map((link, index) => {
            return (
                <Link to={link.to} activeClassName="active" key={index}><i
                    className={"fa " + link.i}/><span>{link.name}</span></Link>
            );
        });

        const albums = this.getAlbums().map((album) => {
            return (
                <Link to={"/album/" + album._id} activeClassName="active" key={album._id}>{album.name}</Link>
            )
        });

        return (
            <nav className="sidebar hide-on-small-only" ref="sidebar">
                <h4 className="sidebar__heading">Navigation</h4>
                {links}

                <h4 className="sidebar__heading">Albums<i className="fa fa-plus sidebar__icon"
                                                          onClick={this.onClick_addAlbum}/></h4>
                {albums}

                <button className="sidebar__logout" onClick={this.onClick_logout}>Logout</button>

            </nav>
        );
    }
}