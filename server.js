const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const path = require('path');
const crypto = require('crypto');

const app = express();
const port = 4000;

// Serve static files (like HTML, CSS, images, etc.) from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to parse form data (important for POST requests)
app.use(bodyParser.urlencoded({ extended: true }));

// Create MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',          // MySQL username
  password: '1234567890',  // MySQL password
  database: 'DRAKZDatabase'  // The database you created earlier
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database: ', err.stack);
    return;
  }
  console.log('Connected to MySQL database');
});

// Function to hash password using SHA-256
function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// Serve the startup page (startup_page.html)
app.get('/start_page', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'start_page.html'));
});

// Serve login pages for different roles
app.get('/admin-login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin-login.html'));
});

app.get('/advisor-login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'advisor-login.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Dashboard Routes
app.get('/admin-dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin-dashboard.html'));
});

app.get('/advisor-dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'advisor-dashboard.html'));
});

app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// POST request to handle Admin Login
app.post('/admin-login', (req, res) => {
    const { username, password } = req.body;
  
    console.log('Admin login attempt:', { username, password }); // Debugging
  
    if (!username || !password) {
      console.error('Missing username or password');
      return res.status(400).send('Username and password are required');
    }
  
    const hashedPassword = hashPassword(password);
    console.log('Hashed password:', hashedPassword); // Debugging
  
    const query = 'SELECT * FROM admins WHERE username = ? AND password = ?';
  
    db.query(query, [username, hashedPassword], (err, results) => {
      if (err) {
        console.error('Database query error:', err); // Log the exact error
        return res.status(500).send('Internal Server Error');
      }
  
      console.log('Query results:', results); // Debugging
  
      if (results.length > 0) {
        console.log('Admin login successful for:', username);
        res.redirect('/admin-dashboard'); // Redirect to Admin Dashboard
      } else {
        console.warn('Invalid login credentials for username:', username);
        res.status(401).send('Invalid username or password');
      }
    });
  });  

// POST request to handle Advisor Login
app.post('/advisor-login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    console.error('Username or password is missing');
    return res.status(400).send('Username and password are required');
  }

  const hashedPassword = hashPassword(password);

  const query = 'SELECT * FROM advisors WHERE username = ? AND password = ?';

  db.query(query, [username, hashedPassword], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).send('Internal Server Error');
    }

    if (results.length > 0) {
      console.log('Advisor login successful for:', username);
      res.redirect('/advisor-dashboard'); // Redirect to Advisor Dashboard
    } else {
      console.warn('Invalid login attempt for username:', username);
      res.send('Invalid username or password');
    }
  });
});

// POST request to handle User Login
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    console.error('Username or password is missing');
    return res.status(400).send('Username and password are required');
  }

  const hashedPassword = hashPassword(password);

  const query = 'SELECT * FROM users WHERE username = ? AND password = ?';

  db.query(query, [username, hashedPassword], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).send('Internal Server Error');
    }

    if (results.length > 0) {
      console.log('User login successful for:', username);
      res.redirect('/dashboard'); // Redirect to User Dashboard
    } else {
      console.warn('Invalid login attempt for username:', username);
      res.send('Invalid username or password');
    }
  });
});

// POST request to handle Signup
app.post('/signup', (req, res) => {
  const { username, email, password, confirm_password } = req.body;

  // Check if all required fields are provided
  if (!username || !email || !password || !confirm_password) {
    return res.status(400).send('All fields are required');
  }

  // Check if passwords match
  if (password !== confirm_password) {
    return res.status(400).send('Passwords do not match');
  }

  const hashedPassword = hashPassword(password);

  // Insert new user into the database
  const query = 'INSERT INTO users (username, name, email, password) VALUES (?, ?, ?, ?)';
  db.query(query, [username, "ABCD",email, hashedPassword], (err, result) => {
    if (err) {
      console.error('Error inserting user into database:', err);
      return res.status(500).send('Internal Server Error');
    }
    
    console.log('New user created:', result);

    // Redirect to the "details.html" page after successful signup
    res.redirect('/details.html'); // Assuming you have this page available
  });
});

// Serve the details page after signup (if it exists)
app.get('/details.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'details.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});