
// Creo classe Map ( molto basic ) come da documentazione -> https://developers.google.com/maps/documentation
export class Map {
    constructor(coords) {
        this.render(coords)
    }

    render(coordinates) {
        // Google ( una volta importato lo script di googleMaps, diventerà una variabie
        // accesibile ovunque) quindi se ne potrà controllare l'esistenza.
        if (!google) {
            alert('Could not load maps library.')
            return;
        }

        // Genero la google maps richiamando il costruttore "google.maps.Map" posizionata
        // nell'elemento div con id="#map" presente nel mio index.html
        const map = new google.maps.Map(document.getElementById('map'), {
            center: coordinates,
            zoom: 16
        })

        new google.maps.Marker({
            position: coordinates,
            map: map,
        })
    }

}