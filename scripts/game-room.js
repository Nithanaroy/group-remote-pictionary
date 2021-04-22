export const ROOM_ID_KEY = "roomId"
const RECENT_ROOMS_KEY = "recent_rooms"

export function extractRoomId() {
    const queryParams = new URLSearchParams(window.location.search);
    return queryParams.get(ROOM_ID_KEY);
}

export function updateRoomIdInURL(roomId) {
    const url = new URL(window.location.href);
    url.searchParams.set(ROOM_ID_KEY, roomId);
    window.history.pushState({}, "", url);
}

export function retrieveRecentRooms() {
    return JSON.parse(window.localStorage.getItem(RECENT_ROOMS_KEY) || "[]");
}

export function saveRoomToDisk(roomName, roomId) {
    const recentRooms = retrieveRecentRooms();
    const newRoomsOrder = recentRooms.filter(room => room.roomId !== roomId); // exclude the current room
    newRoomsOrder.splice(0, 0, { roomId, roomName }); // like a stack
    window.localStorage.setItem(RECENT_ROOMS_KEY, JSON.stringify(newRoomsOrder))
}

