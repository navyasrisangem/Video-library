var mongoClient = require("mongodb").MongoClient;
var express = require("express");
var cors = require("cors");
const path = require("path");

var app = express();
//CORS is required for handling request methods like POST, PUT, DELETE
app.use(cors());
//Required fro converting data into JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

var connectionString = "mongodb://localhost:27017";

//API routes
app.get('/get-admin', (req, res) => {
    mongoClient.connect(connectionString).then(connectionObject => {
        var database = connectionObject.db("videodb");
        database.collection("tbladmin").find({}).toArray().then(documents => {
            res.send(documents);
            res.end(); //stop the response otherwise it will be continuosly running
        })
    })
});

app.get('/get-videos', (req, res) => {
    mongoClient.connect(connectionString).then(connectionObject => {
        var database = connectionObject.db("videodb");
        database.collection("tblvideos").find({}).toArray().then(documents => {
            res.send(documents);
            res.end();
        })
    })
});

app.get('/get-categories', (req, res) => {
    mongoClient.connect(connectionString).then(connectionObject => {
        var database = connectionObject.db("videodb");
        database.collection("tblcategories").find({}).toArray().then(documents => {
            res.send(documents);
            res.end();
        })
    })
});

app.get('/get-users', (req, res) => {
    mongoClient.connect(connectionString).then(connectionObject => {
        var database = connectionObject.db("videodb");
        database.collection("tblusers").find({}).toArray().then(documents => {
            res.send(documents);
            res.end();
        })
    })
});

app.get('/get-user/:userid', (req, res) => {
    mongoClient.connect(connectionString).then(connectionObject => {
        var database = connectionObject.db("videodb");
        database.collection("tblusers").find({ UserId: req.params.userid }).toArray().then(documents => {
            res.send(documents);
            res.end();
        })
    })
});

app.get('/get-video/:id', (req, res) => {
    mongoClient.connect(connectionString).then(connectionObject => {
        var database = connectionObject.db("videodb");
        database.collection("tblvideos").find({ VideoId: parseInt(req.params.id) }).toArray().then(documents => {
            res.send(documents);
            res.end();
        })
    })
});

app.get('/filter-videos/:categoryid', (req, res) => {
    mongoClient.connect(connectionString).then(connectionObject => {
        var database = connectionObject.db("videodb");
        database.collection("tblvideos").find({ CategoryId: parseInt(req.params.categoryid) }).toArray().then(documents => {
            res.send(documents);
            res.end();
        })
    })
});

app.post('/register-user', (req, res) => {
    mongoClient.connect(connectionString).then(connectionObject => {
        var database = connectionObject.db("videodb");

        var user = {
            UserId: req.body.UserId,
            UserName: req.body.UserName,
            Password: req.body.Password,
            Email: req.body.Email,
            Mobile: req.body.Mobile
        };

        database.collection("tblusers").insertOne(user).then(() => {
            res.end();
        })
    })
});

app.post('/add-category', (req, res) => {
    mongoClient.connect(connectionString).then(connectionObject => {
        var database = connectionObject.db("videodb");

        var category = {
            CategoryId: parseInt(req.body.CategoryId),
            CategoryName: req.body.CategoryName
        };

        database.collection("tblcategories").insertOne(category).then(() => {
            res.end();
        })
    })
});

app.post('/add-video', (req, res) => {
    mongoClient.connect(connectionString).then(connectionObject => {
        var database = connectionObject.db("videodb");

        var video = {
            VideoId: parseInt(req.body.VideoId),
            Title: req.body.Title,
            Url: req.body.Url,
            Description: req.body.Description,
            CategoryId: parseInt(req.body.CategoryId)
        };

        database.collection("tblvideos").insertOne(video).then(() => {
            res.end();
        })
    })
});

app.put('/edit-video/:id', (req, res) => {
    mongoClient.connect(connectionString).then(connectionObject => {
        var database = connectionObject.db("videodb");

        var video = {
            VideoId: parseInt(req.body.VideoId),
            Title: req.body.Title,
            Url: req.body.Url,
            Description: req.body.Description,
            CategoryId: parseInt(req.body.CategoryId)
        };

        database.collection("tblvideos").updateOne({ VideoId: parseInt(req.params.id) }, { $set: video }).then(() => {
            res.end();
        })
            .catch(err => {
                console.error("Error updating video:", err);
            });
    })
        .catch(err => {
            console.error("Database connection error:", err);
        })
});

app.delete('/delete-video/:id', (req, res) => {
    mongoClient.connect(connectionString).then(connectionObject => {
        var database = connectionObject.db("videodb");
        database.collection("tblvideos").deleteOne({ VideoId: parseInt(req.params.id) }).then(() => {
            res.end();
        })
    })
});


// Use the client app
app.use(express.static(path.join(__dirname, "/client/build")));

// Render client for any path
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "/client/build/index.html"));
});

app.listen(5050);
console.log(`Server started : http://127.0.0.1:5050`);