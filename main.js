
// Chimes deletion in Konsole testen:
// setInterval(() => {console.log(chimesArray.length)}, 1000);

//const timings = [{"time":7003,"x1":100,"x2":420,"y1":800,"y2":180},{"time":13851,"x1":400,"x2":720,"y1":800,"y2":180},{"time":19502,"x1":700,"x2":1000,"y1":800,"y2":200},{"time":19702,"x1":720,"x2":1030,"y1":800,"y2":180},{"time":19858,"x1":740,"x2":1060,"y1":800,"y2":180},{"time":20351,"x1":780,"x2":1100,"y1":790,"y2":170},{"time":20801,"x1":810,"x2":1230,"y1":820,"y2":200},{"time":26052,"x1":860,"x2":1280,"y1":770,"y2":150},{"time":26306,"x1":1040,"x2":1360,"y1":790,"y2":170},{"time":26556,"x1":1080,"x2":1400,"y1":800,"y2":180},{"time":26850,"x1":1120,"x2":1440,"y1":790,"y2":170},{"time":27301,"x1":1160,"x2":1480,"y1":800,"y2":180},{"time":33301,"x1":1200,"x2":1540,"y1":820,"y2":190},{"time":33501,"x1":1300,"x2":1620,"y1":800,"y2":180},{"time":33650,"x1":1320,"x2":1640,"y1":800,"y2":180},{"time":33800,"x1":1340,"x2":1660,"y1":800,"y2":180},{"time":34205,"x1":1380,"x2":1700,"y1":790,"y2":170}/*,{"time":34967,"x1":1410,"x2":1730,"y1":820,"y2":200},{"time":40000,"x1":1460,"x2":1780,"y1":770,"y2":150}*/]
const timings = [{"time":7003,"x1":100,"y1":800,"x2":420,"y2":180},{"time":13851,"x1":400,"x2":720,"y1":800,"y2":180},{"time":19502,"x1":100,"y1":800,"x2":200,"y2":200},{"time":19702,"x1":200,"y1":200,"x2":400,"y2":800},{"time":19858,"x1":400,"y1":800,"x2":600,"y2":180},{"time":20351,"x1":600,"y1":180,"x2":800,"y2":760},{"time":20801,"x1":800,"y1":760,"x2":1000,"y2":200},{"time":26052,"x1":800,"y1":200,"x2":1000,"y2":800},{"time":26306,"x1":1000,"y1":800,"x2":1200,"y2":170},{"time":26556,"x1":1200,"y1":170,"x2":1400,"y2":1000},{"time":26850,"x1":1400,"y1":1000,"x2":1600,"y2":170},{"time":27301,"x1":1600,"y1":170,"x2":1800,"y2":880},{"time":33301,"x1":400,"y1":190,"x2":600,"y2":820},{"time":33501,"x1":600,"y1":820,"x2":800,"y2":180},{"time":33650,"x1":800,"y1":180,"x2":1000,"y2":900},{"time":33800,"x1":1000,"y1":900,"x2":1200,"y2":180},{"time":34205,"x1":1200,"y1":180,"x2":1400,"y2":800}]

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
let buttonTime;
let drumsFft;
let bassFft;

let bass;
let drums;
let bassColor;

function setup() {
    translate(-500, -500);
    // canvas = createCanvas(1920, 1080, WEBGL);
    canvas = createCanvas(1920, 1080);
    button = createButton('play');
    button.position(10, canvas.height + 10);
    button.mousePressed(toggleSong);

    buttonTime = createButton('get time');
    buttonTime.position(200, canvas.height + 10);
    buttonTime.mousePressed(printTime);

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
    violinArray = violinArray.filter(violin => violin.lifetime > 0);

}


let lastDrumsVal = 0;
let lastClapsVal = 0;
let directionDrums = 1;
let lastDrumsTime = 0;
let lastClapsTime = 0;
let drumsCounter = 0;

let violinState = 0;
let started = false;

function drawViolin() {
    /*push();
    fill(100);
    text(drumsCounter, 10, 20);
    pop();*/
    // 16 32 45 59 77
    if (drumsCounter === 1 && violinState === 0) { // 15
        started = true;
    }
    if (performance.now() - startTime >= timings[violinState].time && started) {
        const violin = timings[violinState];
        violinArray.push(new Violin(violin.x1, violin.y1, violin.x2, violin.y2));
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

            if (chimesArray.length > 0) {
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
const bands = [{
    band: 32,
    value: 230,
    timestamp: 0
}, {
    band: 34,
    value: 255,
    timestamp: 0
}, {
    band: 40,
    value: 247,
    timestamp: 0
}, {
    band: 43,
    value: 255,
    timestamp: 0
}, {
    band: 54,
    value: 246,
    timestamp: 0
}, {
    band: 58,
    value: 249,
    timestamp: 0
}, {
    band: 61,
    value: 249,
    timestamp: 0
}, {
    band: 65,
    value: 244,
    timestamp: 0
}, {
    band: 68,
    value: 244,
    timestamp: 0
}, {
    band: 73,
    value: 245,
    timestamp: 0
}, {
    band: 77,
    value: 244,
    timestamp: 0
}, {
    band: 82,
    value: 236,
    timestamp: 0
}, {
    band: 86,
    value: 234,
    timestamp: 0
}, {
    band: 92,
    value: 233,
    timestamp: 0
}, {
    band: 97,
    value: 226,
    timestamp: 0
}];

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
        console.log(startTime);
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
    return performance.now();
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
        if (this.clap) {
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
        this.slopeX = (this.x2 - this.x1) / 10;
        this.slopeY = (this.y2 - this.y1) / 10;
        this.steps = 0;
    }

    show() {
        push();
        strokeWeight(3);
        this.color.setAlpha(this.lifetime);
        stroke(this.color);
        line(this.x1, this.y1, this.x1 + this.slopeX*this.steps, this.y1 + this.slopeY*this.steps);
        pop();
    }

    update() {
        this.lifetime -= 5;
        if (this.steps < 10) {
            this.steps++;
        }
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

function printTime() {
    console.log(performance.now() - startTime)
}