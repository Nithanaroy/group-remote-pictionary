import { Component } from "react";
import { PropTypes } from "prop-types";

// Forked from https://github.com/Nithanaroy/invisible_pen/blob/master/app/client/helpers/drawing_canvas.js
class CanvasController {
    constructor(canvasContainer, initX = null, initY = null) {
        this.c = canvasContainer;
        this.ctx = canvasContainer.getContext("2d");
        this.lastX = initX;
        this.lastY = initY;

        canvasContainer.addEventListener("touchstart", this.initPathCoordsForTouch); // fires before the finger is lifted
        canvasContainer.addEventListener("touchmove", this.freeFormForTouch);
        canvasContainer.addEventListener("mousedown", this.initPathCoordsForMouse); // fires before mouse left btn is released
        canvasContainer.addEventListener("mousemove", this.freeFormForMouse);

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
        const { x, y } = this.c.getBoundingClientRect();
        this.lastX = userX - x;
        this.lastY = userY - y;
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
    drawLineTo = (X, Y, areAbsoluteCoords = true) => {
        // Compute relative position w.r.t the canvas
        const { x, y } = areAbsoluteCoords ? this.c.getBoundingClientRect() : { x: 0, y: 0 };
        const relativeX = X - x;
        const relativeY = Y - y;

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
            <div>
                <button onClick={() => this.canvasController.cleanCanvas()}>Clear canvas</button>
                <canvas id={this.props.id} style={{ border: "1px solid #CCC" }} ></canvas>
            </div>
        )
    }
}

Canvas.propTypes = {
    syncCanvasRef: PropTypes.func.isRequired,
    id: PropTypes.string.isRequired
}