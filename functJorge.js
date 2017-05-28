var body = document.body,
    r = document.querySelector('#r'),
    g = document.querySelector('#g'),
    b = document.querySelector('#b'),
    percentage = document.querySelector('#percentage'),

    r_out = document.querySelector('#r_out'),
    g_out = document.querySelector('#g_out'),
    b_out = document.querySelector('#b_out'),
    percentage_out = document.querySelector('#percentage_out'),
    color_out = document.getElementById('color'),
    hex_out = document.querySelector('#hex');




function setColor(){

    var r_hex = parseInt(r.value, 10).toString(16),
        g_hex = parseInt(g.value, 10).toString(16),
        b_hex = parseInt(b.value, 10).toString(16),
        hex = "#" + pad(r_hex) + pad(g_hex) + pad(b_hex);

        color_out.style.backgroundColor = hex;
        hex_out.value = hex;
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
    percentage_out.value = percentage.value;
}, false);

percentage.addEventListener('input', function() {

    percentage_out.value = percentage.value;
}, false);