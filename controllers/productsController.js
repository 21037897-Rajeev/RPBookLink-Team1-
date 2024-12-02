const db = require('../db'); // Assuming you have a db.js file to handle MySQL connection

// Controller for fetching products grouped by category
exports.getAllProducts = (req, res) => {
    const query = `
        SELECT products.productId, products.productName, products.productDescription, 
               products.productImage, products.productPrice, products.productStock, categories.categoryName 
        FROM products
        JOIN categories ON products.categoryId = categories.categoryId
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching products from database:', err);
            return res.status(500).send('Error fetching products');
        }

        // Group products by category
        const categories = {};

        results.forEach(product => {
            if (!categories[product.categoryName]) {
                categories[product.categoryName] = [];
            }
            categories[product.categoryName].push(product);
        });

        // Render the products page with the grouped product data
        res.render('product', { categories: categories });
    });
};


exports.getProductsByCategory = (req, res) => {
    const categoryId = req.params.categoryId; // Get categoryId from URL

    // First, fetch the category name based on categoryId
    const categoryQuery = 'SELECT categoryName FROM categories WHERE categoryId = ?';
    db.query(categoryQuery, [categoryId], (err, categoryResult) => {
        if (err) {
            console.error('Error fetching category from database:', err);
            return res.status(500).send('Error fetching category');
        }

        if (categoryResult.length === 0) {
            return res.status(404).send('Category not found');
        }

        const categoryName = categoryResult[0].categoryName;

        // Now fetch the products from the selected category
        const productQuery = 'SELECT * FROM products WHERE categoryId = ?';
        db.query(productQuery, [categoryId], (err, results) => {
            if (err) {
                console.error('Error fetching products from database:', err);
                return res.status(500).send('Error fetching products');
            }

            console.log('Products fetched for category ' + categoryId, results); // Debugging the results

            if (results.length === 0) {
                return res.status(404).send('No products found for this category');
            }

            // Render the page showing products in the selected category
            res.render('categoryProducts', { products: results, categoryName: categoryName });
        });
    });
};