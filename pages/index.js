import Head from "next/head";
import { Component } from "react";
import GameRoom from "./game-room";

export default class Home extends Component {

  render() {
    return (
      <div style={{ minHeight: "100vh", flexDirection: "column" }} className="d-flex">
        <nav className="navbar navbar-expand-lg navbar-light bg-light mb-3">
          <div className="container-fluid">
            <a className="navbar-brand" href="/">GP</a>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav">
                <li className="nav-item">
                  <a className="nav-link active" aria-current="page" href="/">Create New Game Room</a>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        <div className="container-sm d-flex" style={{flexGrow: 1}}>
          <Head>
            <title>Group Pictionary</title>
            <meta charSet="utf-8" />
            <meta name="viewport" content="width=device-width,user-scalable=no,initial-scale=1" />
          </Head>

          <GameRoom />
        </div>
      </div>
    )
  }
}
