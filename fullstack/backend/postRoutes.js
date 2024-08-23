const express = require('express');
const database = require('./connect');
const { ObjectId } = require('mongodb');

let postRoutes = express.Router();

//#1 - Retrieve All
// http://localhost:3000/posts
postRoutes.route("/posts").get(async (request, response) => {
    try {
        let db = database.getDb();
        let data = await db.collection("posts").find({}).toArray();
        if (data.length > 0) {
            response.json(data);
        } else {
            response.status(404).send("No posts found.");
        }
    } catch (error) {
        response.status(500).send("Error retrieving posts: " + error.message);
    }
});

//#2 - Retrieve One
// http://localhost:3000/posts/12345
postRoutes.route("/posts/:id").get(async (request, response) => {
    try {
        let db = database.getDb();
        let data = await db.collection("posts").findOne({ _id: new ObjectId(request.params.id) });
        if (data) {
            response.json(data);
        } else {
            response.status(404).send("Post not found.");
        }
    } catch (error) {
        response.status(500).send("Error retrieving post: " + error.message);
    }
});

//#3 - Create One
postRoutes.route("/posts").post(async (request, response) => {
    try {
        let db = database.getDb();
        let mongoObject = {
            title: request.body.title,
            description: request.body.description,
            content: request.body.content,
            author: request.body.author,
            dateCreated: request.body.dateCreated || new Date() // Set current date if not provided
        };
        let data = await db.collection("posts").insertOne(mongoObject);
        response.status(201).json({ message: "Post created successfully.", postId: data.insertedId });
    } catch (error) {
        response.status(500).send("Error creating post: " + error.message);
    }
});

//#4 - Update One
postRoutes.route("/posts/:id").put(async (request, response) => {
    try {
        let db = database.getDb();
        let mongoObject = {
            $set: {
                title: request.body.title,
                description: request.body.description,
                content: request.body.content,
                author: request.body.author,
                dateCreated: request.body.dateCreated || new Date()
            }
        };
        let data = await db.collection("posts").updateOne({ _id: new ObjectId(request.params.id) }, mongoObject);
        if (data.matchedCount > 0) {
            response.json({ message: "Post updated successfully." });
        } else {
            response.status(404).send("Post not found.");
        }
    } catch (error) {
        response.status(500).send("Error updating post: " + error.message);
    }
});

//#5 - Delete One
postRoutes.route("/posts/:id").delete(async (request, response) => {
    try {
        let db = database.getDb();
        let data = await db.collection("posts").deleteOne({ _id: new ObjectId(request.params.id) });
        if (data.deletedCount > 0) {
            response.json({ message: "Post deleted successfully." });
        } else {
            response.status(404).send("Post not found.");
        }
    } catch (error) {
        response.status(500).send("Error deleting post: " + error.message);
    }
});

module.exports = postRoutes;
