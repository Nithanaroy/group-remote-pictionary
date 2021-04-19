import { Component } from "react";
import { PropTypes } from "prop-types";
import Head from "next/head";

import Guesser from "./guesser"
import Drawer from "./drawer"
import { defaultRoomState } from "../models/state-manager";
import { getRoomState, updateRoomState } from "../models/firestore-state-manager";
import Gamer from "./gamer";
import Alert from "./alert";

const [GUESS_MODE, DRAW_MODE] = ["guess", "draw"]

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
        if (this.props.roomId) {
            const roomState = await getRoomState(this.props.roomId);
            if (roomState) {
                this.setState({ ...roomState, roomNotFoundError: false });
            } else {
                this.setState({ roomNotFoundError: true });
            }
        }
        this.setState({ initializingRoom: false });
    }

    _computeFlippedGameMode = () => {
        return this.state.mode === GUESS_MODE ? DRAW_MODE : GUESS_MODE;
    }

    _validateRoomState = () => {
        const validName = this.state.gamer.trim().length > 0
        if (!validName) {
            this.setState({ alertMsg: "Please provide gamer's (your) name" })
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
            this.setState({ showTurnCompleteScreen: true, drawing: drawingAsURL });
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

    getShareUrl = () => {
        try {
            const url = new URL(this.state.gameUrl);
            url.searchParams.set("streak", this.state.streak);
            return url.toString()
        } catch (error) {
            // happens while rendering and can be ignored
        }
    }

    async componentDidMount() {
        await this.initializeRoom();
        this.setState({ gameUrl: window.location.href })
    }

    render() {
        const loadingRoomScreen = (
            <div style={{display: "flex", alignItems: "center", flexDirection: "column"}}>
                <h1>Loading the room...</h1>
                <p className="lead">Please wait</p>
            </div>
        )
        const guesser = <Guesser drawing={this.state.drawing} drawnBy={this.state.drawnBy} drawingOf={this.state.drawingOf} onCorrectGuess={this.finishGuesserTurn} />
        const readyRoomScreen = (
            <div className="d-flex" style={{flexDirection: "column", flexGrow: 1}}>
                <Gamer onNameChange={newName => this.setState({ gamer: newName })} />
                <p>You are in {this.state.roomName} room</p>

                {this.state.mode === GUESS_MODE ? guesser : <Drawer onDrawingSubmit={this.finishDrawerTurn} />}
            </div>
        )
        const roomNotFoundScreen = (
            <div className="text-center">
                <h3 className="mb-4">OOPS! Looks like you are in the wrong place</h3>
                <p className="lead">Find the right room link or <a href="/">go here</a> to create a new room</p>
            </div>
        )

        const drawerTurnCompleteMessage = <p>Awesome work! Now share this URL with your friends on any messaging app or WhatsApp group to continue the game</p>
        const guesserTurnCompleteMessage = <p>Super guess! Challenge others by drawing the next word by visiting the below link or take a challenge again by sharing this URL with your friends on any messaging app or WhatsApp group to continue the game</p>
        const turnCompleteScreen = (
            <div>
                <img src={this.state.drawing} className="img-thumbnail rounded mx-auto d-block mb-3" />
                { this.state.mode === GUESS_MODE ? guesserTurnCompleteMessage : drawerTurnCompleteMessage}
                <div>
                    <a href={this.getShareUrl()}>{this.getShareUrl()}</a>
                </div>
            </div>
        )

        const postLoadingScreen = this.state.showTurnCompleteScreen ? turnCompleteScreen : (this.state.roomId ? readyRoomScreen : roomNotFoundScreen)
        return (
            <div className="d-flex" style={{flexDirection: "column", flexGrow: 1}}>
                <Head>
                    <title>Group Pictionary: {this.state.roomName} room</title>
                </Head>
                <Alert alertMsg={this.state.alertMsg} />
                <div style={{flexGrow: 1, flexDirection: "column"}} className="d-flex">
                    {this.state.initializingRoom ? loadingRoomScreen : postLoadingScreen}
                </div>
            </div>
        )
    }
}

Arena.propTypes = {
    roomId: PropTypes.string.isRequired
}