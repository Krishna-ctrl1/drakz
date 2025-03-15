const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const session = require("express-session");
const Razorpay = require("razorpay");
require("dotenv").config();

// Initialize express app first
const app = express();

// Then configure it
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "public"));
app.use(cors());
app.use(bodyParser.json());
const port = 4000;

// Use a more secure session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || "ziko120204", // Use environment variable for production
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

// Serve static files (like HTML, CSS, images, etc.) from the "public" folder
app.use(express.static(path.join(__dirname, "public")));

// Middleware to parse form data (important for POST requests)
app.use(bodyParser.urlencoded({ extended: true }));

// Create MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root", // MySQL username`
  password: "Abhi04@28", // MySQL password
  database: "DRAKZDatabase", // The database you created earlier
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database: ", err.stack);
    return;
  }
  console.log("Connected to MySQL database");
});

// Configure email transporter
const transporter = nodemailer.createTransport({
  service: "gmail", // Or use your preferred email service
  auth: {
    user: process.env.EMAIL_USER || "your-email@gmail.com",
    pass: process.env.EMAIL_PASSWORD || "your-email-password",
  },
});

// Function to send OTP via email
async function sendOTPEmail(email, otp) {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER || "your-email@gmail.com",
      to: email,
      subject: "Your Verification Code",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <h2 style="color: #333;">Verification Code</h2>
          <p>Your verification code is:</p>
          <h1 style="background-color: #f5f5f5; padding: 10px; text-align: center; letter-spacing: 5px; font-size: 32px;">${otp}</h1>
          <p>This code will expire in 10 minutes.</p>
          <p style="color: #777; font-size: 12px;">If you did not request this code, please ignore this email.</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error: error.message };
  }
}

// Function to hash password using SHA-256
function hashPassword(password) {
  return crypto.createHash("sha256").update(password).digest("hex");
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

app.get("/", (req, res) => {
  res.redirect("/start_page.html");
});

app.get("/admin-login", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "admin-login.html"));
});

app.get("/advisor-login", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "advisor-login.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

app.get("/admin-dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "admin-dashboard.html"));
});

app.get("/advisor-dashboard", (req, res) => {
  if (!req.session.advisorId) {
    return res.redirect("/login");
  }
  res.sendFile(path.join(__dirname, "public", "advisor-dashboard.html"));
});

app.get("/dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "dashboard.html"));
});

// About Us page route
app.get("/about", (req, res) => {
  // Data that will be passed to the EJS template
  const data = {
    objectives: [
      "Enabling users to manage and track all their financial activities (such as assets, liabilities, loans, investments, credit scores, and expenses) all in one place.",
      "Improving Financial Literacy by offering a broad range of educational content leading to increased investments in financial markets and reduced debt-traps, providing long-term financial security and tackling the root cause of poverty.",
      "Facilitating Personalized Financial Planning by allowing users to input and guiding them towards personal short-term and long-term financial goals.",
    ],
    features: [
      {
        title: "User Dashboard",
        description:
          "Comprehensive financial data overview including assets, liabilities, income, expenses, and investments with interactive charts.",
      },
      {
        title: "AI Chatbot",
        description:
          "Get instant answers to your financial queries and personalized advice.",
      },
      {
        title: "Financial Education",
        description:
          "Access a library of video courses and resources to improve your financial literacy.",
      },
      {
        title: "Reminders and Alerts",
        description:
          "Never miss a payment deadline with our smart alert system for EMIs, bills, loan due dates, and more.",
      },
      {
        title: "Community Blogs",
        description:
          "Share and learn financial tips from our growing community of users.",
      },
    ],
    teamMembers: [
      {
        name: "Krishna",
        role: "Technical Lead",
        contributions: [
          "ChatBot functionality",
          "Implementation of Chart.js",
          "Smart Tax Management",
          "Recommendation Model",
        ],
      },
      {
        name: "Deepthi",
        role: "Data Visualization Specialist",
        contributions: [
          "Chart.js visualizations",
          "Time series data functionalities",
          "Engaging animations",
          "Database Management",
        ],
      },
      {
        name: "Ragamaie",
        role: "Database Administrator",
        contributions: [
          "Database design and management",
          "Creation of videos and blogs",
          "Project documentation",
          "Project promotion",
        ],
      },
      {
        name: "Zulqarnain",
        role: "UI/UX Designer",
        contributions: [
          "Designing the UI/UX",
          "Implementation of EJS for templating",
          "Database optimization",
          "Reminder Alert functionality",
        ],
      },
      {
        name: "Abhinay",
        role: "Creative Designer",
        contributions: [
          "Designing creative assets and layouts",
          "Utilization of EJS for dynamic content rendering",
          "Frontend development",
        ],
      },
    ],
  };

  res.render("about_us", data);
});

