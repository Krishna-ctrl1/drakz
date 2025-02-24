const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require("cors");
const crypto = require('crypto');

const app = express();
app.use(cors()); 
app.use(bodyParser.json());
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
    const { email, password } = req.body;
  
    console.log('Admin login attempt:', { email, password }); // Debugging
  
    if (!email || !password) {
      console.error('Missing email or password');
      return res.status(400).send('Email and password are required');
    }
  
    const hashedPassword = hashPassword(password);
    console.log('Hashed password:', hashedPassword); // Debugging
  
    const query = 'SELECT * FROM admins WHERE email = ? AND password = ?';
  
    db.query(query, [email, hashedPassword], (err, results) => {
      if (err) {
        console.error('Database query error:', err); // Log the exact error
        return res.status(500).send('Internal Server Error');
      }
  
      console.log('Query results:', results); // Debugging
  
      if (results.length > 0) {
        console.log('Admin login successful for:', email);
        res.redirect('/admin-dashboard'); // Redirect to Admin Dashboard
      } else {
        console.warn('Invalid login credentials for email:', email);
        res.status(401).send('Invalid email or password');
      }
    });
  });  

// POST request to handle Advisor Login
app.post('/advisor-login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    console.error('Email or password is missing');
    return res.status(400).send('Email and password are required');
  }

  const hashedPassword = hashPassword(password);

  const query = 'SELECT * FROM advisors WHERE email = ? AND password = ?';

  db.query(query, [email, hashedPassword], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).send('Internal Server Error');
    }

    if (results.length > 0) {
      console.log('Advisor login successful for:', email);
      res.redirect('/advisor-dashboard'); // Redirect to Advisor Dashboard
    } else {
      console.warn('Invalid login attempt for email:', email);
      res.send('Invalid email or password');
    }
  });
});

// POST request to handle User Loginapp.post('/login', (req, res) => {
  app.post('/login', (req, res) => {
    const { email, password } = req.body;
  
    // Basic validation
    if (!email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Email and password are required'
      });
    }
  
    const hashedPassword = hashPassword(password);
  
    const query = 'SELECT * FROM users WHERE email = ? AND password = ?';
    
    db.query(query, [email, hashedPassword], (err, results) => {
      if (err) {
        console.error('Database error during login:', err);
        return res.status(500).json({
          status: 'error',
          message: 'Internal server error'
        });
      }
  
      if (results.length === 0) {
        return res.status(401).json({
          status: 'error',
          message: 'Invalid email or password'
        });
      }
  
      // User found, redirect to dashboard
      console.log('Login successful for user:', email);
      res.redirect('/dashboard');
    });
  });


// Email validation endpoint
app.post('/check-email', (req, res) => {
  const { email } = req.body;
  
  const query = 'SELECT email FROM users WHERE email = ?';
  db.query(query, [email], (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    
    if (results.length > 0) {
      res.json({ exists: true });
    } else {
      res.json({ exists: false });
    }
  });
});

// Updated signup endpoint to handle all user details
app.post('/signup', (req, res) => {
  const {
    fullname,
    email,
    password,
    income,
    employment,
    goals,
    risk,
    aadhaar,
    pan
  } = req.body;

  // Basic validation
  if (!fullname || !email || !password) {
    return res.status(400).json({ error: 'Required fields are missing' });
  }

  // First check if email exists
  const checkEmailQuery = 'SELECT email FROM users WHERE email = ?';
  db.query(checkEmailQuery, [email], (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    if (results.length > 0) {
      return res.status(409).json({ error: 'Email already exists' });
    }

    // If email doesn't exist, proceed with insertion
    const hashedPassword = hashPassword(password);
    
    // Convert goals array to string if it exists
    const goalsString = Array.isArray(goals) ? goals.join(',') : goals;

    const insertQuery = `
      INSERT INTO users (
        name,
        email,
        password,
        monthly_income,
        employment_status,
        financial_goals,
        risk_tolerance,
        aadhaar_number,
        pan_number,
        created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `;

    const values = [
      fullname,
      email,
      hashedPassword,
      income || null,
      employment || null,
      goalsString || null,
      risk || null,
      aadhaar || null,
      pan || null
    ];

    db.query(insertQuery, values, (err, result) => {
      if (err) {
        console.error('Error inserting user into database:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
      
      console.log('New user created:', result);
      res.redirect('/dashboard');
    });
  });
});

const otpStore_aadhaar = {}; // Temporary storage for OTPs

// Generate a simulated OTP for Aadhaar
app.post("/aadhaar-otp", (req, res) => {
    const { aadhaarNumber } = req.body;

    if (!aadhaarNumber || aadhaarNumber.length !== 12) {
        return res.status(400).json({ success: false, message: "Invalid Aadhaar number" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit OTP
    otpStore_aadhaar[aadhaarNumber] = otp;

    console.log(`Simulated OTP for Aadhaar ${aadhaarNumber}: ${otp}`); // Log OTP for testing

    res.json({ success: true, message: "OTP sent (simulated)." });
});

// Verify simulated OTP
app.post("/aadhaar-verify", (req, res) => {
    const { aadhaarNumber, otp } = req.body;

    if (!aadhaarNumber || !otp || otp.length !== 6) {
        return res.status(400).json({ success: false, message: "Invalid request" });
    }

    if (otpStore_aadhaar[aadhaarNumber] == otp) {
        delete otpStore_aadhaar[aadhaarNumber]; // Remove OTP after verification
        res.json({ success: true, message: "Aadhaar verified successfully!" });
    } else {
        res.json({ success: false, message: "Invalid OTP. Please try again." });
    }
});

const otpStore_pan = {}; // Temporary storage for OTPs

// Generate a simulated OTP for PAN
app.post("/pan-otp", (req, res) => {
    const { panNumber } = req.body;

    if (!panNumber || panNumber.length !== 10) {
        return res.status(400).json({ success: false, message: "Invalid PAN number" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit OTP
    otpStore_pan[panNumber] = otp;

    console.log(`Simulated OTP for PAN ${panNumber}: ${otp}`); // Log OTP for testing

    res.json({ success: true, message: "OTP sent (simulated)." });
});

// Verify simulated OTP
app.post("/pan-verify", (req, res) => {
    const { panNumber, otp } = req.body;

    if (!panNumber || !otp || otp.length !== 6) {
        return res.status(400).json({ success: false, message: "Invalid request" });
    }

    if (otpStore_pan[panNumber] == otp) {
        delete otpStore_pan[panNumber]; // Remove OTP after verification
        res.json({ success: true, message: "PAN verified successfully!" });
    } else {
        res.json({ success: false, message: "Invalid OTP. Please try again." });
    }
});


// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});