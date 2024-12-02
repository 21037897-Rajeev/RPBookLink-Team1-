const db = require('../db'); // Assuming a database connection file

// Controller for handling sign-up
exports.signup = async (req, res) => {
  const { username, password, email } = req.body;

  try {
    // Directly use the password without hashing (not recommended for production)
    const query = `INSERT INTO users (username, userEmail, userPassword, userRole) VALUES (?, ?, ?, ?)`;
    const values = [username, email, password, 'user']; // Store password directly

    db.execute(query, values, (err, results) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          // Handle duplicate username or email
          return res.status(400).send('Username or email already exists.');
        }
        return res.status(500).send('Database error');
      }
      res.redirect('/login'); // Redirect to login page after successful sign-up
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
};

// Controller for handling login
exports.login = (req, res) => {
    const { username, password } = req.body;
  
    // Find the user by username
    const query = `SELECT * FROM users WHERE username = ?`;
    db.execute(query, [username], (err, results) => {
      if (err) {
        return res.status(500).send('Database error');
      }
      if (results.length === 0) {
        return res.status(400).send('Invalid username or password');
      }
  
      const user = results[0];
  
      // Compare the provided password with the stored password
      if (user.userPassword !== password) {
        return res.status(400).send('Invalid username or password');
      }
  
      // Login successful, set userId in session
      req.session.userId = user.userId;  // Store the userId in the session
      res.redirect('/categories'); // Redirect to categories page after successful login
    });
  };

  exports.rpLogin = (req, res) => {
    const { username, password } = req.body;

    // Query to find the user by username
    const query = `SELECT * FROM users WHERE username = ?`;
    db.execute(query, [username], (err, results) => {
        if (err) {
            console.error('Error in querying database:', err);
            return res.status(500).send('Database error');
        }

        if (results.length === 0) {
            return res.status(400).send('Invalid username or password');
        }

        const user = results[0];

        // Check if the password is correct
        if (user.userPassword !== password) {
            console.log('Password mismatch:', user.userPassword, password); // Debugging output
            return res.status(400).send('Invalid username or password');
        }

        // If login is successful, store the userId in the session
        req.session.userId = user.userId; // Store userId in session
        req.session.role = user.userRole; // Store user role (user or admin)

        // Redirect to the appropriate page based on the role
        if (user.userRole === 'admin') {
            res.redirect('/adminpage'); // Admin specific dashboard
        } else {
            res.redirect('/index'); // User specific dashboard
        }
    });
};