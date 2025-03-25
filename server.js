const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const session = require("express-session");
const Razorpay = require("razorpay");
const fetch = require("node-fetch");
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
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
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

// API endpoint to get all advisors
app.get("/api/advisors", (req, res) => {
  // Check if user is authenticated as admin (implement proper authentication middleware in production)

  const query = `
    SELECT 
      id, 
      username,
      name, 
      email, 
      DATE_FORMAT(created_at, '%d %b %Y') as join_date
    FROM advisors
    ORDER BY created_at DESC
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching advisors:", err);
      return res.status(500).json({ error: "Database error" });
    }

    // Format the data to match the expected structure
    const formattedAdvisors = results.map((advisor) => {
      const nameParts = advisor.name.split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      return {
        id: advisor.id,
        firstName: firstName,
        lastName: lastName,
        email: advisor.email,
        username: advisor.username,
        role: "advisor",
        status: "active",
        joinDate: advisor.join_date,
      };
    });

    res.json(formattedAdvisors);
  });
});

// API endpoint to get all system users (combined users, admins, advisors)
app.get("/api/all-users", (req, res) => {
  // Run multiple queries to get data from all three tables
  const userQuery = `
    SELECT 
      id, 
      name, 
      email, 
      'standard' as role,
      email_verified, 
      DATE_FORMAT(created_at, '%d %b %Y') as join_date
    FROM users
  `;

  const adminQuery = `
    SELECT 
      id, 
      name, 
      email, 
      'admin' as role,
      1 as email_verified, 
      DATE_FORMAT(created_at, '%d %b %Y') as join_date
    FROM admins
  `;

  const advisorQuery = `
    SELECT 
      id, 
      name, 
      email, 
      'advisor' as role,
      1 as email_verified, 
      DATE_FORMAT(created_at, '%d %b %Y') as join_date
    FROM advisors
  `;

  // Execute all queries
  db.query(userQuery, (err, users) => {
    if (err) {
      console.error("Error fetching users:", err);
      return res.status(500).json({ error: "Database error" });
    }

    db.query(adminQuery, (err, admins) => {
      if (err) {
        console.error("Error fetching admins:", err);
        return res.status(500).json({ error: "Database error" });
      }

      db.query(advisorQuery, (err, advisors) => {
        if (err) {
          console.error("Error fetching advisors:", err);
          return res.status(500).json({ error: "Database error" });
        }

        // Combine and format all results
        const allUsers = [...users, ...admins, ...advisors].map((user) => {
          const nameParts = user.name.split(" ");
          const firstName = nameParts[0] || "";
          const lastName = nameParts.slice(1).join(" ") || "";

          return {
            id: user.id,
            firstName: firstName,
            lastName: lastName,
            email: user.email,
            role: user.role,
            status: user.email_verified ? "active" : "pending",
            joinDate: user.join_date,
          };
        });

        res.json(allUsers);
      });
    });
  });
});

// API endpoint to update user status (active/suspended)
app.put("/api/users/:id/status", (req, res) => {
  const userId = req.params.id;
  const { status } = req.body;

  if (!status || !["active", "pending", "suspended"].includes(status)) {
    return res.status(400).json({ error: "Invalid status value" });
  }

  // Convert status to email_verified value
  const emailVerified = status === "active" ? 1 : 0;

  const query = "UPDATE users SET email_verified = ? WHERE id = ?";

  db.query(query, [emailVerified, userId], (err, result) => {
    if (err) {
      console.error("Error updating user status:", err);
      return res.status(500).json({ error: "Database error" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ success: true, message: "User status updated successfully" });
  });
});

// API endpoint to add a new user
app.post("/api/users", (req, res) => {
  const { firstName, lastName, email, password, role } = req.body;

  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Combine first and last name
  const fullName = `${firstName} ${lastName}`;

  // Hash the password
  const hashedPassword = hashPassword(password);

  // Determine which table to insert into based on role
  let table = "users";
  let fieldsString = "name, email, password, email_verified";
  let valuesString = "?, ?, ?, ?";
  let values = [fullName, email, hashedPassword, 1]; // Email verified by default

  if (role === "admin") {
    table = "admins";
    fieldsString = "name, email, password, username";
    valuesString = "?, ?, ?, ?";
    // Generate username from email (before the @)
    const username = email.split("@")[0];
    values = [fullName, email, hashedPassword, username];
  } else if (role === "advisor") {
    table = "advisors";
    fieldsString = "name, email, password, username";
    valuesString = "?, ?, ?, ?";
    // Generate username from email (before the @)
    const username = email.split("@")[0];
    values = [fullName, email, hashedPassword, username];
  }

  const query = `INSERT INTO ${table} (${fieldsString}) VALUES (${valuesString})`;

  db.query(query, values, (err, result) => {
    if (err) {
      console.error("Error adding new user:", err);
      // Check for duplicate email
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(409).json({ error: "Email already exists" });
      }
      return res.status(500).json({ error: "Database error" });
    }

    res.status(201).json({
      success: true,
      message: "User added successfully",
      userId: result.insertId,
    });
  });
});

// API endpoint to get security alerts
app.get("/api/security-alerts", (req, res) => {
  // In a real application, you'd fetch actual security alerts from a database table
  // For now, we'll return sample data
  const securityAlerts = [
    {
      id: 1,
      type: "Failed Login Attempt",
      user: "robert.b@example.com",
      time: "10:23 AM",
      location: "Kiev, Ukraine",
      status: "Open",
    },
    {
      id: 2,
      type: "Suspicious Activity",
      user: "jane.smith@example.com",
      time: "09:45 AM",
      location: "New York, USA",
      status: "Investigating",
    },
    {
      id: 3,
      type: "Multiple Logins",
      user: "david.m@example.com",
      time: "08:12 AM",
      location: "London, UK",
      status: "Resolved",
    },
    {
      id: 4,
      type: "Password Reset",
      user: "emily.w@example.com",
      time: "07:56 AM",
      location: "Toronto, Canada",
      status: "Closed",
    },
    {
      id: 5,
      type: "API Key Misuse",
      user: "james.t@example.com",
      time: "02:34 AM",
      location: "Singapore",
      status: "Open",
    },
  ];

  res.json(securityAlerts);
});

// API endpoint to save contact messages
app.post("/api/save-contact-message", async (req, res) => {
  try {
    // Get data from request body
    const { name, email, phone, subject, message, submission_date } = req.body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // Format the date properly for MySQL
    const formattedDate = new Date()
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");

    // Use your existing db connection
    db.query(
      `INSERT INTO contact_messages 
       (name, email, phone, subject, message, submission_date) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [name, email, phone || null, subject, message, formattedDate],
      (err, result) => {
        if (err) {
          console.error("Database error:", err);
          return res.status(500).json({
            success: false,
            message: "Database error while saving your message",
          });
        }

        if (result.affectedRows > 0) {
          // Success response
          return res.status(201).json({
            success: true,
            message: "Message saved successfully",
            id: result.insertId,
          });
        } else {
          return res.status(500).json({
            success: false,
            message: "Failed to insert data",
          });
        }
      }
    );
  } catch (error) {
    console.error("Error saving contact message:", error);
    res.status(500).json({
      success: false,
      message: "Server error while saving your message",
    });
  }
});

