const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config()

const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());


app.get('/', (req, res) => {
    res.send('Hello World!')
})

const uri = `mongodb+srv://${process.env.DB_user}:${process.env.DB_password}@cluster0.hvuik.mongodb.net/${process.env.BD_name}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
    // console.log('connection err', err)
    const eventCollection = client.db("Salon").collection("event");
    const appointmentCollection = client.db("Salon").collection("addAppointment");
    const ReviewCollection = client.db("Salon").collection("Review");


    app.post('/addReview', (req, res) => {
        const appointment = req.body;
        ReviewCollection.insertOne(appointment)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    });

    app.get('/Review', (req, res) => {
        ReviewCollection.find()
            .toArray((err, items) => {
                res.send(items)
            })

    })


    app.post('/addAppointment', (req, res) => {
        const appointment = req.body;
        appointmentCollection.insertOne(appointment)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    });
    
    app.get('/appointment', (req, res) => {
        appointmentCollection.find()
            .toArray((err, items) => {
                res.send(items)
            })

    })

    app.post('/addEvent', (req, res) => {
        const newEvent = req.body;
        eventCollection.insertOne(newEvent)
            .then(result => {         
                res.send(result.insertedCount > 1)
            })
    })


    app.delete('/deleteProduct/:id', (req, res) => {
        const id = ObjectID(req.params.id);
        console.log('delete this', id);
        eventCollection.deleteOne({ _id: id })
            .then(documents => res.send(!!documents.value))
    })

    app.get('/events', (req, res) => {
        eventCollection.find()
            .toArray((err, items) => {
                res.send(items)
            })

    })

    app.get('/events/:id', (req, res) => {
        const id = ObjectID(req.params.id);
        eventCollection.find(id)
            .toArray((err, items) => {
                res.send(items)
            })
    })
});


app.listen(process.env.PORT || port, () => {
    // console.log(`Example app listening at http://localhost:${port}`)
})