export const defaultState = { "name": "", "word": "", "drawing": "", "streak": 0 };

export function parseUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const gameState = decodeState(urlParams.get('gameState') || "");
    const updatedAt = urlParams.get('updatedAt');
    return { gameState, updatedAt }
}

function decodeState(rawState) {
    let state = { ...defaultState };
    const stateStr = atob(rawState)
    if (stateStr.length > 0) {
        const currentState = JSON.parse(stateStr)
        state = { ...state, ...currentState };
    }
    return state
}

export function encodeState(name, word, drawing, streak) {
    const newState = {name, word, drawing, streak};
    const stateStr = btoa(JSON.stringify(newState));
    const updatedAt = new Date().getTime();
    const url = new URL(window.location);
    url.searchParams.append("gameState", stateStr);
    url.searchParams.append("updatedAt", updatedAt);
    return url.toString();
}