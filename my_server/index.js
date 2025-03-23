const express = require('express');
const app = express();
const port = 3002;

const morgan = require("morgan");
app.use(morgan("combined"));

// Replace these two lines:
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended: true}));

// With these lines to increase payload limit:
const bodyParser = require("body-parser");
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

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
reviewsCollection = database.collection("Reviews");
cartCollection = database.collection("Cart");
checkoutCollection = database.collection("Checkout");
feedbackCollection = database.collection("Feedback")
blogCollection = database.collection("Blog")


// Get all users
app.get("/users", cors(), async (req, res) => {
  const result = await usersCollection.find({}).toArray();
  res.send(result);
});

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
// Middleware xác thực JWT
function verifyToken(req, res, next) {
  // Lấy header authorization
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Format: Bearer TOKEN

  if (!token) {
    return res.status(401).send({ error: 'Vui lòng đăng nhập để tiếp tục.' });
  }

  try {
    const verified = jwt.verify(token, SECRET_KEY);
    req.user = verified; // Thêm thông tin user vào request
    next(); // Tiếp tục xử lý request
  } catch (error) {
    return res.status(403).send({ error: 'Phiên đăng nhập không hợp lệ hoặc đã hết hạn.' });
  }
}

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
//put
// Update user information
app.put("/updateusers/:id", cors(), verifyToken, async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Verify the user is updating their own profile
    if (req.user.userId !== userId) {
      return res.status(403).send({ error: "You can only update your own profile" });
    }
    
    // Get update data from request body
    const updateData = { ...req.body };
    
    // Don't allow _id to be updated
    delete updateData._id;
    
    // If password is being updated, hash it
    if (updateData.Password) {
      updateData.Password = await bcrypt.hash(updateData.Password, saltRounds);
    }
    
    // Use ObjectId for MongoDB
    const objectId = new ObjectId(userId);
    
    // Update the user document
    const result = await usersCollection.updateOne(
      { _id: objectId },
      { $set: updateData }
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).send({ error: "User not found" });
    }
    
    // Get updated user (without password)
    const updatedUser = await usersCollection.findOne({ _id: objectId });
    const { Password, ...userWithoutPassword } = updatedUser;
    
    res.status(200).send({
      message: "User updated successfully",
      user: userWithoutPassword
    });
  } catch (error) {
    console.error("Update user error:", error);
    res.status(500).send({ error: "Internal server error" });
  }
});



// PRODUCT
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

app.post("/products", cors(), async (req, res) => {
  try {
    // Create a copy of the request body
    const product = {...req.body};
    
    // Remove empty _id field if it exists
    if (product._id === "") {
      delete product._id;
    }
    
    // Insert the product into the collection
    const result = await productsCollection.insertOne(product);
    
    // Return the inserted product with the new _id
    res.send({...product, _id: result.insertedId});
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).send({ error: error.message });
  }
});
//131
app.put("/products", cors(), async (req, res) => { 
  try { 
    const product = req.body; 
    
    if (!product._id) { 
      return res.status(400).send({ error: "Product ID is required" }); 
    } 
    
    let o_id;
    try {
      o_id = new ObjectId(product._id);
    } catch (err) {
      return res.status(400).send({ error: "Invalid product ID format" });
    }
    
    console.log("Updating product:", product._id);
    
    // Create the update document with the same field names as the frontend
    const updateData = { 
      ProductName: product.ProductName, 
      Price: parseFloat(product.Price) || 0, 
      oldPrice: parseFloat(product.oldPrice) || 0, 
      Description: product.Description || "", 
      CategoryName: product.CategoryName || "", 
      Color: product.Color || "", 
      Weight: parseInt(product.Weight) || 0, 
      BurningTime: parseInt(product.BurningTime) || 0, 
      Fragrance: product.Fragrance || "", 
      StockQuantity: parseInt(product.StockQuantity) || 0, 
      SKU: product.SKU || "", 
      Images: Array.isArray(product.Images) ? product.Images : [] 
    };
    
    // Perform the update
    const result = await productsCollection.updateOne( 
      { _id: o_id }, 
      { $set: updateData }
    ); 
    
    if (result.matchedCount === 0) { 
      return res.status(404).send({ error: "Product not found" }); 
    } 
    
    // Verify the update by fetching the product
    const updatedProduct = await productsCollection.findOne({ _id: o_id });
    console.log("Update verified:", updatedProduct ? "Success" : "Failed");
    
    // Return the updated product as is without remapping
    res.status(200).send({ 
      ...updatedProduct,
      message: "Product updated successfully" 
    }); 
  } catch (error) { 
    console.error("Error updating product:", error); 
    res.status(500).send({ error: error.message }); 
  } 
});


