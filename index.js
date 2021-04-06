require('dotenv').config()
const bodyParser = require('body-parser')
const express = require('express')
const cors = require('cors')
const app = express()
const port = 5000;
const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.n4z9q.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

app.use(cors());
app.use(bodyParser.json());


app.get('/', (req, res) => {
    res.send('Welcome to Volunteer Network Server')
  })


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const volunteerCollection = client.db("volunteer-network").collection("volunteer-work");
  

  app.post('/addTask' , (req,res)=>{
    const task = req.body;
    volunteerCollection.insertOne(task)
        .then(result => {
            if (result.insertedCount > 0) {
              res.send(result.insertedCount > 0)
            }
        })
  });


  app.get('/allevents', (req,res) => {
    const useremail = req.query.email;
    
    volunteerCollection.find({email: useremail})
    .toArray((err, docs) =>{
        res.send(docs)
    })
})

});


app.listen(process.env.PORT || port)