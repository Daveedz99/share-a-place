import { Map } from './UI/Map'
// SanitizeHtml viene utilizzato per proteggere il nostro codice, da eventuali js code injection ( possibili come in nel caso dell'uso di innerHTML qui di seguito.)
import sanitizeHtml from 'sanitize-html'

// Classe "LoadedPlace" che chiama l'index all'interno della folder "my-place" per visualizzare
// una nuova page appunto con differenti funzionalità ma vista simile
class LoadedPlace {
    // Genera una Google Map chiamando il costruttore in Map.js
    constructor(coordinates, address) {
        new Map(coordinates);
        // Creo in /myplace/index.html il titolo della posizione condivisa
        const headerTitleEl = document.querySelector('header h1');
        // SanitizeHtml per proteggere injection di script (codice js).
        headerTitleEl.innerHTML = sanitizeHtml(address)
    }
}
// Passare un url al costrutto API JS "URL" permette di ricevere un oggetto dettagliato,
// il quale contiene informazioni necessarie a noi.
const url = new URL(location.href);
const queryParams = url.searchParams;
// "get" ritornerà sempre una stringa, si può convertire con un ParseFloat o semplicemente '+' prima del valore in questione
// const coords = {
//     lat: +queryParams.get('lat'),
//     lng: +queryParams.get('lng')
// }
// const address = queryParams.get('address')

// Chiamo il backend con una get, per ricevere tramite id, il singolo posto caricato con le coordinate relative, ( in questo caso su localhost:3000 )
const locId = queryParams.get('location')
const myServer = 'http://localhost:3000'
fetch(`${myServer}/location/${locId}`)
    .then((response) => {
        if (response.status === 404) {
            throw new Error('Could not find location')
        }
        return response.json()
    }).then(data => {
        new LoadedPlace(data.coordinates, data.address)
    }).catch(e => {
        alert(e.message)
    })