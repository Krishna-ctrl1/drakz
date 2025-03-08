const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const session = require("express-session");
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
  user: "root", // MySQL username
  password: "1234567890", // MySQL password
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

// API endpoint to get security alerts (demo data - replace with real alerts in production)
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

// Add this route handler for replying to messages
// In your server.js file, modify the reply endpoint:

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
// Add this endpoint to your server.js file

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

// Add these API routes to your server.js file

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
    SELECT * FROM user_investments 
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

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
