const express = require('express');
const mysql = require('mysql2');
const app = express();
const path = require('path');
const userController = require('./controllers/userController');
const categoriesController = require('./controllers/categoriesController');
const productsController = require('./controllers/productsController');
const cartController = require('./controllers/cartController');
const orderController = require('./controllers/orderController');

//express session to store the data
const session = require('express-session');

app.use(
    session({
        secret: 'your-secret-key', // Replace with a strong secret key
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false } // Use `true` if you're using HTTPS
    })
);

app.use(express.json()); // Parse JSON payloads
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded payloads


// Set view engine and public folder for static assets
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));  // Serving static files from 'public' folder




// Route for category page
// Route for categories page
app.get('/categories', categoriesController.getCategories);


// Route for displaying all products grouped by category
app.get('/products', productsController.getAllProducts);


// Route for displaying products by category
app.get('/products/category/:categoryId', productsController.getProductsByCategory);

// Cart routes
app.get('/cart', cartController.getCartItems); // View cart
app.post('/cart/add/:productId', cartController.addToCart); // Add item to cart
app.post('/cart/update/:id', cartController.updateCartItemQuantity); // Update cart item quantity
app.post('/cart/delete/:id', cartController.deleteCartItem); // Delete item from cart
app.post('/cart/checkout', cartController.checkout); // Checkout

// Route for orders page
app.get('/orders', orderController.getOrders);

// Route to view orders that are to be shipped
app.get('/orders/to-ship', orderController.getToShipOrders);

// Ensure routes are defined before app.listen()
app.get('/adminorders', orderController.getAdminOrders);  // Admin orders page
// Route to edit an order (Admin)
// Route to edit an order (Admin)
app.get('/admin/orders/edit/:orderId', orderController.editOrderForm); // This should render a form for editing

// Route to update the order (Admin)
app.post('/admin/orders/edit/:orderId', orderController.editOrder); // This should update the order in the database

// Route to delete an order (Admin)
app.post('/admin/orders/delete/:orderId', orderController.deleteOrder); // This should delete an order from the database

// Route to handle order status update by admin
app.post('/admin/orders/status/:orderId', orderController.updateOrderStatus);

// Existing routes
app.get('/', (req, res) => res.render('index'));
// Routes
app.get('/signup', (req, res) => {
  res.render('signup');
});

app.post('/signup', userController.signup);

app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', userController.login);
// Route to serve the RP login page
// Route to serve the RP login page
app.get('/rp-login', (req, res) => {
  res.render('rp-login'); // Render the rp-login.ejs view
});

// Route to handle RP login POST
app.post('/rp-login', userController.rpLogin); // Using rpLogin controller to handle login

app.get('/adminpage', (req, res) => {
  res.render('adminpage');
});

app.get('/verification', (req, res) => res.render('verification'));
app.get('/about', (req, res) => res.render('about'));
app.get('/faq', (req, res) => res.render('faq'));
app.get('/rewards', (req, res) => res.render('rewards'));

// New route for the subscription page
app.get('/subscribe', (req, res) => {
  res.render('subscribe'); // Renders the subscribe page
});

// Handle subscription POST request
app.post('/subscribe', (req, res) => {
  const { email } = req.body;
  console.log(`New subscriber: ${email}`);
  res.send(`Thank you for subscribing with ${email}!`);
});


// Protect the /dashboard route (only accessible if logged in)
app.get('/dashboard', (req, res) => {
  // Check if the user is logged in by checking the session
  if (!req.session.userId) {
    return res.redirect('/login'); // Redirect to login if not logged in
  }

  // Find the user from the session
  const user = users.find(u => u.username === req.session.userId);

  // Render the dashboard page with the user's username
  res.render('dashboard', { username: user.username });
});


// GET route for RP dashboard
app.get('/rp-dashboard', (req, res) => {
  if (!req.session.rpUserId) {
    return res.redirect('/rp-login'); // Redirect to RP login if not logged in
  }

  const rpUser = rpUsers.find(u => u.username === req.session.rpUserId);
  res.render('rp-dashboard', { username: rpUser.username });
});


///////////////////////end of login/signup///////////////////////

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
