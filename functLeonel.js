var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");




function grayScale()
{
var myFrame =ctx.getImageData(0,0,480,360); //obtem os pixels do frame escolhido
var frameData= myFrame.data;

  for(var i=0; i<frameData.length; i+=4)
  {
  	var avg=(frameData[i]+frameData[i+1]+frameData[i+2])/3;
    frameData[i] = avg;
    frameData[i+1] =avg;
    frameData[i+2] =avg;
}
  

ctx.putImageData(myFrame,0,0);


}

 //aplica o filtro num canal em particular
function applyFilterbyChannel(col,row,channel)
{

  var filterSize = 3; //tamanho do filtro 3x3
  var filter = [[0,-1,0],[-1,5,-1],[0,-1,0]]; //filtro
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

  return Math.min(255,Math.max(0,channelTotal)); //o valor final não pode ser menor que 0 e maior que 255

}


function applyFilter(imageHeight,imageWidth,imageData){

	for (var r = 1; r < (imageHeight-1); r++) //percorre as linhas da imagem, excluí primeira e última linhas que precisariam de tratamento diferenciado
	{
		for(var c = 1; c < (imageWidth-1); c++) //percorre a coluna de cada linha da imagem, excluí primeira e última colunas que precisariam de tratamento diferenciado
		{
			for(var w = 0; w < 3; w++) //percorre 3 canais: r,g,b (alpha é excluído)
			{
				imageData[(c*4)+(imageWidth*4*r)+w] = applyFilterbyChannel(c,r,w);
			}
		}
	}


}

