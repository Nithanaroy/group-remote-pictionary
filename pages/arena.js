import { Component } from "react";
import Guesser from "./guesser"
import Drawer from "./drawer"
import { defaultRoomState } from "../models/state-manager";
import { extractRoomId } from "../scripts/game-room";
import { getRoomState, updateRoomState } from "../models/firestore-state-manager";
import Gamer from "./gamer";
import Alert from "./alert";

export default class Arena extends Component {
    constructor(props) {
        super(props)
        this.state = {
            ...defaultRoomState,
            gamer: "",
            initializingRoom: true,
            showTurnCompleteScreen: false,
            gameUrl: "",
            alertMsg: ""
        }
    }

    async initializeRoom() {
        const roomId = extractRoomId();
        if (roomId) {
            const roomState = await getRoomState(roomId);
            console.log(roomState);
            if (roomState) {
                this.setState({ ...roomState, roomNotFoundError: false });
            } else {
                this.setState({ roomNotFoundError: true });
            }
        }
        this.setState({ initializingRoom: false });
    }

    _computeFlippedGameMode = () => {
        return this.state.mode === "guess" ? "draw" : "guess";
    }

    _validateRoomState = () => {
        const validName = this.state.gamer.trim().length > 0
        if (!validName) {
            this.setState({ alertMsg: "Please provide gamer's name" })
            return false
        }
        this.setState({ alertMsg: "" });
        return true;
    }

    finishDrawerTurn = (word, drawingAsURL) => {
        const myDrawingScore = (this.state.drawingScores[this.state.gamer] ?? 0) + 1
        const newDrawingScores = { ...this.state.drawingScores, [this.state.gamer]: myDrawingScore }
        const newRoomState = {
            drawingOf: word,
            drawing: drawingAsURL,
            drawnBy: this.state.gamer,
            mode: this._computeFlippedGameMode(),
            drawingScores: newDrawingScores,
            streak: this.state.streak + 1
        }
        if (this._validateRoomState()) {
            updateRoomState(this.state.roomId, newRoomState)
            this.setState({ showTurnCompleteScreen: true });
        }
    }

    finishGuesserTurn = () => {
        const myGuessingScore = (this.state.guessingScores[this.state.gamer] ?? 0) + 1
        const newGuessingScores = { ...this.state.guessingScores, [this.state.gamer]: myGuessingScore }
        const newRoomState = {
            mode: this._computeFlippedGameMode(),
            guessingScores: newGuessingScores,
            streak: this.state.streak + 1
        }
        if (this._validateRoomState()) {
            updateRoomState(this.state.roomId, newRoomState)
            this.setState({ showTurnCompleteScreen: true });
        }
    }

    async componentDidMount() {
        await this.initializeRoom();
        this.setState({ gameUrl: window.location.href })
    }

    render() {
        const loadingRoomScreen = (
            <div>
                <p>Loading the room...</p>
                <p>Please wait</p>
            </div>
        )
        const guesser = <Guesser drawing={this.state.drawing} drawnBy={this.state.drawnBy} drawingOf={this.state.drawingOf} onCorrectGuess={this.finishGuesserTurn} />
        const readyRoomScreen = (
            <div>
                <Gamer name={this.state.name} onNameChange={newName => this.setState({ gamer: newName })} />
                <p>You are in {this.state.roomName} room</p>

                {this.state.mode === "guess" ? guesser : <Drawer onDrawingSubmit={this.finishDrawerTurn} />}
            </div>
        )
        const roomNotFoundScreen = (
            <div>
                <p>OOPS! Looks like you are in the wrong place</p>
                <p>Find the right room link or <a href="/">go here</a> to create a new room</p>
            </div>
        )
        const turnCompleteScreen = (
            <div>
                <img src={this.state.drawing} />
                Share this URL with your friends on any messaging app or WhatsApp group to continue the game
                <div>
                    <a href={this.state.gameUrl}>{this.state.gameUrl}</a>
                </div>
            </div>
        )

        const postLoadingScreen = this.state.showTurnCompleteScreen ? turnCompleteScreen : (this.state.roomId ? readyRoomScreen : roomNotFoundScreen)
        return (
            <div>
                <Alert alertMsg={this.state.alertMsg} />
                {this.state.initializingRoom ? loadingRoomScreen : postLoadingScreen}
            </div>
        )
    }
}