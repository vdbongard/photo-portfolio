import React from "react";
import {browserHistory, Link} from "react-router";
import Navigation from "../components/Navigation";
import TrackerReact from "meteor/ultimatejs:tracker-react";
import {Roles} from "meteor/alanning:roles";
import Albums from "../../api/albums";

export default class HeaderLayout extends TrackerReact(React.Component) {

    constructor(props) {
        super(props);

        this.state = {
            subscription: {
                albums: Meteor.subscribe('albums')
            }
        };

        this.onClick_toggle = this.onClick_toggle.bind(this);
        this.onClick_close = this.onClick_close.bind(this);
        this.onClick_logout = this.onClick_logout.bind(this);
        this.getAlbums = this.getAlbums.bind(this);
    }

    componentWillUnmount() {
        this.state.subscription.albums.stop();
    }

    getAlbums() {
        return Albums.find({}).fetch();
    }

    onClick_toggle() {
        this.refs.mobileNav.classList.toggle('hidden');
        this.refs.mobileNavOverlay.classList.toggle('hidden');
        document.body.classList.toggle('noscroll-small');
    }

    onClick_close() {
        if (!this.refs.mobileNav.classList.contains('hidden')) {
            this.onClick_toggle();
        }
    }

    onClick_logout(event) {
        event.preventDefault();
        Meteor.logout(() => {
            browserHistory.push("/");
            this.onClick_close();
        });
    }

    render() {
        const albums = this.getAlbums();
        const userId = Meteor.userId();

        return (
            <div id="header-layout">
                <header className="header">

                    <div className="header__left">
                        <i className="header__toggle fa fa-bars hide-on-med-and-up " onClick={this.onClick_toggle}/>
                        <Link to="/" onClick={this.onClick_close}><img src="/logo.svg" className="header__logo"
                                                                       alt="Logo"/></Link>
                        <Link to="/" onClick={this.onClick_close}><h1 className="header__name">vdbongard.com</h1></Link>
                    </div>

                    <div className="header__right hide-on-small-only">
                        <Navigation />
                    </div>

                </header>

                <main>

                    <nav className="mobile-nav hide-on-med-and-up hidden" ref="mobileNav">
                        <h4 className="sidebar__heading">Navigation</h4>

                        {userId ? <Link to="/photos" activeClassName="active" onClick={this.onClick_toggle}><i
                            className=" fa fa-picture-o"/><span>Photos</span></Link> :
                            <Link to="/login" activeClassName="active" onClick={this.onClick_toggle}>Login</Link>
                        }

                        {userId && Roles.userIsInRole(userId, 'admin') &&
                        <span className="flex column">
                            <Link to="/users" activeClassName="active" onClick={this.onClick_toggle}><i
                                className="fa fa-users"/><span>Users</span></Link>
                            <Link to="/settings" activeClassName="active" onClick={this.onClick_toggle}><i
                                className="fa fa-cog"/><span>Settings</span></Link>
                        </span>
                        }

                        {userId &&
                        <h4 className="sidebar__heading">Albums<i className="fa fa-plus-square-o sidebar__icon"/></h4>}

                        {userId && albums.map((album) => {
                            return (
                                <Link to={"/album/" + album._id} activeClassName="active" onClick={this.onClick_toggle}
                                      key={album._id}>{album.name}</Link>
                            )
                        })}

                        {userId && <Link to="" onClick={this.onClick_logout}>Logout</Link>}
                    </nav>
                    <div className="mobile-nav-overlay hide-on-med-and-up hidden" ref="mobileNavOverlay"
                         onClick={this.onClick_toggle}></div>

                    {this.props.children}
                </main>
            </div>
        );
    }
}