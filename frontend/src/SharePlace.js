import { Modal } from './UI/Modal.js'
import { Map } from './UI/Map.js'
import { getCoordsFromAddress, getAddressFromCoords } from './Utility/Location'

class PlaceFinder {
    constructor() {
        // Dichiaro e linko gli elementi sui quali andrò a lavorare.
        const addressForm = document.querySelector('form');
        const locateUserBtn = document.getElementById('locate-btn')
        this.shareBtn = document.getElementById('share-btn')
        this.newWindowBtn = document.getElementById('new-window-btn')

        // Bindo il "this" alle functions, cosi da potermi riferire a PlaceFinder e non a window.
        locateUserBtn.addEventListener('click', this.locateUserHandler.bind(this))
        addressForm.addEventListener('submit', this.findAddressHandler.bind(this))
        this.shareBtn.addEventListener('click', this.sharePlaceHandler)
        this.newWindowBtn.addEventListener('click', this.openInNewWindowHandler)
    }
    // Funzione Button Share place copia link o una fallBack ( 'focus event' in questo caso ) 
    sharePlaceHandler() {
        const sharedLinkInputElement = document.getElementById('share-link');
        // Check se esiste nel browser 'clipboard' ( se esso è aggiornato )
        if (!navigator.clipboard) {
            // Evidenzia l'elemento in question ( focus )
            sharedLinkInputElement.select()
            return;
        }
        // Copia nella clipboard ( shortcut per CTRL + C )
        navigator.clipboard.writeText(sharedLinkInputElement.value).then((response) => {
            alert('Copied to clipboard')
        }).catch((e) => {
            sharedLinkInputElement.select()
            console.log(e)
        });
    }

    // Funzione Button Open in new window 
    openInNewWindowHandler() {
        const sharedLinkInputElement = document.getElementById('share-link');
        if (sharedLinkInputElement) window.open(sharedLinkInputElement.value)
    }
    // Eseguo un controllo nel caso in cui una mappa fosse gia renderizzata per non 
    // istanziare una seconda GoogleMap, chiamo nuovamente il metodo 'render()' ad essa legata,
    // altrimenti ne genero una passandogli le coordinate.
    selectPlace(coordinates, address) {
        if (this.map) {
            this.map.render(coordinates)
        } else {
            this.map = new Map(coordinates)
        }
        fetch('http://localhost:3000/add-location', {
            method: 'POST',
            body: JSON.stringify({
                address: address,
                lat: coordinates.lat,
                lng: coordinates.lng
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => {
            return response.json()
        }).then(data => {
            const locationId = data.locId
            // Impostando la props disabled su false, il button si abilita.
            this.shareBtn.disabled = false
            this.newWindowBtn.disabled = false
            // Prendo #share-link input e cambio il suo value in modo dinamico grazie al "TEMPLATE LITERAL NOTATION"
            const sharedLinkInputElement = document.getElementById('share-link');
            sharedLinkInputElement.value = `${location.origin}/my-place?location=${locationId}`;
        })


    }
    // Funzione di ricerca indirizzo da stringa 
    async findAddressHandler(event) {
        // Evitiamo il ri-caricamento della page.
        event.preventDefault();
        const address = event.target.querySelector('input').value

        // Controllo se il valore dell'input o ( || ) 
        // il valore dell'input trimmato (senza spazi), è vuoto
        if (!address || address.trim().length === 0) {
            alert('Invalid address entered');
            return;
        }
        //Istanzio una modale con testo personalizzato dal costruttore di Modal.js
        const modal = new Modal('loading-modal-content', 'Loading location please wait..')
        modal.show()
        try {
            const coordinates = await getCoordsFromAddress(address);
            this.selectPlace(coordinates, address)
        } catch (err) {
            alert(err.message)
        }
        modal.hide()
    }

    // Funzione della current location, tira fuori le coordinate della posizione attuale.
    locateUserHandler() {
        if (!navigator.geolocation) {
            alert('Location feature not avaible in your browser, please use a modern browser.')
            return;
        }
        const modal = new Modal('loading-modal-content', 'Loading location please wait..')
        modal.show()
        // API JS -- funzione built-in per ricevere l'oggetto della mia posizione attuale.
        navigator.geolocation.getCurrentPosition(
            async successResult => {
                const coordinates = {
                    lat: successResult.coords.latitude,
                    lng: successResult.coords.longitude
                }
                const address = await getAddressFromCoords(coordinates)
                modal.hide()
                this.selectPlace(coordinates, address);
            }, error => {
                modal.hide()
                alert('Could not locate you unfortunately. Please enter an address manually!')
            });
    }
}

// Richiamo alla fine la classe, per far partire le logiche inizializzate.
const placeFinder = new PlaceFinder