// Login handlers (unchanged)
app.post("/admin-login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    console.error("Missing email or password");
    return res.status(400).send("Email and password are required");
  }

  const hashedPassword = hashPassword(password);
  const query = "SELECT * FROM admins WHERE email = ? AND password = ?";

  db.query(query, [email, hashedPassword], (err, results) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).send("Internal Server Error");
    }

    if (results.length > 0) {
      console.log("Admin login successful for:", email);
      res.redirect("/admin-dashboard");
    } else {
      console.warn("Invalid login credentials for email:", email);
      res.status(401).send("Invalid email or password");
    }
  });
});

app.post("/advisor-login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    console.error("Email or password is missing");
    return res.status(400).send("Email and password are required");
  }

  const hashedPassword = hashPassword(password);
  const query = "SELECT * FROM advisors WHERE email = ? AND password = ?";

  db.query(query, [email, hashedPassword], (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).send("Internal Server Error");
    }

    if (results.length > 0) {
      // Store advisor ID in the session
      req.session.advisorId = results[0].id;
      req.session.advisorEmail = email;

      console.log("Advisor login successful for:", email);
      res.redirect("/advisor-dashboard");
    } else {
      console.warn("Invalid login attempt for email:", email);
      res.send("Invalid email or password");
    }
  });
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  // Basic validation
  if (!email || !password) {
    return res.status(400).json({
      status: "error",
      message: "Email and password are required",
    });
  }

  const hashedPassword = hashPassword(password);
  const query = "SELECT * FROM users WHERE email = ? AND password = ?";

  db.query(query, [email, hashedPassword], (err, results) => {
    if (err) {
      console.error("Database error during login:", err);
      return res.status(500).json({
        status: "error",
        message: "Internal server error",
      });
    }

    if (results.length === 0) {
      return res.status(401).json({
        status: "error",
        message: "Invalid email or password",
      });
    }

    // User found, set session and redirect to dashboard
    req.session.userId = results[0].id;
    console.log("Login successful for user:", email);
    console.log("User Id: ", req.session.userId);

    // For AJAX requests, redirect will be handled by the client
    res.redirect("/dashboard");
  });
});

// Email validation endpoint
app.post("/check-email", (req, res) => {
  const { email } = req.body;

  const query = "SELECT email FROM users WHERE email = ?";
  db.query(query, [email], (err, results) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (results.length > 0) {
      res.json({ exists: true });
    } else {
      res.json({ exists: false });
    }
  });
});

// Update the signup endpoint with better error handling and logging
app.post("/signup", (req, res) => {
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
    email_verified,
  } = req.body;

  console.log("Signup request:", {
    name,
    email,
    // Don't log password
    monthly_income,
    employment_status,
    financial_goals: Array.isArray(financial_goals)
      ? financial_goals
      : [financial_goals],
    risk,
    aadhaar_number: aadhaar_number ? "****" + aadhaar_number.substr(-4) : null,
    pan_number: pan_number ? "****" + pan_number.substr(-4) : null,
    email_verified,
  });

  // Improved validation
  if (!name || !email || !password) {
    return res.status(400).json({ error: "Required fields are missing" });
  }

  // Check if email exists
  const checkEmailQuery = "SELECT email FROM users WHERE email = ?";
  db.query(checkEmailQuery, [email], (err, results) => {
    if (err) {
      console.error("Database error during email check:", err);
      return res
        .status(500)
        .json({ error: "Database error during email check" });
    }

    if (results.length > 0) {
      return res.status(409).json({ error: "Email already exists" });
    }

    // Hash password
    const hashedPassword = hashPassword(password);

    // Properly handle financial_goalss array or string
    let financial_goals;
    if (Array.isArray(financial_goals)) {
      financial_goals = financial_goals.join(",");
    } else if (typeof financial_goals === "string") {
      financial_goals = financial_goals;
    } else {
      financial_goals = null;
    }

    // Log what we're inserting for debugging
    console.log("Inserting user with values:", {
      name,
      email,
      // password obfuscated
      monthly_income: monthly_income || null,
      employment_status: employment_status || null,
      financial_goals: financial_goals || null,
      risk: risk || null,
      aadhaar_number: aadhaar_number
        ? "****" + aadhaar_number.substr(-4)
        : null,
      pan_number: pan_number ? "****" + pan_number.substr(-4) : null,
      email_verified: email_verified === "true" ? 1 : 0,
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
      email_verified === "true" ? 1 : 0,
    ];

    // Execute the insert
    db.query(insertQuery, values, (err, result) => {
      if (err) {
        console.error("Database error during user creation:", err);
        return res
          .status(500)
          .json({ error: "Database error during user creation" });
      }

      console.log("User created successfully with ID:", result.insertId);

      // Set user session
      req.session.userId = result.insertId;
      req.session.email = email;
      req.session.isLoggedIn = true;

      return res.status(200).json({ success: true, redirect: "/dashboard" });
    });
  });
});

