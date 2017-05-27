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
    myVideo.width = 560;
}

function makeSmall() {
    myVideo.width = 320;
}

function makeNormal() {
    myVideo.width = 420;
} 