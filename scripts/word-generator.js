import easyWords from "../data/easy-words";
import mediumWords from "../data/medium-words";
import hardWords from "../data/hard-words";
import reallyHardWords from "../data/really-hard-words";

function pickARandomWordFromList(wordList) {
    const wordIndex = parseInt(Math.random() * wordList.length);
    return wordList[wordIndex];
}

export function generateEasyWord() {
    return pickARandomWordFromList(easyWords)
}

export function generateMediumWord() {
    return pickARandomWordFromList(mediumWords)
}

export function generateHardWord() {
    return pickARandomWordFromList(hardWords)
}

export function generateReallyHardWord() {
    return pickARandomWordFromList(reallyHardWords);
}

export function generateARandomWord() {
    const wordGenerators = [generateEasyWord, generateMediumWord, generateHardWord, generateReallyHardWord];
    const randomWordSetIndex = parseInt(Math.random() * wordGenerators.length);
    const selectedWordGen = wordGenerators[randomWordSetIndex];
    return selectedWordGen();
}