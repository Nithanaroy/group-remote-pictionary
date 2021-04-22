import { Component } from "react";
import { PropTypes } from "prop-types";

export default class Leaderboard extends Component {

    constructor(props) {
        super(props)
        this.state = { rankedGamers: [] }
    }

    rankGamers = () => {
        const totalScores = {}
        const allGamers = new Set(Object.keys(this.props.drawingScores).concat(Object.keys(this.props.guessingScores)))
        for (const gamer of allGamers) {
            const score = this.props.drawingScores[gamer]
            totalScores[gamer] = [score || 0]
        }
        for (const gamer of allGamers) {
            const score = this.props.guessingScores[gamer]
            totalScores[gamer].push(score || 0)
        }
        const sum = arr => arr.reduce((v, agg) => agg + v, 0)
        const rankedGamers = Object.entries(totalScores).sort(([gamer1, scores1], [gamer2, scores2]) => sum(scores2) - sum(scores1))
        this.setState({ rankedGamers })
    }

    componentDidMount() {
        this.rankGamers()
    }

    render() {
        return (
            <div id={this.props.id} className="modal fade" tabIndex="-1" aria-labelledby="leaderboardModal" aria-hidden="true">
                <div className="modal-dialog modal-fullscreen-sm-down">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Leaderboard</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th scope="col">#</th>
                                        <th scope="col">Gamer</th>
                                        <th scope="col">Score</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.rankedGamers.map(([gamer, scores], i) => {
                                        return (
                                            <tr key={i}>
                                                <th scope="row">{i + 1}</th>
                                                <td>{gamer}</td>
                                                <td>{`${scores[0]} + ${scores[1]}`}</td>
                                            </tr>
                                        )
                                    })}

                                </tbody>
                            </table>

                        </div>
                        <div className="modal-footer">
                            A score of 40 + 20 indicates, 40 points for drawing and 20 points for guessing correctly.
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

Leaderboard.propTypes = {
    id: PropTypes.string.isRequired
}