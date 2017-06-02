var body = document.body,
    r = document.querySelector('#r'),
    g = document.querySelector('#g'),
    b = document.querySelector('#b'),
    percentage = document.querySelector('#percentage'),

    r_out = document.querySelector('#r_out'),
    g_out = document.querySelector('#g_out'),
    b_out = document.querySelector('#b_out'),
    color_out = document.getElementById('color'),
    percentage_out = document.querySelector('#percentage_out');

    var canvasColor = document.getElementById("canvasColor");
    var canvasColorctx= canvasColor.getContext('2d');

var stateMask = false;

//Aplica a cor selecionada ao canvas 
function setColor(){

    var r_hex = parseInt(r.value, 10).toString(16),
        g_hex = parseInt(g.value, 10).toString(16),
        b_hex = parseInt(b.value, 10).toString(16),
        hex = "#" + pad(r_hex) + pad(g_hex) + pad(b_hex);
        color_out.style.backgroundColor = hex;



    canvasColorctx.clearRect(0, 0, canvas.width, canvas.height);
    canvasColorctx.fillStyle="rgba("+r.value+","+g.value+","+b.value+", "+(percentage_out.value*0.01)+")"
    canvasColorctx.fillRect(0,0,200,200);


}

function pad(n){
    return (n.length<2) ? "0"+n : n;
}

r.addEventListener('change', function() {
    setColor();
    r_out.value = r.value;
}, false);

r.addEventListener('input', function() {
    setColor();
    r_out.value = r.value;
}, false);

g.addEventListener('change', function() {
    setColor();
    g_out.value = g.value;
}, false);

g.addEventListener('input', function() {
    setColor();
    g_out.value = g.value;
}, false);

b.addEventListener('change', function() {
    setColor();
    b_out.value = b.value;
}, false);

b.addEventListener('input', function() {
    setColor();
    b_out.value = b.value;
}, false);

percentage.addEventListener('change', function() {
    setColor();
    percentage_out.value = percentage.value;
}, false);

percentage.addEventListener('input', function() {
    setColor();

    percentage_out.value = percentage.value;
}, false);

//Função que efectua o load dos videos
function readURL(input) {
    if (input.files && input.files[0]) {
        var file = input.files[0];
        var url = URL.createObjectURL(file);
        console.log(url);
        var reader = new FileReader();
        reader.onload = function() {
            myVideo.src = url;

        }
        reader.readAsDataURL(file);
    }
}


var canvas2 = document.getElementById("layer2");
var canvas2ctx= canvas2.getContext('2d');

//Aplica a primeira a mascara de uma tv ao canvas
function mask1(){
    makeLengthTy();
    if(stateMask==false) {
        img = new Image();
        img.src = "maskTv.png";
        canvas2ctx.clearRect(0, 0, canvas2.width, canvas2.height);
        canvas2ctx.drawImage(img, 0, 0, canvas2.width,canvas2.height);
        stateMask = true;
    }else {
        stateMask = false;
        makeNormal();
        canvas2ctx.clearRect(0, 0, canvas2.width, canvas2.height);
    }
}

//Aplica a segunda mascara da frame de um quadro ao canvas
function mask2(){
    makeLengthTy();
    if(stateMask==false) {
        img = new Image();
        img.src = "mask2.png";
        canvas2ctx.clearRect(0, 0, canvas2.width, canvas2.height);
        canvas2ctx.drawImage(img, 0, 0, canvas2.width-100,canvas2.height-20);
        stateMask = true;
    }else {
        stateMask = false;
        makeNormal();
        canvas2ctx.clearRect(0, 0, canvas2.width, canvas2.height);
    }
}

//Actualiza a cor mostrado ao utilizador
function updateColor(){
    r_out.value = r.value;
    g_out.value = g.value;
    b_out.value = b.value;
    percentage_out.value = percentage.value;
    setColor();
}