// API endpoint to get all messages (for admin dashboard)
app.get("/api/messages", async (req, res) => {
  try {
    // Using the existing db connection
    db.query(
      "SELECT * FROM contact_messages ORDER BY submission_date DESC",
      (error, results) => {
        if (error) {
          console.error("Error fetching messages:", error);
          return res.status(500).json({
            success: false,
            message: "An error occurred while fetching messages.",
          });
        }

        res.json({
          success: true,
          messages: results,
        });
      }
    );
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching messages.",
    });
  }
});

// API endpoint to mark a message as read
app.post("/api/messages/mark-read", async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Message ID is required.",
      });
    }

    // Using the existing db connection
    db.query(
      "UPDATE contact_messages SET is_read = TRUE WHERE id = ?",
      [id],
      (error, result) => {
        if (error) {
          console.error("Error marking message as read:", error);
          return res.status(500).json({
            success: false,
            message: "An error occurred while marking the message as read.",
          });
        }

        if (result.affectedRows > 0) {
          res.json({
            success: true,
            message: "Message marked as read.",
          });
        } else {
          res.status(404).json({
            success: false,
            message: "Message not found or already marked as read.",
          });
        }
      }
    );
  } catch (error) {
    console.error("Error marking message as read:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while marking the message as read.",
    });
  }
});

// API end-point for replying to messages
app.post("/api/messages/reply", async (req, res) => {
  try {
    const { id, to, subject, message } = req.body;

    if (!id || !to || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // Send the email
    const mailOptions = {
      from: process.env.EMAIL_USER || "your-email@gmail.com",
      to: to,
      subject: subject,
      text: message,
    };

    // Send mail with defined transport object
    await transporter.sendMail(mailOptions);

    // Update message status in database using promise interface
    const promiseConnection = db.promise();
    const query = "UPDATE contact_messages SET is_replied = true WHERE id = ?";
    await promiseConnection.query(query, [id]);

    res.json({ success: true, message: "Reply sent successfully" });
  } catch (error) {
    console.error("Error sending reply:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send reply: " + error.message,
    });
  }
});

// Dashboard API endpoint
app.get("/api/dashboard", (req, res) => {
  // Ensure the user is logged in
  const userId = req.session.userId;
  console.log("Session userId:", req.session.userId);

  // IMPORTANT: Set the content type to JSON
  res.setHeader("Content-Type", "application/json");

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized. Please log in." });
  }

  let dashboardData = {};

  // Get basic user details
  db.query("SELECT * FROM users WHERE id = ?", [userId], (err, userResult) => {
    if (err) return res.status(500).json({ error: "Database error" });
    dashboardData.user = userResult[0];

    // Get credit scores
    db.query(
      "SELECT * FROM user_credit_scores WHERE user_id = ?",
      [userId],
      (err, creditResults) => {
        if (err) return res.status(500).json({ error: "Database error" });
        dashboardData.creditScores = creditResults;

        // Get expenses
        db.query(
          "SELECT * FROM user_expenses WHERE user_id = ?",
          [userId],
          (err, expenseResults) => {
            if (err) return res.status(500).json({ error: "Database error" });
            dashboardData.expenses = expenseResults;

            // Get credit cards
            db.query(
              "SELECT * FROM user_credit_cards WHERE user_id = ?",
              [userId],
              (err, cardResults) => {
                if (err)
                  return res.status(500).json({ error: "Database error" });
                dashboardData.creditCards = cardResults;

                // Get total holdings
                db.query(
                  "SELECT * FROM user_holdings WHERE user_id = ?",
                  [userId],
                  (err, holdingsResults) => {
                    if (err)
                      return res.status(500).json({ error: "Database error" });
                    dashboardData.holdings = holdingsResults[0];

                    // Send all the data as JSON (or render a view with this data)
                    res.json(dashboardData);
                  }
                );
              }
            );
          }
        );
      }
    );
  });
});

