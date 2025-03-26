const { MongoClient } = require("mongodb");
const express = require("express");
const cors = require("cors");
const path = require("path");
require('dotenv').config();

const app = express();

const corsOptions = {
    origin: ['http://localhost:5050', 'https://video-library-z8t4.onrender.com'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const connectionString = process.env.MONGODB_URI;
const PORT = process.env.PORT || 5050;

let database;

// Connect to MongoDB Atlas once and reuse the connection
async function connectToMongoDB() {
    try {
        const client = new MongoClient(connectionString);
        await client.connect();
        console.log("Connected to MongoDB Atlas");
        database = client.db("videodb");
    } catch (error) {
        console.error("Failed to connect to MongoDB:", error);
        process.exit(1);
    }
}
connectToMongoDB();

//API routes
app.get('/get-admin', async (req, res) => {
    const documents = await database.collection("tbladmin").find({}).toArray();
    res.send(documents);
});

app.get('/get-videos', async (req, res) => {
    const documents = await database.collection("tblvideos").find({}).toArray();
    res.send(documents);
});

app.get('/get-categories', async (req, res) => {
    const documents = await database.collection("tblcategories").find({}).toArray();
    res.send(documents);
});

app.get('/get-users', async (req, res) => {
    const documents = await database.collection("tblusers").find({}).toArray();
    res.send(documents);
});

app.get('/get-user/:userid', async (req, res) => {
    const documents = await database.collection("tblusers").find({ UserId: req.params.userid }).toArray();
    res.send(documents);
});

app.get('/get-video/:id', async (req, res) => {
    const documents = await database.collection("tblvideos").find({ VideoId: parseInt(req.params.id) }).toArray();
    res.send(documents);
});

app.get('/filter-videos/:categoryid', async (req, res) => {
    const documents = await database.collection("tblvideos").find({ CategoryId: parseInt(req.params.categoryid) }).toArray();
    res.send(documents);
});

app.post('/register-user', async (req, res) => {
    const user = {
        UserId: req.body.UserId,
        UserName: req.body.UserName,
        Password: req.body.Password,
        Email: req.body.Email,
        Mobile: req.body.Mobile
    };
    await database.collection("tblusers").insertOne(user);
    res.end();
});

app.post('/add-category', async (req, res) => {
    const category = {
        CategoryId: parseInt(req.body.CategoryId),
        CategoryName: req.body.CategoryName
    };
    await database.collection("tblcategories").insertOne(category);
    res.end();
});

app.post('/add-video', async (req, res) => {
    const video = {
        VideoId: parseInt(req.body.VideoId),
        Title: req.body.Title,
        Url: req.body.Url,
        Description: req.body.Description,
        CategoryId: parseInt(req.body.CategoryId)
    };
    await database.collection("tblvideos").insertOne(video);
    res.end();
});

app.put('/edit-video/:id', async (req, res) => {
    const video = {
        VideoId: parseInt(req.body.VideoId),
        Title: req.body.Title,
        Url: req.body.Url,
        Description: req.body.Description,
        CategoryId: parseInt(req.body.CategoryId)
    };
    await database.collection("tblvideos").updateOne(
        { VideoId: parseInt(req.params.id) }, 
        { $set: video }
    );
    res.end();
});

app.delete('/delete-video/:id', async (req, res) => {
    await database.collection("tblvideos").deleteOne({ VideoId: parseInt(req.params.id) });
    res.end();
});

// Use the client app
app.use(express.static(path.join(__dirname, "/client/build")));

// Render client for any path
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "/client/build/index.html"));
});

app.listen(PORT, () => {
    console.log(`Server started at: https://video-library-z8t4.onrender.com`);
});
