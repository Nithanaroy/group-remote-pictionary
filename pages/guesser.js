import { Component } from "react";
import { PropTypes } from "prop-types";

import Alert from "./alert";

export default class Guesser extends Component {
    constructor(props) {
        super(props)
        this.state = {
            guess: "",
            alertMsg: ""
        }
    }

    validateGuess = () => {
        const correctGuess = this.props.drawingOf.toUpperCase() === this.state.guess.toUpperCase();
        if (correctGuess) {
            this.props.onCorrectGuess()
        } else {
            this.setState({ alertMsg: "Nope! try again" });
        }
    }

    render() {
        return (
            <div>
                <h1>Guess the drawing</h1>
                <Alert alertMsg={this.state.alertMsg} />
                <form onSubmit={e => { e.preventDefault(); this.validateGuess(); }}>
                    <div>
                        <p>by {this.props.drawnBy}</p>
                        <div><img src={this.props.drawing} alt="drawing to be guessed" /></div>
                    </div>
                    <div>
                        <label htmlFor="guessTb">Your Guess</label>
                        <input name="guessTb" type="text" value={this.state.guess} onChange={e => this.setState({ guess: e.target.value })} autoFocus autoComplete="off" />
                    </div>
                    <button type="button" onClick={this.validateGuess}>Submit</button>
                </form>
            </div>
        );
    }
}

Guesser.propTypes = {
    onCorrectGuess: PropTypes.func.isRequired,
    drawing: PropTypes.string.isRequired,
    drawingOf: PropTypes.string.isRequired,
    drawnBy: PropTypes.string.isRequired
}