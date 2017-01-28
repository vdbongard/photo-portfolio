import React from "react";
import moment from "moment";

export default (props) => {
    const removeUser = () => Meteor.call('removeUser', props.user._id);

    const toggleAdmin = () => props.user.roles[0] === 'admin' ?
        Meteor.call('makeNormal', props.user._id) :
        Meteor.call('makeAdmin', props.user._id);

    return (
        <tr className="user">
            <td>{props.user.emails[0].address} {props.user.emails[0].verified && <i className="fa fa-check"/>}</td>
            <td><span onClick={toggleAdmin}>{props.user.roles && props.user.roles[0]}</span></td>
            <td>{moment(props.user.createdAt).format('D. MMMM YYYY')}</td>
            <td><i className="fa fa-trash action" onClick={removeUser}/></td>
        </tr>
    );
};