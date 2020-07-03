
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

// TODO: - Animation / Wiedergabe delayen -> Chimes Ton erklingen bei Limit
// TODO: - Chimes Limit nach Tonhöhe
// TODO: - luca sagen: delete elements for performance

// Chimes deletion in Konsole testen:
// setInterval(() => {console.log(chimesArray.length)}, 1000);

let drumsSound 
let chimesSound 
let songSound
let ball_array = []
let chimesArray = []


function preload(){
    drumsSound  = loadSound('tracks/drums.mp3');
    chimesSound  = loadSound('tracks/other.mp3');
    songSound = loadSound('avada_kadabra.mp3');
}

let canvas;
let button;
let bassFft;

let bass;

function setup(){
    canvas = createCanvas(1920, 1080);
    button = createButton('play / pause');
    button.position(10, canvas.height + 10);
    button.mousePressed(toggleSong);

    drumsSound.disconnect();
    chimesSound.disconnect();
    // song.disconnect();

    bassFft = new p5.FFT()
    bassFft.setInput(drumsSound);
    chimesFft = new p5.FFT()
    chimesFft.setInput(chimesSound);

    bass = new Bass()
}
function draw(){
    background(0);
    checkBass();
    checkChimes();

    bass.update();
    bass.show();

    ball_array.forEach(function (ball){
        ball.update();
        ball.show();
    })
    chimesArray.forEach(function (chime){
        chime.update();
        chime.show();
    })
    chimesArray = chimesArray.filter(chime => chime.x > 0);
}


let lastBassVal = 0;
let directionBass = 1;

function checkBass(){
    let bassSpectrum = bassFft.analyze();
    // console.log(bassSpectrum)
    let bassValue = bassSpectrum[511];
    // console.log(bassValue);
    if(lastBassVal > bassValue){
        if(directionBass > 0 && lastBassVal > 92){
            //let ball = new Ball(50, 50);
            //ball_array.push(ball);
            let chime = new Chimes(canvas.width / 2, 0, canvas.height / 2);
            chimesArray.push(chime);
            bass.impulse();
        }

        directionBass = -1;
    }else{
        directionBass = 1;
    }

    // console.log(directionBass);
    lastBassVal = bassValue;
}

let lastChimesVal = 0;
let directionChimes = 1;

function checkChimes(){
    let chimesSpectrum = chimesFft.analyze();
    // console.log(bassSpectrum)
    let chimesValue = chimesSpectrum[58];
    // console.log(bassValue);
    if(lastChimesVal > chimesValue){
        if(directionChimes > 0 && lastChimesVal > 150){

            let chime = new Chimes(canvas.width / 2, 0, canvas.height / 2);
            chimesArray.push(chime);
        }

        directionChimes = -1;
    }else{
        directionChimes = 1;
    }

    // console.log(directionBass);
    lastChimesVal = chimesValue;
}

function toggleSong(){
    if(songSound.isPlaying()){
        songSound.pause();
        drumsSound.pause();
    }else{
        songSound.play();
        drumsSound.play();
    }
}


class Ball{
    constructor(x, y, r = 20){
        this.x = x;
        this.y = y;
        this.r = r;
        this.speed = 0.8;
        this.accel = 1.3;
    }

    show(){
        push();
        stroke(255);
        strokeWeight(3);
        fill(100);
        ellipse(this.x, this.y, this.r * 2);
        pop();
    }

    update(){
        this.y += this.speed;
        this.speed *= this.accel;
    }
}

class Bass{
    constructor(r = 900){
        this.x = canvas.width / 2;
        this.y = canvas.height / 2;
        this.r = r;
        this.rDefault = 900;
        this.sizing = 10;
    }

    show(){
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

    update(){
        let value = (this.r - this.rDefault) * 0.1
        if(this.r > this.rDefault) {
            this.r -= value;
        }
    }
}

class Chimes{
    constructor(x, y, l, r = 20){
        this.x = x;
        this.y = y;
        this.r = r;
        this.speed = 0.8;
        this.move = 3;
        this.accel = 1.1;
        this.limit = l;
    }

    show(){
        push();
        stroke(100);
        strokeWeight(3);
        fill(255);
        ellipse(this.x, this.y, this.r * 2);
        pop();
    }

    update(){
        // move circle
        if (this.y >= this.limit) {
            this.x -= this.move;
        } else {
            this.y += this.speed;
            this.speed += this.accel;
        }
    }
}