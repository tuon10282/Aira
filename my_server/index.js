const express = require('express');
const app = express();
const port = 3002;

const morgan = require("morgan");
app.use(morgan("combined"));

const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
const bcrypt = require('bcrypt');
const saltRounds = 10; // Độ phức tạp của mã hóa, 10 là giá trị phổ biến
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
// Create new user
app.post("/users", cors(), async (req, res) => {
  try {
    // Check if email already exists
    const existingUser = await usersCollection.findOne({ Email: req.body.Email });
    if (existingUser) {
      return res.status(400).send({ error: "Email already registered" });
    }
    
    // Hash the password
    const hashedPassword = await bcrypt.hash(req.body.Password, saltRounds);
    
    // Replace plain password with hashed one
    const userWithHashedPassword = {
      ...req.body,
      Password: hashedPassword
    };
    
    // Put json User into database
    await usersCollection.insertOne(userWithHashedPassword);
    
    // Send message to client (don't send back the hashed password)
    const { Password, ...userWithoutPassword } = userWithHashedPassword;
    res.send(userWithoutPassword);
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).send({ error: "Internal server error" });
  }
});
const jwt = require('jsonwebtoken');
const SECRET_KEY = "aira_demo_secret_key"; // Đủ dùng cho mục đích demo

// Login endpoint
app.post("/login", cors(), async (req, res) => {
  try {
    // Find user with matching email
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
    
    // Compare hashed password
    const passwordMatch = await bcrypt.compare(Password, user.Password);
    
    if (!passwordMatch) {
      return res.status(401).send({ error: "Invalid email or password" });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id.toString(), email: user.Email },
      SECRET_KEY,
      { expiresIn: '24h' }
    );
    
    // Remove password from response
    const { Password: userPassword, ...userWithoutPassword } = user;
    
    // Return user data with token
    res.status(200).send({
      message: "Login successful",
      user: userWithoutPassword,
      auth: {
        token: token
      }
    });
  } catch (error) {
    console.error("Login error:", error);
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