import { Component } from "react";
import { createRoom } from "../models/firestore-state-manager";
import { extractRoomId, updateRoomIdInURL, retrieveRecentRooms, ROOM_ID_KEY } from "../scripts/game-room";
import Alert from "./alert";
import Arena from "./arena";

const MIN_ROOM_NAME_LENGTH = 3

export default class GameRoom extends Component {
    constructor(props) {
        super(props);
        this.state = {
            alertMsg: "",
            roomId: "",
            roomName: "",
            recentRooms: []
        }
    }

    _validateRoom = () => {
        return this.state.roomName.trim().length >= MIN_ROOM_NAME_LENGTH
    }

    onCreateRoom = async () => {
        try {
            if (this._validateRoom()) {
                const newRoomId = await createRoom(this.state.roomName)
                this.setState({ alertMsg: "" })
                this.setState({ roomId: newRoomId }); // navigates to the room
                updateRoomIdInURL(newRoomId);
            } else {
                this.setState({alertMsg: `Room name should have atleast 3 letters`})
            }
        } catch (error) {
            console.error(error);
            this.setState({ alertMsg: "Oops! Could not create room" });
        }
    }

    componentDidMount() {
        this.setState({ roomId: extractRoomId(), recentRooms: retrieveRecentRooms() });
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
                        <li>Finally share a unique link with your friends on WhatsApp or elsewhere</li>
                    </ol>
                </div>

                <div className="row g-3 align-items-center mb-3">
                    <div className="col-auto">
                        <label htmlFor="roomNameTb" className="col-form-label">Room name</label>
                    </div>
                    <div className="col-auto">
                        <input type="text" className="form-control" name="roomNameTb" minLength={MIN_ROOM_NAME_LENGTH}
                            onChange={(e) => this.setState({ roomName: e.target.value })} value={this.state.roomName} />
                    </div>
                    <div className="col-auto">
                        <span id="roomNameHelp" className="form-text"></span>
                    </div>
                </div>
                <button className="btn btn-primary" onClick={this.onCreateRoom}>Create New Room</button>
            </form>
        )

        const recentRoomsScreen = (
            <div className={`list-group-flush ${this.state.recentRooms.length === 0 ? "d-none" : ""}`}>
                <p className="display-6">Or join one of your previous rooms</p>
                {this.state.recentRooms.map(room => (
                    <a key={room.roomId} href={`/?roomId=${room.roomId}`} className="list-group-item list-group-item-action">{room.roomName}</a>
                ))}
            </div>
        )

        const gameRoomScreen = (
            <div className="d-grid row">
                <div className="col">
                    {createRoomScreen}
                </div>
                <div className="col gy-5">
                    {recentRoomsScreen}
                </div>
            </div>
        )

        return (
            <div style={{ flexGrow: 1, flexDirection: "column" }} className="d-flex">
                <Alert alertMsg={this.state.alertMsg} />
                { this.state.roomId ? <Arena roomId={this.state.roomId} /> : gameRoomScreen}
            </div>
        )
    }
}