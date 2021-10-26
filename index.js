const { MongoClient } = require('mongodb');
require('dotenv').config();
const express = require("express");
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
const { response } = require('express');


const app = express();
const port = 5000;

//middleware
app.use(cors());
app.use(express.json());

//user: mongodbgenius
//password: DxIUnA8OQI5E4hbx

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.y1dxx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {

    try {
        await client.connect();

        const database = client.db("carMechanic");
        const servicesCollection = database.collection('services');

        //GET API
        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        });

        //GET Single Service
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            console.log('Heating specific service', id);
            const query = { _id: ObjectId(id) };

            const service = await servicesCollection.findOne(query);

            res.send(service);
        });

        //POST API
        app.post('/services', async (req, res) => {
            const service = req.body;
            console.log('Hit the post api', service);
            const result = await servicesCollection.insertOne(service);
            console.log(result);
            response.json(result)
        });

        //DELETE API
        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await servicesCollection.deleteOne(query);
            response.json(result);
        })
    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get("/", (req, res) => {
    res.send("Running Genius Server")
});

app.listen(port, () => {
    console.log('Running Genius Server on Port: ', port);
})