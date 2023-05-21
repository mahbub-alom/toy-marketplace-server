const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qud1tkv.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const toysCollection = client.db("insertToysDB").collection("toys");

    //Creating index on two fields
    const indexKeys = { toyName: 1 };
    const indexOptions = {name:"toyName"};
    const result =await toysCollection.createIndex(indexKeys, indexOptions);


    app.get('/searchToy/:text',async(req,res)=>{
      const searchText = req.params.text;
      const result = await toysCollection.find({
        $or:[
          {toyName:{$regex:searchText, $options:"i"}},
        ]
      }).toArray();
      res.send(result);
    })
    





    app.get("/addtoys", async (req, res) => {
      // const cursor = toysCollection.find();
      const result = await toysCollection.find().limit(20).toArray();
      res.send(result);
    });

    app.get("addtoys/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await toysCollection.findOne(query);
      res.send(result);
    });

    app.post("/addtoys", async (req, res) => {
      const toys = req.body;
      const result = await toysCollection.insertOne(toys);
      res.send(result);
    });

    app.get("/addtoys/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const data = await toysCollection.findOne(filter);
      res.send(data);
    });

    app.get("/mytoys", async (req, res) => {
      const email = req.query.email;
      const sortValue = req.query?.sort;
      let query = {};
      if (req.query?.email) {
        query = { sellerEmail: email };
      }
      const val = sortValue === "dese" ? -1 : 1;
      const result = await toysCollection
        .find(query)
        .sort({ price: val })
        .toArray();
      res.send(result);
    });

    app.put("/addtoys/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedToys = req.body;
      const updatedToysData = {
        $set: {
          toyName: updatedToys.toyName,
          sellerName: updatedToys.sellerName,
          sellerEmail: updatedToys.sellerEmail,
          price: updatedToys.price,
          rating: updatedToys.rating,
          quantity: updatedToys.quantity,
          description: updatedToys.description,
          photo: updatedToys.photo,
        },
      };
      const result = await toysCollection.updateOne(
        filter,
        updatedToysData,
        options
      );
      res.send(result);
    });

    app.delete("/toys/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await toysCollection.deleteOne(query);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("barbie doll server is starting");
});

app.listen(port, () => {
  console.log(`barbie doll server is running on port ${port}`);
});
