export function parseUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const gameState = decodeState(urlParams.get('gameState') || "");
    const updatedAt = urlParams.get('updatedAt');
    return { state: gameState, updatedAt }
}

function decodeState(rawState) {
    let state = {"name": "", "word": "", "drawing": "", "streak": 0};
    const stateStr = atob(rawState)
    if (stateStr.length > 0) {
        const currentState = JSON.parse(stateStr)
        state = {...state, ...currentState};
    }
    return state
}

function encodeState() {
        
}