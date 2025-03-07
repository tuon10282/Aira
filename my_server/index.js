const express = require('express');
const app = express();
const port = 3002;

const morgan=require("morgan")
app.use(morgan("combined"))

const bodyParser=require("body-parser")
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const cors=require("cors");
app.use(cors())

app.listen(port,()=>{
console.log(`My Server listening on port ${port}`)
})

app.get("/",(req,res)=>{
res.send("This Web server is processed for MongoDB")
})

const { MongoClient, ObjectId } = require('mongodb');
client = new MongoClient("mongodb://127.0.0.1:27017");
client.connect();
database = client.db("Aira"); 
usersCollection = database.collection("Users");
productsCollection = database.collection("Products");



app.get("/users",cors(),async (req,res)=>{ 
    const result = await usersCollection.find({}).toArray();
    res.send(result)
    }
    )

app.post("/users",cors(),async(req,res)=>{ 
    //put json User into database
    await usersCollection.insertOne(req.body)
    //send message to client(send all database to client)
    res.send(req.body)
    })

app.get("/products",cors(),async (req,res)=>{
    const result = await productsCollection.find({}).toArray();
    res.send(result)
    })
app.get("/products/:id",cors(),async (req,res)=>{
    var o_id = new ObjectId(req.params["id"]);
    const result = await productsCollection.find({_id:o_id}).toArray(); 
    res.send(result[0])
    }
        )