app.delete("/products/:id", cors(), async(req, res) => { 
  // Find detail Product with id
  var o_id = new ObjectId(req.params["id"]);
  const result = await productsCollection.find({_id:o_id}).toArray(); 
  
  // Delete the product from database
  await productsCollection.deleteOne({_id:o_id});
  
  // Send Product data that was removed
  res.send(result[0]);
});


// REVIEWS
// Get all reviews
app.get("/reviews", cors(), async (req, res) => {
  const result = await reviewsCollection.find({}).toArray();
  res.send(result);
});

// Get reviews by ProductID
app.get("/reviews/product/:id", cors(), async (req, res) => {
  try {
    const productId = req.params["id"];
    
    // Validate if productId is valid
    if (!ObjectId.isValid(productId)) {
      return res.status(400).send({ error: "Invalid product ID format" });
    }
    
    // Try to find reviews matching ProductID as string
    let reviews = await reviewsCollection.find({ ProductID: productId }).toArray();
    
    // If no reviews found, try with ObjectId
    if (reviews.length === 0) {
      reviews = await reviewsCollection.find({ ProductID: new ObjectId(productId) }).toArray();
    }
    
    // Add debug information
    console.log(`Product ID: ${productId}`);
    console.log(`Reviews found: ${reviews.length}`);
    
    res.send(reviews);
  } catch (error) {
    console.error("Error fetching reviews by product ID:", error);
    res.status(500).send({ error: "Internal server error" });
  }
});
// Query Product
app.get('/api/products/search', async (req, res) => {
  try {
    const searchTerm = req.query.q || '';
    
    const products = await productsCollection.find({
      $or: [
        { ProductName: { $regex: searchTerm, $options: 'i' } },
        { Description: { $regex: searchTerm, $options: 'i' } },
      ]
    }).toArray();
    
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Filter
// API endpoint để lấy tất cả các màu sắc duy nhất
app.get('/api/colors', async (req, res) => {
  try {
    // Lấy tất cả các giá trị Color duy nhất từ collection Products
    const colorValues = await productsCollection.distinct('Color');

    // Chuyển đổi thành mảng đối tượng để client dễ sử dụng
    const colors = colorValues
      .filter(color => color) // Loại bỏ các giá trị null/undefined
      .map(color => ({
        name: color
      }));

    res.json(colors);
  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu màu sắc:', error);
    res.status(500).json({ error: 'Không thể lấy dữ liệu màu sắc' });
  }
});

// Ngọc
// API Cart
app.get("/cart", async (req, res) => {
  const result = await cartCollection.find({}).toArray();
  res.send(result);
});

app.get("/cart/:cart_id", async (req, res) => {
  try {
    let cartId = req.params.cart_id;

    if (!ObjectId.isValid(cartId)) {
      return res.status(400).json({ error: "Invalid Cart ID" });
    }

    // Fetch giỏ hàng trước
    const cart = await cartCollection.findOne({ _id: new ObjectId(cartId) });

    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    // Trả về toàn bộ thông tin giỏ hàng trước
    res.json(cart);
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ error: "Error fetching cart", message: error.message });
  }
});



// API thêm vào giỏ hàng (yêu cầu đăng nhập)
app.post("/cart", verifyToken, async (req, res) => {
  try {
    // Lấy ID người dùng từ token JWT
    const userId = req.user.userId;

    const { product_id, name, price, discount, final_price, image, quantity } = req.body;

    if (!product_id) {
      return res.status(400).send({ message: "Thiếu product_id" });
    }

    // Sử dụng giá trị final_price và discount được gửi từ client
    // Không cần tính toán lại ở server, vì logic tính đã được thực hiện ở client
    const discountValue = discount || 0;
    const finalPrice = final_price || price * (1 - discountValue / 100);

    // Tìm giỏ hàng của người dùng
    const userCart = await cartCollection.findOne({ userId });

    if (userCart) {
      // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
      const productIndex = userCart.products.findIndex(
        p => p.product_id === product_id
      );

      if (productIndex > -1) {
        // Cập nhật quantity nếu sản phẩm đã tồn tại
        await cartCollection.updateOne(
          { userId, "products.product_id": product_id },
          {
            $inc: { "products.$.quantity": quantity },
            $set: { updatedAt: new Date() }
          }
        );
      } else {
        // Thêm sản phẩm mới vào giỏ hàng
        await cartCollection.updateOne(
          { userId },
          {
            $push: {
              products: {
                product_id,
                name,
                price,  // Giá gốc
                discount: discountValue,
                final_price: finalPrice, // Giá sau khi giảm
                image,
                quantity,
                addedAt: new Date()
              }
            },
            $set: { updatedAt: new Date() }
          }
        );
      }

      // Lấy giỏ hàng đã cập nhật để trả về
      const updatedCart = await cartCollection.findOne({ userId });
      res.status(200).send({
        message: "Thêm vào giỏ hàng thành công",
        cart: updatedCart
      });
    } else {
      // Tạo giỏ hàng mới nếu chưa tồn tại
      const newCart = {
        userId,
        products: [{
          product_id,
          name,
          price,  // Giá gốc
          discount: discountValue,
          final_price: finalPrice, // Giá sau khi giảm
          image,
          quantity,
          addedAt: new Date()
        }],
        updatedAt: new Date()
      };

      const result = await cartCollection.insertOne(newCart);
      res.status(201).send({
        message: "Tạo giỏ hàng mới thành công",
        cart: newCart
      });
    }
  } catch (error) {
    console.error("Lỗi khi thêm vào giỏ hàng:", error);
    res.status(500).send({
      message: "Lỗi khi thêm vào giỏ hàng",
      error: error.message
    });
  }
});

// API lấy giỏ hàng của người dùng đã đăng nhập
app.get("/user-cart", verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    // Tìm giỏ hàng của người dùng
    const cart = await cartCollection.findOne({ userId });

    if (!cart) {
      // Trả về giỏ hàng trống nếu chưa tồn tại
      return res.send({
        userId,
        products: [],
        updatedAt: new Date()
      });
    }

    res.send(cart);
  } catch (error) {
    res.status(500).send({
      error: "Lỗi khi lấy giỏ hàng",
      message: error.message
    });
  }
});



