/**
 * Manage more complex state using Firebase's Firestore DB
 */

import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, collection, addDoc, query, where, doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { initializePerformance as initializePerformanceTracking, getPerformance  } from "firebase/performance";

import { defaultRoomState } from "./state-manager";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: "group-pictionary.firebaseapp.com",
    projectId: "group-pictionary",
    storageBucket: "group-pictionary.appspot.com",
    messagingSenderId: "851797664401",
    appId: "1:851797664401:web:f2673b23d3a7924a2bd530",
    measurementId: "G-N99QS9DMH7"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

const db = getFirestore();
const ROOMS_COLLECTION = "rooms"

const roomsRef = collection(db, ROOMS_COLLECTION);

export async function createRoom(roomName) {
    const roomDetails = { ...defaultRoomState, roomName }
    const docRef = await addDoc(roomsRef, roomDetails)
    return docRef.id;
}

export async function getRoomState(roomId) {
    const docRef = doc(db, ROOMS_COLLECTION, roomId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return { ...docSnap.data(), roomId: roomId };
    }
    console.warn(`Room ID, ${roomId} not found`);
}

export async function updateRoomState(roomId, newRoomState) {
    const roomRef = doc(db, ROOMS_COLLECTION, roomId);
    const stateToSave = { ...newRoomState, updatedAt: serverTimestamp() }
    await setDoc(roomRef, stateToSave, { merge: true });
}

export function initializeTracking() {
    try {
        initializePerformanceTracking(app)
    } catch (error) {
        console.error(error)
    }
}