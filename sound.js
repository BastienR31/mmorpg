const playSound = () => {

    let urlMusic = "/examples/sound/desert_ambient_1.mp3";
    let sound = document.createElement("audio");

    sound.src = urlMusic;

    sound.volume = 0.01;
    sound.play();
};

const playEffect = effect => {

    let urlEffect = `/examples/sound/effects/${effect}`;
    let audioEffect = document.createElement("audio");

    audioEffect.src = urlEffect;

    audioEffect.volume = 0.2;
    audioEffect.play();
};