// API cập nhật số lượng sản phẩm trong giỏ hàng
app.put("/cart/update", verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { product_id, quantity } = req.body;

    if (!product_id) {
      return res.status(400).send({ message: "Thiếu product_id" });
    }

    // Kiểm tra xem giỏ hàng có tồn tại không
    const cart = await cartCollection.findOne({ userId });

    if (!cart) {
      return res.status(404).send({ message: "Không tìm thấy giỏ hàng" });
    }

    // Kiểm tra xem sản phẩm có trong giỏ hàng không
    const productExists = cart.products.some(p => p.product_id === product_id);

    if (!productExists) {
      return res.status(404).send({
        message: "Sản phẩm không tồn tại trong giỏ hàng"
      });
    }

    // Cập nhật số lượng
    await cartCollection.updateOne(
      { userId, "products.product_id": product_id },
      {
        $set: {
          "products.$.quantity": quantity,
          updatedAt: new Date()
        }
      }
    );

    // Lấy giỏ hàng đã cập nhật
    const updatedCart = await cartCollection.findOne({ userId });

    res.send({
      message: "Cập nhật số lượng thành công",
      cart: updatedCart
    });
  } catch (error) {
    res.status(500).send({
      error: "Lỗi khi cập nhật giỏ hàng",
      message: error.message
    });
  }
});

