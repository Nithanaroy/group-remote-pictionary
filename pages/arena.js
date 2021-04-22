import { Component } from "react";
import { PropTypes } from "prop-types";
import Head from "next/head";

import Guesser from "./guesser"
import Drawer from "./drawer"
import { defaultRoomState } from "../models/state-manager";
import { getRoomState, updateRoomState } from "../models/firestore-state-manager";
import Gamer from "./gamer";
import Alert from "./alert";
import Leaderboard from "./leaderboard";

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
            alertMsg: "",
            alertType: "alert-primary",
            isShareFeatureAvailable: false
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

    setAlertHelper = (msg, type = "alert-primary") => {
        this.setState({ alertMsg: "" });
        window.setTimeout(() => this.setState({ alertMsg: msg, alertType: type }), 100);
    }

    copyContentForSharing = async (what) => {
        const shareUrlMsg = `Visit ${this.getShareUrl()} to continue our pictionary game`
        function legacyCopyURL() {
            // Credits: https://stackoverflow.com/a/48020189/1585523
            // const range = document.createRange()
            // range.selectNodeContents(document.getElementById("shareContentDiv"))
            // window.getSelection().removeAllRanges(); // clear current selection
            // window.getSelection().addRange(range); // to select text
            // document.execCommand("copy");
            // window.getSelection().removeAllRanges(); // to deselect

            const inpElem = document.createElement("input")
            inpElem.setAttribute("value", shareUrlMsg)
            document.body.appendChild(inpElem)
            inpElem.select()
            inpElem.setSelectionRange(0, 1000)
            document.execCommand("copy");
            inpElem.blur(); // to close the keyboard autopened on selection
            document.body.removeChild(inpElem);
        }

        const showImageCopyError = () => this.setAlertHelper(
            "Unfortunately, your browser doesnt support copying images automatically. Try to copy manually",
            "alert-danger"
        );

        if (what === "drawing" && !navigator.clipboard) {
            showImageCopyError();
            return;
        }

        if (navigator.clipboard) {
            if (what === "drawing") {
                try {
                    await navigator.clipboard.write([
                        // Credits: https://stackoverflow.com/a/62677424/1585523
                        new ClipboardItem({ "image/png": await (await fetch(this.state.drawing)).blob() })
                    ])
                } catch (error) {
                    console.error(error)
                    showImageCopyError();
                    return;
                }
            } else {
                const urlBlob = new Blob([shareUrlMsg], { type: "text/plain" })
                try {
                    await navigator.clipboard.write([new ClipboardItem({ [urlBlob.type]: urlBlob })])
                } catch (error) {
                    console.error(error)
                    legacyCopyURL()
                }
            }
        } else if (what === "url") {
            legacyCopyURL();
        }
        this.setAlertHelper("Successfully copied! Now go ahead and paste in your friends group", "alert-success");
    }

    showSharePopup = async () => {
        try {
            const blob = await (await fetch(this.state.drawing)).blob();
            const drawingFile = new File([blob], 'drawing.png', { type: "image/png", lastModified: new Date() });
            await navigator.share({
                "url": this.getShareUrl(),
                "text": `Click on this link to continue our pictionary game`,
                "title": "Let's play some pictionary",
                "files": [drawingFile]
            })
        } catch (err) {
            // TODO: differentiate between AbortError that is fired on closing the share dialog without sharing versus a real programmatic error
            console.error(err)
        }
    }

    async componentDidMount() {
        await this.initializeRoom();
        this.setState({ gameUrl: window.location.href })
        if (navigator.share) {
            this.setState({ isShareFeatureAvailable: true });
        }
    }

    render() {
        const loadingRoomScreen = (
            <div style={{ display: "flex", alignItems: "center", flexDirection: "column" }}>
                <h1>Loading the room...</h1>
                <p className="lead">Please wait</p>
            </div>
        )
        const guesser = <Guesser drawing={this.state.drawing} drawnBy={this.state.drawnBy} drawingOf={this.state.drawingOf} onCorrectGuess={this.finishGuesserTurn} />
        const readyRoomScreen = (
            <div className="d-flex" style={{ flexDirection: "column", flexGrow: 1 }}>
                <Gamer onNameChange={newName => this.setState({ gamer: newName })} />
                <p className="text-center">
                    {this.state.roomName}'s 
                    <span className="text-end">
                        <a href="#" data-bs-toggle="modal" data-bs-target="#leaderboard" onClick={this.fetchWord} className="link-primary mx-1">Leaderboard</a>🏆
                    </span>
                    </p>

                {this.state.mode === GUESS_MODE ? guesser : <Drawer onDrawingSubmit={this.finishDrawerTurn} roomId={this.state.roomId} />}
                <Leaderboard id="leaderboard" drawingScores={this.state.drawingScores} guessingScores={this.state.guessingScores} />
            </div>
        )
        const roomNotFoundScreen = (
            <div className="text-center">
                <h3 className="mb-4">OOPS! Looks like you are in the wrong place</h3>
                <p className="lead">Find the right room link or <a href="/">go here</a> to create a new room</p>
            </div>
        )

        const drawerTurnCompleteMessage = <p>Awesome work! Now share this URL with your friends on any messaging app or WhatsApp group to continue the game</p>
        const guesserTurnCompleteMessage = <p>Super guess! Challenge others by drawing the next word waiting in the below link or share this URL with your friends on any messaging app or WhatsApp group to let others draw</p>
        const turnCompleteScreen = (
            <div>
                <img src={this.state.drawing} className="img-thumbnail rounded mx-auto d-block mb-3" />
                { this.state.mode === GUESS_MODE ? guesserTurnCompleteMessage : drawerTurnCompleteMessage}
                <div id="shareContentDiv" className="card">
                    <div className="card-body">
                        <a href={this.getShareUrl()}>{this.getShareUrl()}</a>
                    </div>
                </div>
                {/* <div className="mt-4 d-grid gap-4 g-3 d-md-flex justify-content-around"> */}
                <div className="mt-3 row row-cols-1 g-3 row-cols-sm-2 gx-sm-3 row-cols-md-3">
                    {this.state.isShareFeatureAvailable ? (
                        <div className="col">
                            <button className="btn btn-primary w-100" onClick={this.showSharePopup}>Share</button>
                        </div>
                    ) : ""}
                    <div className="col">
                        <button className="btn btn-primary w-100" onClick={() => this.copyContentForSharing("url")}>Copy game link</button>
                    </div>
                    <div className="col col-sm-12">
                        <button className="btn btn-primary w-100" onClick={() => this.copyContentForSharing("drawing")}>or Copy the drawing</button>
                    </div>
                </div>
            </div>
        )

        const postLoadingScreen = this.state.showTurnCompleteScreen ? turnCompleteScreen : (this.state.roomId ? readyRoomScreen : roomNotFoundScreen)
        return (
            <div className="d-flex" style={{ flexDirection: "column", flexGrow: 1 }}>
                <Head>
                    <title>Group Pictionary: {this.state.roomName} room</title>
                </Head>
                <Alert alertMsg={this.state.alertMsg} type={this.state.alertType} />
                <div style={{ flexGrow: 1, flexDirection: "column" }} className="d-flex">
                    {this.state.initializingRoom ? loadingRoomScreen : postLoadingScreen}
                </div>
            </div>
        )
    }
}

Arena.propTypes = {
    roomId: PropTypes.string.isRequired
}