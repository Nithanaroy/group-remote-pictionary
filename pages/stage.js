import { Component } from "react";
import Guesser from "./guesser"
import Drawer from "./drawer"
import { parseUrl, encodeState, defaultState as defaultGameState } from "../scripts/url-parser";

export default class Stage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showShareURL: false,
            gameStateURL: ""
        }
    }

    componentDidMount() {
        const { gameState } = parseUrl()
        this.setState({ gameState });
    }

    shareGameState = async (word, drawing) => {
        const { gameState } = this.state;
        const url = encodeState(gameState.name, word, drawing, gameState.streak + 1);
        const shortUrl = await this.shortenGameUrl(url);
        this.setState({ showShareURL: true, gameStateURL: shortUrl });
    }

    async shortenGameUrl(url) {
        const firebaseApiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY // next.js builder replaces this
        const resp = await fetch(`https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=${firebaseApiKey}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                "dynamicLinkInfo": {
                    "domainUriPrefix": "https://grouppictionary.page.link",
                    "link": url
                }
            })
        });
        const shortUrl = (await resp.json()).shortLink;
        return shortUrl;
    }

    render() {
        const showGuessState = this.state.gameState?.drawing?.length > 0
        return (
            <div>
                {showGuessState ? <Guesser /> : <Drawer onDrawingSubmit={this.shareGameState} />}
                <div style={{ "display": this.state.showShareURL ? "block" : "none" }}>
                    <p>Share this in your group to continue the game,</p>
                    <p>{this.state.gameStateURL}</p>
                </div>
            </div>
        )
    }
}