// API xóa sản phẩm khỏi giỏ hàng
app.delete("/cart/remove", verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { product_id } = req.body;

    if (!product_id) {
      return res.status(400).send({ message: "Thiếu product_id" });
    }

    // Kiểm tra xem giỏ hàng có tồn tại không
    const cart = await cartCollection.findOne({ userId });

    if (!cart) {
      return res.status(404).send({ message: "Không tìm thấy giỏ hàng" });
    }

    // Xóa sản phẩm khỏi giỏ hàng
    await cartCollection.updateOne(
      { userId },
      {
        $pull: { products: { product_id } },
        $set: { updatedAt: new Date() }
      }
    );

    // Lấy giỏ hàng đã cập nhật
    const updatedCart = await cartCollection.findOne({ userId });

    res.send({
      message: "Đã xóa sản phẩm khỏi giỏ hàng",
      cart: updatedCart
    });
  } catch (error) {
    res.status(500).send({
      error: "Lỗi khi xóa sản phẩm khỏi giỏ hàng",
      message: error.message
    });
  }
});

// API lấy giỏ hàng chi tiết với thông tin sản phẩm đầy đủ
app.get("/cart/details", verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    // Tìm giỏ hàng của người dùng
    const cart = await cartCollection.findOne({ userId });

    if (!cart || !cart.products || cart.products.length === 0) {
      return res.send({
        userId,
        products: [],
        subtotal: 0,
        total: 0
      });
    }

    // Tính tổng giá trị giỏ hàng
    let subtotal = 0;
    let total = 0;

    cart.products.forEach(product => {
      const productTotal = parseFloat(product.final_price) * product.quantity;
      subtotal += productTotal;
      total += productTotal;
    });

    res.send({
      ...cart,
      subtotal: subtotal,
      total: total
    });
  } catch (error) {
    res.status(500).send({
      error: "Lỗi khi lấy chi tiết giỏ hàng",
      message: error.message
    });
  }
});
// API làm trống giỏ hàng
app.delete("/cart/clear", verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    // Cập nhật giỏ hàng thành mảng rỗng
    await cartCollection.updateOne(
      { userId },
      {
        $set: {
          products: [],
          updatedAt: new Date()
        }
      },
      { upsert: true }
    );

    res.send({ message: "Đã làm trống giỏ hàng" });
  } catch (error) {
    res.status(500).send({
      error: "Lỗi khi làm trống giỏ hàng",
      message: error.message
    });
  }
});
// API tạo checkout từ giỏ hàng
app.post("/checkout", verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    // Lấy thông tin giỏ hàng hiện tại
    const cart = await cartCollection.findOne({ userId });

    if (!cart || !cart.products || cart.products.length === 0) {
      return res.status(400).send({
        message: "Giỏ hàng trống, không thể tạo đơn hàng"
      });
    }

    // Tính tổng tiền
    let subtotal = 0;
    let total = 0;
    const shippingFee = 5.00; // Phí vận chuyển cố định

    cart.products.forEach(product => {
      const productTotal = parseFloat(product.final_price) * product.quantity;
      subtotal += productTotal;
    });

    total = subtotal + shippingFee;

    // Tạo đối tượng checkout mới
    // Thay vì tạo checkoutId mới, hãy sử dụng _id mặc định của MongoDB
    const checkout = {
      userId,
      checkoutDate: new Date(),
      products: cart.products,
      subtotal: subtotal,
      shippingFee: shippingFee,
      total: total,

    };

    // Lưu vào collection Checkout
    const result = await checkoutCollection.insertOne(checkout);

    res.status(201).send({
      message: "Tạo đơn hàng thành công",
      checkoutId: result.insertedId, // Sử dụng ID được tạo bởi MongoDB
      checkout
    });
  } catch (error) {
    console.error("Lỗi khi tạo đơn hàng:", error);
    res.status(500).send({
      message: "Lỗi khi tạo đơn hàng",
      error: error.message
    });
  }
});

// API lấy thông tin checkout theo ID
app.get("/checkout/:checkoutId", verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const checkoutId = req.params.checkoutId;
    console.log("User ID từ token:", userId);
    console.log("Checkout ID từ params:", checkoutId);

    if (!ObjectId.isValid(checkoutId)) {
      return res.status(400).send({ message: "ID đơn hàng không hợp lệ" });
    }

    // Tìm checkout theo _id và userId
    const checkout = await checkoutCollection.findOne({
      _id: new ObjectId(checkoutId),  // Thay đổi từ checkoutId sang _id
      userId
    });

    if (!checkout) {
      return res.status(404).send({ message: "Không tìm thấy đơn hàng" });
    }

    res.send(checkout);
  } catch (error) {
    res.status(500).send({
      message: "Lỗi khi lấy thông tin đơn hàng",
      error: error.message
    });
  }
});

