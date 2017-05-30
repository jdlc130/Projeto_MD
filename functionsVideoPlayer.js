var myVideo = document.getElementById("video1");
var canvas = document.getElementById("myCanvas");
var canvasctx= canvas.getContext('2d');
var divHide = document.getElementById('parent_div_1');

function playPause() {
    if (myVideo.paused){

        myVideo.play();

    }
    else
        myVideo.pause();
}

function makeBig() {
    canvas.width = 560;
}

function makeSmall() {
    canvas.height = canvas.width/2 ;
    canvas.width = canvas.width/2 ;
}

function makeNormal() {
    canvas.width = 480;
    canvas.height= 360;
}

function makeLengthTy() {
    canvas.height = 300;
    canvas.width = 370;
}