// Credit card API endpoint
app.post("/api/credit-cards", (req, res) => {
  console.log("Credit card addition request received:", req.body);

  console.log("Credit card addition request received:", req.body);

  if (!req.session || !req.session.userId) {
    return res
      .status(401)
      .json({ error: "You must be logged in to add a credit card" });
  }

  const userId = req.session.userId;

  const {
    card_number,
    cardholder_name,
    valid_from,
    valid_thru,
    bank_name,
    card_type,
  } = req.body;

  console.log("Processing card data:", {
    userId,
    cardDetails: {
      card_number,
      cardholder_name,
      valid_from,
      valid_thru,
      bank_name,
      card_type,
    },
  });

  // Validate required fields
  if (!card_number || !cardholder_name || !valid_from || !valid_thru) {
    console.log("Validation failed - missing fields");
    return res
      .status(400)
      .json({ error: "Missing required credit card information" });
  }

  // Basic card number validation
  const sanitizedCardNumber = card_number.replace(/\s/g, "");
  if (!/^\d{13,19}$/.test(sanitizedCardNumber)) {
    console.log("Validation failed - invalid card number format");
    return res.status(400).json({ error: "Invalid card number format" });
  }

  // Insert the credit card into database
  const query = `
    INSERT INTO user_credit_cards 
    (user_id, card_number, cardholder_name, valid_from, valid_thru, bank_name, card_type) 
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  const params = [
    userId,
    sanitizedCardNumber,
    cardholder_name,
    valid_from,
    valid_thru,
    bank_name || "Unknown Bank",
    card_type || "Unknown Type",
  ];

  console.log("Executing query with params:", params);

  db.query(query, params, (error, result) => {
    if (error) {
      console.error("Database error adding credit card:", error);
      return res.status(500).json({
        error: "Failed to add credit card",
        details: error.message,
      });
    }

    console.log("Card added successfully, result:", result);

    // Return success response
    res.status(201).json({
      success: true,
      message: "Credit card added successfully",
      cardId: result.insertId,
    });
  });
});

// DELETE endpoint for credit cards
app.delete("/api/credit-cards/:id", (req, res) => {
  if (!req.session || !req.session.userId) {
    return res
      .status(401)
      .json({ error: "You must be logged in to delete a credit card" });
  }
  
  const userId = req.session.userId;
  const cardId = req.params.id;
  
  // First verify the card belongs to this user
  const verifyQuery = "SELECT * FROM user_credit_cards WHERE id = ? AND user_id = ?";
  db.query(verifyQuery, [cardId, userId], (verifyError, verifyResults) => {
    if (verifyError) {
      console.error("Database error verifying card ownership:", verifyError);
      return res.status(500).json({ error: "Failed to verify card ownership" });
    }
    
    if (verifyResults.length === 0) {
      return res.status(404).json({ error: "Card not found or you don't have permission to delete it" });
    }
    
    // If verification passed, delete the card
    const deleteQuery = "DELETE FROM user_credit_cards WHERE id = ? AND user_id = ?";
    db.query(deleteQuery, [cardId, userId], (deleteError, deleteResult) => {
      if (deleteError) {
        console.error("Database error deleting credit card:", deleteError);
        return res.status(500).json({ error: "Failed to delete credit card" });
      }
      
      res.json({ success: true, message: "Credit card deleted successfully" });
    });
  });
});

// At the end of your middleware chain
app.use((err, req, res, next) => {
  console.error(err.stack);

  // If the request is to an API endpoint, return JSON
  if (
    req.path.startsWith("/dashboard") ||
    req.xhr ||
    req.headers.accept.includes("application/json")
  ) {
    return res.status(500).json({ error: "Server error" });
  }

  // Otherwise return HTML
  res.status(500).send("Server error");
});

// API route to fetch user profile data
app.get("/api/user/profile", (req, res) => {
  // Check if user is logged in
  if (!req.session.userId) {
    return res.status(401).json({
      status: "error",
      message: "Unauthorized - Please log in",
    });
  }

  const query =
    "SELECT id, name, email, monthly_income, employment_status, financial_goals, risk_tolerance, aadhaar_number, pan_number, created_at FROM users WHERE id = ?";

  db.query(query, [req.session.userId], (err, results) => {
    if (err) {
      console.error("Database error fetching user profile:", err);
      return res.status(500).json({
        status: "error",
        message: "Internal server error",
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    // Return user profile data (excluding password)
    res.json({
      status: "success",
      data: results[0],
    });
  });
});

// API route to fetch user holdings
app.get("/api/user/holdings", (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({
      status: "error",
      message: "Unauthorized - Please log in",
    });
  }

  const query =
    "SELECT total_balance, savings_account_balance, income, expense, last_updated FROM user_holdings WHERE user_id = ?";

  db.query(query, [req.session.userId], (err, results) => {
    if (err) {
      console.error("Database error fetching user holdings:", err);
      return res.status(500).json({
        status: "error",
        message: "Internal server error",
      });
    }

    if (results.length === 0) {
      // If no holding records found, return defaults
      return res.json({
        status: "success",
        data: {
          total_balance: 0,
          savings_account_balance: 0,
          income: 0,
          expense: 0,
          last_updated: new Date(),
        },
      });
    }

    res.json({
      status: "success",
      data: results[0],
    });
  });
});

// API route to fetch user loans
app.get("/api/user/loans", (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({
      status: "error",
      message: "Unauthorized - Please log in",
    });
  }

  const query =
    "SELECT id, loan_type, principal_amount, remaining_balance, interest_rate, loan_term, emi_amount, loan_taken_on, next_payment_due, total_paid, status FROM user_loans WHERE user_id = ?";

  db.query(query, [req.session.userId], (err, results) => {
    if (err) {
      console.error("Database error fetching user loans:", err);
      return res.status(500).json({
        status: "error",
        message: "Internal server error",
      });
    }

    res.json({
      status: "success",
      data: results,
    });
  });
});

// API route to fetch user transactions
app.get("/api/user/transactions", (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({
      status: "error",
      message: "Unauthorized - Please log in",
    });
  }

  // Get limit from query parameter or use default
  const limit = req.query.limit || 10;

  const query =
    "SELECT id, description, type, transaction_datetime, amount, created_at FROM user_transactions WHERE user_id = ? ORDER BY transaction_datetime DESC LIMIT ?";

  db.query(query, [req.session.userId, parseInt(limit)], (err, results) => {
    if (err) {
      console.error("Database error fetching user transactions:", err);
      return res.status(500).json({
        status: "error",
        message: "Internal server error",
      });
    }

    res.json({
      status: "success",
      data: results,
    });
  });
});

const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.userId) {
    return next();
  }
  return res
    .status(401)
    .json({ status: "error", message: "Not authenticated" });
};

app.get("/api/user/weekly-activity", isAuthenticated, (req, res) => {
  const userId = req.session.userId;
  console.log("Processing weekly activity request for user:", userId);

  // Get current week's date range (Sunday to Saturday)
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay()); // Start from Sunday
  startOfWeek.setHours(0, 0, 0, 0); // Set to beginning of day

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6); // End on Saturday
  endOfWeek.setHours(23, 59, 59, 999); // Set to end of day

  // Format dates for SQL
  const formatSqlDate = (date) => {
    return date.toISOString().slice(0, 19).replace("T", " ");
  };

  const startDate = formatSqlDate(startOfWeek);
  const endDate = formatSqlDate(endOfWeek);

  console.log("Week date range:", startDate, "to", endDate);

  // Query to get daily deposit and withdrawal totals for the week
  const query = `
    SELECT 
      DATE(transaction_datetime) as date,
      SUM(CASE WHEN amount > 0 THEN amount ELSE 0 END) as deposit_total,
      SUM(CASE WHEN amount < 0 THEN ABS(amount) ELSE 0 END) as withdraw_total
    FROM 
      user_transactions
    WHERE 
      user_id = ? AND
      transaction_datetime BETWEEN ? AND ?
    GROUP BY 
      DATE(transaction_datetime)
    ORDER BY 
      date
  `;

  db.query(query, [userId, startDate, endDate], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.json({ status: "error", message: "Database error" });
    }

    console.log("Raw database results:", results);

    // Initialize arrays for the whole week (Sunday to Saturday)
    const depositValues = [0, 0, 0, 0, 0, 0, 0];
    const withdrawValues = [0, 0, 0, 0, 0, 0, 0];
    const weekDates = [];

    // Generate dates for the week
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      weekDates.push(formatSqlDate(date).split(" ")[0]); // Just get the date part
    }

    // Map results to the correct day of the week
    results.forEach((row) => {
      const rowDate = new Date(row.date);
      // Sunday is 0, Monday is 1, etc.
      const dayOfWeek = rowDate.getDay();

      depositValues[dayOfWeek] = parseFloat(row.deposit_total);
      withdrawValues[dayOfWeek] = parseFloat(row.withdraw_total);
    });

    console.log("Processed deposit values:", depositValues);
    console.log("Processed withdraw values:", withdrawValues);

    // Check if there's any data for the week
    const hasTransactions =
      depositValues.some((val) => val > 0) ||
      withdrawValues.some((val) => val > 0);

    if (!hasTransactions) {
      console.log(
        "No transactions found, adding test data for visualization purposes"
      );
      // If you want to send test data, you can do so here
    }

    // Send actual data from database, not test data
    res.json({
      status: "success",
      data: {
        weekDates,
        depositValues,
        withdrawValues,
      },
    });
  });
});

// API end-poimt to get user_investments
app.get("/api/user-investments", (req, res) => {
  // Check if user is logged in
  if (!req.session.userId) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  // Query to get user investments
  const query = `
    SELECT * FROM user_stocks 
    WHERE user_id = ?
  `;

  // Execute the query with the user ID from the session
  db.query(query, [req.session.userId], (err, results) => {
    if (err) {
      console.error("Error fetching user investments:", err);
      return res.status(500).json({ error: "Database error" });
    }

    // Send the investment data as JSON
    res.json(results);
  });
});

// Premium upgrade endpoint
app.post("/api/upgrade-to-premium", (req, res) => {
  // Ensure the user is logged in
  const userId = req.session.userId;

  if (!userId) {
    return res
      .status(401)
      .json({ success: false, error: "Unauthorized. Please log in." });
  }

  // Begin transaction
  db.beginTransaction((err) => {
    if (err) {
      console.error("Transaction error:", err);
      return res.status(500).json({ success: false, error: "Database error" });
    }

    // 1. Update the user's premium status
    db.query(
      "UPDATE users SET is_premium = 1 WHERE id = ?",
      [userId],
      (err, result) => {
        if (err) {
          return db.rollback(() => {
            console.error("Database error:", err);
            res.status(500).json({ success: false, error: "Database error" });
          });
        }

        if (result.affectedRows === 0) {
          return db.rollback(() => {
            res.status(404).json({ success: false, error: "User not found" });
          });
        }

        // 2. Find an advisor with fewer than 5 clients
        db.query(
          `SELECT a.id, a.name, a.email, COUNT(ca.id) as client_count 
           FROM advisors a 
           LEFT JOIN client_advisors ca ON a.id = ca.advisor_id 
           GROUP BY a.id 
           HAVING client_count < 5 
           ORDER BY client_count ASC 
           LIMIT 1`,
          (err, advisors) => {
            if (err) {
              return db.rollback(() => {
                console.error("Database error:", err);
                res
                  .status(500)
                  .json({ success: false, error: "Database error" });
              });
            }

            // If no advisor is available
            if (!advisors || advisors.length === 0) {
              return db.commit((err) => {
                if (err) {
                  return db.rollback(() => {
                    console.error("Commit error:", err);
                    res
                      .status(500)
                      .json({ success: false, error: "Database error" });
                  });
                }

                // Success but no advisor available
                res.json({ success: true });
              });
            }

            const advisor = advisors[0];

            // 3. Assign the advisor to the user
            db.query(
              "INSERT INTO client_advisors (advisor_id, user_id) VALUES (?, ?)",
              [advisor.id, userId],
              (err, result) => {
                if (err) {
                  return db.rollback(() => {
                    console.error("Database error:", err);
                    res
                      .status(500)
                      .json({ success: false, error: "Database error" });
                  });
                }

                // 4. Get user email for sending confirmation
                db.query(
                  "SELECT name, email FROM users WHERE id = ?",
                  [userId],
                  (err, users) => {
                    if (err) {
                      return db.rollback(() => {
                        console.error("Database error:", err);
                        res
                          .status(500)
                          .json({ success: false, error: "Database error" });
                      });
                    }

                    const user = users[0];

                    // 5. Commit the transaction
                    db.commit((err) => {
                      if (err) {
                        return db.rollback(() => {
                          console.error("Commit error:", err);
                          res
                            .status(500)
                            .json({ success: false, error: "Database error" });
                        });
                      }

                      // 6. Send confirmation email
                      sendConfirmationEmail(user, advisor);

                      // 7. Return success with advisor details
                      res.json({
                        success: true,
                        advisor: {
                          name: advisor.name,
                          email: advisor.email,
                        },
                      });
                    });
                  }
                );
              }
            );
          }
        );
      }
    );
  });
});

// Function to send confirmation email
function sendConfirmationEmail(user, advisor) {
  // You would integrate with your email service here (e.g., Nodemailer, SendGrid, etc.)
  // This is a placeholder function
  console.log(`Sending confirmation email to ${user.email}`);

  const mailOptions = {
    from: "drakz.fintech@gmail.com",
    to: user.email,
    subject: "Welcome to DRAKZ Premium!",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #ffd700; padding: 20px; text-align: center;">
          <h1 style="color: #333; margin: 0;">DRAKZ Premium</h1>
        </div>
        <div style="padding: 20px;">
          <h2>Welcome to Premium, ${user.name}!</h2>
          <p>Your payment has been successfully processed, and you now have access to all premium features.</p>
  
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Your Personal Financial Advisor</h3>
            <p><strong>Name:</strong> ${advisor.name}</p>
            <p><strong>Email:</strong> ${advisor.email}</p>
            <p>Your advisor will contact you within 24 hours to schedule your first consultation.</p>
          </div>
  
          <p>As a premium member, you now have access to:</p>
          <ul>
            <li>Full access to our financial video library</li>
            <li>Personal financial advisor services</li>
            <li>Advanced analytics and insights</li>
            <li>Priority alerts for market changes</li>
          </ul>
  
          <p>If you have any questions, please don't hesitate to contact our support team.</p>
  
          <div style="text-align: center; margin-top: 30px;">
            <a href="https://drakz.com/dashboard" style="background-color: #ffd700; color: #333; text-decoration: none; padding: 10px 20px; border-radius: 4px; font-weight: bold;">Go to Dashboard</a>
          </div>
        </div>
        <div style="background-color: #333; color: white; padding: 20px; text-align: center; font-size: 12px;">
          <p>&copy; 2025 DRAKZ. All rights reserved.</p>
        </div>
      </div>
    `,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log("Email error:", error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
}

// // Initialize Razorpay with your credentials
// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_your_key_id",
//   key_secret: process.env.RAZORPAY_KEY_SECRET || "your_key_secret",
// });

// // Create Razorpay order endpoint
// app.post("/api/create-razorpay-order", (req, res) => {
//   // Ensure the user is logged in
//   const userId = req.session.userId;

//   if (!userId) {
//     return res
//       .status(401)
//       .json({ success: false, error: "Unauthorized. Please log in." });
//   }

//   // Set amount for premium subscription (e.g., ₹5000 = 500000 paise)
//   const amount = 500000; // Adjust according to your pricing

//   // Create Razorpay order
//   const options = {
//     amount,
//     currency: "INR",
//     receipt: `order_${Date.now()}_${userId}`,
//     payment_capture: 1,
//   };

//   razorpay.orders.create(options, (err, order) => {
//     if (err) {
//       console.error("Razorpay order creation error:", err);
//       return res
//         .status(500)
//         .json({ success: false, error: "Failed to create payment order" });
//     }

//     res.json({
//       id: order.id,
//       amount: order.amount,
//       currency: order.currency,
//     });
//   });
// });

// // Verify Razorpay payment and upgrade to premium
// app.post("/api/verify-razorpay-payment", (req, res) => {
//   // Get payment verification details
//   const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
//     req.body;

//   // Ensure the user is logged in
//   const userId = req.session.userId;

//   if (!userId) {
//     return res
//       .status(401)
//       .json({ success: false, error: "Unauthorized. Please log in." });
//   }

//   // Validate input
//   if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
//     return res.status(400).json({
//       success: false,
//       error: "Missing payment verification parameters",
//     });
//   }

//   // Verify signature
//   const generatedSignature = crypto
//     .createHmac("sha256", razorpay.key_secret)
//     .update(razorpay_order_id + "|" + razorpay_payment_id)
//     .digest("hex");

//   if (generatedSignature !== razorpay_signature) {
//     return res.status(400).json({
//       success: false,
//       error: "Invalid payment signature",
//     });
//   }

//   // Payment signature is valid, now verify payment status
//   razorpay.payments.fetch(razorpay_payment_id, (err, payment) => {
//     if (err) {
//       console.error("Razorpay payment fetch error:", err);
//       return res
//         .status(500)
//         .json({ success: false, error: "Failed to verify payment" });
//     }

//     if (payment.status !== "captured") {
//       return res.status(400).json({
//         success: false,
//         error: "Payment not completed",
//       });
//     }

//     // Payment verified, now upgrade the user to premium
//     // Begin transaction
//     db.beginTransaction((err) => {
//       if (err) {
//         console.error("Transaction error:", err);
//         return res
//           .status(500)
//           .json({ success: false, error: "Database error" });
//       }

//       // 1. Update the user's premium status
//       db.query(
//         "UPDATE users SET is_premium = 1 WHERE id = ?",
//         [userId],
//         (err, result) => {
//           if (err) {
//             return db.rollback(() => {
//               console.error("Database error:", err);
//               res.status(500).json({ success: false, error: "Database error" });
//             });
//           }

//           if (result.affectedRows === 0) {
//             return db.rollback(() => {
//               res.status(404).json({ success: false, error: "User not found" });
//             });
//           }

//           // 2. Record payment in your database
//           db.query(
//             "INSERT INTO payments (user_id, payment_id, order_id, amount, status) VALUES (?, ?, ?, ?, ?)",
//             [
//               userId,
//               razorpay_payment_id,
//               razorpay_order_id,
//               payment.amount / 100,
//               payment.status,
//             ],
//             (err, result) => {
//               if (err) {
//                 return db.rollback(() => {
//                   console.error("Database error:", err);
//                   res
//                     .status(500)
//                     .json({ success: false, error: "Database error" });
//                 });
//               }

//               // 3. Find an advisor with fewer than 5 clients
//               db.query(
//                 `SELECT a.id, a.name, a.email, COUNT(ca.id) as client_count
//                  FROM advisors a
//                  LEFT JOIN client_advisors ca ON a.id = ca.advisor_id
//                  GROUP BY a.id
//                  HAVING client_count < 5
//                  ORDER BY client_count ASC
//                  LIMIT 1`,
//                 (err, advisors) => {
//                   if (err) {
//                     return db.rollback(() => {
//                       console.error("Database error:", err);
//                       res
//                         .status(500)
//                         .json({ success: false, error: "Database error" });
//                     });
//                   }

//                   // If no advisor is available
//                   if (!advisors || advisors.length === 0) {
//                     return db.commit((err) => {
//                       if (err) {
//                         return db.rollback(() => {
//                           console.error("Commit error:", err);
//                           res
//                             .status(500)
//                             .json({ success: false, error: "Database error" });
//                         });
//                       }

//                       // Success but no advisor available
//                       res.json({ success: true });
//                     });
//                   }

//                   const advisor = advisors[0];

//                   // 4. Assign the advisor to the user
//                   db.query(
//                     "INSERT INTO client_advisors (advisor_id, user_id) VALUES (?, ?)",
//                     [advisor.id, userId],
//                     (err, result) => {
//                       if (err) {
//                         return db.rollback(() => {
//                           console.error("Database error:", err);
//                           res
//                             .status(500)
//                             .json({ success: false, error: "Database error" });
//                         });
//                       }

//                       // 5. Get user email for sending confirmation
//                       db.query(
//                         "SELECT name, email FROM users WHERE id = ?",
//                         [userId],
//                         (err, users) => {
//                           if (err) {
//                             return db.rollback(() => {
//                               console.error("Database error:", err);
//                               res
//                                 .status(500)
//                                 .json({
//                                   success: false,
//                                   error: "Database error",
//                                 });
//                             });
//                           }

//                           const user = users[0];

//                           // 6. Commit the transaction
//                           db.commit((err) => {
//                             if (err) {
//                               return db.rollback(() => {
//                                 console.error("Commit error:", err);
//                                 res
//                                   .status(500)
//                                   .json({
//                                     success: false,
//                                     error: "Database error",
//                                   });
//                               });
//                             }

//                             // 7. Send confirmation email
//                             sendConfirmationEmail(user, advisor);

//                             // 8. Return success with advisor details
//                             res.json({
//                               success: true,
//                               advisor: {
//                                 name: advisor.name,
//                                 email: advisor.email,
//                               },
//                             });
//                           });
//                         }
//                       );
//                     }
//                   );
//                 }
//               );
//             }
//           );
//         }
//       );
//     });
//   });
// });

// Un-comment the above code when you have the RazorPay API Key. Also check dashboard.js

// API endpoint to get advisor's clients
app.get("/api/advisor-clients", (req, res) => {
  if (!req.session.advisorId) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  const advisorId = req.session.advisorId;
  const query = `
    SELECT ca.user_id, u.name, u.email 
    FROM client_advisors ca
    JOIN users u ON ca.user_id = u.id
    WHERE ca.advisor_id = ?
  `;

  db.query(query, [advisorId], (err, results) => {
    if (err) {
      console.error("Error fetching clients:", err);
      return res.status(500).json({ error: "Database error" });
    }

    console.log(`Clients for advisor ID ${advisorId}:`, results);
    res.json({ clients: results });
  });
});

// API endpoint to get detailed client information
app.get("/api/client-details/:userId", (req, res) => {
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
        .json({ error: "Not authorized to view this client" });
    }

    // Once verified, get the client details from both tables
    const clientQuery = `
      SELECT u.id, u.name, u.email, ud.phone, ud.country, ud.postal_code
      FROM users u
      LEFT JOIN user_details ud ON u.id = ud.user_id
      WHERE u.id = ?
    `;

    db.query(clientQuery, [userId], (err, clientResults) => {
      if (err) {
        console.error("Error fetching client details:", err);
        return res.status(500).json({ error: "Database error" });
      }

      if (clientResults.length === 0) {
        return res.status(404).json({ error: "Client not found" });
      }

      // Parse the client name into first and last name
      const fullName = clientResults[0].name || "";
      const nameParts = fullName.split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      // Create response object with all required fields
      const clientDetails = {
        id: clientResults[0].id,
        firstName: firstName,
        lastName: lastName,
        email: clientResults[0].email || "",
        phone: clientResults[0].phone || "",
        country: clientResults[0].country || "",
        postalCode: clientResults[0].postal_code || "",
      };

      console.log(`Details for client ID ${userId}:`, clientDetails);
      res.json({ client: clientDetails });
    });
  });
});

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

