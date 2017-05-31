var countframePrevious = 0;
var stateMovement = false;
var typeStateMovement;

function typeMovement(auxTypeStateMovement) {
    interval = Math.round(myVideo.duration/n);

    if(!canPlay)
    {
        typeStateMovement = auxTypeStateMovement;
        number = 0;
        ctx.clearRect(0, 0, c.width, c.height);
        aux_i = 0;
        setInt = setInterval(seekVideo, 100);  //chama seekvideo pretendida a cada 100ms
        canPlay = true; //be bure that setInterval is called only once
        stateMovement = true;
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
        stateMovement = false;
        canPlay = false;
    }
}

//cada vez que existe alteracao frameDataoral desenha um frame no canvas, caso i >= n para
myVideo.ontimeupdate = function() {

    if (stateMovement) {
        if (aux_i < n && stateMovement) {
            switch (typeStateMovement) {
                case 'movementFrameColor':
                    movementFrameColor();
                    break;
                case 'movementFrame':
                    movementFrame();

                    break;
                case 'movementFrameSabel':

                    grayScale();
                    applyFilter(filterSize, verticalSobel);
                    applyFilter(filterSize, horizontalSobel);
                    movementFrameRedBlack(0);
                    movementFrameRed();

                    break;

                case 'movementFrameSabelHorizontal':

                    grayScale();
                    applyFilter(filterSize, horizontalSobel);
                    movementFrameRedBlack(0);
                    movementFrameRed();

                    break;
                case 'movementFrameSabelVertical':

                    grayScale();
                    applyFilter(filterSize, topSobel);
                    movementFrameRedBlack(0);
                    movementFrameRed();
                    break;

                case 'movementFrameEmboss':

                    grayScale();
                    applyFilter(filterSize, emboss);
                    movementFrameRedBlack(0);
                    movementFrameRed();

                    break;
            }

            aux_i++;
        }
    }



};


function copyFrame() {


        number++;
        time[number] = myVideo.currentTime;

        var myFrame2 = canvasctx.getImageData(0, 0, canvas.width, canvas.height);
        ctx.drawImage(myVideo, ((320 + 10) * (number)), 0, 320, 180);


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




function movementFrame() {

    var tdate = document.getElementById('txtDate');

    var myFrame = canvasctx.getImageData(0, 0, canvas.width, canvas.height ); // obtem os pixels do frame escolhido
    var frameData = myFrame.data;
    var movementFrame = 0;

    for (var i = 0; i < frameData.length; i += 4)
    {
        var r_frame = frameData[i];
        var g_frame = frameData[i+1];
        var b_frame = frameData[i+2];


        // diferenca de 1 frame com o anterior, valores sempre positivos
        frameData[i] = Math.abs(frameData[i]- temp[i]);
        frameData[i+1] = Math.abs(frameData[i+1]- temp[i+1]);
        frameData[i+2] = Math.abs(frameData[i+2]- temp[i+2]);


        var auxmovementFrame = frameData[i]+ frameData[i+1] +frameData[i+2];

            if (auxmovementFrame < 80) {
                movementFrame += frameData[i]+ frameData[i+1] +frameData[i+2];
            }


        // guarda o frame para o proximo ciclo
        temp[i] = r_frame;
        temp[i+1] = g_frame;
        temp[i+2] = b_frame;
    }
    // tdate.value = Math.abs(movementFrame - framePrevious);
    if((Math.abs(movementFrame - framePrevious))>100)
    {
        //tdate.value = myVideo.currentTime;

        copyFrame();
    }
    framePrevious = movementFrame;


}



function movementFrameColor() {

    var tdate = document.getElementById('txtDate');

    var myFrame = canvasctx.getImageData(0, 0, canvas.width, canvas.height ); // obtem os pixels do frame escolhido
    var frameData = myFrame.data;


    var count = 0;

    for (var i = 0; i < frameData.length; i += 4)
    {
        var aux_r = frameData[i];
        var aux_g = frameData[i+1];
        var aux_b = frameData[i+2];

        if(r_out.value == aux_r && g_out.value == aux_g && b_out.value == aux_b){
            count ++;
        }

    }
 var calculation = ((count*100)/frameData.length);
    if((calculation)>(percentage_out.value*0.01))
    {
        //tdate.value = myVideo.currentTime;

        copyFrame();
    }



}

function movementFrameEdge() {

    var tdate = document.getElementById('txtDate');

    var myFrame = canvasctx.getImageData(0, 0, canvas.width, canvas.height ); // obtem os pixels do frame escolhido
    var frameData = myFrame.data;


    var count = 0;

    for (var i = 0; i < frameData.length; i += 4)
    {
        var aux_r = frameData[i];
        var aux_g = frameData[i+1];
        var aux_b = frameData[i+2];

        if(0 == aux_r && 0 == aux_g && 0 == aux_b){
            count ++;
        }

    }
    var calculation = ((count*100)/frameData.length);
    if((calculation)>(percentage_out.value*0.01))
    {
        //tdate.value = myVideo.currentTime;

        copyFrame();
    }



}


function movementFrameRed() {

    var tdate = document.getElementById('txtDate');

    var myFrame = canvasctx.getImageData(0, 0, canvas.width, canvas.height ); // obtem os pixels do frame escolhido
    var frameData = myFrame.data;


    var count = 0;

    for (var i = 0; i < frameData.length; i += 4)
    {
        var aux_r = frameData[i];
        var aux_g = frameData[i+1];
        var aux_b = frameData[i+2];

        if(255 == aux_r && 0 == aux_g && 0 == aux_b){
            count ++;
        }

    }
    var calculation = ((count*100)/frameData.length);
    if((calculation)>0.2)
    {
        //tdate.value = myVideo.currentTime;

        copyFrame();
    }



}