/*var canPlay2 = true;
var n_mini = 21;  //divide o vídeo em 5 segmentos de igual diuração
var aux_mini = 0;
var canvas_sideFrame = document.getElementById("sideFrame");
var canvas_sideFramectx= canvas_sideFrame.getContext('2d');
var intervalVideo;
var numberSideFrame = 0;
var timeSideFrame = [];
var setIntsideFrame;


myVideo.oncanplay = function() {
    intervalVideo = Math.round(myVideo.duration/n_mini);
    if(canPlay2)
    {
        numberSideFrame = 0;
        setIntsideFrame = setInterval(seekVideoMini, 100);  //chama seekvideo pretendida a cada 100ms
        canPlay2 = false; //be bure that setInterval is called only once
    }
};

//coloca o vídeo na posição frameDataoral pretendida, se i >= n para
function seekVideoMini(){
    if(aux_mini < n_mini) {
        myVideo.currentTime = intervalVideo * aux_mini;
    }
    else {
        myVideo.currentTime = 0;
        clearInterval(setIntsideFrame);
        canPlay2 = false;
    }
}

//cada vez que existe alteracao frameDataoral desenha um frame no canvas, caso i >= n para
myVideo.ontimeupdate = function() {

        if (aux_mini < n_mini) {
            copyFrameSideFrame();
            aux_mini++;
        }


};

function copyFrameSideFrame() {

    numberSideFrame++;
    timeSideFrame[numberSideFrame] = myVideo.currentTime;
    canvas_sideFramectx.drawImage(myVideo, ((20) * (numberSideFrame)), 0, 50, 50);

}


//canvas deteta eventos quando o rato é presionado. Consoante o frame escolhido pelo utilizador, coloca o vídeo na posição frameDataoral correspondente.
canvas_sideFrame.addEventListener('mousedown', function(event) {
    var x = event.clientX; //obtém a coordenada x relativamente à margem do documento.

    x -= c.getBoundingClientRect().left; //subtrai a distância entre o x canvas e margem do document -> canto esquerdo do canvas fica posição 0

    var frameindex = Math.floor(x/(20)); //calcula a que segmento pertence o frame

    var tdate = document.getElementById('txtDate');

    tdate.value = timeSideFrame[frameindex];

    myVideo.currentTime = timeSideFrame[frameindex]-0.1;
    //myVideo.currentTime = time[frameindex]; //coloca o vídeo na posição frameDataoral do segmento

    //document.getElementById('time').innerHTML = interval*frameindex;

}, false);
*/