import { Component } from "react";
import PropTypes from "prop-types"

export default class Drawer extends Component {
    
    canvasInstance = null
    
    constructor(props) {
        super(props)
        this.state = {
            
        }
    }

    submitDrawing = () => {
        const drawingURL = this.canvasInstance?.toDataURL();
        this.props.onDrawingSubmit(this.state.word, drawingURL)
    }

    fetchWord = () => {
        // https://www.thegamegal.com/printables/
        this.setState({ word: "Banana" });
    }

    componentDidMount() {
        this.canvasInstance = document.getElementById("drawingCanvas");
        this.fetchWord();
    }

    render() {
        return (
            <div>
                <h1>Time to draw...</h1>
                <div>
                    <p>Word: <strong>{this.state.word}</strong></p>
                </div>
                <div>
                    <p>Drawing</p>
                    <canvas id="drawingCanvas"></canvas>
                </div>
                <button type="button" onClick={this.submitDrawing}>Submit</button>
            </div>
        )
    }
}

Drawer.propTypes = {
    onDrawingSubmit: PropTypes.func.isRequired
}