import { Component } from "react";
import { createRoom } from "../models/firestore-state-manager";
import Alert from "./alert";

export default class GameRoom extends Component {
    constructor(props) {
        super(props);
        this.state = {
            alertMsg: "",
            roomId: "",
            roomName: "Flanthar Fagidis"
        }
    }

    onCreateRoom = async () => {
        try {
            this.setState({ roomId: await createRoom(this.state.roomName) });
        } catch (error) {
            console.error(error);
            this.setState({ alertMsg: "Oops!" });
        }
    }

    render() {
        return (
            <div>
                <Alert alertMsg={this.state.alertMsg} />
                <div id="createRoomDiv">
                    <p>To start playing with a group of friends create a room</p>
                    <div>
                        <label htmlFor="roomNameTb">Room name</label>
                        <input type="text" name="roomNameTb" onChange={(e) => this.setState({ roomId: e.target.value })} value={this.state.roomName} />
                    </div>
                    <button type="button" onClick={this.onCreateRoom}>Create New Room</button>
                </div>
            </div>
        )
    }
}