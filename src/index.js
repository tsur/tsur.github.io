import Walker from "lemuria/walker";
import styles from "global-styles.css";

function Point(x, y, walker) {
  this.x = x;
  this.y = y;
  this.baseR = spacing / 4;
  this.r = this.baseR;
  this.a = 1;
  this.dist = 0;
  this.vdir = true;
  this.hdir = true;
  this.walker = walker;
}

Point.prototype.update = function() {
  var dx = this.x - mx;
  var dy = this.y - my;
  this.dist = Math.sqrt(dx * dx + dy * dy);
  this.r = this.baseR - this.dist / (spacing / 1) + 2;
  this.walker.walk();
};

Point.prototype.render = function(ctx) {
  var rad = this.r >= 1 ? this.r : 1;
  ctx.beginPath();
  ctx.arc(
    this.walker.position.x + (rand(0, 100) - 50) * this.dist / 10000,
    this.walker.position.y + (rand(0, 100) - 50) * this.dist / 10000,
    rad,
    0,
    Math.PI * 2,
    false
  );
  ctx.fillStyle =
    "hsla(" + (180 - this.dist / 20) + ", 75%, 50%, " + this.a + ")";
  ctx.fill();
};

const getCanvasContext = () => {
  const canvas = document.createElement("canvas");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  document.body.appendChild(canvas);
  return { context: canvas.getContext("2d"), canvas };
};

const draw = ctx => {
  ctx.globalCompositeOperation = "destination-out";
  //   ctx.fillStyle = "rgba(0,0,0,.3)";
  //   ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, getWidth(), getHeight());
  ctx.globalCompositeOperation = "lighter";
  lightSoul.update();
  lightSoul.render(ctx);
};

const getWidth = () => window.innerWidth;
const getHeight = () => window.innerHeight;
const renderLoop = context => {
  draw(context);
  raf(context);
};

const raf = canvasContext =>
  window.requestAnimationFrame(() => renderLoop(canvasContext));
const rand = function(a, b) {
  return ~~(Math.random() * (b - a + 1) + a);
};
let mx = getWidth() / 2;
let my = getHeight() / 2;
const spacing = 35;
const lightSoul = new Point(
  spacing,
  spacing,
  new Walker(0.0001 * 9, {
    initPosX: window.innerWidth / 2,
    initPosY: window.innerHeight / 2,
    initVelX: 1,
    initVelY: 1
  })
);

(function init() {
  window.requestAnimationFrame =
    window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.msRequestAnimationFrame;
  const { canvas, context } = getCanvasContext();
  window.addEventListener("mousemove", function(e) {
    mx = e.pageX - canvas.offsetLeft;
    my = e.pageY - canvas.offsetTop;
  });
  raf(context);
})();
