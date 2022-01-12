'use strict';

document.getElementById('country').addEventListener('change', ()=> {
    // Finde Heraus Welches Element jetzt das richtige ist
    let value = document.getElementById('country').value
    // Ändere den Wert entsprechend im City Element
    let newIt = '';
    newIt += `<option value='-'>Wählen Sie</option>`;
    if(value === 'DE'){
        newIt += `<option value='Berlin'>Berlin</option>`;
        newIt += `<option value='Munic'>München</option>`;
    } else if(value === 'US'){
        newIt += `<option value='San Francisco'>San Francisco</option>`;
    }
    document.getElementById('city').innerHTML = newIt;
})