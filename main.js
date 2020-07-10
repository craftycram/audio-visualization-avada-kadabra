/** 
 * left channel
 * drumsSound.mp3
 * Band: 43
 * peak: ca 180
 */
/**
 * Bass: 43, 20
 */
/**
 * bass 270 (100)
 * 511 (92)
 */

// Chimes 31, 40, 50, 53

// bass.mp3
// Band 6/7 - 1. peak: 155 / 2.peak: 170 - 

// TODO: - Animation / Wiedergabe delayen -> Chimes Ton erklingen bei Limit
// TODO: - Chimes Limit nach Tonhöhe
// TODO: - luca sagen: delete elements for performance

// TODO: - Luca: Problem Bass und Drums gleichzeitig

// Chimes deletion in Konsole testen:
// setInterval(() => {console.log(chimesArray.length)}, 1000);

let drumsSound
let bassSound
let chimesSound
let songSound
let ball_array = []
let chimesArray = []


function preload() {
    drumsSound = loadSound('tracks/drums.mp3');
    bassSound = loadSound('tracks/bass.mp3');
    chimesSound = loadSound('avada_kadabra.mp3');
    songSound = loadSound('avada_kadabra.mp3');
}

let canvas;
let button;
let drumsFft;
let bassFft;

let bass;

function setup() {
    canvas = createCanvas(1920, 1080);
    button = createButton('play / pause');
    button.position(10, canvas.height + 10);
    button.mousePressed(toggleSong);

    drumsSound.disconnect();
    chimesSound.disconnect();
    bassSound.disconnect();
    // song.disconnect();

    drumsFft = new p5.FFT()
    drumsFft.setInput(drumsSound);
    bassFft = new p5.FFT()
    bassFft.setInput(bassSound);
    chimesFft = new p5.FFT()
    chimesFft.setInput(chimesSound);

    bass = new Bass()
}

function draw() {
    background(0);
    checkDrums();
    checkBass();
    checkChimes();

    getPeaks();

    bass.update();
    bass.show();

    ball_array.forEach(function (ball) {
        ball.update();
        ball.show();
    })
    chimesArray.forEach(function (chime) {
        chime.update();
        chime.show();
    })
    chimesArray = chimesArray.filter(chime => chime.x > 0 - chime.r * 2);
}


let lastDrumsVal = 0;
let directionDrums = 1;
let lastDrumsTime = 0;

function checkDrums() {
    let drumsSpectrum = drumsFft.analyze();
    // console.log(drumsSpectrum)
    let drumsValue = drumsSpectrum[4];
    // console.log(drumsValue);
    const time = getMillis();
    if (lastDrumsVal > drumsValue) {
        if (directionDrums > 0 && lastDrumsVal > 195 && time - lastDrumsTime > 300) {
            //let ball = new Ball(50, 50);
            //ball_array.push(ball);
            bass.impulse();
            lastDrumsTime = time;
        }

        directionDrums = -1;
    } else {
        directionDrums = 1;
    }

    // console.log(directionDrums);
    lastDrumsVal = drumsValue;
}

let lastBassVal = 0;
let directionBass = 1;
let lastBassTime = 0;

function checkBass() {
    let bassSpectrum = bassFft.analyze();
    // console.log(bassSpectrum)
    let bassValue = bassSpectrum[6];
    // console.log(bassValue);
    const time = getMillis();
    if (lastBassVal > bassValue) {
        if (directionBass > 0 && lastBassVal > 150 /*&& time - lastBassTime > 300*/ ) {
            //let ball = new Ball(50, 50);
            //ball_array.push(ball);
            bass.impulse();
            lastBassTime = time;
        }

        directionBass = -1;
    } else {
        directionBass = 1;
    }

    // console.log(directionDrums);
    lastBassVal = bassValue;
}

let lastChimesVal = 0;
let directionChimes = 1;
let lastChimesBand = 0;

