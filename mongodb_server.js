const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const path = require("path");
const cors = require("cors");
const crypto = require("crypto");
require("dotenv").config();

// Import Advisor Model
const Advisor = require("./models/Advisor");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || "ziko120204",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

// Set view engine and static files
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "public"));
app.use(express.static(path.join(__dirname, "public")));

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_ATLAS_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((error) => console.error("MongoDB connection error:", error));

// Utility function to hash password
const hashPassword = (password) => {
  return crypto.createHash("sha256").update(password).digest("hex");
};

// Routes
app.get("/", (req, res) => {
  res.redirect("/start_page.html");
});

app.post("/advisor-login", async (req, res) => {
  const { username, email, password } = req.body;

  // Determine login method (username or email)
  const loginIdentifier = username || email;
  const loginField = username ? "username" : "email";

  if (!loginIdentifier || !password) {
    return res.status(400).json({
      status: "error",
      message: "Login identifier and password are required",
    });
  }

  try {
    // Find advisor by username or email
    const advisor = await Advisor.findOne({
      [loginField]: loginIdentifier,
    });

    if (!advisor) {
      console.log(
        `Login attempt failed: No advisor found with ${loginField} ${loginIdentifier}`
      );
      return res.status(401).json({
        status: "error",
        message: "Invalid login credentials",
      });
    }

    // Hash the provided password
    const hashedPassword = hashPassword(password);

    // Compare passwords
    if (hashedPassword !== advisor.password) {
      console.log(
        `Login attempt failed: Incorrect password for advisor ${loginIdentifier}`
      );
      return res.status(401).json({
        status: "error",
        message: "Invalid login credentials",
      });
    }

    // Successful login logging
    console.log(`Advisor logged in successfully:`);
    console.log(`- Username: ${advisor.username}`);
    console.log(`- Email: ${advisor.email}`);
    console.log(`- Advisor ID: ${advisor._id}`);
    console.log(`- Number of Clients: ${advisor.number_of_clients}`);
    console.log(`- Login Timestamp: ${new Date().toISOString()}`);

    // Set session with more details
    req.session.advisorId = advisor._id;
    req.session.advisorUsername = advisor.username;
    req.session.advisorEmail = advisor.email;
    req.session.numberOfClients = advisor.number_of_clients;

    // Redirect to advisor dashboard
    return res.redirect("/advisor-dashboard");
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
});

// Dashboard route to use session information
app.get("/advisor-dashboard", (req, res) => {
  if (!req.session.advisorId) {
    return res.redirect("/login");
  }

  // Log session information for debugging
  console.log("Accessing Advisor Dashboard:");
  console.log(`- Advisor ID: ${req.session.advisorId}`);
  console.log(`- Username: ${req.session.advisorUsername}`);
  console.log(`- Email: ${req.session.advisorEmail}`);
  console.log(`- Number of Clients: ${req.session.numberOfClients}`);

  res.sendFile(path.join(__dirname, "public", "advisor-dashboard.html"));
});

// Advisor Registration Route
app.post("/advisor-register", async (req, res) => {
  const { username, name, email, password } = req.body;

  // Validate input
  if (!username || !name || !email || !password) {
    return res.status(400).json({
      status: "error",
      message: "All fields are required",
    });
  }

  try {
    // Check if username or email already exists
    const existingAdvisor = await Advisor.findOne({
      $or: [{ username }, { email }],
    });

    if (existingAdvisor) {
      return res.status(400).json({
        status: "error",
        message: "Username or email already exists",
      });
    }

    // Hash the password
    const hashedPassword = hashPassword(password);

    // Create new advisor
    const newAdvisor = new Advisor({
      username,
      name,
      email,
      password: hashedPassword,
      number_of_clients: 0,
    });

    // Save the advisor
    await newAdvisor.save();

    // Automatically log in the new advisor
    req.session.advisorId = newAdvisor._id;
    req.session.advisorUsername = newAdvisor.username;

    // Redirect to advisor dashboard
    return res.redirect("/advisor-dashboard");
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
});

// Logout Route
app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Logout error:", err);
    }
    res.redirect("/login");
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
