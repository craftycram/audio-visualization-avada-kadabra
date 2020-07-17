// Chimes deletion in Konsole testen:
// setInterval(() => {console.log(chimesArray.length)}, 1000);

let drumsSound
let bassSound
let chimesSound
let songSound
let ball_array = []
let chimesArray = []
let violinArray = []

let startTime;

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
let drums;
let bassColor;

function setup() {
    translate(-500, -500);
    // canvas = createCanvas(1920, 1080, WEBGL);
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

    bassColor = color('#ededed');
    bass = new Bass();
    drums = new Drums();
}

function draw() {
    background(0);
    checkDrums();
    checkBass();
    checkChimes();

    
    // getPeaks();
    
    bass.update();
    bass.show();
    
    drums.update();
    drums.show();
    
    ball_array.forEach(function (ball) {
        ball.update();
        ball.show();
    })

    drawViolin();
    violinArray.forEach((violin) => {
        violin.update();
        violin.show();
    })
    
    chimesArray.forEach(function (chime) {
        chime.update();
        chime.show();
    })
    chimesArray = chimesArray.filter(chime => chime.x > 0 - chime.r * 2);
    
}


let lastDrumsVal = 0;
let lastClapsVal = 0;
let directionDrums = 1;
let lastDrumsTime = 0;
let lastClapsTime = 0;
let drumsCounter = 0;

let violinState = 0;

function drawViolin() {
    push();
    fill(100);
    text(drumsCounter, 10, 20);
    pop();
    // 16 32 45 59 77
    if (drumsCounter === 16 && violinState === 0) { // 15
        violinArray.push(new Violin(100, 800, 100+320, 800-620));
        violinState++;
    }
    if (drumsCounter === 31 && violinState === 1) { // 31
        violinArray.push(new Violin(400, 800, 400+320, 800-620));
        violinState++;
    }
    if (drumsCounter === 44 && violinState === 2) { // 44
        const xStart = 700;
        const yStart = 800;

        violinArray.push(new Violin(xStart, yStart, xStart+300, yStart-600));
        violinArray.push(new Violin(xStart + 20, yStart, xStart+330, yStart-620));
        violinArray.push(new Violin(xStart + 40, yStart, xStart+360, yStart-620));

        violinArray.push(new Violin(xStart + 80, yStart-10, xStart+400, yStart-630));

        violinArray.push(new Violin(xStart + 110, yStart+20, xStart+530, yStart-600));
        
        violinArray.push(new Violin(xStart + 160, yStart-30, xStart+580, yStart-650));
        violinState++;
    }
    if (drumsCounter === 59 && violinState === 3) { // 59
        const xStart = 1000;
        const yStart = 800;

        violinArray.push(new Violin(xStart + 40, yStart-10, xStart+360, yStart-630));

        violinArray.push(new Violin(xStart + 80, yStart, xStart+400, yStart-620));

        violinArray.push(new Violin(xStart + 120, yStart-10, xStart+440, yStart-630));
        
        violinArray.push(new Violin(xStart + 160, yStart, xStart+480, yStart-620));


        violinArray.push(new Violin(xStart + 200, yStart+20, xStart+540, yStart - 610));
        violinState++;
    }
    if (drumsCounter === 76 && violinState === 4) { // 76
        const xStart = 1300;
        const yStart = 800;

        violinArray.push(new Violin(xStart, yStart, xStart+320, yStart-620));
        violinArray.push(new Violin(xStart + 20, yStart, xStart+340, yStart-620));
        violinArray.push(new Violin(xStart + 40, yStart, xStart+360, yStart-620));

        violinArray.push(new Violin(xStart + 80, yStart-10, xStart+400, yStart-630));

        violinArray.push(new Violin(xStart + 110, yStart+20, xStart+430, yStart-600));
        
        violinArray.push(new Violin(xStart + 160, yStart-30, xStart+480, yStart-650));
        violinState++;
    }
}