const bands = [{band:40,value:240, timestamp: 0},{band:53,value:222, timestamp: 0},{band:43,value:255, timestamp: 0},{band:65,value:249, timestamp: 0},{band:58,value:253, timestamp: 0},{band:68,value:245, timestamp: 0},{band:82,value:244, timestamp: 0},{band:86,value:241, timestamp: 0},{band:79,value:194, timestamp: 0},{band:71,value:214, timestamp: 0}];
function checkChimes() {
    let chimesSpectrum = chimesFft.analyze();
    bands.forEach(element => {
        let chimesValue = chimesSpectrum[element.band];
        if (lastChimesVal > chimesValue && lastChimesBand !== element.band) {
            if (directionChimes > 0 && lastChimesVal > element.value - 10 && getMillis() - element.timestamp > 200) {
                element.timestamp = getMillis();
                lastChimesBand = element.band;
                const yArea = 500;
                const yPos = map(element.value, 150, 300, canvas.height / 2 + yArea, canvas.height / 2 - yArea);
                let chime = new Chimes(canvas.width / 2, 0, yPos, 20, element.band, element.value);
                chimesArray.push(chime);
            }

            directionChimes = -1;
        } else {
            directionChimes = 1;
        }

        lastChimesVal = chimesValue;
    });

}

/*
let chime = new Chimes(canvas.width / 2, 0, canvas.height / 2);
chimesArray.push(chime);
*/


function toggleSong() {
    drumsSound.play();
    chimesSound.play();
    bassSound.play();
    setTimeout(function () {
        songSound.play();
    }, 80);
    /*
    if(songSound.isPlaying()){
        songSound.pause();
        drumsSound.pause();
     }else{
         songSound.play();
         drumsSound.play();
     }
     */
}

function getMillis() {
    let d = new Date();
    return d.getTime()
}
class Ball {
    constructor(x, y, r = 20) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.speed = 0.8;
        this.accel = 1.3;
    }

    show() {
        push();
        stroke(255);
        strokeWeight(3);
        fill(100);
        ellipse(this.x, this.y, this.r * 2);
        pop();
    }

    update() {
        this.y += this.speed;
        this.speed *= this.accel;
    }
}

class Bass {
    constructor(r = 900) {
        this.x = canvas.width / 2;
        this.y = canvas.height / 2;
        this.r = r;
        this.rDefault = 900;
        this.sizing = 10;
    }

    show() {
        push();
        //stroke(125);
        noStroke();
        strokeWeight(3);
        fill(225);
        ellipse(this.x, this.y, this.r * 2);
        pop();
    }

    impulse() {
        this.r += 100;
    }

    update() {
        let value = (this.r - this.rDefault) * 0.1
        if (this.r > this.rDefault) {
            this.r -= value;
        }
    }
}

class Chimes {
    constructor(x, y, l, r = 20, b, p) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.speed = 0.8;
        this.move = 3;
        this.accel = 1.1;
        this.limit = l;
        this.band = b;
        this.peak = p;
        this.color = color(125, 125, 125);
    }

    show() {
        push();
        stroke(100);
        strokeWeight(3);
        fill(this.color);
        noStroke();
        ellipse(this.x, this.y, this.r * 2);
        pop();
    }

    update() {
        // move circle
        if (this.y >= this.limit) {
            this.x -= this.move;
            this.color.setAlpha(map(this.x, canvas.width/2,0, 255,0));
            fill(this.color);
        } else {
            this.y += this.speed;
            this.speed += this.accel;
        }
    }
}

const bandsCheck = [{
    band: 40,
    value: 0
},
{
    band: 53,
    value: 0
},
{
    band: 43,
    value: 0
},
{
    band: 65,
    value: 0
},
{
    band: 58,
    value: 0
},
{
    band: 68,
    value: 0
},
{
    band: 82,
    value: 0
},
{
    band: 86,
    value: 0
},
{
    band: 63,
    value: 0
},
{
    band: 79,
    value: 0
},
{
    band: 71,
    value: 0
}
];
function getPeaks() {
    let chimesSpectrum = chimesFft.analyze();
    
    bandsCheck.forEach(element => {
        let chimesValue = chimesSpectrum[element.band];
        if (element.value < chimesValue) {
            element.value = chimesValue;
        }

        lastChimesVal = chimesValue;
    });

}