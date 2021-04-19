import { Component } from "react";
import { PropTypes } from "prop-types";

export default class Alert extends Component {
    render() {
        const alertType = this.props.type || "alert-primary"
        const alertBox = <div className={`alert ${alertType}`} role="alert" style={{ ...this.props.style }}>{this.props.alertMsg}</div>
        return this.props.alertMsg?.trim().length > 0 ? alertBox : <div></div>
    }
}

Alert.propTypes = {
    alertMsg: PropTypes.string.isRequired
}