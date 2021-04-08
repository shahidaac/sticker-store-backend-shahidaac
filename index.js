const express = require("express");
require("dotenv").config();
const MongoClient = require("mongodb").MongoClient;
const bodyParser = require("body-parser");
const cors = require("cors");
const objectId = require("mongodb").ObjectId;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cxkd4.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
const port = process.env.PORT || 5000;


app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});




client.connect((err) => {
  const stickerCollection = client.db("stickerStore").collection("stickers");
  const orderCollection = client.db("stickerStore").collection("orders");


  

  app.post("/addSticker", (req, res) => {
    const sticker = req.body;
    stickerCollection.insertOne(sticker).then((result) => {
      console.log(result);
      res.send(result.insertedCount > 0);
    });
  });

  app.post("/addOrder",  (req, res) => {
    const order = req.body;
    orderCollection.insertOne(order).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });

  app.get("/orders",  (req, res) => {
    orderCollection
      .find({ email: req.query.email })
      .toArray((err, documents) => {
        res.send(documents);
      });
  });

  app.get("/stickers",  (req, res) => {
    stickerCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });

  app.get("/checkout/:id",  (req, res) => {
    stickerCollection
      .find({ _id: objectId(req.params.id) })
      .toArray((err, documents) => {
        res.send(documents[0]);
      });
  });

  app.get("/manageProduct",  (req, res) => {
    stickerCollection
      .find({ email: req.query.email })
      .toArray((err, documents) => {
        res.send(documents);
      });
  });

  app.delete("/delete/:id",  (req, res) => {
    stickerCollection
      .findOneAndDelete({ _id: objectId(req.params.id) })
      .then((result) => {
        res.send(result.deletedCount > 0);
      });
  });
});

app.get("/",  (req, res) => {
  res.send("Hi Trendy Stickers");
});

app.listen(port);
