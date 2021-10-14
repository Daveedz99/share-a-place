const express = require('express');

const MongoClient = require('mongodb').MongoClient;
const mongodb = require('mongodb');

const router = express.Router();

// CONESSIONE AL MONGO CLIENT PASSANDOGLI LA URL PRESENTE IN MONGODB --> Document: riga in una table | Collection: table of records
const url = 'mongodb+srv://davide:abcd1234@locationdb.ebu2u.mongodb.net/locations?retryWrites=true&w=majority'
const client = new MongoClient(url)

// Storage in memoria ( al riavvio del server si perdono i dati )
const locationStorage = {
    locations: []
}
// Configuro la path per il frontend, dopodichè gestisco eventuali operazioni con mongoDB.
router.post('/add-location', async (req, res, next) => {
    try {
        await client.connect();
        // Configurazione database - seleziono db
        const db = client.db('locations');

        // Configurazione database - seleziono nome collezione ( se non presente si crea in automatico )
        const locations = db.collection('user-locations');

        // Oggetto da postare ( query )
        const query = {
            address: req.body.address,
            coords: { lat: req.body.lat, lng: req.body.lng }
        }
        // Funzione che inserisce un singolo documento ovvero una riga.
        const storedLocation = await locations.insertOne(query)

        // Funzione lanciata al termine dell'insertOne method.
        res.json({
            message: 'Stored location!', locId: storedLocation.insertedId
        })
        console.log(`New document inserted with _id: ${storedLocation.insertedId}`)
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }


    //SENZA MONGODB SALVO IN MEMORIA :
    // locationStorage.locations.push({
    //     id: id,
    //     address: req.body.address,
    //     coords: { lat: req.body.lat, lng: req.body.lng }
    // });
    // res.json({
    //     message: 'Stored location!', locId: id
    // })

});

router.get('/location/:id', async (req, res, next) => {
    const locationId = req.params.id;
    try {
        // Stessa configurazione database, ma per una GET request
        await client.connect();
        const db = client.db('locations');
        const locations = db.collection('user-locations');

        console.log(locationId)
        // Funzione che cerca un singolo "documento", ovvero una singola riga.
        const foundLocation = await locations.findOne(
            // Oggetto con cui specifico i criteri di ricerca nel DB -> in questo caso per ID
            { _id: mongodb.ObjectId(locationId) }
        )

        if (!foundLocation) {
            return res.status(404).json({ message: 'Not Found!' })
        }

        // Funzione lanciata al termine del "findOne" method.
        res.json({ address: foundLocation.address, coordinates: foundLocation.coords })

    } catch (e) {
        console.log(e)
    }
    finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }

    // Locationstorage era il DB locale usato prima di mongo
    // const location = locationStorage.locations.find(el => {
    //     return el.id === locationId
    // })

    // if (!location) {
    //     return res.status(404).json({ message: 'Not Found!' })
    // }
    // res.json({
    //     address: location.address,
    //     coordinates: location.coords
    // })

});

module.exports = router;