/**
 * Created by jorgeduarte on 20/05/17.
 */
var myVideo = document.getElementById("video1");
var canvas = document.getElementById("myCanvas");
var canvasctx= canvas.getContext('2d');
var divHide = document.getElementById('parent_div_1');

var c = document.getElementById("frame");
var n = 6;  //divide o vídeo em 5 segmentos de igual diuração
c.width = (myVideo.width+10)*n; //dimensões do canvas tem includir 5 frames com metade das dimensões do vídeo
c.height = myVideo.height/2;

var interval = 0; //duração dos clips

var ctx = c.getContext("2d");

var i = 0; //controlo do número de frame a obter < n

var canPlay = false;

var setInt;

var activeFilter ='default';

document.getElementById('filters').addEventListener('click', function(e) {
        var value = e.target.value;
        activeFilter = value ? value : activeFilter;
}, false);

//assim que o vídeo fôr carregado, calcula o intervalo e obtém os frames
myVideo.oncanplay = function() {
    divHide.style.display='none';
    interval = Math.round(myVideo.duration/n);
    if(!canPlay)
    {
        setInt = setInterval(seekVideo, 100);  //chama seekvideo pretendida a cada 100ms
        canPlay = true; //be bure that setInterval is called only once
    }
};


//coloca o vídeo na posição temporal pretendida, se i >= n para
function seekVideo(){
    if(i < n)
        myVideo.currentTime = interval*i;
    else
        clearInterval(setInt);
}

//cada vez que existe alteracao temporal desenha um frame no canvas, caso i >= n para
myVideo.ontimeupdate = function() {
    if(i < n)
    {
        ctx.drawImage(myVideo,((320+10)*(i)),0,320,180);
        i++;
    }
};


//canvas deteta eventos quando o rato é presionado. Consoante o frame escolhido pelo utilizador, coloca o vídeo na posição temporal correspondente.
c.addEventListener('mousedown', function(event) {
    var x = event.clientX; //obtém a coordenada x relativamente à margem do documento.

    x -= c.getBoundingClientRect().left; //subtrai a distância entre o x canvas e margem do document -> canto esquerdo do canvas fica posição 0

    var frameindex = Math.floor(x/(320+10)); //calcula a que segmento pertence o frame

    myVideo.currentTime = interval*frameindex; //coloca o vídeo na posição temporal do segmento

    //document.getElementById('time').innerHTML = interval*frameindex;

}, false);

myVideo.addEventListener('play', function () {
    var $this = this; //cache
    (function loop() {
        if (!$this.paused && !$this.ended) {        
            canvasctx.drawImage(myVideo, 0, 0,480,360);
            setTimeout(loop, 1000 / 30); // drawing at 30fps
            switch(activeFilter)
            {
                case 'grayScale':
                grayScale();
                break;
                case 'noise':
                noise();
                break;


            }
        }
    })();
}, 0);



function grayScale()
{
var myFrame =canvasctx.getImageData(0,0,480,360); //obtem os pixels do frame escolhido
var frameData= myFrame.data;

  for(var i=0; i<frameData.length; i+=4)
  {
    var avg=(frameData[i]+frameData[i+1]+frameData[i+2])/3; //avg para aplicar a todos as cores 
    frameData[i] = avg;
    frameData[i+1] =avg;
    frameData[i+2] =avg;
}

canvasctx.putImageData(myFrame,0,0);
}

function noise()
{
var myFrame =canvasctx.getImageData(0,0,480,360); //obtem os pixels do frame escolhido
var frameData= myFrame.data;

  for(var i=0; i<frameData.length; i+=4)
  {
   var rand = (0.5 - Math.random()) * 70; //UM VALOR RANDOM 

   var r =  frameData[i];
   var g =  frameData[i+1];
   var b = frameData[i+2];

   frameData[i] = r+ rand;
   frameData[i+1]= g+rand;
   frameData[i+2]= b+rand;

}

canvasctx.putImageData(myFrame,0,0);
}

