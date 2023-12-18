let canvasHeight = 800;
let canvasWidth = 400;
let loose = false;
let duration = 30;
let timeout = duration; // Millisecond
let score = 0; // Millisecond
let apple;
let snake;
const canvas = document.createElement("canvas");
const ctx = canvas.getContext('2d');

function init() : void {
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    canvas.style.border = "30px solid gray";
    canvas.style.margin = "50px auto";
    canvas.style.display = "block";
    canvas.style.backgroundColor = "#ddd";
    document.body.appendChild(canvas);
    launch();
}

function launch() : void {

}