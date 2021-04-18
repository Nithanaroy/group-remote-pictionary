import { Component } from "react";
import PropTypes from "prop-types";
import Canvas from "./drawing-canvas";

export default class Drawer extends Component {
    
    constructor(props) {
        super(props)
        this.state = {}
        this.canvasDOM = null;
    }

    submitDrawing = () => {
        const drawingURL = this.canvasDOM?.toDataURL();
        this.props.onDrawingSubmit(this.state.word, drawingURL)
    }

    fetchWord = () => {
        // https://www.thegamegal.com/printables/
        this.setState({ word: "Banana" });
    }

    componentDidMount() {
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
                    <Canvas id="drawerCanvas" syncCanvasRef={(ref) => this.canvasDOM = ref} />
                </div>
                <button type="button" onClick={this.submitDrawing}>Submit</button>
            </div>
        )
    }
}

Drawer.propTypes = {
    onDrawingSubmit: PropTypes.func.isRequired
}