//Aadhaar OTP endpoint
app.post("/aadhaar-otp", async (req, res) => {
  const { aadhaarNumber } = req.body;

  console.log(`Received Aadhaar OTP request for: ${aadhaarNumber}`);

  if (!aadhaarNumber || aadhaarNumber.length !== 12) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid Aadhaar number" });
  }

  try {
    // Look up the email associated with this Aadhaar number
    const lookupQuery =
      "SELECT email FROM users_aadhaar_pan WHERE aadhaar_number = ?";

    db.query(lookupQuery, [aadhaarNumber], async (err, results) => {
      if (err) {
        console.error("Database query error:", err);
        return res
          .status(500)
          .json({ success: false, message: "Error verifying Aadhaar number" });
      }

      if (results.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Aadhaar number not found in our records",
        });
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
          createdAt: Date.now(),
        };

        return res.json({
          success: true,
          message: `Verification code sent to your registered email (${maskEmail(
            email
          )})`,
          maskedEmail: maskEmail(email),
        });
      } else {
        console.error(`Failed to send email to ${email}:`, result.error);
        return res.status(500).json({
          success: false,
          message: "Failed to send verification code. Please try again later.",
        });
      }
    });
  } catch (error) {
    console.error("Error sending OTP:", error);
    return res
      .status(500)
      .json({ success: false, message: "Error processing request" });
  }
});

// Helper function to mask email for privacy
function maskEmail(email) {
  const [name, domain] = email.split("@");
  const maskedName =
    name.charAt(0) + "*".repeat(name.length - 2) + name.charAt(name.length - 1);
  return `${maskedName}@${domain}`;
}

// Aadhaar OTP verification endpoint
app.post("/aadhaar-verify", async (req, res) => {
  const { aadhaarNumber, otp } = req.body;

  if (!aadhaarNumber || !otp || otp.length !== 6) {
    return res.status(400).json({ success: false, message: "Invalid request" });
  }

  if (
    !req.session.aadhaarVerification ||
    req.session.aadhaarVerification.aadhaarNumber !== aadhaarNumber ||
    Date.now() > req.session.aadhaarVerification.createdAt + 10 * 60 * 1000
  ) {
    return res.status(400).json({
      success: false,
      message: "Verification session expired or invalid",
    });
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
        email: email,
      });
    } else {
      return res.json({
        success: false,
        message: "Invalid verification code. Please try again.",
      });
    }
  } catch (error) {
    console.error("Error during verification:", error);
    return res.status(500).json({
      success: false,
      message: "Verification error. Please try again.",
    });
  }
});

// Updated PAN OTP endpoint to look up email from database
app.post("/pan-otp", async (req, res) => {
  const { panNumber } = req.body;

  console.log(`Received PAN OTP request for: ${panNumber}`);

  if (!panNumber || panNumber.length !== 10) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid PAN number" });
  }

  try {
    // Look up the email associated with this PAN number
    const lookupQuery =
      "SELECT email FROM users_aadhaar_pan WHERE pan_number = ?";

    db.query(lookupQuery, [panNumber], async (err, results) => {
      if (err) {
        console.error("Database query error:", err);
        return res
          .status(500)
          .json({ success: false, message: "Error verifying PAN number" });
      }

      if (results.length === 0) {
        return res.status(404).json({
          success: false,
          message: "PAN number not found in our records",
        });
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
          createdAt: Date.now(),
        };

        return res.json({
          success: true,
          message: `Verification code sent to your registered email (${maskEmail(
            email
          )})`,
          maskedEmail: maskEmail(email),
        });
      } else {
        console.error(`Failed to send email to ${email}:`, result.error);
        return res.status(500).json({
          success: false,
          message: "Failed to send verification code. Please try again later.",
        });
      }
    });
  } catch (error) {
    console.error("Error sending OTP:", error);
    return res
      .status(500)
      .json({ success: false, message: "Error processing request" });
  }
});

