import React from "react";

const Toggle = ({onChange, checked}) =>
    <label className="switch">
        <input type="checkbox" onChange={onChange} checked={checked || false}/>
        <div className="switch__bar"></div>
        <div className="switch__button"></div>
    </label>;

Toggle.propTypes = {
    onChange: React.PropTypes.func,
    checked: React.PropTypes.bool
};

export default Toggle;