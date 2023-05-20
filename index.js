const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require("mongodb");

app.use(cors());
app.use(express.json());

//barbieDoll
//Psa1eJrNnqRaulAs

const uri =
  "mongodb+srv://barbieDoll:Psa1eJrNnqRaulAs@cluster0.qud1tkv.mongodb.net/?retryWrites=true&w=majority";

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
    await client.connect();

    const toysCollection = client.db("insertToysDB").collection("toys");

    app.get("/addtoys", async (req, res) => {
      const cursor = toysCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.post("/addtoys", async (req, res) => {
      const toys = req.body;
      const result = await toysCollection.insertOne(toys);
      res.send(result);
    });

    app.patch("/toys/:id", async (req, res) => {
      const id = req.params.id;
      const updatedToyData = req.body;
      const query = { id: new ObjectId(id) };
      const updatedToys = {
        $set: {
          ...updatedToyData,
        },
      };
      const result = await toysCollection.updateOne(query, updatedToys);
      res.send(result);
    });

    app.delete("/toys/:id", async (req, res) => {
      const id = req.params.id;
      const query = { id: new ObjectId(id) };
      const result = await toysCollection.deleteOne(query);
      res.send(result);

    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
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
