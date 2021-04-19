import { Component } from "react";
import { createRoom } from "../models/firestore-state-manager";
import { extractRoomId, updateRoomIdInURL } from "../scripts/game-room";
import Alert from "./alert";
import Arena from "./arena";

export default class GameRoom extends Component {
    constructor(props) {
        super(props);
        this.state = {
            alertMsg: "",
            roomId: "",
            roomName: ""
        }
    }

    onCreateRoom = async () => {
        try {
            const newRoomId = await createRoom(this.state.roomName)
            this.setState({ roomId: newRoomId });
            updateRoomIdInURL(newRoomId);
        } catch (error) {
            console.error(error);
            this.setState({ alertMsg: "Oops! Could not create room" });
        }
    }

    componentDidMount() {
        this.setState({ roomId: extractRoomId() });
    }

    render() {
        const createRoomScreen = (
            <form id="createRoomDiv" style={{ display: "flex", flexDirection: "column", justifyContent: "center" }} onSubmit={e => e.preventDefault()}>

                <p className="lead text-center">Welcome! play pictionary with friends and family
                    <span data-bs-toggle="tooltip" data-bs-placement="top" title="everyone can play at their own leisure"> asynchronously</span>.
                </p>
                <p>The pictionary game that can be played forever.</p>
                <div>
                    Start a new game in 3 steps,
                    <ol>
                        <li>Create a game room for you &amp; your friends</li>
                        <li>Make a drawing of the given word</li>
                        <li>Finally share the given link with your friends directly or in a (WhatsApp) group</li>
                    </ol>
                </div>

                <div className="row g-3 align-items-center mb-3">
                    <div className="col-auto">
                        <label htmlFor="roomNameTb" className="col-form-label">Room name</label>
                    </div>
                    <div className="col-auto">
                        <input type="text" className="form-control" name="roomNameTb"
                            onChange={(e) => this.setState({ roomName: e.target.value })} value={this.state.roomName} />
                    </div>
                    <div className="col-auto">
                        <span id="roomNameHelp" className="form-text"></span>
                    </div>
                </div>
                <button className="btn btn-primary" onClick={this.onCreateRoom}>Create New Room</button>
            </form>
        )

        return (
            <div style={{flexGrow: 1, flexDirection: "column"}} className="d-flex">
                <Alert alertMsg={this.state.alertMsg} />
                { this.state.roomId ? <Arena roomId={this.state.roomId} /> : createRoomScreen}
            </div>
        )
    }
}