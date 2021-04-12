import { Component } from "react";

export default class Guesser extends Component {
    render() {
        return (
            <div>
                <h1>Guess the drawing</h1>
                <form action="">
                    <div>
                        <label htmlFor="guesser-name">Name</label>
                        <input name="guesser-name" type="text" />
                    </div>
                    <div>
                        <p>Drawing</p>
                        <div><img src="" alt="" /></div>
                    </div>
                    <div>
                        <label htmlFor="guesser-guess">Your Guess</label>
                        <input name="guesser-guess" type="text" />
                    </div>
                    <button type="button">Submit</button>
                </form>
            </div>
        );
    }
}