// Add this to your existing server.js file



const ordersCollection = database.collection("Orders");

// API to get user profile
// In your server.js file
app.get("/users/profile", verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    // Find user by ID
    const user = await usersCollection.findOne({ _id: new ObjectId(userId) });

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    // Log the user data to see the actual structure
    console.log("User data from database:", user);

    // Remove sensitive information
    const { Password, ...userProfile } = user;

    res.send(userProfile);
  } catch (error) {
    res.status(500).send({
      error: "Error fetching user profile",
      message: error.message
    });
  }
});

// API to create a new order
app.post("/orders", verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const orderData = req.body;

    // Validate required fields
    if (!orderData.shippingInfo || !orderData.paymentMethod || !orderData.orderSummary) {
      return res.status(400).send({ message: "Missing required order information" });
    }

    // Create order object
    const order = {
      userId,
      checkoutId: orderData.checkoutId,
      shippingInfo: orderData.shippingInfo,
      paymentMethod: orderData.paymentMethod,
      orderSummary: orderData.orderSummary,
      orderDate: new Date(),
      status: "pending"
    };

    // Insert order into database
    const result = await ordersCollection.insertOne(order);

    // Clear the user's cart if order is successful
    if (result.insertedId) {
      await cartCollection.updateOne(
        { userId },
        { $set: { products: [], updatedAt: new Date() } },
        { upsert: true }
      );

      // Update checkout status
      await checkoutCollection.updateOne(
        { _id: new ObjectId(orderData.checkoutId) },
        { $set: { status: "ordered" } }
      );
    }

    res.status(201).send({
      message: "Order created successfully",
      orderId: result.insertedId
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).send({
      message: "Error creating order",
      error: error.message
    });
  }
});

// API to get user's orders
app.get("/orders", verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    // Find all orders for the user
    const orders = await ordersCollection.find({ userId }).toArray();

    res.send(orders);
  } catch (error) {
    res.status(500).send({
      message: "Error fetching orders",
      error: error.message
    });
  }
});

// API to get a specific order
app.get("/orders/:orderId", verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const orderId = req.params.orderId;

    if (!ObjectId.isValid(orderId)) {
      return res.status(400).send({ message: "Invalid order ID" });
    }

    // Find order by ID and user ID
    if (!ObjectId.isValid(orderId)) {
      return res.status(400).send({ message: "Invalid order ID" });
    }

    const order = await ordersCollection.findOne({
      _id: new ObjectId(orderId),
      userId
    });


    if (!order) {
      return res.status(404).send({ message: "Order not found" });
    }

    res.send(order);
  } catch (error) {
    res.status(500).send({
      message: "Error fetching order",
      error: error.message
    });
  }
});
// ADMIN Orders

// Get all orders
app.get("/adminorders", cors(), async (req, res) => {
  try {
    const result = await ordersCollection.find({}).toArray();
    res.send(result);
  } catch (error) {
    console.error("Error getting orders:", error);
    res.status(500).send({ error: error.message });
  }
});

// Get order by ID
app.get("/adminorders/:id", cors(), async (req, res) => {
  try {
    const { id } = req.params;
    
    let o_id;
    try {
      o_id = new ObjectId(id);
    } catch (err) {
      return res.status(400).send({ error: "Invalid order ID format" });
    }
    
    const result = await ordersCollection.findOne({ _id: o_id });
    
    if (!result) {
      return res.status(404).send({ error: "Order not found" });
    }
    
    res.send(result);
  } catch (error) {
    console.error("Error getting order:", error);
    res.status(500).send({ error: error.message });
  }
});

