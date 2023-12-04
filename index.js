const express = require('express');
const app = express()
const cors = require('cors')
const port = process.env.PORT || 5000;
require('dotenv').config()

// middleware

app.use(cors())
app.use(express.json())


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ejrpgrq.mongodb.net/?retryWrites=true&w=majority`;


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const menuCollection = client.db("bistroDb").collection("menu")
    const reviweCollection = client.db("bistroDb").collection("review")
    const cartsCollection = client.db("bistroDb").collection("carts")

    app.get('/menu', async(req, res)=>{
      const result = await menuCollection.find().toArray();
      res.send(result)
    })

    app.get('/review', async(req, res)=>{
      const result = await reviweCollection.find().toArray();
      res.send(result)
    })


    // Cart Collection

    app.post("/carts", async(req, res)=> {
      const item = req.body;
      console.log(item);
      const result = await cartsCollection.insertOne(item);
      res.send(result);
    })

    
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
res.send('Bistro is sitting')
})

app.listen(port, ()=> {
    console.log('Bistro Boss is Running on port ' + port);
})