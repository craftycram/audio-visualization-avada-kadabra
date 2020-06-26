
/** 
 * left channel
 * drums.mp3
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



let drums 
let song
let ball_array = []


function preload(){
    drums  = loadSound('tracks/drums.mp3');
    song = loadSound('avada_kadabra.mp3');
}

let canvas;
let button;
let clapsFft;

let bass;

function setup(){
    canvas = createCanvas(1920, 1080);
    button = createButton('play / pause');
    button.position(10, canvas.height + 10);
    button.mousePressed(toggleSong);

    drums.disconnect();
    // song.disconnect();

    clapsFft = new p5.FFT()
    clapsFft.setInput(drums);

    bass = new Bass()
}
function draw(){
    background(0);
    checkHH();

    bass.update();
    bass.show();

    ball_array.forEach(function (ball){
        ball.update();
        ball.show();
    })
}


let lastClapsVal = 0;
let directionClaps = 1;

function checkHH(){
    let clapsSpectrum = clapsFft.analyze();
    // console.log(clapsSpectrum)
    let clapsValue = clapsSpectrum[511];
    // console.log(clapsValue);
    if(lastClapsVal > clapsValue){
        if(directionClaps > 0 && lastClapsVal > 92){
            //let ball = new Ball(50, 50);
            //ball_array.push(ball);
            bass.impulse();
        }

        directionClaps = -1;
    }else{
        directionClaps = 1;
    }

    // console.log(directionClaps);
    lastClapsVal = clapsValue;
}

function toggleSong(){
    if(song.isPlaying()){
        song.pause();
        drums.pause();
    }else{
        song.play();
        drums.play();
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