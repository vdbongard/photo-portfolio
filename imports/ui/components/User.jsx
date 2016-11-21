import React from "react";
import TrackerReact from "meteor/ultimatejs:tracker-react";
import moment from "moment";

export default class User extends TrackerReact(React.Component) {

    constructor(props) {
        super(props);

        this.removeUser = this.removeUser.bind(this);
        this.toggleAdmin = this.toggleAdmin.bind(this);
    }

    removeUser() {
        Meteor.call('removeUser', this.props.user._id);
    }

    toggleAdmin() {
        if(this.props.user.roles[0] === 'admin')
            Meteor.call('makeNormal', this.props.user._id);
        else
            Meteor.call('makeAdmin', this.props.user._id);
    }

    render() {
        return (
            <tr className="user">
                <td>{this.props.user.emails[0].address} {this.props.user.emails[0].verified && <i className="fa fa-check"/>}</td>
                <td><span onClick={this.toggleAdmin}>{this.props.user.roles && this.props.user.roles[0]}</span></td>
                <td>{moment(this.props.user.createdAt).format('D. MMMM YYYY')}</td>
                <td><i className="fa fa-trash action" onClick={this.removeUser}/></td>
            </tr>
        );
    }
}