// ChatGPT

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
app.post("/api/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    const openaiResponse = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: "You are a helpful assistant." },
            { role: "user", content: userMessage },
          ],
          max_tokens: 20,
        }),
      }
    );

    const data = await openaiResponse.json();

    if (data.choices && data.choices[0].message) {
      res.json({ response: data.choices[0].message.content });
    } else {
      res.status(500).json({ error: "Invalid response from OpenAI" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to process request" });
  }
});

// Endpoint to fetch invoices
app.get("/api/invoices", (req, res) => {
  const userId = req.session.userId;
  console.log("Fetching invoices for user:", userId);

  const query =
    "SELECT id, store_name, amount, transaction_time FROM invoices WHERE user_id = ? ORDER BY transaction_time DESC";

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({
        status: "error",
        message: "Failed to fetch invoices from the database",
      });
    }

    console.log("Found invoices:", results.length);

    // Process data for client
    const invoices = results.map((row) => ({
      id: row.id,
      storeName: row.store_name,
      amount: row.amount,
      transactionTime: row.transaction_time,
      timeAgo: getTimeAgo(new Date(row.transaction_time)),
    }));

    res.json({
      status: "success",
      data: invoices,
    });
  });
});

// Helper function to calculate time ago
function getTimeAgo(date) {
  const now = new Date();
  const diffMs = now - date;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffDay > 0) {
    return diffDay === 1 ? "1 day ago" : `${diffDay} days ago`;
  } else if (diffHour > 0) {
    return diffHour === 1 ? "1 hour ago" : `${diffHour} hours ago`;
  } else if (diffMin > 0) {
    return diffMin === 1 ? "1 minute ago" : `${diffMin} minutes ago`;
  } else {
    return "Just now";
  }
}

