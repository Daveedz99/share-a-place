import { Map } from './UI/Map'

// Classe "LoadedPlace" che chiama l'index all'interno della folder "my-place" per visualizzare
// una nuova page appunto con differenti funzionalità ma vista simile
class LoadedPlace {
    // Genera una Google Map chiamando il costruttore in Map.js
    constructor(coordinates, address) {
        new Map(coordinates);
        // Creo in /myplace/index.html il titolo della posizione condivisa
        const headerTitleEl = document.querySelector('header h1');
        headerTitleEl.textContent = address
    }
}
// Passare un url al costrutto API JS "URL" permette di ricevere un oggetto dettagliato, 
// il quale contiene informazioni necessarie a noi.
const url = new URL(location.href);
const queryParams = url.searchParams;
// "get" ritornerà sempre una stringa, si può convertire con un ParseFloat o semplicemente '+' prima del valore in questione
const coords = {
    lat: +queryParams.get('lat'),
    lng: +queryParams.get('lng')
}
const address = queryParams.get('address')


new LoadedPlace(coords, address)