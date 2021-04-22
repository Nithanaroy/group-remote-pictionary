import { Component } from "react";
import { PropTypes } from "prop-types";

import Alert from "./alert";

export default class Guesser extends Component {
    constructor(props) {
        super(props)
        this.state = {
            guess: "",
            alertMsg: "",
            alertType: "alert-primary"
        }
    }

    validateGuess = () => {
        if (this.props.gamer === this.props.drawnBy) {
            this.setState({ alertMsg: "Meh! It is boring to guess your own drawing. Let see if someone else guesses it :)"});
            return
        }
        const correctGuess = this.props.drawingOf.toUpperCase() === this.state.guess.trim().toUpperCase();
        if (correctGuess) {
            this.setState({ alertMsg: "Yippe! You got it!", alertType: "alert-success" });
            this.props.onCorrectGuess();
        } else {
            this.setState({ alertMsg: "", alertType: "alert-primary" });
            window.setTimeout( () => this.setState({ alertMsg: "Nope! try again" }), 100 );
        }
    }

    render() {
        return (
            <div>
                <h1>Guess the drawing</h1>
                <p>by {this.props.drawnBy}</p>

                <Alert alertMsg={this.state.alertMsg} type={this.state.alertType} />
                <form className="row" onSubmit={e => { e.preventDefault(); this.validateGuess(); }}>
                    <div><img src={this.props.drawing} alt="drawing to be guessed" className="img-thumbnail rounded mb-3" /></div>
                    <div className="col-auto">
                        <label htmlFor="guessTb" className="col-form-label">Your Guess</label>
                    </div>
                    <div className="col-auto">
                        <input name="guessTb" className="form-control" type="text" value={this.state.guess} onChange={e => this.setState({ guess: e.target.value })} autoFocus autoComplete="off" />
                    </div>
                    <div className="col-sm-12 col-md-5">
                    </div>
                </form>
                <button className="mt-3 btn btn-success col-12 col-md-6" onClick={this.validateGuess}>Submit</button>
            </div>
        );
    }
}

Guesser.propTypes = {
    onCorrectGuess: PropTypes.func.isRequired,
    gamer: PropTypes.string.isRequired,
    drawing: PropTypes.string.isRequired,
    drawingOf: PropTypes.string.isRequired,
    drawnBy: PropTypes.string.isRequired
}