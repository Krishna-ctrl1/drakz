const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require("cors");
const crypto = require('crypto');
const nodemailer = require('nodemailer'); // Add nodemailer for email

const session = require('express-session');
require('dotenv').config();

const app = express();
app.use(cors()); 
app.use(bodyParser.json());
const port = 4000;

// Use a more secure session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key', // Use environment variable for production
  resave: false,
  saveUninitialized: true,
  cookie: { 
    secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Serve static files (like HTML, CSS, images, etc.) from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to parse form data (important for POST requests)
app.use(bodyParser.urlencoded({ extended: true }));

// Create MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1234567890',
  database: 'DRAKZDatabase'
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database: ', err.stack);
    return;
  }
  console.log('Connected to MySQL database');
});

// Configure email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail', // Or use your preferred email service
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com',
    pass: process.env.EMAIL_PASSWORD || 'your-email-password'
  }
});

// Function to send OTP via email
async function sendOTPEmail(email, otp) {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER || 'your-email@gmail.com',
      to: email,
      subject: 'Your Verification Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <h2 style="color: #333;">Verification Code</h2>
          <p>Your verification code is:</p>
          <h1 style="background-color: #f5f5f5; padding: 10px; text-align: center; letter-spacing: 5px; font-size: 32px;">${otp}</h1>
          <p>This code will expire in 10 minutes.</p>
          <p style="color: #777; font-size: 12px;">If you did not request this code, please ignore this email.</p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
}

// Function to hash password using SHA-256
function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// Function to generate a 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Function to verify OTP (simulated verification since we're storing in session)
async function verifyOTP(email, submittedOTP, sessionOTP) {
  // Simple comparison for verification
  return submittedOTP === sessionOTP;
}

// Route definitions (unchanged)
app.get('/start_page', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'start_page.html'));
});

app.get('/admin-login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin-login.html'));
});

app.get('/advisor-login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'advisor-login.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/admin-dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin-dashboard.html'));
});

app.get('/advisor-dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'advisor-dashboard.html'));
});

app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// Login handlers (unchanged)
app.post('/admin-login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    console.error('Missing email or password');
    return res.status(400).send('Email and password are required');
  }

  const hashedPassword = hashPassword(password);
  const query = 'SELECT * FROM admins WHERE email = ? AND password = ?';

  db.query(query, [email, hashedPassword], (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).send('Internal Server Error');
    }

    if (results.length > 0) {
      console.log('Admin login successful for:', email);
      res.redirect('/admin-dashboard');
    } else {
      console.warn('Invalid login credentials for email:', email);
      res.status(401).send('Invalid email or password');
    }
  });
});  

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
      res.redirect('/advisor-dashboard');
    } else {
      console.warn('Invalid login attempt for email:', email);
      res.send('Invalid email or password');
    }
  });
});

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

