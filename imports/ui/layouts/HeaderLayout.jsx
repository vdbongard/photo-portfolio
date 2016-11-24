import React from "react";
import {Link} from "react-router";
import Navigation from "../components/Navigation";
import Sidebar from "./Sidebar";

export default class HeaderLayout extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            mobileNavHidden: true
        };

        this.onClick_toggleMobileNav = this.onClick_toggleMobileNav.bind(this);
        this.onClick_closeMobileNav = this.onClick_closeMobileNav.bind(this);
    }

    onClick_toggleMobileNav() {
        this.setState({mobileNavHidden: !this.state.mobileNavHidden});
        document.body.classList.toggle('noscroll-small');
    }

    onClick_closeMobileNav() {
        if (!this.state.mobileNavHidden) this.onClick_toggleMobileNav();
    }

    render() {
        return (
            <div id="header-layout">
                <header className="header">

                    <div className="header__left">
                        <i className="header__toggle fa fa-bars hide-on-med-and-up "
                           onClick={this.onClick_toggleMobileNav}/>
                        <Link to="/" onClick={this.onClick_closeMobileNav}><img src="/logo.svg" className="header__logo"
                                                                                alt="Logo"/></Link>
                        <Link to="/" onClick={this.onClick_closeMobileNav}><h1 className="header__name">
                            vdbongard.com</h1></Link>
                    </div>

                    <div className="header__right hide-on-small-only">
                        <Navigation />
                    </div>

                </header>

                <main>
                    {this.props.children}
                </main>

                <div className="hide-on-med-and-up" ref="mobileNav">
                    <Sidebar className={this.state.mobileNavHidden && " ttx-100p"}
                             onClick={this.onClick_toggleMobileNav}/>
                    <div className={"overlay animate" + (this.state.mobileNavHidden ? " hidden" : "")}
                         onClick={this.onClick_toggleMobileNav}></div>
                </div>
            </div>
        );
    }
}