import { loadJSON } from '../loaders.js';
import AudioBoard from '../AudioBoard.js';

// const audioContext = new AudioContext();
// const audioBoard = new AudioBoard(audioContext);
// const jumpBuffer = await loadAudio('/audio/jump.ogg');
// audioBoard.addAudio('jump', jumpBuffer);
// const stompBuffer = await loadAudio('/audio/stomp.ogg');
// audioBoard.addAudio('stomp', stompBuffer);

export async function loadAudioBoard(name, audioContext) {
    const loadAudio = createAudioLoader(audioContext);
    const AudioSheet = await loadJSON(`/sounds/${name}.json`);
    const audioBoard = new AudioBoard();
    const fx = AudioSheet.fx;
    const jobs = Object.keys(fx).map(name => {
        const url = fx[name].url;

        return loadAudio(url).then(buffer => {
            audioBoard.addAudio(name, buffer);
        });
    });

    await Promise.all(jobs);

    return audioBoard;
}

export function createAudioLoader(audioContext) {
    return async function loadAudio(url) {
        const response = await fetch(url);
        const buffer = await response.arrayBuffer();
        return audioContext.decodeAudioData(buffer);
    }
}