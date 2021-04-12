import { Component } from "react";
import Guesser from "./guesser"
import Drawer from "./drawer"
import { parseUrl } from "../scripts/url-parser";

export default class Stage extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    componentDidMount() {
        const { gameState } = parseUrl()
        this.setState({ gameState });
    }

    shareGameState() {

    }

    render() {
        const showGuessState = this.state.gameState?.drawing.length > 0
        return (
            <div>
                {showGuessState ? <Guesser /> : <Drawer onDrawingSubmit={this.shareGameState} />}
            </div>
        )
    }
}