function checkDrums() {
    time = getMillis();


    let drumsSpectrum = drumsFft.analyze();
    //console.log(drumsSpectrum)
    let clapsValue = drumsSpectrum[325];
    // console.log(drumsSpectrum[325])
    if (lastClapsVal > clapsValue && time - lastClapsTime > 500) {
        if (lastClapsVal > 100) {

            if(chimesArray.length > 0) {
                // Glockenspiele mit Claps manipulieren.
                const chimeId = Math.floor(Math.random() * chimesArray.length);
                chimesArray[chimeId].color = color('#1B2640');
                chimesArray[chimeId].clap = true;
            }

            lastClapsTime = time;
        }
    }
    lastClapsVal = clapsValue;

    let drumsValue = drumsSpectrum[4];
    // console.log(drumsValue);
    if (lastDrumsVal > drumsValue) {
        if (directionDrums > 0 && lastDrumsVal > 195 && time - lastDrumsTime > 300) {
            //let ball = new Ball(50, 50);
            //ball_array.push(ball);
            drums.impulse();
            lastDrumsTime = time;
            drumsCounter++;

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
const bands = [{band:32,value:230,timestamp: 0},{band:34,value:255,timestamp: 0},{band:40,value:247,timestamp: 0},{band:43,value:255,timestamp: 0},{band:54,value:246,timestamp: 0},{band:58,value:249,timestamp: 0},{band:61,value:249,timestamp: 0},{band:65,value:244,timestamp: 0},{band:68,value:244,timestamp: 0},{band:73,value:245,timestamp: 0},{band:77,value:244,timestamp: 0},{band:82,value:236,timestamp: 0},{band:86,value:234,timestamp: 0},{band:92,value:233,timestamp: 0},{band:97,value:226,timestamp: 0}];

function checkChimes() {
    let chimesSpectrum = chimesFft.analyze();
    bands.forEach(element => {
        let chimesValue = chimesSpectrum[element.band];
        if (lastChimesVal > chimesValue && lastChimesBand !== element.band) {
            if (directionChimes > 0 && lastChimesVal > element.value - 10 && getMillis() - element.timestamp > 200) {
                element.timestamp = getMillis();
                lastChimesBand = element.band;
                const yArea = 500;
                //const yPos = map(element.value, 150, 300, canvas.height / 2 + yArea, canvas.height / 2 - yArea);
                const yPos = map(element.band, 20, 110, canvas.height / 2 + yArea, canvas.height / 2 - yArea);
                let chime = new Chimes(canvas.width - 200, 0, yPos, 20, element.band, element.value);
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
    chimesSound.play();
    setTimeout(function () {
        startTime = getMillis();
        drumsSound.play();
        songSound.play();
        bassSound.play();
    }, 40);
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
    constructor(r = 850) {
        this.x = canvas.width / 2;
        this.y = canvas.height / 2;
        this.r1 = r;
        this.r2 = r;
        this.rDefault = 900;
        this.sizing = 10;
        this.color = bassColor;

    }

    show() {
        push();
        //stroke(125);
        noStroke();
        strokeWeight(3);
        this.color.setAlpha(200);
        fill(this.color);
        ellipse(this.x, this.y, this.r1 * 2 + 50);
        pop();

        push();
        //stroke(125);
        noStroke();
        strokeWeight(3);
        this.color.setAlpha(150);
        fill(this.color);
        ellipse(this.x, this.y, this.r2 * 2 + 100);
        pop();
    }

    impulse() {
        this.r1 += 30;
        this.r2 += 30;
    }

    update() {
        let value1 = (this.r1 - this.rDefault) * 0.1
        if (this.r1 > this.rDefault) {
            this.r1 -= value1;
        }
        let value2 = (this.r2 - this.rDefault) * 0.09
        if (this.r2 > this.rDefault) {
            this.r2 -= value2;
        }
    }
}

class Drums {
    constructor(r = 900) {
        this.x = canvas.width / 2;
        this.y = canvas.height / 2;
        this.r = r;
        this.rDefault = 900;
        this.sizing = 10;
        this.color = bassColor;

    }

    show() {
        push();
        //stroke(125);
        noStroke();
        strokeWeight(3);
        this.color.setAlpha(255);
        fill(this.color);
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
        this.color = color('#6E9AFF');
        this.clap = false;
        this.clapVal = 0;
    }

    show() {
        push();
        stroke(100);
        strokeWeight(3);
        fill(this.color);
        noStroke();
        ellipse(this.x, this.y, (this.r + this.clapVal) * 2);
        pop();
    }

    update() {
        // move circle
        if (this.y >= this.limit) {
            this.x -= this.move;
            this.color.setAlpha(map(this.x, canvas.width / 2, 0, 255, 0));
            fill(this.color);
        } else {
            this.y += this.speed;
            this.speed += this.accel;
        }

        // clap pulse
        if(this.clap) {
            this.clapVal = 20;
            this.clap = false;
        } else {
            this.clapVal = 0;
        }
    }
}

class Violin {
    constructor(x1, y1, x2, y2) {
        this.x1 = x1;
        this.x2 = x2;
        this.y1 = y1;
        this.y2 = y2;
        this.color = color('#000000');
        this.lifetime = 255;
    }

    show() {
        push();
        strokeWeight(3);
        this.color.setAlpha(this.lifetime);
        stroke(this.color);
        line(this.x1, this.y1, this.x2, this.y2);
        pop();
    }

    update() {
        this.lifetime -= 5;
    }
}

const bandsCheck = [{
        band: 32,
        value: 0
    },
    {
        band: 34,
        value: 0
    },
    {
        band: 40,
        value: 0
    },
    {
        band: 43,
        value: 0
    },
    {
        band: 54,
        value: 0
    },
    {
        band: 58,
        value: 0
    },
    {
        band: 61,
        value: 0
    },
    {
        band: 65,
        value: 0
    },
    {
        band: 68,
        value: 0
    },
    {
        band: 73,
        value: 0
    },
    {
        band: 77,
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
        band: 92,
        value: 0
    },
    {
        band: 97,
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