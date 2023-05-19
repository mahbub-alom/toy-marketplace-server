const express = require('express');
const app = express();
const cors = require('cors');
const port= process.env.PORT ||5000;
// const { MongoClient, ServerApiVersion } = require('mongodb');

app.use(cors());
app.use(express.json());






app.get('/', (req, res)=>{
    res.send('barbie doll server is starting')
})

app.listen(port,()=>{
    console.log(`barbie doll server is running on port ${port}`);
})