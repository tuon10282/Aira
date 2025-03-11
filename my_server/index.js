const express = require('express');
const app = express();
const port = 3002;

const morgan = require("morgan");
app.use(morgan("combined"));

const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const cors = require("cors");
app.use(cors());

app.listen(port, () => {
  console.log(`My Server listening on port ${port}`);
});

app.get("/", (req, res) => {
  res.send("This Web server is processed for MongoDB");
});

const { MongoClient, ObjectId } = require('mongodb');
client = new MongoClient("mongodb://127.0.0.1:27017");
client.connect();
database = client.db("Aira");

usersCollection = database.collection("Users");
productsCollection = database.collection("Products");

// Get all users
app.get("/users", cors(), async (req, res) => {
  const result = await usersCollection.find({}).toArray();
  res.send(result);
});

// Create new user
app.post("/users", cors(), async (req, res) => {
  // Check if email already exists
  const existingUser = await usersCollection.findOne({ Email: req.body.Email });
  if (existingUser) {
    return res.status(400).send({ error: "Email already registered" });
  }
  
  // Put json User into database
  await usersCollection.insertOne(req.body);
  // Send message to client
  res.send(req.body);
});

// Login endpoint
app.post("/login", cors(), async (req, res) => {
  try {
    // Find user with matching email and password
    const { Email, Password } = req.body;
    
    // Validate input
    if (!Email || !Password) {
      return res.status(400).send({ error: "Email and password are required" });
    }
    
    // Find user by email
    const user = await usersCollection.findOne({ Email: Email });
    
    // Check if user exists
    if (!user) {
      return res.status(401).send({ error: "Invalid email or password" });
    }
    
    // Check if password matches
    if (user.Password !== Password) {
      return res.status(401).send({ error: "Invalid email or password" });
    }
    
    // Remove password from response
    const { Password: userPassword, ...userWithoutPassword } = user;
    
    // Return user data (without password)
    res.status(200).send({
      message: "Login successful",
      user: userWithoutPassword
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).send({ error: "Internal server error" });
  }
});

// Get user by ID endpoint
app.get("/users/:id", cors(), async (req, res) => {
  try {
    var o_id = new ObjectId(req.params["id"]);
    const result = await usersCollection.findOne({ _id: o_id });
    
    if (!result) {
      return res.status(404).send({ error: "User not found" });
    }
    
    res.send(result);
  } catch (error) {
    res.status(500).send({ error: "Internal server error" });
  }
});

// Get all products
app.get("/products", cors(), async (req, res) => {
  const result = await productsCollection.find({}).toArray();
  res.send(result);
});

// Get product by ID
app.get("/products/:id", cors(), async (req, res) => {
  var o_id = new ObjectId(req.params["id"]);
  const result = await productsCollection.find({ _id: o_id }).toArray();
  res.send(result[0]);
});