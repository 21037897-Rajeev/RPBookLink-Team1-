const db = require('../db');
// Get user orders
// Get user orders
// Get user orders (for the customer)
// Get user orders
// Get user orders (for the customer)
exports.getOrders = (req, res) => {
    const userId = req.session.userId;

    if (!userId) {
        return res.redirect('/login');  // Redirect to login if the user is not logged in
    }

    // Query to get all the orders for the user
    const query = `
        SELECT o.orderId, p.productName, o.orderProductQuantity, o.orderDate, o.status
        FROM order_items o
        JOIN products p ON o.orderProductId = p.productId
        WHERE o.orderUserId = ?
        ORDER BY o.orderDate DESC;
    `;

    db.query(query, [userId], (err, results) => {
        if (err) {
            console.error('Error fetching orders:', err);
            return res.status(500).send('Error fetching orders');
        }

        // Filter orders based on status
        const toShipOrders = results.filter(order => order.status === 'To Ship');
        const toReceiveOrders = results.filter(order => order.status === 'To Receive');

        // Render the order page with the orders and "To Ship" and "To Receive" orders
        res.render('orders', { orders: results, toShipOrders: toShipOrders, toReceiveOrders: toReceiveOrders });
    });
};

// Get orders that are marked as 'To Ship'
exports.getToShipOrders = (req, res) => {
    const query = `
        SELECT o.orderId, p.productName, o.orderProductQuantity, o.orderDate
        FROM order_items o
        JOIN products p ON o.orderProductId = p.productId
        WHERE o.status = 'To Ship';
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching orders to ship:', err);
            return res.status(500).send('Error fetching orders');
        }

        const toShipOrders = results.filter(order => order.status === 'To Ship');
        es.render('orders', { orders: results, toShipOrders: toShipOrders });
    });
};

// Controller for updating the order status
exports.updateOrderStatus = (req, res) => {
    const orderId = req.params.orderId;
    const { status } = req.body;  // New status value: 'To Ship' or 'To Receive'

    // Validate the status
    if (!['To Ship', 'To Receive'].includes(status)) {
        return res.status(400).send('Invalid status');
    }

    // Query to update the order status
    const updateQuery = 'UPDATE order_items SET status = ? WHERE orderId = ?';
    db.query(updateQuery, [status, orderId], (err) => {
        if (err) {
            console.error('Error updating order status:', err);
            return res.status(500).send('Error updating order status');
        }

        // After updating the status, redirect to the admin orders page
        res.redirect('/adminorders');
    });
};

// Controller for deleting an order
exports.deleteOrder = (req, res) => {
    const orderId = req.params.orderId;

    const deleteQuery = 'DELETE FROM order_items WHERE orderId = ?';
    db.query(deleteQuery, [orderId], (err) => {
        if (err) {
            console.error('Error deleting order:', err);
            return res.status(500).send('Error deleting order');
        }

        res.redirect('/adminorders');  // Redirect back to the orders page after deletion
    });
};

// Get all orders for admin
exports.getAdminOrders = (req, res) => {
    const query = `
        SELECT o.orderId, p.productName, o.orderProductQuantity, o.orderDate, o.status
        FROM order_items o
        JOIN products p ON o.orderProductId = p.productId;
    `;
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching orders:', err);
            return res.status(500).send('Error fetching orders');
        }
        res.render('adminorders', { orders: results });
    });
}

// Controller for rendering the edit order form
// Controller for rendering the edit order form
exports.editOrderForm = (req, res) => {
    const orderId = req.params.orderId;

    // Query to get the order details by orderId
    const query = `SELECT * FROM order_items WHERE orderId = ?`;
    db.query(query, [orderId], (err, results) => {
        if (err) {
            console.error('Error fetching order details:', err);
            return res.status(500).send('Error fetching order details');
        }
        if (results.length > 0) {
            // Render the edit order page with the order details
            res.render('editOrder', { order: results[0] });
        } else {
            res.status(404).send('Order not found');
        }
    });
};

// Controller for updating an order (when form is submitted)
// Controller for updating an order (when form is submitted)
exports.editOrder = (req, res) => {
    const orderId = req.params.orderId;
    const { quantity } = req.body;

    // Query to update the order's quantity
    const updateQuery = 'UPDATE order_items SET orderProductQuantity = ? WHERE orderId = ?';
    db.query(updateQuery, [quantity, orderId], (err) => {
        if (err) {
            console.error('Error updating order:', err);
            return res.status(500).send('Error updating order');
        }
        res.redirect('/admin/orders');  // Redirect back to the admin orders page after update
    });
};

// Controller for deleting an order
exports.deleteOrder = (req, res) => {
    const orderId = req.params.orderId;

    const deleteQuery = 'DELETE FROM order_items WHERE orderId = ?';
    db.query(deleteQuery, [orderId], (err) => {
        if (err) {
            console.error('Error deleting order:', err);
            return res.status(500).send('Error deleting order');
        }

        // After deleting the order, redirect back to the /adminorders page to reload the orders
        res.redirect('/adminorders');
    });
};
