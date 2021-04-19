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
            <div className="d-flex mb-3" style={{flexDirection: "column", flexGrow: 1}}>
                <h1>Time to draw...</h1>
                <p>Word: <strong>{this.state.word}</strong></p>
                <Canvas id="drawerCanvas" syncCanvasRef={(ref) => this.canvasDOM = ref} />
                <button className="btn btn-success" type="button" onClick={this.submitDrawing}>Submit</button>
            </div>
        )
    }
}

Drawer.propTypes = {
    onDrawingSubmit: PropTypes.func.isRequired
}