// Update order status
app.put("/adminorders/:id", cors(), async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).send({ error: "Status is required" });
    }

    let o_id;
    try {
      o_id = new ObjectId(id);
    } catch (err) {
      return res.status(400).send({ error: "Invalid order ID format" });
    }

    console.log("Updating order status:", id, "to", status);

    // Only update the status field
    const result = await ordersCollection.updateOne(
      { _id: o_id },
      { $set: { status: status } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).send({ error: "Order not found" });
    }

    // Verify the update by fetching the order
    const updatedOrder = await ordersCollection.findOne({ _id: o_id });
    console.log("Update verified:", updatedOrder ? "Success" : "Failed");

    res.status(200).send({
      ...updatedOrder,
      message: "Order status updated successfully"
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).send({ error: error.message });
  }
});

// API feedbacks 
app.get("/feedbacks", async (req, res) => {
  const result = await feedbackCollection.find({}).toArray();
  res.send(result);
})

app.post("/feedbacks", async (req, res) => {
  const feedback = req.body;
  if (!feedback.name || !feedback.email || !feedback.message) {
      return res.status(400).send({ error: "Missing required fields" });
  }
  await feedbackCollection.insertOne(feedback);
  res.send(feedback);
});

// Get all blogs
app.get("/blogs", cors(), async (req, res) => {
  try {
    const result = await blogCollection
      .find({})
      .sort({ CreatedAt: -1 }) // Sort by CreatedAt descending
      .toArray();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Error fetching blogs", error });
  }
});

