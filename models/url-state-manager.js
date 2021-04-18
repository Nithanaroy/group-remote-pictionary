/**
 * Maintain app state using URLs
 * Doesn't require any additional database
 */

import {defaultState} from "./state-manager";

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

export async function shortenGameUrl(url) {
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