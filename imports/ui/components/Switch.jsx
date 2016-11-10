import React from 'react';

export default class Switch extends React.Component {

    constructor(props) {
        super(props);

        this.onChange = this.onChange.bind(this);
    }

    onChange(e) {
        if (this.props.onChange) this.props.onChange.call(this, e);
    }

    render() {
        return (
            <label className="switch">
                <input type="checkbox" onChange={this.onChange} checked={this.props.checked || false} />
                <div className="slider"></div>
            </label>
        );
    }
}