app.get("/api/getStockApiKey", (req, res) => {
  // Store API key in environment variable instead of hardcoding
  res.json({ apiKey: process.env.ALPHA_VANTAGE_API_KEY });
});

// Helper function to execute queries with promises
const query = (sql, params) => {
  return new Promise((resolve, reject) => {
    db.execute(sql, params, (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
};

// GET all blogs
app.get("/api/blogs", async (req, res) => {
  try {
    const search = req.query.search || "";
    let sql = `
      SELECT b.*, u.name as author_name 
      FROM blogs b
      JOIN users u ON b.author_id = u.id
    `;

    let params = [];
    if (search) {
      sql += ` WHERE b.title LIKE ? OR b.content LIKE ? OR u.name LIKE ?`;
      const searchParam = `%${search}%`;
      params = [searchParam, searchParam, searchParam];
    }

    const rows = await query(sql, params);
    res.json(rows);
  } catch (error) {
    console.error("Error fetching blogs:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST a new blog
app.post("/api/blogs", async (req, res) => {
  try {
    const { title, content, author_id } = req.body;

    // Validate input
    if (!title || !content || !author_id) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    // Insert blog into database
    const result = await query(
      "INSERT INTO blogs (title, content, author_id) VALUES (?, ?, ?)",
      [title, content, author_id]
    );

    res.json({ success: true, id: result.insertId });
  } catch (error) {
    console.error("Error creating blog:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// DELETE a blog
app.delete("/api/blogs/:id", async (req, res) => {
  try {
    const blogId = req.params.id;
    const userId = req.body.userId;

    // Verify ownership
    const blogs = await query("SELECT author_id FROM blogs WHERE id = ?", [
      blogId,
    ]);

    if (blogs.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Blog not found" });
    }

    if (blogs[0].author_id != userId) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    // Delete blog
    await query("DELETE FROM blogs WHERE id = ?", [blogId]);

    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting blog:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// GET blog interactions for a user
app.get("/api/blogs/:id/interactions", async (req, res) => {
  try {
    const blogId = req.params.id;
    const userId = req.query.userId;

    if (!userId) {
      return res.json({ liked: false, disliked: false });
    }

    // Check if user has liked/disliked this blog
    const interactions = await query(
      "SELECT * FROM blog_interactions WHERE blog_id = ? AND user_id = ?",
      [blogId, userId]
    );

    if (interactions.length === 0) {
      return res.json({ liked: false, disliked: false });
    }

    res.json({
      liked: interactions[0].interaction_type === "like",
      disliked: interactions[0].interaction_type === "dislike",
    });
  } catch (error) {
    console.error("Error fetching blog interactions:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST like a blog
app.post("/api/blogs/:id/like", async (req, res) => {
  try {
    const blogId = req.params.id;
    const userId = req.body.userId;

    db.beginTransaction(async (err) => {
      if (err) throw err;

      try {
        // Check if user has already interacted with this blog
        const interactions = await query(
          "SELECT * FROM blog_interactions WHERE blog_id = ? AND user_id = ?",
          [blogId, userId]
        );

        if (interactions.length > 0) {
          // User has already interacted with this blog
          if (interactions[0].interaction_type === "like") {
            // User has already liked this blog, so remove the like
            await query(
              "DELETE FROM blog_interactions WHERE blog_id = ? AND user_id = ?",
              [blogId, userId]
            );

            await query("UPDATE blogs SET likes = likes - 1 WHERE id = ?", [
              blogId,
            ]);
          } else {
            // User has disliked this blog, so change to like
            await query(
              'UPDATE blog_interactions SET interaction_type = "like" WHERE blog_id = ? AND user_id = ?',
              [blogId, userId]
            );

            await query(
              "UPDATE blogs SET likes = likes + 1, dislikes = dislikes - 1 WHERE id = ?",
              [blogId]
            );
          }
        } else {
          // User has not interacted with this blog yet
          await query(
            'INSERT INTO blog_interactions (blog_id, user_id, interaction_type) VALUES (?, ?, "like")',
            [blogId, userId]
          );

          await query("UPDATE blogs SET likes = likes + 1 WHERE id = ?", [
            blogId,
          ]);
        }

        db.commit((err) => {
          if (err) throw err;
          res.json({ success: true });
        });
      } catch (error) {
        db.rollback(() => {
          throw error;
        });
      }
    });
  } catch (error) {
    console.error("Error liking blog:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// POST dislike a blog
app.post("/api/blogs/:id/dislike", async (req, res) => {
  try {
    const blogId = req.params.id;
    const userId = req.body.userId;

    db.beginTransaction(async (err) => {
      if (err) throw err;

      try {
        // Check if user has already interacted with this blog
        const interactions = await query(
          "SELECT * FROM blog_interactions WHERE blog_id = ? AND user_id = ?",
          [blogId, userId]
        );

        if (interactions.length > 0) {
          // User has already interacted with this blog
          if (interactions[0].interaction_type === "dislike") {
            // User has already disliked this blog, so remove the dislike
            await query(
              "DELETE FROM blog_interactions WHERE blog_id = ? AND user_id = ?",
              [blogId, userId]
            );

            await query(
              "UPDATE blogs SET dislikes = dislikes - 1 WHERE id = ?",
              [blogId]
            );
          } else {
            // User has liked this blog, so change to dislike
            await query(
              'UPDATE blog_interactions SET interaction_type = "dislike" WHERE blog_id = ? AND user_id = ?',
              [blogId, userId]
            );

            await query(
              "UPDATE blogs SET dislikes = dislikes + 1, likes = likes - 1 WHERE id = ?",
              [blogId]
            );
          }
        } else {
          // User has not interacted with this blog yet
          await query(
            'INSERT INTO blog_interactions (blog_id, user_id, interaction_type) VALUES (?, ?, "dislike")',
            [blogId, userId]
          );

          await query("UPDATE blogs SET dislikes = dislikes + 1 WHERE id = ?", [
            blogId,
          ]);
        }

        db.commit((err) => {
          if (err) throw err;
          res.json({ success: true });
        });
      } catch (error) {
        db.rollback(() => {
          throw error;
        });
      }
    });
  } catch (error) {
    console.error("Error disliking blog:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// GET comments for a blog
app.get("/api/blogs/:id/comments", async (req, res) => {
  try {
    const blogId = req.params.id;

    const comments = await query(
      `SELECT c.*, u.name as username
       FROM blog_comments c
       JOIN users u ON c.user_id = u.id
       WHERE c.blog_id = ?
       ORDER BY c.created_at DESC;`,
      [blogId]
    );

    res.json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST a comment
app.post("/api/blogs/:id/comments", async (req, res) => {
  try {
    const blogId = req.params.id;
    const { userId, text } = req.body;

    // Validate input
    if (!userId || !text) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    // Insert comment into database
    const result = await query(
      "INSERT INTO blog_comments (blog_id, user_id, text) VALUES (?, ?, ?)",
      [blogId, userId, text]
    );

    res.json({ success: true, id: result.insertId });
  } catch (error) {
    console.error("Error creating comment:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// DELETE a comment
app.delete("/api/comments/:id", async (req, res) => {
  try {
    const commentId = req.params.id;
    const userId = req.body.userId;

    // Verify ownership
    const comments = await query(
      "SELECT user_id FROM blog_comments WHERE id = ?",
      [commentId]
    );

    if (comments.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Comment not found" });
    }

    if (comments[0].user_id != userId) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    // Delete comment
    await query("DELETE FROM blog_comments WHERE id = ?", [commentId]);

    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

module.exports = app;

app.get("/api/auth/current-user", (req, res) => {
  if (req.session && req.session.userId) {
    res.json({
      authenticated: true,
      userId: req.session.userId
    });
  } else {
    res.json({
      authenticated: false,
      userId: null
    });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
