/**
 * Created by jorgeduarte on 20/05/17.
 */
var myVideo = document.getElementById("video1");
var canvas = document.getElementById("myCanvas");
var canvasctx= canvas.getContext('2d');
var divHide = document.getElementById('parent_div_1');

var c = document.getElementById("frame");
var n =20;  //divide o vídeo em 5 segmentos de igual diuração
c.width = (myVideo.width+10)*30; //dimensões do canvas tem includir 5 frames com metade das dimensões do vídeo
c.height = myVideo.height/2;

var interval = 0; //duração dos clips

var ctx = c.getContext("2d");

var aux_i = 0; //controlo do número de frame a obter < n

var number = 0;

var canPlay = false;

var setInt;

var activeFilter ='default'; //definir qual o filtro
var filterSize = 3; //tamanho do filtro 3x3
var filterSharp = [[-1,-1,-1],[-1,8,-1],[-1,-1,-1]]; //filtro  Shar
var filterBlur = [[1/9,1/9,1/9],[1/9,1/9,1/9],[1/9,1/9,1/9]]; //filtro  blur
var filterSobel =  [[1,2,1],[0,0,0],[-1,-2,-1]];  //filtro Sobel
var filterSobel2 =  [[1,0,-1],[2,0,-2],[1,0,-1]];
var filterEdge =  [[0,1,0],[1,-4,1],[0,1,0]];   //filtro das bordas

var time = [];

var temp = []; // imagem temporaria inicializada a preta
var framePrevious = 0;
var countframePrevious = 0;

for (var i = 0; i < canvas.width*canvas.height*4; i +=4)
{
    temp[i] = 0; // red i
    temp[i+1] = 0; // green i+1
    temp[i+2] = 0; // blue i+2
    temp[i+3] = 255; // alpha i+3

}

var imageWidth=canvas.width;
var imageHeight=canvas.height;

document.getElementById('filters').addEventListener('click', function(e) //selecionar controles dos filtros
{
    var value = e.target.value;
    activeFilter = value ? value : activeFilter;
}, false);

//assim que o vídeo fôr carregado, calcula o intervalo e obtém os frames
myVideo.oncanplay = function() {
    divHide.style.display='none';

    canvasctx.drawImage(myVideo,0,0,canvas.width,canvas.height);


  /*  interval = Math.round(myVideo.duration/n);
    if(!canPlay)
    {aux_i = 0;
        setInt = setInterval(seekVideo, 100);  //chama seekvideo pretendida a cada 100ms
        canPlay = true; //be bure that setInterval is called only once
    }*/
};

function testtt() {
    interval = Math.round(myVideo.duration/n);
    if(!canPlay)
    {
        aux_i = 0;
        setInt = setInterval(seekVideo, 100);  //chama seekvideo pretendida a cada 100ms
        canPlay = true; //be bure that setInterval is called only once
    }
}

//coloca o vídeo na posição frameDataoral pretendida, se i >= n para
function seekVideo(){
    if(aux_i < n) {
        myVideo.currentTime = interval * aux_i;
    }
    else {
        myVideo.currentTime = 0;
        clearInterval(setInt);
    }
}

//cada vez que existe alteracao frameDataoral desenha um frame no canvas, caso i >= n para
myVideo.ontimeupdate = function() {

    if(aux_i < n)
    {
        copyFrame(0);
        aux_i++;
    }

};


function copyFrame() {

        number++;
        time[number] = myVideo.currentTime;
        ctx.drawImage(myVideo,((320+10)*(number)),0,320,180);

}

//canvas deteta eventos quando o rato é presionado. Consoante o frame escolhido pelo utilizador, coloca o vídeo na posição frameDataoral correspondente.
c.addEventListener('mousedown', function(event) {
    var x = event.clientX; //obtém a coordenada x relativamente à margem do documento.

    x -= c.getBoundingClientRect().left; //subtrai a distância entre o x canvas e margem do document -> canto esquerdo do canvas fica posição 0

    var frameindex = Math.floor(x/(320+10)); //calcula a que segmento pertence o frame

    var tdate = document.getElementById('txtDate');

    tdate.value = time[frameindex];

    myVideo.currentTime = time[frameindex]-0.1;
    //myVideo.currentTime = time[frameindex]; //coloca o vídeo na posição frameDataoral do segmento

    //document.getElementById('time').innerHTML = interval*frameindex;

}, false);

myVideo.addEventListener('play', function ()    //sempre que o video se encontra a ser reproduzido
{
    var $this = this; //cache
    (function loop() {
        if (!$this.paused && !$this.ended) {
            canvasctx.drawImage(myVideo, 0, 0,canvas.width,canvas.height);
            setTimeout(loop, 1000 / 30); // drawing at 30fps
            switch(activeFilter)
            {
                case 'grayScale':
                    grayScale();
                    break;
                case 'noise':
                    noise();
                    break;
                case 'sharpen':
                    applyFilter(filterSize,filterSharp);
                    break;
                case 'blur':
                    applyFilter(filterSize,filterBlur);
                    break;
                case 'edge':
                    grayScale();
                    applyFilter(filterSize,filterEdge);
                    break;
                case 'sobel':
                    grayScale();
                    applyFilter(filterSize.filterSobel2);
                    applyFilter(filterSize.filterSobel);
                    break;
                case 'black':
                    black_white();
                    break;
                case 'colorButton':
                    color();
                    break;
                case 'addObect':
                    addObect();
                    break;

                default:
                    break;

            }
        }
    })();
}, 0);



