
class Violin {
  constructor(x1, y1, x2, y2) {
      this.x1 = x1;
      this.x2 = x2;
      this.y1 = y1;
      this.y2 = y2;
  }
}


const violinArray= [];

violinArray.push(new Violin(100, 800, 100+320, 800-620));
violinArray.push(new Violin(400, 800, 400 + 320, 800 - 620));
let xStart = 700;
let yStart = 800;
violinArray.push(new Violin(xStart, yStart, xStart + 300, yStart - 600));
violinArray.push(new Violin(xStart + 20, yStart, xStart + 330, yStart - 620));
violinArray.push(new Violin(xStart + 40, yStart, xStart + 360, yStart - 620));
violinArray.push(new Violin(xStart + 80, yStart - 10, xStart + 400, yStart - 630));
violinArray.push(new Violin(xStart + 110, yStart + 20, xStart + 530, yStart - 600));
violinArray.push(new Violin(xStart + 160, yStart - 30, xStart + 580, yStart - 650));
xStart = 1000;
yStart = 800;
violinArray.push(new Violin(xStart + 40, yStart - 10, xStart + 360, yStart - 630));
violinArray.push(new Violin(xStart + 80, yStart, xStart + 400, yStart - 620));
violinArray.push(new Violin(xStart + 120, yStart - 10, xStart + 440, yStart - 630));
violinArray.push(new Violin(xStart + 160, yStart, xStart + 480, yStart - 620));
violinArray.push(new Violin(xStart + 200, yStart + 20, xStart + 540, yStart - 610));
xStart = 1300;
yStart = 800;
violinArray.push(new Violin(xStart, yStart, xStart + 320, yStart - 620));
violinArray.push(new Violin(xStart + 20, yStart, xStart + 340, yStart - 620));
violinArray.push(new Violin(xStart + 40, yStart, xStart + 360, yStart - 620));
violinArray.push(new Violin(xStart + 80, yStart - 10, xStart + 400, yStart - 630));
violinArray.push(new Violin(xStart + 110, yStart + 20, xStart + 430, yStart - 600));
violinArray.push(new Violin(xStart + 160, yStart - 30, xStart + 480, yStart - 650));


