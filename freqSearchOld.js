var spectrum = [];
let fft, song, filter;

function preload(){
  song = loadSound('tracks/drums.mp3');
  song.rate(1)
  //song.panPosition = 1;
  //song.setBuffer([song.buffer.getChannelData(1)]);
}

function setup() {
  //song.setBuffer([song.buffer.getChannelData(0)]);
  console.log(song);
  let cnv = createCanvas(1024,200);
  cnv.mousePressed(makeNoise);
  fill(255, 0, 255);

  filter = new p5.BandPass();
  song.setBuffer([song.buffer.getChannelData(0)]);
  song.disconnect();
  song.connect(filter);


  fft = new p5.FFT();
}

const chimes = [];

function draw() {
  background(220);
  let maxHeight = 0;
  let maxID = 0
  // set the BandPass frequency based on mouseX
  let freq = map(mouseX, 0, width/2, 20, 10000);
  freq = constrain(freq, -1, 22050);
  filter.freq(freq)
  // give the filter a narrow band (lower res = wider bandpass)
  let res = map(mouseY, 0, height, 0, 120);
  filter.res(res);
  //console.log("freq = " + freq + "  res = " + res)
  // draw filtered spectrum
  let spectrum = fft.analyze();
  //spectrum.splice(100, 1104);
  spectrum.splice(0, 25);
  noStroke();
  for (let i = 0; i < spectrum.length; i++) {
    let x = map(i, 0, spectrum.length, 0, width);
    let h = -height + map(spectrum[i], 0, 255, height, 0);
    rect(x, height, width/spectrum.length, h);
    push()
    fill(255);
    text(i+25, x, 160);
    pop();
    //console.log(h);
    if(-h > maxHeight){
      maxHeight = -h;
      maxID = i+25;
    }
  }
  console.log("Max Band: " + maxID + " has " + maxHeight);
}

function makeNoise() {
  // see also: `userStartAudio()`
  song.play();
  console.log("play");
}

function mouseReleased() {
  song.pause();
  console.log("pause");
}