// Update the signup endpoint with better error handling and logging
app.post('/signup', (req, res) => {
  const {
    name, 
    email, 
    password, 
    monthly_income, 
    employment_status,
    financial_goals, 
    risk,
    aadhaar_number,
    pan_number,
    email_verified
  } = req.body;

  console.log('Signup request:', {
    name, 
    email,
    // Don't log password
    monthly_income, 
    employment_status,
    financial_goals: Array.isArray(financial_goals) ? financial_goals : [financial_goals],
    risk,
    aadhaar_number: aadhaar_number ? '****' + aadhaar_number.substr(-4) : null,
    pan_number: pan_number ? '****' + pan_number.substr(-4) : null,
    email_verified
  });

  // Improved validation
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Required fields are missing' });
  }

  // Check if email exists
  const checkEmailQuery = 'SELECT email FROM users WHERE email = ?';
  db.query(checkEmailQuery, [email], (err, results) => {
    if (err) {
      console.error('Database error during email check:', err);
      return res.status(500).json({ error: 'Database error during email check' });
    }

    if (results.length > 0) {
      return res.status(409).json({ error: 'Email already exists' });
    }

    // Hash password
    const hashedPassword = hashPassword(password);
    
    // Properly handle financial_goalss array or string
    let financial_goals;
    if (Array.isArray(financial_goals)) {
      financial_goals = financial_goals.join(',');
    } else if (typeof financial_goals === 'string') {
      financial_goals = financial_goals;
    } else {
      financial_goals = null;
    }

    // Log what we're inserting for debugging
    console.log('Inserting user with values:', {
      name,
      email,
      // password obfuscated
      monthly_income: monthly_income || null,
      employment_status: employment_status || null,
      financial_goals: financial_goals || null,
      risk: risk || null,
      aadhaar_number: aadhaar_number ? '****' + aadhaar_number.substr(-4) : null,
      pan_number: pan_number ? '****' + pan_number.substr(-4) : null,
      email_verified: email_verified === 'true' ? 1 : 0
    });

    // Create a prepared statement to ensure safe insertion
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
        email_verified,
        created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `;

    const values = [
      name,
      email,
      hashedPassword,
      monthly_income || null,
      employment_status || null,
      financial_goals || null,
      risk || null,
      aadhaar_number || null,
      pan_number || null,
      email_verified === 'true' ? 1 : 0
    ];

    // Execute the insert
    db.query(insertQuery, values, (err, result) => {
      if (err) {
        console.error('Database error during user creation:', err);
        return res.status(500).json({ error: 'Database error during user creation' });
      }
      
      console.log('User created successfully with ID:', result.insertId);
      
      // Set user session
      req.session.userId = result.insertId;
      req.session.email = email;
      req.session.isLoggedIn = true;
      
      return res.status(200).json({ success: true, redirect: '/dashboard' });
    });
  });
});

//Aadhaar OTP endpoint
app.post("/aadhaar-otp", async (req, res) => {
  const { aadhaarNumber } = req.body;

  console.log(`Received Aadhaar OTP request for: ${aadhaarNumber}`);

  if (!aadhaarNumber || aadhaarNumber.length !== 12) {
    return res.status(400).json({ success: false, message: "Invalid Aadhaar number" });
  }

  try {
    // Look up the email associated with this Aadhaar number
    const lookupQuery = 'SELECT email FROM users_aadhaar_pan WHERE aadhaar_number = ?';
    
    db.query(lookupQuery, [aadhaarNumber], async (err, results) => {
      if (err) {
        console.error('Database query error:', err);
        return res.status(500).json({ success: false, message: "Error verifying Aadhaar number" });
      }
      
      if (results.length === 0) {
        return res.status(404).json({ success: false, message: "Aadhaar number not found in our records" });
      }
      
      const email = results[0].email;
      console.log(`Found email for Aadhaar: ${email}`);
      
      // Generate a new OTP
      const otp = generateOTP();
      
      // Send OTP via email
      const result = await sendOTPEmail(email, otp);
      
      if (result.success) {
        // Store verification data in session
        req.session.aadhaarVerification = {
          aadhaarNumber,
          email,
          otp,
          createdAt: Date.now()
        };
        
        return res.json({ 
          success: true, 
          message: `Verification code sent to your registered email (${maskEmail(email)})`,
          maskedEmail: maskEmail(email)
        });
      } else {
        console.error(`Failed to send email to ${email}:`, result.error);
        return res.status(500).json({ 
          success: false, 
          message: "Failed to send verification code. Please try again later."
        });
      }
    });
  } catch (error) {
    console.error('Error sending OTP:', error);
    return res.status(500).json({ success: false, message: "Error processing request" });
  }
});

// Helper function to mask email for privacy
function maskEmail(email) {
  const [name, domain] = email.split('@');
  const maskedName = name.charAt(0) + '*'.repeat(name.length - 2) + name.charAt(name.length - 1);
  return `${maskedName}@${domain}`;
}

// Aadhaar OTP verification endpoint
app.post("/aadhaar-verify", async (req, res) => {
  const { aadhaarNumber, otp } = req.body;
  
  if (!aadhaarNumber || !otp || otp.length !== 6) {
    return res.status(400).json({ success: false, message: "Invalid request" });
  }
  
  if (!req.session.aadhaarVerification || 
      req.session.aadhaarVerification.aadhaarNumber !== aadhaarNumber ||
      Date.now() > req.session.aadhaarVerification.createdAt + (10 * 60 * 1000)) {
    return res.status(400).json({ success: false, message: "Verification session expired or invalid" });
  }
  
  const email = req.session.aadhaarVerification.email;
  const sessionOTP = req.session.aadhaarVerification.otp;
  
  try {
    // Verify the OTP by comparing with the stored OTP
    const isValid = await verifyOTP(email, otp, sessionOTP);
    
    if (isValid) {
      // Mark Aadhaar as verified in session
      req.session.aadhaarVerified = true;
      
      return res.json({ 
        success: true, 
        message: "Aadhaar verified successfully!",
        email: email
      });
    } else {
      return res.json({ success: false, message: "Invalid verification code. Please try again." });
    }
  } catch (error) {
    console.error('Error during verification:', error);
    return res.status(500).json({ success: false, message: "Verification error. Please try again." });
  }
});

// Updated PAN OTP endpoint to look up email from database
app.post("/pan-otp", async (req, res) => {
  const { panNumber } = req.body;

  console.log(`Received PAN OTP request for: ${panNumber}`);

  if (!panNumber || panNumber.length !== 10) {
    return res.status(400).json({ success: false, message: "Invalid PAN number" });
  }

  try {
    // Look up the email associated with this PAN number
    const lookupQuery = 'SELECT email FROM users_aadhaar_pan WHERE pan_number = ?';
    
    db.query(lookupQuery, [panNumber], async (err, results) => {
      if (err) {
        console.error('Database query error:', err);
        return res.status(500).json({ success: false, message: "Error verifying PAN number" });
      }
      
      if (results.length === 0) {
        return res.status(404).json({ success: false, message: "PAN number not found in our records" });
      }
      
      const email = results[0].email;
      console.log(`Found email for PAN: ${email}`);
      
      // Generate a new OTP
      const otp = generateOTP();
      
      // Send OTP via email
      const result = await sendOTPEmail(email, otp);
      
      if (result.success) {
        // Store verification data in session
        req.session.panVerification = {
          panNumber,
          email,
          otp,
          createdAt: Date.now()
        };
        
        return res.json({ 
          success: true, 
          message: `Verification code sent to your registered email (${maskEmail(email)})`,
          maskedEmail: maskEmail(email)
        });
      } else {
        console.error(`Failed to send email to ${email}:`, result.error);
        return res.status(500).json({ 
          success: false, 
          message: "Failed to send verification code. Please try again later."
        });
      }
    });
  } catch (error) {
    console.error('Error sending OTP:', error);
    return res.status(500).json({ success: false, message: "Error processing request" });
  }
});

// PAN OTP verification endpoint
app.post("/pan-verify", async (req, res) => {
  const { panNumber, otp } = req.body;
  
  if (!panNumber || !otp || otp.length !== 6) {
    return res.status(400).json({ success: false, message: "Invalid request" });
  }
  
  if (!req.session.panVerification || 
      req.session.panVerification.panNumber !== panNumber ||
      Date.now() > req.session.panVerification.createdAt + (10 * 60 * 1000)) {
    return res.status(400).json({ success: false, message: "Verification session expired or invalid" });
  }
  
  const email = req.session.panVerification.email;
  const sessionOTP = req.session.panVerification.otp;
  
  try {
    // Verify the OTP by comparing with the stored OTP
    const isValid = await verifyOTP(email, otp, sessionOTP);
    
    if (isValid) {
      // Mark PAN as verified in session
      req.session.panVerified = true;
      
      return res.json({ 
        success: true, 
        message: "PAN verified successfully!",
        email: email
      });
    } else {
      return res.json({ success: false, message: "Invalid verification code. Please try again." });
    }
  } catch (error) {
    console.error('Error during verification:', error);
    return res.status(500).json({ success: false, message: "Verification error. Please try again." });
  }
});

// Helper function to validate email format
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});