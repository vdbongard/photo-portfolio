import React from "react";

const ProgressBar = () => {
    let progress = this.props.progress;
    if (isNaN(progress) || progress < 0) progress = 0;
    if (progress > 100) progress = 100;

    return (
        <div className="progressbar">
            <div className="progressbar__bar" style={{width: progress + '%'}}></div>
            <span className="progressbar__text">{this.props.children}</span>
        </div>
    );
}

ProgressBar.propTypes = {
    progress: React.PropTypes.number,
    children: React.PropTypes.element
};

export default ProgressBar;