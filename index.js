const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()
const port = 5000

const app = express()
app.use(cors());
app.use(bodyParser.json());
app.use(fileUpload());


  const MongoClient = require('mongodb').MongoClient;
  const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dix9b.mongodb.net/creativeagency?retryWrites=true&w=majority`;
  const client = new MongoClient(uri, { useNewUrlParser: true , useUnifiedTopology: true });
  client.connect(err => {
    const adminservices = client.db("creativeagency").collection("admin");
    const userreviews = client.db("creativeagency").collection("userreview");
    const userorders = client.db("creativeagency").collection("user");
    const makeadmins = client.db("creativeagency").collection("makeadmin");

    app.post('/addService', (req, res) => {
        const file = req.files.icon;
        const title = req.body.title;
        const description = req.body.description;
        const newImg = file.data;
        const encImg = newImg.toString('base64');
        
        var icon = {
            contentType: file.mimetype,
            size: file.size,
            img: Buffer.from(encImg, 'base64')
        }

        adminservices.insertOne({title, description, icon})
        .then(result => {
            res.send(result.insertedCount > 0);
        })
    })


    app.get('/services', (req,res) => {
        adminservices.find({})
        .toArray((err, documents) => {
            res.send(documents);
        })
    })


    app.post('/addreview', (req, res) => {
        const addreviews = req.body;
        userreviews.insertOne(addreviews)
        .then(result => {
           res.send(result.insertedCount > 0);
        })
    })


    app.get('/reviews', (req,res) => {
        userreviews.find({})
        .toArray((err, documents) => {
            res.send(documents);
        })
    })

    //makeadmin part

    app.post('/makeadmin', (req, res) => {
        const addadmin = req.body;
        makeadmins.insertOne(addadmin)
        .then(result => {
           res.send(result.insertedCount > 0);
        })
    })

    app.get('/isadmin',(req,res)=>{
        const email = req.query.email;
        makeadmins.find({email})
        .toArray((err, documents) => {
            res.send(documents);
        })
    })



    app.post('/addorder', (req, res) => {
        const addorder = req.body;
        userorders.insertOne(addorder)
        .then(result => {
           res.send(result.insertedCount > 0);
        })
    })


    app.get('/userorder', (req,res) => {
        console.log(req.query.Email)
        userorders.find({Email: req.query.Email})
        .toArray((err, documents) => {
            res.send(documents);
        })
    })


    app.get('/allservicelist', (req,res) => {
        userorders.find({})
        .toArray((err, documents) => {
            res.send(documents);
        })
    })
    



  });
  


app.get('/', (req, res) => {
    res.end('Working')
})

app.listen(process.env.PORT || port)




