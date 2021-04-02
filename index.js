const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const { ObjectID } = require('bson');
require('dotenv').config()
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hsnpf.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const app = express()

app.use(bodyParser.json());
app.use(cors());

const port = 5000

client.connect(err => {

  const productsCollection = client.db("shopNow").collection("products");
  const ordersCollection = client.db("shopNow").collection("orders");

  app.post('/addProduct', (req, res) => {
      const product = req.body;
      // console.log('adding product', product)
      productsCollection.insertOne(product)
      .then(result =>{
        console.log('inserted count', result.insertedCount)
        res.send(result.insertedCount > 0)
      })
  })

  app.get('/products', (req, res) => {
    productsCollection.find()
    .toArray((err, items) => {
      res.send(items)
    })
  })

  app.get('/product/:id', (req, res) => {
    productsCollection.find({_id: ObjectID(req.params.id)})
    .toArray((err, documents) => {
      res.send(documents[0])
    })
  })

  app.get('/orders', (req, res) => {
    // console.log(req.query.email)
    ordersCollection.find({email: req.query.email})
    .toArray((err, documents) => {
      res.send(documents)
    })
  })

  app.post('/addOrders', (req, res) => {
    const orders = req.body;
    ordersCollection.insertOne(orders)
    .then(result => {
      res.send(result.insertedCount > 0)
    })
  })

  app.get('/deleteOne/:id', (req, res) => {
    productsCollection.findOneAndDelete({_id: ObjectID(req.params.id)})
    .then(result => {
      // console.log(result)
    })
  })
  
});


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(process.env.PORT || port)