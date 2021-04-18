export function extractRoomId() {
    const queryParams = new URLSearchParams(window.location.search);
    return queryParams.get("roomId");
}