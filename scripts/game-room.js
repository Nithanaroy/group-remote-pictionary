const ROOM_ID_KEY = "roomId"

export function extractRoomId() {
    const queryParams = new URLSearchParams(window.location.search);
    return queryParams.get(ROOM_ID_KEY);
}

export function updateRoomIdInURL(roomId) {
    const url = new URL(window.location.href);
    url.searchParams.set(ROOM_ID_KEY, roomId);
    window.history.pushState({}, "", url);
}