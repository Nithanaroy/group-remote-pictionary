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
        this.setState({ name: window.localStorage.getItem(GAMER_NAME_KEY) ?? "" })
    }

    changeName = (newName) => {
        this.setState({ name: newName })
        this.props.onNameChange(newName)
    }

    render() {
        return (
            <div>
                <label htmlFor="gamerNameTb">Name</label>
                <input type="text" name="gamerNameTb" value={this.state.name}
                    onChange={e => this.changeName(e.target.value) }
                    onBlur={() => window.localStorage.setItem(GAMER_NAME_KEY, this.state.name)} />
            </div>
        )
    }
}

Gamer.propTypes = {
    onNameChange: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired
}