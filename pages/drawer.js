import {Component} from "react";
import PropTypes from "prop-types"

export default class Drawer extends Component {
    render() {
        const word = "Banana"
        return (
            <div>
                <h1>Time to draw...</h1>
                <div>
                    <p>Word: </p>
                    <p>{word}</p>
                </div>
                <div>
                    <p>Drawing</p>
                    <canvas></canvas>
                </div>
                <button type="button">Submit</button>
            </div>
        )
    }
}

Drawer.propTypes = {
    onDrawingSubmit: PropTypes.func.isRequired
}