// PAN OTP verification endpoint
app.post("/pan-verify", async (req, res) => {
  const { panNumber, otp } = req.body;

  if (!panNumber || !otp || otp.length !== 6) {
    return res.status(400).json({ success: false, message: "Invalid request" });
  }

  if (
    !req.session.panVerification ||
    req.session.panVerification.panNumber !== panNumber ||
    Date.now() > req.session.panVerification.createdAt + 10 * 60 * 1000
  ) {
    return res.status(400).json({
      success: false,
      message: "Verification session expired or invalid",
    });
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
        email: email,
      });
    } else {
      return res.json({
        success: false,
        message: "Invalid verification code. Please try again.",
      });
    }
  } catch (error) {
    console.error("Error during verification:", error);
    return res.status(500).json({
      success: false,
      message: "Verification error. Please try again.",
    });
  }
});

// Helper function to validate email format
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// API endpoint to get all users for admin dashboard
app.get("/api/users", (req, res) => {
  // Check if user is authenticated as admin (implement proper authentication middleware in production)

  const query = `
    SELECT 
      id, 
      name, 
      email, 
      monthly_income, 
      employment_status, 
      financial_goals, 
      risk_tolerance,
      email_verified, 
      DATE_FORMAT(created_at, '%d %b %Y') as join_date
    FROM users
    ORDER BY created_at DESC
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching users:", err);
      return res.status(500).json({ error: "Database error" });
    }

    // Format the data to match the expected structure in the dashboard
    const formattedUsers = results.map((user) => {
      // Split the name into first and last name (assuming format is "First Last")
      const nameParts = user.name.split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      return {
        id: user.id,
        firstName: firstName,
        lastName: lastName,
        email: user.email,
        role: "standard", // Default role, can be updated if you add role to users table
        status: user.email_verified ? "active" : "pending",
        joinDate: user.join_date,
        // Additional fields for detailed view
        monthlyIncome: user.monthly_income,
        employmentStatus: user.employment_status,
        financialGoals: user.financial_goals,
        riskTolerance: user.risk_tolerance,
      };
    });

    res.json(formattedUsers);
  });
});

// API endpoint to get all admins
app.get("/api/admins", (req, res) => {
  // Check if user is authenticated as admin (implement proper authentication middleware in production)

  const query = `
    SELECT 
      id, 
      username,
      name, 
      email, 
      DATE_FORMAT(created_at, '%d %b %Y') as join_date
    FROM admins
    ORDER BY created_at DESC
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching admins:", err);
      return res.status(500).json({ error: "Database error" });
    }

    // Format the data to match the expected structure
    const formattedAdmins = results.map((admin) => {
      const nameParts = admin.name.split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      return {
        id: admin.id,
        firstName: firstName,
        lastName: lastName,
        email: admin.email,
        username: admin.username,
        role: "admin",
        status: "active",
        joinDate: admin.join_date,
      };
    });

    res.json(formattedAdmins);
  });
});

// Function to show service details in modal
function showServiceDetails(serviceId) {
  const modal = document.getElementById('serviceModal');
  const modalContent = document.getElementById('serviceModalContent');
  const service = serviceDetails[serviceId];
  
  if (service) {
      // Create content for modal
      let content = `
          <h2 class="service-detail-title">${service.title}</h2>
          <p class="service-detail-content">${service.description}</p>
          <div class="service-features">
              <h4>Features & Benefits</h4>
              <ul class="feature-list">
      `;
      
      // Add features
      service.features.forEach(feature => {
          content += `<li>${feature}</li>`;
      });
      
      content += `
              </ul>
          </div>
          <div class="service-action">
              <button class="action-button">${service.actionText}</button>
          </div>
      `;
      
      modalContent.innerHTML = content;
      modal.style.display = 'block';
  }
}

