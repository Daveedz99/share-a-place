// Google KEY Authorization https://developers.google.com/maps
const GOOGLE_API_KEY = 'AIzaSyAig3Z9y_zrndlS2wJglKfEutG6k7HcGEA'

// Function che riceve le coordinate da SharePlace.js e ritorna da esse l'indirizzo esatto
export async function getAddressFromCoords(coords) {
    const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${coords.lat},${coords.lng}&key=${GOOGLE_API_KEY}`)

    // Error handling fetch risposta != 200 
    if (!response.ok) {
        throw new Error('Failed to fetch address. Please try again!')
    }
    const data = await response.json();
    // Error handling fetch risposta == 200, ma errore dopo.
    if (data.error_message) {
        throw new Error(data.error_message)
    }
    const address = data.results[0].formatted_address;
    return address;
}

// Function che riceve l' indirizzo da SharePlace.js e ritorna da esso le coordinate esatte
export async function getCoordsFromAddress(address) {
    const urlAddress = encodeURI(address)
    const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${urlAddress}&key=${GOOGLE_API_KEY}`)

    // Error handling fetch risposta != 200 
    if (!response.ok) {
        throw new Error('Failed to fetch coordinates. Please try again!')
    }
    const data = await response.json();
    // Error handling fetch risposta == 200, ma errore dopo.
    if (data.error_message) {
        throw new Error(data.error_message)
    }
    const coordinates = data.results[0].geometry.location
    return coordinates
}