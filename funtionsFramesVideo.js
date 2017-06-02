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

var ctx = c.getContext("2d");//contexto do canvas de momentos relevantes

var aux_i = 0; //controlo do número de frame a obter < n

var number = 0;

var canPlay = false;

var setInt;

var activeFilter ='default'; //definir qual o filtro
var filterSize = 3; //tamanho do filtro 3x3
var filterSharp = [[-1,-1,-1],[-1,8,-1],[-1,-1,-1]]; //filtro  Sharpened 
var filterBlur =  //filtro  blur
var filterEdge =  [[0,1,0],[1,-4,1],[0,1,0]];   //filtro edge Detection
var emboss =  [[-2,-1,0],[-1,1,-1],[0,1,2]];   //filtro das bordas
var sobel2 =  [[1,1,1],[1,0.7,-1],[-1,-1,-1]];   //filtro das bordas
var outline =  [[-1,-1,-1],[-1,8,-1],[-1,-1,-1]];   //filtro das bordas
var topSobel =  [[1,2,1],[0,0,0],[-1,-2,-1]];   //filtro das bordas
var verticalSobel =  [[-1,0,1],[-2,0,2],[-1,0,1]];   //filtro detecta as linhas Verticias
var horizontalSobel =  [[-1,-2,-1],[0,0,0],[1,2,1]];   //filtro detecta as linhas horizontais
var identity =  [[-1,-2,-1],[0,0,0],[1,2,1]];   //filtro das bordas
var coutum =  [[0,-3,0],[-2.1,5,-1],[-1.9,0.8,1.6]];   //filtro das bordas

var time = [];

var temp = []; // imagem temporaria inicializada a preta
var framePrevious = 0; //Frame anterior


for (var i = 0; i < canvas.width*canvas.height*4; i +=4)
{
    temp[i] = 0; // red i
    temp[i+1] = 0; // green i+1
    temp[i+2] = 0; // blue i+2
    temp[i+3] = 255; // alpha i+3

}

var imageWidth=canvas.width;
var imageHeight=canvas.height;

//Event listener para adição dos Filtros
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




//Sempre que o video é reproduzido podem ser aplicados filtros sobre o mesmo dependo de qual filtro 
//Foi selecionado
myVideo.addEventListener('play', function ()    
{
    var $this = this; //cache
    (function loop() {

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
                    applyFilter(filterSize,horizontalSobel);
                    applyFilter(filterSize,verticalSobel);
                    break;
                case 'black':
                    black_white();
                    break;
                case 'colorButton':
                    color();
                    break;
                case 'emboss':
                    applyFilter(filterSize,emboss);

                     break;
                case 'movementEmboss':
                    grayScale();
                    applyFilter(filterSize,emboss);
                    movementFrameRedBlack(0);
                    break;
                case 'movementSabel':
                    grayScale();
                    applyFilter(filterSize,verticalSobel);
                    applyFilter(filterSize,horizontalSobel);
                    movementFrameRedBlack(0);
                    break;
                default:
                    break;

            }

    })();
}, 0);


//Função que aplica o efeito cinza aos videos
function grayScale()        
{
    var myFrame =canvasctx.getImageData(0,0,canvas.width,canvas.height); //obtem os dados da imagem
    var frameData= myFrame.data;
    for(var i=0; i<frameData.length; i+=4)//percorre o array de pixeis 
    {
        var avg=(frameData[i]+frameData[i+1]+frameData[i+2])/3; //avg para aplicar aos tres canais RGB
        frameData[i] = avg;  
        frameData[i+1] =avg;
        frameData[i+2] =avg;
    }

    canvasctx.putImageData(myFrame,0,0);//coloca a imagem processada no canvas
}

//Função que aplica o efeito de noise aos videos
function noise()
{
    var myFrame =canvasctx.getImageData(0,0,canvas.width,canvas.height); //obtem os dados da imagem
    var frameData= myFrame.data;

    for(var i=0; i<frameData.length; i+=4) //percorre o array de pixeis 
    {
        var rand = (0.5 - Math.random()) * 70; //gera um valor aleatorio

        var r =  frameData[i];     //red
        var g =  frameData[i+1];   //green
        var b = frameData[i+2];     //blue

        //Soma o numero aleatorio ao canal de cada pixel

        frameData[i] = r+ rand;     
        frameData[i+1]= g+rand;     
        frameData[i+2]= b+rand;

    }

    canvasctx.putImageData(myFrame,0,0);
}




//aplica os filtros de convoluçao
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

//Aplica os Filtors a imagem recendo como argumento o tamanho do filtro (matriz) e a matriz do filtro
function applyFilter(filterSize,filter){


    var myFrame =canvasctx.getImageData(0,0,canvas.width,canvas.height); 
    var frameData= myFrame.data;                      
    var temp = []; 

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
    
}



function addObect(){
    canvasctx.fillStyle="rgba("+r.value+","+g.value+","+b.value+", 0.6)"

}


function color(){
    canvasctx.fillStyle="rgba("+r.value+","+g.value+","+b.value+", 0.6)"
    canvasctx.fillRect(0,0,canvas.width,canvas.height);
}

function black_white() {

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


        var auxmovementFrame = frameData[i]+ frameData[i+1] +frameData[i+2];

            if (auxmovementFrame < 80) {

                frameData[i] = 0;
                frameData[i + 1] = 0;
                frameData[i + 2] = 0;

            } else {
                frameData[i] = 255;
                frameData[i + 1] = 255;
                frameData[i + 2] = 255;
            }

        // guarda o frame para o proximo ciclo
        temp[i] = r;
        temp[i+1] = g;
        temp[i+2] = b;
    }

    framePrevious = movementFrame;

    canvasctx.putImageData(myFrame, 0, 0);

}



function movementFrameRedBlack( type) {

    var tdate = document.getElementById('txtDate');

    var myFrame = canvasctx.getImageData(0, 0, canvas.width, canvas.height ); // obtem os pixels do frame escolhido
    var frameData = myFrame.data;


    var count = 0;

    for (var i = 0; i < frameData.length; i += 4)
    {
        var aux_r = frameData[i];
        var aux_g = frameData[i+1];
        var aux_b = frameData[i+2];

        if(type == 0){
        if(255 == aux_r && 255 == aux_g && 255 == aux_b){
            frameData[i] = 255;
            frameData[i + 1] = 0;
            frameData[i + 2] = 0;
        }else{
            frameData[i] = 0;
            frameData[i + 1] = 0;
            frameData[i + 2] = 0;
        }
        }
        if(type == 1){
            if(255 == aux_r && 255 == aux_g && 255 == aux_b){
                frameData[i] = 0;
                frameData[i + 1] = 0;
                frameData[i + 2] = 0;
            }else{
                frameData[i] = 255;
                frameData[i + 1] = 0;
                frameData[i + 2] = 0;
            }
        }
    }



    canvasctx.putImageData(myFrame, 0, 0);

}