// Filter blog by category
app.get("/blogs/Category/:Category", cors(), async (req, res) => {
  try {
    const result = await blogCollection.find({ Category: req.params.Category }).toArray();
    res.send(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get blog by ID
app.get("/blogs/:id", cors(), async (req, res) => {
  var o_id = new ObjectId(req.params["id"]);
  const result = await blogCollection.find({ _id: o_id }).toArray();
  res.send(result[0]);
});

// Add a new blog
app.post("/blogs", cors(), async (req, res) => {
  try {
    // Create a copy of the request body
    const blog = {...req.body};
    
    // Remove empty _id field if it exists
    if (blog._id === "") {
      delete blog._id;
    }
    
    // Insert the product into the collection
    const result = await blogCollection.insertOne(blog);
    
    // Return the inserted product with the new _id
    res.send({...blog, _id: result.insertedId});
  } catch (error) {
    console.error("Error adding Blog:", error);
    res.status(500).send({ error: error.message });
  }
});

// Edit a blog
app.put("/blogs", cors(), async (req, res) => { 
  try { 
    const blog = req.body; 
    
    if (!blog._id) { 
      return res.status(400).send({ error: "Blog ID is required" }); 
    } 
    
    let o_id;
    try {
      o_id = new ObjectId(blog._id);
    } catch (err) {
      return res.status(400).send({ error: "Invalid Blog ID format" });
    }
    
    console.log("Updating Blog:", blog._id);
    const updateTime = new Date().toISOString();

    // Create the update document with the same field names as the frontend
    const updateData = { 
      Title: blog.Title, 
      Content: blog.Content, // Fixed: was incorrectly mapped to Price
      Author: blog.Author,
      Category: blog.Category || "", 
      Tags: blog.Tags || [], 
      Images: blog.Images || "", 
      Status: blog.Status || "",
      UpdatedAt: updateTime
    };
    
    // Perform the update
    const result = await blogCollection.updateOne( 
      { _id: o_id }, 
      { $set: updateData }
    ); 
    
    if (result.matchedCount === 0) { 
      return res.status(404).send({ error: "Blog not found" }); 
    } 
    
    // Verify the update by fetching the blog
    const updatedBlog = await blogCollection.findOne({ _id: o_id });
    console.log("Update verified:", updatedBlog ? "Success" : "Failed");
    
    // Return the updated blog
    res.status(200).send({ 
      ...updatedBlog,
      message: "Blog updated successfully" 
    }); 
  } catch (error) { 
    console.error("Error updating Blog:", error); 
    res.status(500).send({ error: error.message }); 
  } 
});

// Remove a blog
app.delete("/blogs/:id", cors(), async (req, res) => {
  try {
    // Find blog with id
    var o_id = new ObjectId(req.params["id"]);
    const result = await blogCollection.find({ _id: o_id }).toArray();
    
    // Delete blog from database
    await blogCollection.deleteOne({ _id: o_id });
    
    // Send deleted blog as response
    res.send(result[0]);
  } catch (error) {
    res.status(500).send({ error: "Error deleting blog", details: error });
  }
});

// Edit a user
app.put("/users", cors(), async (req, res) => {
  try {
    const user = req.body;
    
    if (!user._id) {
      return res.status(400).send({ error: "User ID is required" });
    }
    
    let o_id;
    try {
      o_id = new ObjectId(user._id);
    } catch (err) {
      return res.status(400).send({ error: "Invalid User ID format" });
    }
    
    console.log("Updating User:", user._id);
    const updateTime = new Date().toISOString();
    
    // Create the update document with user fields
    const updateData = {
      Username: user.Username,
      Email: user.Email,
      Password: user.Password, // Note: In production, handle password updates securely
      FullName: user.FullName || "",
      Phone: user.Phone || "",
      Address: user.Address || "",
      UpdatedAt: updateTime
    };
    
    // Perform the update
    const result = await usersCollection.updateOne(
      { _id: o_id },
      { $set: updateData }
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).send({ error: "User not found" });
    }
    
    // Verify the update by fetching the user
    const updatedUser = await usersCollection.findOne({ _id: o_id });
    console.log("Update verified:", updatedUser ? "Success" : "Failed");
    
    // Return the updated user
    res.status(200).send({
      ...updatedUser,
      message: "User updated successfully"
    });
  } catch (error) {
    console.error("Error updating User:", error);
    res.status(500).send({ error: error.message });
  }
});

// Remove a user
app.delete("/users/:id", cors(), async (req, res) => {
  try {
    // Find user with id
    var o_id = new ObjectId(req.params["id"]);
    const result = await usersCollection.find({ _id: o_id }).toArray();
    
    // Delete user from database
    await usersCollection.deleteOne({ _id: o_id });
    
    // Send deleted user as response
    res.send(result[0]);
  } catch (error) {
    res.status(500).send({ error: "Error deleting user", details: error });
  }
});
app.get("/user-admin/:id", cors(), async (req, res) => {
  var o_id = new ObjectId(req.params["id"]);
  const result = await usersCollection.find({ _id: o_id }).toArray();
  res.send(result[0]);
});

// Dashboard API routes - fixed version
app.get("/dashboard/stats", async (req, res) => {
  try {
    // Get current date
    const now = new Date();

    // Calculate date 30 days ago (for monthly revenue)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Calculate monthly revenue
    const monthlyOrders = await ordersCollection.find({
      orderDate: { $gte: thirtyDaysAgo, $lte: now }
    }).toArray();

    const monthlyRevenue = monthlyOrders.reduce((total, order) => {
      return total + (order.orderSummary && order.orderSummary.total ?
        Number(order.orderSummary.total) : 0);
    }, 0);

    // Calculate new sales (count of new orders in last 30 days)
    const newSales = monthlyOrders.length;

    // Get ALL orders to count total unique customers
    const allOrders = await ordersCollection.find({}).toArray();

    // Count unique customers from all orders
    const uniqueCustomers = new Set();
    allOrders.forEach(order => {
      if (order.userId) {
        uniqueCustomers.add(order.userId);
      }
    });

    const totalUniqueCustomers = uniqueCustomers.size;

    res.json({
      monthlyRevenue,
      newSales,
      totalUniqueCustomers
    });

  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({ error: "Error fetching dashboard stats", message: error.message });
  }
});

// Revenue data for line chart - fixed version
app.get("/dashboard/revenue", async (req, res) => {
  try {
    // Get current date
    const now = new Date();

    // Get last 7 months
    const months = [];
    const incomeData = [];
    const revenueData = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setMonth(now.getMonth() - i);

      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);

      // Get month name (Jan, Feb, etc.)
      const monthName = date.toLocaleString('default', { month: 'short' });
      months.push(monthName);

      // Get orders for this month
      const monthOrders = await ordersCollection.find({
        orderDate: { $gte: monthStart, $lte: monthEnd }
      }).toArray();

      // Calculate total revenue for the month - safely handle missing properties
      const monthRevenue = monthOrders.reduce((total, order) => {
        return total + (order.orderSummary && order.orderSummary.total ?
          Number(order.orderSummary.total) : 0);
      }, 0);

      // Calculate total income (revenue - shipping fees) - safely handle missing properties
      const monthIncome = monthOrders.reduce((total, order) => {
        return total + (order.orderSummary && order.orderSummary.subtotal ?
          Number(order.orderSummary.subtotal) : 0);
      }, 0);

      // Convert to millions for better scaling on chart
// Use small values if data is missing to avoid breaking the chart
      incomeData.push(monthIncome ? monthIncome / 1000 : 0);
      revenueData.push(monthRevenue ? monthRevenue / 1000 : 0);


    }

    res.json({
      labels: months,
      income: incomeData,
      revenue: revenueData
    });

  } catch (error) {
    console.error("Error fetching revenue data:", error);
    res.status(500).json({ error: "Error fetching revenue data", message: error.message });
  }
});

// Product sales data for pie chart - fixed version
// app.get("/dashboard/product-sales", async (req, res) => {
//   try {
//     // Get all orders
//     const allOrders = await ordersCollection.find({}).toArray();
    
//     // Initialize variables
//     const productSales = {};
//     let totalQuantity = 0;
    
//     // Loop through orders
//     allOrders.forEach(async order => {
//       // Check if order has checkoutId (to access the products from checkout)
//       if (order.checkoutId) {
//         // Find the corresponding checkout
//         const checkout = await checkoutCollection.findOne({ 
//           _id: new ObjectId(order.checkoutId) 
//         });
        
//         if (checkout && checkout.products && Array.isArray(checkout.products)) {
//           // Process each product in the checkout
//           checkout.products.forEach(product => {
//             if (product.name) {
//               if (!productSales[product.name]) {
//                 productSales[product.name] = 0;
//               }
              
//               const quantity = parseInt(product.quantity) || 1;
//               productSales[product.name] += quantity;
//               totalQuantity += quantity;
//             }
//           });
//         }
//       }
//     });
    
//     // Convert to sorted array
//     const sortedProducts = Object.entries(productSales)
//       .map(([name, quantity]) => ({ name, quantity }))
//       .sort((a, b) => b.quantity - a.quantity);
    
//     // Create chart data
//     const colors = ['rgb(0, 51, 204)', 'rgb(0, 102, 255)', 'rgb(51, 153, 255)', 'rgb(255, 204, 0)', 'rgb(128, 128, 128)'];
    
//     // Get top 4 products
//     const topProducts = sortedProducts.slice(0, Math.min(4, sortedProducts.length));
    
//     // Add "Others" category if needed
//     if (sortedProducts.length > 4) {
//       const othersQuantity = sortedProducts.slice(4).reduce((sum, product) => sum + product.quantity, 0);
//       if (othersQuantity > 0) {
//         topProducts.push({ name: 'Others', quantity: othersQuantity });
//       }
//     }
    
//     const labels = [];
//     const data = [];
//     const legend = [];
    
//     topProducts.forEach((product, index) => {
//       const percentage = Math.round((product.quantity / totalQuantity) * 100);
//       labels.push(product.name);
//       data.push(percentage);
//       legend.push({
//         name: product.name,
//         value: product.quantity,
//         percentage: percentage,
//         color: colors[index % colors.length]
//       });
//     });
    
//     res.json({
//       totalSoldQuantity: totalQuantity,
//       productQuantities: sortedProducts,
//       labels,
//       data,
//       legend
//     });
    
//   } catch (error) {
//     console.error("Error fetching product sales data:", error);
//   }
// });
app.get("/dashboard/recent-orders", async (req, res) => {
  try {
    // Get 5 most recent orders
    const recentOrders = await ordersCollection.find({})
      .sort({ orderDate: -1 })

      .toArray();

    // Transform data for frontend
    const formattedOrders = recentOrders.map(order => {
      // Access product name directly from the products array


      return {
        orderId: order._id ? order._id.toString().substring(0, 6).toUpperCase() : 'UNKNOWN',

        orderDate: order.orderDate || new Date(),
        price: order.orderSummary && order.orderSummary.total ?
          Number(order.orderSummary.total) : 0,
        status: order.status || 'pending'
      };
    });

    res.json(formattedOrders);

  } catch (error) {
    console.error("Error fetching recent orders:", error);
    res.status(500).json({ error: "Error fetching recent orders", message: error.message });
  }
});
