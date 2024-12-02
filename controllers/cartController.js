const db = require('../db');

// Get all cart items for the user
// Get Cart Items and Total for the User
exports.getCartItems = (req, res) => {
    const userId = req.session.userId;

    // Query to get cart items and calculate the total price
    const query = `
        SELECT ci.cartId AS id, p.productName AS name, p.productPrice AS price, ci.cartProductQuantity AS quantity
        FROM cart_items ci
        INNER JOIN products p ON ci.cartProductId = p.productId
        WHERE ci.cartUserId = ?;
    `;

    db.query(query, [userId], (err, results) => {
        if (err) {
            console.error('Error fetching cart items:', err);
            return res.status(500).send('Error fetching cart items');
        }

        // Ensure price is a number before rendering
        results.forEach(item => {
            // Convert price to number, if not a number set it to 0
            item.price = parseFloat(item.price) || 0;
        });

        // Calculate total price
        const cartTotal = results.reduce((total, item) => total + (item.price * item.quantity), 0);

        // Render the cart page
        res.render('cart', { cartItems: results, cartTotal: cartTotal });
    });
};


exports.addToCart = (req, res) => {
    const productId = req.params.productId;
    const userId = req.session.userId;

    if (!userId) {
        return res.status(400).send("User not logged in");
    }

    // Check if the product already exists in the cart
    const checkQuery = 'SELECT * FROM cart_items WHERE cartUserId = ? AND cartProductId = ?';
    db.query(checkQuery, [userId, productId], (err, result) => {
        if (err) {
            console.error('Error checking if product exists in cart:', err);
            return res.status(500).send('Error checking cart');
        }

        if (result.length > 0) {
            // If product exists, update the quantity
            const updateQuery = 'UPDATE cart_items SET cartProductQuantity = cartProductQuantity + 1 WHERE cartUserId = ? AND cartProductId = ?';
            db.query(updateQuery, [userId, productId], (err) => {
                if (err) {
                    console.error('Error updating cart item:', err);
                    return res.status(500).send('Error updating cart');
                }
                res.redirect('/cart');
            });
        } else {
            // If product doesn't exist, insert new cart item
            const insertQuery = 'INSERT INTO cart_items (cartUserId, cartProductId, cartProductQuantity) VALUES (?, ?, 1)';
            db.query(insertQuery, [userId, productId], (err) => {
                if (err) {
                    console.error('Error adding item to cart:', err);
                    return res.status(500).send('Error adding item to cart');
                }
                res.redirect('/cart');
            });
        }
    });
};

exports.updateCartItemQuantity = (req, res) => {
    const itemId = req.params.id;
    const { quantity } = req.body;  // Get the updated quantity

    // Query to update the item quantity
    const query = 'UPDATE cart_items SET cartProductQuantity = ? WHERE cartId = ?';
    db.query(query, [quantity, itemId], (err) => {
        if (err) {
            console.error('Error updating cart item quantity:', err);
            return res.status(500).send('Error updating cart item');
        }
        res.redirect('/cart');
    });
};

exports.deleteCartItem = (req, res) => {
    const itemId = req.params.id;

    const query = 'DELETE FROM cart_items WHERE cartId = ?';
    db.query(query, [itemId], (err) => {
        if (err) {
            console.error('Error deleting cart item:', err);
            return res.status(500).send('Error deleting cart item');
        }
        res.redirect('/cart');
    });
};

exports.checkout = (req, res) => {
    const userId = req.session.userId;

    // Get all items in the cart to insert them into the orders table
    const getCartItemsQuery = `
        SELECT cartProductId, cartProductQuantity
        FROM cart_items
        WHERE cartUserId = ?;
    `;

    db.query(getCartItemsQuery, [userId], (err, cartItems) => {
        if (err) {
            console.error('Error fetching cart items:', err);
            return res.status(500).send('Error fetching cart items');
        }

        // Insert each cart item into the `order_items` table
        cartItems.forEach(item => {
            const insertOrderQuery = `
                INSERT INTO order_items (orderProductId, orderProductQuantity, orderUserId, orderDate)
                VALUES (?, ?, ?, CURDATE());
            `;
            db.query(insertOrderQuery, [item.cartProductId, item.cartProductQuantity, userId], (err) => {
                if (err) {
                    console.error('Error inserting order item:', err);
                    return res.status(500).send('Error inserting order item');
                }
            });
        });

        // Clear the cart after the order is placed
        const clearCartQuery = 'DELETE FROM cart_items WHERE cartUserId = ?';
        db.query(clearCartQuery, [userId], (err) => {
            if (err) {
                console.error('Error clearing cart:', err);
                return res.status(500).send('Error clearing cart');
            }

            res.redirect('/orders'); // Redirect to the orders page after successful checkout
        });
    });
};