function grayScale()        //filtro cinza
{
    var myFrame =canvasctx.getImageData(0,0,canvas.width,canvas.height); //obtem os pixels do frame escolhido
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
    var myFrame =canvasctx.getImageData(0,0,canvas.width,canvas.height); //obtem os pixels do frame escolhido
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




//aplica o filtro num canal em particular
function applyFilterbyChannel(col,row,channel,temp,filterSize,filter){



    var channelTotal = 0; //acumulador das somas
    var coltrans = col-1; //inicia o ciclo na coluna da esq. da matrix 3x3
    var rowtrans = row-1; //inicio o ciclio na linha de topo da matrix 3x3

    for (var r = 0; r < filterSize; r++)
    {
        for(var c = 0; c < filterSize; c++)
        {
            channelTotal += temp[((coltrans+c)*4)+(imageWidth*4*(rowtrans+r))+channel]*filter[r][c]; //filter[r][c] acede ao valor do filtro de linha r e coluna c

        }
    }

    var channelTop    = (temp[((col-1)*4)+(imageWidth*4*(row-1))+channel]*0) + (temp[(col*4)+(imageWidth*4*(row-1))+channel]*-1) + (temp[((col+1)*4)+(imageWidth*4*(row-1))+channel]*0);
    var channelMiddle = (temp[((col-1)*4)+(imageWidth*4*row)+channel]*-1) + (temp[(col*4)+(imageWidth*4*row)+channel]*5) + (temp[((col+1)*4)+(imageWidth*4*row)+channel]*-1);
    var channelBelow  = (temp[((col-1)*4)+(imageWidth*4*(row+1))+channel]*0) + (temp[(col*4)+(imageWidth*4*(row+1))+channel]*-1) + (temp[((col+1)*4)+(imageWidth*4*(row+1))+channel]*0);

    var channelTotal = channelMiddle+channelBelow+channelTop;

    return channelTotal;
}


function applyFilter(filterSize,filter){


    var myFrame =canvasctx.getImageData(0,0,canvas.width,canvas.height); //obtem os pixels do frame escolhido
    var frameData= myFrame.data;                      //obtem os dados do frame
    var temp = []; //copia da imagem

    for (var i = 0; i < imageWidth*imageHeight*4; i += 4) {
        temp[i] =   frameData[i]; //red i
        temp[i+1] = frameData[i+1]; //green i+1
        temp[i+2] = frameData[i+2]; //blue i+2
        temp[i+3] = frameData[i+3]; //alpha i+3

    }
    for (var r = 1; r < (imageHeight-1); r++) //percorre as linhas da imagem, excluí primeira e última linhas que precisariam de tratamento diferenciado
    {
        for(var c = 1; c < (imageWidth-1); c++) //percorre a coluna de cada linha da imagem, excluí primeira e última colunas que precisariam de tratamento diferenciado
        {
            for(var w = 0; w < 3; w++) //percorre 3 canais: r,g,b (alpha é excluído)
            {
                frameData[(c*4)+(imageWidth*4*r)+w] = applyFilterbyChannel(c,r,w,temp,filterSize,filter);
            }
        }
    }

    canvasctx.putImageData(myFrame, 0, 0);
    //requestAnimationFrame(copyGrayVideo); //para fazer atualizacoes segundo frame rate
}



function black_white(){
    copyPlayer1(1)

}

function addObect(){
    canvasctx.fillStyle="rgba("+r.value+","+g.value+","+b.value+", 0.6)"

}


function color(){
    canvasctx.fillStyle="rgba("+r.value+","+g.value+","+b.value+", 0.6)"
    canvasctx.fillRect(0,0,canvas.width,canvas.height);
}

function copyPlayer1(type) {
    ctx.drawImage(myVideo,0,0,canvas.width,canvas.height);
    var tdate = document.getElementById('txtDate');

    var myFrame = canvasctx.getImageData(0, 0, canvas.width, canvas.height ); // obtem os pixels do frame escolhido
    var frameData = myFrame.data;
    var movementFrame = 0;

    for (var i = 0; i < frameData.length; i += 4)
    {
        var r = frameData[i];
        var g = frameData[i+1];
        var b = frameData[i+2];


        // diferenca de 1 frame com o anterior, valores sempre positivos
        frameData[i] = Math.abs(frameData[i]- temp[i]);
        frameData[i+1] = Math.abs(frameData[i+1]- temp[i+1]);
        frameData[i+2] = Math.abs(frameData[i+2]- temp[i+2]);



        movementFrame += frameData[i]+ frameData[i+1] +frameData[i+2];
        var auxmovementFrame = frameData[i]+ frameData[i+1] +frameData[i+2];


        if(type==1) {
            if (auxmovementFrame < 80) {

                frameData[i] = 0;
                frameData[i + 1] = 0;
                frameData[i + 2] = 0;


            } else {
                frameData[i] = 255;
                frameData[i + 1] = 255;
                frameData[i + 2] = 255;

            }
        }

        // guarda o frame para o proximo ciclo
        temp[i] = r;
        temp[i+1] = g;
        temp[i+2] = b;
    }
   // tdate.value = Math.abs(movementFrame - framePrevious);
    if((Math.abs(movementFrame - framePrevious))>10000000)
    {
        //tdate.value = myVideo.currentTime;

        copyFrame();
    }
    framePrevious = movementFrame;
    if(type==1) {
        canvasctx.putImageData(myFrame, 0, 0);

    }
    ctx.putImageData(myFrame,0 , 0);


}


