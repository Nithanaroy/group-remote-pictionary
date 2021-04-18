import { Component } from "react";
import { PropTypes } from "prop-types";

export default class Alert extends Component {
    render() {
        return this.props.alertMsg?.trim().length > 0 ? <div>{this.props.alertMsg}</div> : <div></div>
    }
}

Alert.propTypes = {
    alertMsg: PropTypes.string.isRequired
}