// Function to show user's business loan details
function showUserLoanDetails() {
  const modal = document.getElementById('serviceModal');
  const modalContent = document.getElementById('serviceModalContent');
  const loanDetails = userAccountDetails['loan'];
  
  let content = `
      <h2 class="service-detail-title">${loanDetails.title}</h2>
      
      <div class="account-summary">
          <div class="summary-item">
              <span class="label">Account Number:</span>
              <span class="value">${loanDetails.accountNumber}</span>
          </div>
          <div class="summary-item">
              <span class="label">Remaining Balance:</span>
              <span class="value">${loanDetails.balance}</span>
          </div>
          <div class="summary-item">
              <span class="label">Loan Term:</span>
              <span class="value">${loanDetails.term}</span>
          </div>
          <div class="summary-item">
              <span class="label">Interest Rate:</span>
              <span class="value">${loanDetails.interestRate}</span>
          </div>
          <div class="summary-item">
              <span class="label">Monthly Payment:</span>
              <span class="value">${loanDetails.monthlyPayment}</span>
          </div>
          <div class="summary-item">
              <span class="label">Next Payment Due:</span>
              <span class="value">${loanDetails.nextPaymentDate}</span>
          </div>
      </div>
      
      <div class="payment-history">
          <h4>Recent Payment History</h4>
          <table class="history-table">
              <thead>
                  <tr>
                      <th>Date</th>
                      <th>Amount</th>
                      <th>Status</th>
                  </tr>
              </thead>
              <tbody>
  `;
  
  loanDetails.paymentHistory.forEach(payment => {
      content += `
          <tr>
              <td>${payment.date}</td>
              <td>${payment.amount}</td>
              <td><span class="status-badge">${payment.status}</span></td>
          </tr>
      `;
  });
  
  content += `
              </tbody>
          </table>
      </div>
      
      <div class="documents">
          <h4>Loan Documents</h4>
          <ul class="document-list">
  `;
  
  loanDetails.documents.forEach(doc => {
      content += `<li><i class="fas fa-file-pdf"></i> ${doc}</li>`;
  });
  
  content += `
          </ul>
      </div>
      
      <div class="service-action">
          <button class="action-button">Make a Payment</button>
      </div>
  `;
  
  modalContent.innerHTML = content;
  modal.style.display = 'block';
}

// Function to show user's account receipts
function showAccountReceipts() {
  const modal = document.getElementById('serviceModal');
  const modalContent = document.getElementById('serviceModalContent');
  const receiptDetails = userAccountDetails['receipts'];
  
  let content = `
      <h2 class="service-detail-title">${receiptDetails.title}</h2>
      
      <div class="account-summary">
          <div class="summary-item">
              <span class="label">Account Number:</span>
              <span class="value">${receiptDetails.accountNumber}</span>
          </div>
          <div class="summary-item">
              <span class="label">Current Balance:</span>
              <span class="value">${receiptDetails.balance}</span>
          </div>
      </div>
      
      <div class="transaction-history">
          <h4>Recent Transactions</h4>
          <table class="history-table">
              <thead>
                  <tr>
                      <th>Date</th>
                      <th>Description</th>
                      <th>Category</th>
                      <th>Amount</th>
                  </tr>
              </thead>
              <tbody>
  `;
  
  receiptDetails.transactions.forEach(transaction => {
      // Determine if amount is negative or positive for styling
      const amountClass = transaction.amount.startsWith('+') ? 'positive-amount' : 'negative-amount';
      
      content += `
          <tr>
              <td>${transaction.date}</td>
              <td>${transaction.description}</td>
              <td>${transaction.category || ''}</td>
              <td class="${amountClass}">${transaction.amount}</td>
          </tr>
      `;
  });
  
  content += `
              </tbody>
          </table>
      </div>
      
      <div class="spending-summary">
          <h4>Monthly Spending Breakdown</h4>
          <div class="spending-chart">
              <div class="chart-visualization">
                  <!-- Simplified chart visualization -->
                  <div class="chart-bars">
  `;
  
  receiptDetails.monthlySpending.forEach(item => {
      content += `
          <div class="chart-bar-item">
              <div class="chart-label">${item.category}</div>
              <div class="chart-bar" style="width: ${item.percentage}"></div>
              <div class="chart-value">${item.amount} (${item.percentage})</div>
          </div>
      `;
  });
  
  content += `
                  </div>
              </div>
          </div>
      </div>
      
      <div class="service-action">
          <button class="action-button">Download Statement</button>
          <button class="action-button secondary">Export Transactions</button>
      </div>
  `;
  
  modalContent.innerHTML = content;
  modal.style.display = 'block';
}

