import React from "react";

const Toggle = (props) => {
    return (
        <label className="switch">
            <input type="checkbox" onChange={props.onChange} checked={props.checked || false}/>
            <div className="switch__bar"></div>
            <div className="switch__button"></div>
        </label>
    );
};

Toggle.propTypes = {
    onChange: React.PropTypes.func,
    checked: React.PropTypes.bool
};

export default Toggle;