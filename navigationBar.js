/**
 * Created by jorgeduarte on 29/05/17.
 */
function changeButton(type){

    var selectColor = document.getElementById('selectColor');
    var filters = document.getElementById('filters');
    var labelTitle = document.getElementById('labelTitle');
    var imporFile = document.getElementById('imporFile');
    var masks = document.getElementById('mask');
    var moments = document.getElementById('moments');


    switch(type)
    {
        case 'WheneverRelevantMoments':
            selectColor.style.display = 'block';
            filters.style.display = 'none';
            imporFile.style.display = 'none';
            masks.style.display = 'none';
            moments.style.display = 'block';
            labelTitle.innerHTML = "Change the relevant color"

            break;
        case 'filters':
            filters.style.display = 'block';
            selectColor.style.display = 'block';
            imporFile.style.display = 'none';
            masks.style.display = 'none';
            moments.style.display = 'none';
            labelTitle.innerHTML = "Change the filter color"

            break;
        case 'imporFile':
            filters.style.display = 'none';
            selectColor.style.display = 'none';
            imporFile.style.display = 'block';
            masks.style.display = 'none';
            moments.style.display = 'none';
            break;
        case 'masks':
            filters.style.display = 'none';
            selectColor.style.display = 'none';
            imporFile.style.display = 'none';
            masks.style.display = 'block';
            moments.style.display = 'none';
            break;
    }
}