// Function to show user's savings account details
function showSavingsDetails() {
  const modal = document.getElementById('serviceModal');
  const modalContent = document.getElementById('serviceModalContent');
  const savingsDetails = userAccountDetails['savings'];
  
  let content = `
      <h2 class="service-detail-title">${savingsDetails.title}</h2>
      
      <div class="account-summary">
          <div class="summary-item">
              <span class="label">Account Number:</span>
              <span class="value">${savingsDetails.accountNumber}</span>
          </div>
          <div class="summary-item">
              <span class="label">Current Balance:</span>
              <span class="value">${savingsDetails.balance}</span>
          </div>
          <div class="summary-item">
              <span class="label">Interest Rate:</span>
              <span class="value">${savingsDetails.interestRate}</span>
          </div>
          <div class="summary-item">
              <span class="label">Year-to-Date Interest:</span>
              <span class="value">${savingsDetails.ytdInterest}</span>
          </div>
      </div>
      
      <div class="savings-goal">
          <h4>Savings Goal Progress</h4>
          <div class="goal-details">
              <div class="goal-name">${savingsDetails.goalProgress.name}</div>
              <div class="goal-progress-bar">
                  <div class="progress-fill" style="width: ${savingsDetails.goalProgress.percentage}"></div>
              </div>
              <div class="goal-stats">
                  <div class="goal-stat">
                      <span class="label">Current:</span>
                      <span class="value">${savingsDetails.goalProgress.current}</span>
                  </div>
                  <div class="goal-stat">
                      <span class="label">Target:</span>
                      <span class="value">${savingsDetails.goalProgress.target}</span>
                  </div>
                  <div class="goal-stat">
                      <span class="label">Completion:</span>
                      <span class="value">${savingsDetails.goalProgress.percentage}</span>
                  </div>
                  <div class="goal-stat">
                      <span class="label">Est. Date:</span>
                      <span class="value">${savingsDetails.goalProgress.estimatedCompletion}</span>
                  </div>
              </div>
          </div>
      </div>
      
      <div class="transaction-history">
          <h4>Recent Transactions</h4>
          <table class="history-table">
              <thead>
                  <tr>
                      <th>Date</th>
                      <th>Description</th>
                      <th>Amount</th>
                  </tr>
              </thead>
              <tbody>
  `;
  
  savingsDetails.transactions.forEach(transaction => {
      const amountClass = transaction.amount.startsWith('+') ? 'positive-amount' : 'negative-amount';
      
      content += `
          <tr>
              <td>${transaction.date}</td>
              <td>${transaction.description}</td>
              <td class="${amountClass}">${transaction.amount}</td>
          </tr>
      `;
  });
  
  content += `
              </tbody>
          </table>
      </div>
      
      <div class="service-action">
          <button class="action-button">Transfer Money</button>
          <button class="action-button secondary">Manage Goals</button>
      </div>
  `;
  
  modalContent.innerHTML = content;
  modal.style.display = 'block';
}

// Close modal when clicking the X


// API endpoint to get user's stocks and investments
app.get("/api/client-investments/:userId", (req, res) => {
  if (!req.session.advisorId) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  const advisorId = req.session.advisorId;
  const userId = req.params.userId;

  // First verify that this client is assigned to this advisor
  const verifyQuery = `
    SELECT * FROM client_advisors 
    WHERE advisor_id = ? AND user_id = ?
  `;

  db.query(verifyQuery, [advisorId, userId], (err, results) => {
    if (err) {
      console.error("Error verifying client-advisor relationship:", err);
      return res.status(500).json({ error: "Database error" });
    }

    if (results.length === 0) {
      return res
        .status(403)
        .json({ error: "Not authorized to view this client's investments" });
    }

    // Get stocks and investments in parallel using Promise.all
    Promise.all([
      // Get stocks
      new Promise((resolve, reject) => {
        const stocksQuery =
          "SELECT symbol, price FROM user_stocks WHERE user_id = ?";
        db.query(stocksQuery, [userId], (err, stocks) => {
          if (err) {
            console.error("Error fetching stocks:", err);
            reject(err);
          } else {
            resolve(stocks);
          }
        });
      }),
      // Get investments
      new Promise((resolve, reject) => {
        const investmentsQuery =
          "SELECT symbol, price FROM user_investments WHERE user_id = ?";
        db.query(investmentsQuery, [userId], (err, investments) => {
          if (err) {
            console.error("Error fetching investments:", err);
            reject(err);
          } else {
            resolve(investments);
          }
        });
      }),
    ])
      .then(([stocks, investments]) => {
        // Combine stocks and investments into a single array
        const combinedInvestments = [...stocks, ...investments];

        console.log(
          `Combined investments for user ID ${userId}:`,
          combinedInvestments
        );
        res.json({ investments: combinedInvestments });
      })
      .catch((error) => {
        console.error("Error fetching investment data:", error);
        res.status(500).json({ error: "Database error" });
      });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
