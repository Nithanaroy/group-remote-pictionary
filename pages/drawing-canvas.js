import { Component } from "react";
import { PropTypes } from "prop-types";

// Forked from https://github.com/Nithanaroy/invisible_pen/blob/master/app/client/helpers/drawing_canvas.js
class CanvasController {
    constructor(canvasElem, initX = null, initY = null) {
        this.c = canvasElem;
        this.ctx = canvasElem.getContext("2d");
        this.lastX = initX;
        this.lastY = initY;
        this.xScale = 1
        this.yScale = 1

        canvasElem.addEventListener("touchstart", this.initPathCoordsForTouch); // fires before the finger is lifted
        canvasElem.addEventListener("touchmove", this.freeFormForTouch);
        canvasElem.addEventListener("mousedown", this.initPathCoordsForMouse); // fires before mouse left btn is released
        canvasElem.addEventListener("mousemove", this.freeFormForMouse);

        this.setStyles();
    }

    setStyles = () => {
        // this.c.style.background = "black";
    };

    initPathCoordsForTouch = (e) => {
        const { clientX, clientY } = e.targetTouches[0];
        this.initPathCoords(clientX, clientY);
    }

    initPathCoordsForMouse = (e) => {
        this.initPathCoords(e.clientX, e.clientY);
    }

    initPathCoords = (userX, userY) => {
        const { x, y, width, height } = this.c.getBoundingClientRect();
        this.xScale = this.c.width / width;
        this.yScale = this.c.height / height;
        this.lastX = (userX - x) * this.xScale;
        this.lastY = (userY - y) * this.yScale;
    };

    freeFormForTouch = (e) => {
        const { clientX, clientY } = e.targetTouches[0];
        this.drawLineTo(clientX, clientY);
    }

    freeFormForMouse = (e) => {
        if (e.buttons !== 1) return; // left button is not pushed yet
        this.drawLineTo(e.clientX, e.clientY);
    };

    /**
     * Draws a line from the previous known X and Y to x and y
     * @param X: X coordinate
     * @param Y: Y coordinate
     * @param areAbsoluteCoords: Are X and Y absolute on screen or relative to canvas?
     */
    drawLineTo = (X, Y) => {
        // Compute relative position w.r.t the canvas
        const { x, y } = this.c.getBoundingClientRect()
        const relativeX = (X - x) * this.xScale;
        const relativeY = (Y - y) * this.yScale;

        // Initialize at runtime if not set earlier
        if (this.lastX == null) {
            this.lastX = relativeX;
            this.lastY = relativeY;
        }

        this.ctx.beginPath();
        this.ctx.lineWidth = 5;
        this.ctx.moveTo(this.lastX, this.lastY);
        this.ctx.lineTo(relativeX, relativeY);
        this.ctx.strokeStyle = 'black';
        this.ctx.stroke();
        this.ctx.closePath();

        this.lastX = relativeX;
        this.lastY = relativeY;
    };

    cleanCanvas() {
        this.ctx.clearRect(0, 0, this.c.width, this.c.height);
    }
}

export default class Canvas extends Component {
    componentDidMount() {
        const canvasRef = document.getElementById(this.props.id)
        this.props.syncCanvasRef(canvasRef)
        this.canvasController = new CanvasController(canvasRef)
        // Prevent page scroll on touch move. Gives a better canvas drawing experience on touch devices
        document.addEventListener("touchmove", (e) => e.preventDefault(), { passive: false });
    }

    render() {
        return (
            <div className="d-flex" style={{ flexDirection: "column", flexGrow: 1 }}>
                <div className="mb-3">
                    <button className="btn btn-warning" onClick={() => this.canvasController.cleanCanvas()}>Clear canvas</button>
                </div>
                <div style={{ flexGrow: 1, flexDirection: "column", alignItems: "center" }} className="mb-3 d-flex">
                    <canvas id={this.props.id} style={{ border: "0.5rem groove #CCC", width: "100%", height: "100%" }} ></canvas>
                </div>
            </div>
        )
    }
}

Canvas.propTypes = {
    syncCanvasRef: PropTypes.func.isRequired,
    id: PropTypes.string.isRequired
}