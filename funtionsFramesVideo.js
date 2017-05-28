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

var activeFilter ='default'; //definir qual o filtro
var filterSize = 3; //tamanho do filtro 3x3
var filterSharp = [[-1,-1,-1],[-1,8,-1],[-1,-1,-1]]; //filtro  Shar 
var filterBlur = [[1/9,1/9,1/9],[1/9,1/9,1/9],[1/9,1/9,1/9]]; //filtro  blur 
var filterSobel =  [[1,2,1],[0,0,0],[-1,-2,-1]];  //filtro Sobel 
var filterSobel2 =  [[1,0,-1],[2,0,-2],[1,0,-1]]; 
var filterEdge =  [[0,1,0],[1,-4,1],[0,1,0]];   //filtro das bordas



document.getElementById('filters').addEventListener('click', function(e) //selecionar controles dos filtros
{ 
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


//coloca o vídeo na posição frameDataoral pretendida, se i >= n para
function seekVideo(){
    if(i < n)
        myVideo.currentTime = interval*i;
    else
        clearInterval(setInt);
}

//cada vez que existe alteracao frameDataoral desenha um frame no canvas, caso i >= n para
myVideo.ontimeupdate = function() {
    if(i < n)
    {
        ctx.drawImage(myVideo,((320+10)*(i)),0,320,180);
        i++;
    }
};

//canvas deteta eventos quando o rato é presionado. Consoante o frame escolhido pelo utilizador, coloca o vídeo na posição frameDataoral correspondente.
c.addEventListener('mousedown', function(event) {
    var x = event.clientX; //obtém a coordenada x relativamente à margem do documento.

    x -= c.getBoundingClientRect().left; //subtrai a distância entre o x canvas e margem do document -> canto esquerdo do canvas fica posição 0

    var frameindex = Math.floor(x/(320+10)); //calcula a que segmento pertence o frame

    myVideo.currentTime = interval*frameindex; //coloca o vídeo na posição frameDataoral do segmento

    //document.getElementById('time').innerHTML = interval*frameindex;

}, false);

myVideo.addEventListener('play', function ()    //sempre que o video se encontra a ser reproduzido
{  
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
                default:
                break;

            }
        }
    })();
}, 0);



function grayScale()        //filtro cinza
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

 var imageWidth=480;
 var imageHeight=360;


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

    
    var myFrame =canvasctx.getImageData(0,0,480,360); //obtem os pixels do frame escolhido
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



    