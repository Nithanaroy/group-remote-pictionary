import { Component } from "react";
import { PropTypes } from "prop-types";

const GAMER_NAME_KEY = "gamerName"

export default class Gamer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: ""
        }
    }

    componentDidMount() {
        this.changeName(window.localStorage.getItem(GAMER_NAME_KEY) ?? "")
    }

    changeName = (newName) => {
        this.setState({ name: newName })
        this.props.onNameChange(newName)
    }

    render() {
        return (

            <div className="row g-3 align-items-center mb-3">
                <div className="col-auto">
                    <label htmlFor="gamerNameTb" className="col-form-label">Your name</label>
                </div>
                <div className="col-auto">
                    <input type="text" className="form-control" name="gamerNameTb"
                        value={this.state.name}
                        onChange={e => this.changeName(e.target.value)}
                        onBlur={() => window.localStorage.setItem(GAMER_NAME_KEY, this.state.name)} />
                </div>
            </div>
        )
    }
}

Gamer.propTypes = {
    onNameChange: PropTypes.func.isRequired
}