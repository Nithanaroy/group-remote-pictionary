import { Component } from "react";
import PropTypes from "prop-types";
import Canvas from "./drawing-canvas";
import * as wordGenerators from "../scripts/word-generator";

const DEV_TESTING_ROOM_ID = "tMCCZVKkirRhCPdZHrTi";

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
        if (this.props.roomId === DEV_TESTING_ROOM_ID) {
            this.setState({ word: "Banana" });
        } else {
            this.setState({ word: wordGenerators.generateEasyWord() });
        }
    }

    componentDidMount() {
        this.fetchWord();
    }

    render() {
        return (
            <div className="d-flex mb-3" style={{ flexDirection: "column", flexGrow: 1 }}>
                <h1>Time to draw...</h1>
                <div>Word: <strong>{this.state.word}</strong> [ <a href="#" onClick={this.fetchWord} class="link-primary">try another</a> ]</div>
                <Canvas id="drawerCanvas" syncCanvasRef={(ref) => this.canvasDOM = ref} />
                <button className="btn btn-success" type="button" onClick={this.submitDrawing}>Submit</button>
            </div>
        )
    }
}

Drawer.propTypes = {
    onDrawingSubmit: PropTypes.func.isRequired,
    // roomId: PropTypes.string.isRequired // TODO: erroring as we fetch the roomId only after the DOM renders from the URL
}