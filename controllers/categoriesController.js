const db = require('../db'); // Assuming you have a db.js file to handle MySQL connection

// Controller for fetching categories
exports.getCategories = (req, res) => {
    const query = 'SELECT * FROM categories';

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching categories from database:', err);
            return res.status(500).send('Error fetching categories');
        }

        // Render the homepage with categories data
        res.render('categories', { categories: results });
    });
};