const express = require('express');
const database = require('./connect');
const ObjectId = require('mongodb').ObjectId;

const postRoutes = express.Router(); // Correctly initialize Router

//#1 - Retrieve All
postRoutes.get('/', async (request, response) => {  // Correct base route
    try {
        let db = database.getDb();
        let data = await db.collection('posts').find({}).toArray();
        if (data.length > 0) {
            response.json(data);
        } else {
            response.status(404).send("Data not found");
        }
    } catch (error) {
        response.status(500).send(error.message);
    }
});

//#2 - Retrieve One
postRoutes.get('/:id', async (request, response) => {  // Correct route
    try {
        let db = database.getDb();
        let data = await db.collection('posts').findOne({ _id: new ObjectId(request.params.id) });
        if (data) {
            response.json(data);
        } else {
            response.status(404).send("Data not found");
        }
    } catch (error) {
        response.status(500).send(error.message);
    }
});

//#3 - Create One
postRoutes.post('/', async (request, response) => {  // Correct route
    try {
        let db = database.getDb();
        let mongoObject = {
            title: request.body.title,
            description: request.body.description,
            content: request.body.content,
            author: request.body.author,
            dateCreated: request.body.dateCreated
        };
        let data = await db.collection('posts').insertOne(mongoObject);
        response.status(201).json(data);
    } catch (error) {
        response.status(500).send(error.message);
    }
});

//#4 - Update One
postRoutes.put('/:id', async (request, response) => {  // Correct route
    try {
        let db = database.getDb();
        let mongoObject = {
            $set: {
                title: request.body.title,
                description: request.body.description,
                content: request.body.content,
                author: request.body.author,
                dateCreated: request.body.dateCreated
            }
        };

        let data = await db.collection('posts').updateOne({ _id: new ObjectId(request.params.id) }, mongoObject);
        response.json(data);
    } catch (error) {
        response.status(500).send(error.message);
    }
});

//#5 - Delete One
postRoutes.delete('/:id', async (request, response) => {  // Correct route
    try {
        let db = database.getDb();
        let data = await db.collection('posts').deleteOne({ _id: new ObjectId(request.params.id) });
        response.json(data);
    } catch (error) {
        response.status(500).send(error.message);
    }
});

module.exports = postRoutes;
