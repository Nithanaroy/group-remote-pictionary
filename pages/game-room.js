import { Component } from "react";
import { createRoom } from "../models/firestore-state-manager";
import { extractRoomId } from "../scripts/game-room";
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
            this.setState({ roomId: await createRoom(this.state.roomName) });
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
            <div id="createRoomDiv">
                <p>To start playing with a group of friends create a room</p>
                <div>
                    <label htmlFor="roomNameTb">Room name</label>
                    <input type="text" name="roomNameTb" onChange={(e) => this.setState({ roomName: e.target.value })} value={this.state.roomName} />
                </div>
                <button type="button" onClick={this.onCreateRoom}>Create New Room</button>
            </div>
        )

        return (
            <div>
                <Alert alertMsg={this.state.alertMsg} />
                { this.state.roomId ? <Arena roomId={this.state.roomId} /> : createRoomScreen }
            </div>
        )
    }
}