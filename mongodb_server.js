const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const path = require("path");
const cors = require("cors");
const crypto = require("crypto");
require("dotenv").config();
const fs = require("fs");
const app = express();
const multer = require("multer");
const { exec } = require("child_process");
const http = require('http');
const WebSocket = require('ws');

const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const Razorpay = require("razorpay");
const fetch = require("node-fetch");

// Model Imports
const ContactMessage = require('./models/save-contact-message');
const Advisor = require("./models/Advisor");
const Admin = require("./models/Admin");
const User = require("./models/User");
const Message = require("./models/Message");
const CreditCard = require("./models/CardCredit");
const CreditCardBill = require("./models/CreditCardBill");
const CreditScore = require("./models/CreditScore");
const Expense = require("./models/Expense");
const Holding = require("./models/Holding");
const ClientAdvisor = require("./models/ClientAdvisor");
const UserHoldings = require("./models/UserHoldings");
const Invoice = require("./models/Invoice");
const UserLoan = require("./models/UserLoan");
const UserTransaction = require("./models/UserTransaction");
const UserInsurancePolicy = require("./models/UserInsurancePolicy");
const UserPreciousHoldings = require("./models/UserPreciousHoldings");
const UserProperty = require("./models/UserProperties");
const UserStocks = require("./models/UserStocks");
const Blog = require("./models/Blog");

// =========================================================================
// NEW SCHEMAS FOR VIDEO SESSION
// =========================================================================
const sessionNoteSchema = new mongoose.Schema({
    advisor_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Advisor', required: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    note: { type: String, required: true },
    created_at: { type: Date, default: Date.now }
});
const SessionNote = mongoose.model('SessionNote', sessionNoteSchema);

const videoSchema = new mongoose.Schema({
    advisor_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Advisor', required: true },
    title: { type: String, required: true },
    // For YouTube videos
    videoId: { type: String, sparse: true, unique: true }, // sparse allows multiple nulls
    // For uploaded videos
    filename: { type: String },
    url: { type: String },
    created_at: { type: Date, default: Date.now }
});
const Video = mongoose.model('Video', videoSchema);
// =========================================================================

// Initialize express app first
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });


// Then configure it
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "public"));
app.use(cors());
app.use(bodyParser.json());
const port = 3000;

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
// Statically serve uploaded videos
app.use('/uploads/recorded-videos', express.static(path.join(__dirname, 'public', 'uploads', 'recorded-videos')));


// Middleware to parse form data (important for POST requests)
app.use(bodyParser.urlencoded({ extended: true }));

// WebSocket connection handling
wss.on('connection', ws => {
  console.log('Client connected for video session');

  ws.on('message', message => {
    const messageString = message.toString();
    console.log(`Received message => ${messageString}`);
    
    // Broadcast the message to all other clients
    wss.clients.forEach(client => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(messageString);
      }
    });
  });

  ws.on('close', () => {
    console.log('Client disconnected from video session');
  });
});


// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_ATLAS_URI, {
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
// ---------------------------------------------------------------------------------------------------------------------------------------------
// ADVISOR
// ---------------------------------------------------------------------------------------------------------------------------------------------

// API for Advisor Login
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

// API to get Client for the Advisor Dashboard
app.get("/api/advisor-clients", async (req, res) => {
  if (!req.session.advisorId) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  const advisorId = req.session.advisorId;

  try {
    // Import the updated models
    const ClientAdvisors = require("./models/Client");
    const User = require("./models/User");

    // Find clients for this advisor using the correct MongoDB structure
    const clientRelations = await ClientAdvisors.find({
      advisor_id: new mongoose.Types.ObjectId(advisorId),
    })
      .populate("user_id", "name email")
      .lean();

    // Format the results to match your expected structure
    const formattedClients = clientRelations.map((relation) => ({
      user_id: relation.user_id._id,
      name: relation.user_id.name,
      email: relation.user_id.email,
    }));

    console.log(`Clients for advisor ID ${advisorId}:`, formattedClients);
    res.json({ clients: formattedClients });
  } catch (err) {
    console.error("Error fetching clients:", err);
    return res.status(500).json({ error: "Database error" });
  }
});

// API to get the Client Details
app.get("/api/client-details/:userId", async (req, res) => {
  if (!req.session.advisorId) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  const advisorId = req.session.advisorId;
  const userId = req.params.userId;

  try {
    // Import required models
    const ClientAdvisors = require("./models/Client");
    const User = require("./models/User");
    const UserDetails = require("./models/UserDetails"); // Add this model if needed

    // First verify that this client is assigned to this advisor
    const relationship = await ClientAdvisors.findOne({
      advisor_id: new mongoose.Types.ObjectId(advisorId),
      user_id: new mongoose.Types.ObjectId(userId),
    });

    if (!relationship) {
      return res
        .status(403)
        .json({ error: "Not authorized to view this client" });
    }

    // Get basic user info
    const clientUser = await User.findById(userId).lean();

    if (!clientUser) {
      return res.status(404).json({ error: "Client not found" });
    }

    // Get user details from separate collection if it exists
    const userDetails =
      (await UserDetails.findOne({ user_id: userId }).lean()) || {};

    // Parse the client name into first and last name
    const fullName = clientUser.name || "";
    const nameParts = fullName.split(" ");
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    // Create response object combining both collections
    const clientDetails = {
      id: clientUser._id,
      firstName: firstName,
      lastName: lastName,
      email: clientUser.email || "",
      phone: userDetails.phone || "",
      country: userDetails.country || "",
      postalCode: userDetails.postal_code || "",
    };

    console.log(`Details for client ID ${userId}:`, clientDetails);
    res.json({ client: clientDetails });
  } catch (err) {
    console.error("Error fetching client details:", err);
    return res.status(500).json({ error: "Database error" });
  }
});

// API to get Stock & Investments of the Clients
app.get("/api/client-investments/:userId", async (req, res) => {
  if (!req.session.advisorId) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  const advisorId = req.session.advisorId;
  const userId = req.params.userId;

  try {
    // Import required models
    const ClientAdvisors = require("./models/Client");
    const UserStocks = require("./models/UserStocks");
    const UserInvestments = require("./models/UserInvestments");

    // First verify that this client is assigned to this advisor
    const relationship = await ClientAdvisors.findOne({
      advisor_id: new mongoose.Types.ObjectId(advisorId),
      user_id: new mongoose.Types.ObjectId(userId),
    });

    if (!relationship) {
      return res.status(403).json({
        error: "Not authorized to view this client's investments",
      });
    }

    // Get stocks and investments in parallel using Promise.all
    const [stocks, investments] = await Promise.all([
      // Get stocks
      UserStocks.find(
        { user_id: new mongoose.Types.ObjectId(userId) },
        { symbol: 1, price: 1, _id: 0 }
      ).lean(),

      // Get investments
      UserInvestments.find(
        { user_id: new mongoose.Types.ObjectId(userId) },
        { symbol: 1, price: 1, _id: 0 }
      ).lean(),
    ]);

    // Combine stocks and investments into a single array
    const combinedInvestments = [...stocks, ...investments];

    console.log(
      `Combined investments for user ID ${userId}:`,
      combinedInvestments
    );
    res.json({ investments: combinedInvestments });
  } catch (error) {
    console.error("Error fetching investment data:", error);
    res.status(500).json({ error: "Database error" });
  }
});

// Route to get client image by user ID
app.get("/api/client-image/:userId", (req, res) => {
  const userId = req.params.userId;

  // Query the database to find the image path for the given user ID
  const query = "SELECT image_path FROM images WHERE user_id = ?";

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).json({ error: "Failed to retrieve image" });
    }

    // If no image found, send default profile image
    if (results.length === 0) {
      return res.sendFile(
        path.join(
          __dirname,
          "public",
          "assets",
          "images",
          "default-profile.png"
        )
      );
    }

    const localImagePath = results[0].image_path;

    // Check if the file exists
    if (!fs.existsSync(localImagePath)) {
      return res.sendFile(
        path.join(
          __dirname,
          "public",
          "assets",
          "images",
          "default-profile.png"
        )
      );
    }

    // Serve the image
    res.sendFile(localImagePath);
  });
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

// ---------------------------------------------------------------------------------------------------------------------------------------------
// ADMIN
// ---------------------------------------------------------------------------------------------------------------------------------------------

// API Endpoint for Admin Login
app.post("/admin-login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    console.error("Missing email or password");
    return res.status(400).json({
      status: "error",
      message: "Email and password are required",
    });
  }

  try {
    // Find admin by email using the model
    const admin = await Admin.findOne({ email: email });

    if (!admin) {
      console.log(`Login attempt failed: No admin found with email ${email}`);
      return res.status(401).json({
        status: "error",
        message: "Invalid email or password",
      });
    }

    // Hash the provided password
    const hashedPassword = hashPassword(password);

    // Compare passwords
    if (hashedPassword !== admin.password) {
      console.log(
        `Login attempt failed: Incorrect password for admin ${email}`
      );
      return res.status(401).json({
        status: "error",
        message: "Invalid email or password",
      });
    }

    // Successful login logging
    console.log(`Admin logged in successfully:`);
    console.log(`- Email: ${admin.email}`);
    console.log(`- Admin ID: ${admin._id}`);
    console.log(`- Login Timestamp: ${new Date().toISOString()}`);

    // Set session with admin details
    req.session.adminId = admin._id;
    req.session.adminEmail = admin.email;
    req.session.adminName = admin.name;

    // Redirect to admin dashboard
    return res.redirect("/admin-dashboard");
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
});

// API Endpoint to fetch All the Users, Advisors and Admins for the Admin Dashboard
app.get("/api/all-users", async (req, res) => {
  try {
    // Fetch data from all three collections using Mongoose models
    const users = await User.find();
    const admins = await Admin.find();
    const advisors = await Advisor.find();

    // Process users data
    const formattedUsers = users.map((user) => ({
      id: user._id,
      firstName: user.name ? user.name.split(" ")[0] : "",
      lastName: user.name ? user.name.split(" ").slice(1).join(" ") : "",
      email: user.email,
      role: "standard",
      status: user.email_verified ? "active" : "pending",
      joinDate: user.created_at
        ? new Date(user.created_at).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })
        : "",
    }));

    // Process admins data
    const formattedAdmins = admins.map((admin) => ({
      id: admin._id,
      firstName: admin.name ? admin.name.split(" ")[0] : "",
      lastName: admin.name ? admin.name.split(" ").slice(1).join(" ") : "",
      email: admin.email,
      role: "admin",
      status: "active", // Assuming all admins are active
      joinDate: admin.created_at
        ? new Date(admin.created_at).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })
        : "",
    }));

    // Process advisors data
    const formattedAdvisors = advisors.map((advisor) => ({
      id: advisor._id,
      firstName: advisor.name ? advisor.name.split(" ")[0] : "",
      lastName: advisor.name ? advisor.name.split(" ").slice(1).join(" ") : "",
      email: advisor.email,
      role: "advisor",
      status: "active", // Assuming all advisors are active
      joinDate: advisor.created_at
        ? new Date(advisor.created_at).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })
        : "",
    }));

    // Combine all results
    const allUsers = [
      ...formattedUsers,
      ...formattedAdmins,
      ...formattedAdvisors,
    ];

    res.json(allUsers);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// API Endpoint to get all Users
app.get("/api/users", async (req, res) => {
  try {
    // Using Mongoose to fetch users instead of MySQL
    const users = await User.find().sort({ created_at: -1 });

    // Format the data to match the expected structure in the dashboard
    const formattedUsers = users.map((user) => {
      // Split the name into first and last name (assuming format is "First Last")
      const nameParts = user.name ? user.name.split(" ") : ["", ""];
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      return {
        id: user._id, // MongoDB uses _id as the primary key
        firstName: firstName,
        lastName: lastName,
        email: user.email,
        role: user.is_premium ? "premium" : "standard",
        status: user.email_verified ? "active" : "pending",
        joinDate: user.created_at
          ? new Date(user.created_at).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })
          : "",
        // Additional fields for detailed view
        monthlyIncome: user.monthly_income,
        employmentStatus: user.employment_status,
        financialGoals: user.financial_goals,
        riskTolerance: user.risk_tolerance,
      };
    });

    res.json(formattedUsers);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// API Endpoint to get the Advisors
app.get("/api/advisors", async (req, res) => {
  try {
    // Using Mongoose to fetch advisors instead of MySQL
    const advisors = await Advisor.find().sort({ created_at: -1 });

    // Format the data to match the expected structure
    const formattedAdvisors = advisors.map((advisor) => {
      const nameParts = advisor.name ? advisor.name.split(" ") : ["", ""];
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      return {
        id: advisor._id, // MongoDB uses _id as the primary key
        firstName: firstName,
        lastName: lastName,
        email: advisor.email,
        username: advisor.username,
        role: "advisor",
        status: "active",
        joinDate: advisor.created_at
          ? new Date(advisor.created_at).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })
          : "",
      };
    });

    res.json(formattedAdvisors);
  } catch (err) {
    console.error("Error fetching advisors:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// API endpoint to update user status (active/suspended)
app.put("/api/users/:id/status", async (req, res) => {
  try {
    const userId = req.params.id;
    console.log(userId);
    const { status } = req.body;

    if (!status || !["active", "pending", "suspended"].includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    // Check if userId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID format" });
    }

    // Convert status to email_verified value
    const emailVerified = status === "active";

    // Update the user
    const result = await User.findByIdAndUpdate(
      userId,
      { email_verified: emailVerified },
      { new: true }
    );

    if (!result) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ success: true, message: "User status updated successfully" });
  } catch (err) {
    console.error("Error updating user status:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// API endpoint to add a new user
app.post("/api/users", async (req, res) => {
  try {
    const { firstName, lastName, email, password, role } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Combine first and last name
    const fullName = `${firstName} ${lastName}`;

    // Hash the password
    const hashedPassword = hashPassword(password);

    // Generate username from email (before the @)
    const username = email.split("@")[0];

    let newUser;

    // Determine which model to use based on role
    if (role === "admin") {
      // Check if email already exists
      const existingAdmin = await Admin.findOne({ email });
      if (existingAdmin) {
        return res.status(409).json({ error: "Email already exists" });
      }

      newUser = new Admin({
        name: fullName,
        email: email,
        password: hashedPassword,
        username: username,
        created_at: new Date(),
      });

      await newUser.save();
    } else if (role === "advisor") {
      // Check if email already exists
      const existingAdvisor = await Advisor.findOne({ email });
      if (existingAdvisor) {
        return res.status(409).json({ error: "Email already exists" });
      }

      newUser = new Advisor({
        name: fullName,
        email: email,
        password: hashedPassword,
        username: username,
        created_at: new Date(),
        number_of_clients: 0,
      });

      await newUser.save();
    } else {
      // Regular user
      // Check if email already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(409).json({ error: "Email already exists" });
      }

      newUser = new User({
        name: fullName,
        email: email,
        password: hashedPassword,
        email_verified: true,
        is_premium: false,
        created_at: new Date(),
      });

      await newUser.save();
    }

    res.status(201).json({
      success: true,
      message: "User added successfully",
      userId: newUser._id,
    });
  } catch (err) {
    console.error("Error adding new user:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// ---------------------------------------------------------------------------------------------------------------------------------------------
// CONTACT US
// ---------------------------------------------------------------------------------------------------------------------------------------------

// API to fetch all contact messages
app.get('/api/messages', async (req, res) => {
  console.log('Received request for /api/messages');
  try {
    const messages = await ContactMessage.find()
      .sort({ submission_date: -1 })
      .lean();
    console.log('Queried collection:', ContactMessage.collection.collectionName);
    const formattedMessages = messages.map(msg => ({
      id: msg._id.toString(),
      name: msg.name,
      email: msg.email,
      phone: msg.phone,
      subject: msg.subject,
      message: msg.message,
      submission_date: msg.submission_date,
      is_read: msg.is_read,
      is_replied: msg.is_replied
    }));
    console.log('Fetched contact messages:', formattedMessages.length, formattedMessages);
    res.json({ success: true, messages: formattedMessages });
  } catch (err) {
    console.error('Error fetching contact messages:', err);
    return res.status(500).json({ success: false, message: 'Database error' });
  }
});

// API to save contact message
app.post('/api/save-contact-message', async (req, res) => {
  console.log('Received request for /api/save-contact-message', req.body);
  try {
    const { name, email, phone, subject, message, submission_date } = req.body;
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }
    const newMessage = new ContactMessage({
      name,
      email,
      phone: phone || '',
      subject,
      message,
      submission_date: submission_date ? new Date(submission_date) : new Date(),
      is_read: false,
      is_replied: false
    });
    await newMessage.save();
    console.log(`New contact message saved from ${email} with subject: ${subject}`);
    res.json({ success: true, message: 'Message saved successfully' });
  } catch (err) {
    console.error('Error saving contact message:', err);
    return res.status(500).json({ success: false, message: 'Database error: Unable to save message' });
  }
});

// API to send a reply to a message
app.post('/api/messages/reply', async (req, res) => {
  console.log('Received request for /api/messages/reply', req.body);
  try {
    const { id, to, subject, message } = req.body;
    if (!id || !to || !subject || !message) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }
    const contactMessage = await ContactMessage.findById(id);
    if (!contactMessage) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }
    contactMessage.is_replied = true;
    contactMessage.is_read = true;
    await contactMessage.save();
    console.log(`Reply sent to ${to} with subject: ${subject}`);
    res.json({ success: true, message: 'Reply sent successfully' });
  } catch (err) {
    console.error('Error sending reply:', err);
    return res.status(500).json({ success: false, message: 'Database or server error' });
  }
});

// API to mark a message as read
app.post('/api/messages/mark-read', async (req, res) => {
  console.log('Received request for /api/messages/mark-read', req.body);
  try {
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({ success: false, message: 'Message ID is required' });
    }
    const contactMessage = await ContactMessage.findById(id);
    if (!contactMessage) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }
    contactMessage.is_read = true;
    await contactMessage.save();
    console.log(`Message ${id} marked as read`);
    res.json({ success: true, message: 'Message marked as read' });
  } catch (err) {
    console.error('Error marking message as read:', err);
    return res.status(500).json({ success: false, message: 'Database error' });
  }
});

// ---------------------------------------------------------------------------------------------------------------------------------------------
// USER LOGIN
// ---------------------------------------------------------------------------------------------------------------------------------------------

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // Basic validation
  if (!email || !password) {
    return res.status(400).json({
      status: "error",
      message: "Email and password are required",
    });
  }

  try {
    const hashedPassword = hashPassword(password);

    // Find user with matching email and password
    const user = await User.findOne({
      email: email,
      password: hashedPassword,
    });

    if (!user) {
      return res.status(401).json({
        status: "error",
        message: "Invalid email or password",
      });
    }

    // User found, set session and redirect to dashboard
    req.session.userId = user._id;
    console.log("Login successful for user:", email);
    console.log("User Id: ", req.session.userId);

    // For AJAX requests, redirect will be handled by the client
    res.redirect("/dashboard");
  } catch (err) {
    console.error("Database error during login:", err);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
});

// ---------------------------------------------------------------------------------------------------------------------------------------------
// DASHBOARD
// ---------------------------------------------------------------------------------------------------------------------------------------------

// Dashboard API endpoint
app.get("/api/dashboard", async (req, res) => {
  // Ensure the user is logged in
  const userId = req.session.userId;
  console.log("Session userId:", userId);

  // Set content type
  res.setHeader("Content-Type", "application/json");

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized. Please log in." });
  }

  try {
    // Create an object to store all dashboard data
    const dashboardData = {};

    // Get basic user details
    const user = await mongoose.model("User").findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    dashboardData.user = user;

    // Create MongoDB ObjectId from the userId string
    const userObjectId = new mongoose.Types.ObjectId(userId);

    // Log the ObjectId we're using for queries
    console.log("Using ObjectId for queries:", userObjectId);

    // Define the collections to query based on your MongoDB collection names
    const collections = {
      creditScores: "user_credit_scores",
      creditCards: "user_credit_cards",
      expenses: "user_expenses",
      holdings: "user_holdings",
    };

    // Get credit scores
    dashboardData.creditScores = await mongoose.connection
      .collection(collections.creditScores)
      .find({ user_id: userObjectId })
      .toArray();

    // Get credit cards
    dashboardData.creditCards = await mongoose.connection
      .collection(collections.creditCards)
      .find({ user_id: userObjectId })
      .toArray();

    // Get expenses
    dashboardData.expenses = await mongoose.connection
      .collection(collections.expenses)
      .find({ user_id: userObjectId })
      .toArray();

    // Get holdings (single document)
    dashboardData.holdings = await mongoose.connection
      .collection(collections.holdings)
      .findOne({ user_id: userObjectId });

    // Check if we're getting data or empty results
    console.log("Credit Cards found:", dashboardData.creditCards.length);
    console.log("Credit Scores found:", dashboardData.creditScores.length);
    console.log("Expenses found:", dashboardData.expenses.length);
    console.log("Holdings found:", dashboardData.holdings ? "Yes" : "No");

    // Send all the data as JSON
    res.json(dashboardData);
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).json({
      error: "Database error",
      details: error.message,
    });
  }
});

app.get("/api/user/premium-status", async (req, res) => {
  console.log("🔍 Premium status endpoint called");

  // Ensure the user is logged in
  const userId = req.session.userId;
  console.log("👤 Session userId:", userId);

  // Set content type header
  res.setHeader("Content-Type", "application/json");

  // Check if user is authenticated
  if (!userId) {
    console.log("❌ Authentication failed: No userId in session");
    return res.status(401).json({
      success: false,
      error: "Unauthorized. Please log in.",
    });
  }

  try {
    console.log("🔎 Looking up user with ID:", userId);

    // Query only the is_premium field from the User model
    const user = await mongoose
      .model("User")
      .findById(userId)
      .select("is_premium")
      .lean(); // Convert to plain JavaScript object for better performance

    console.log("👥 User lookup result:", user ? "Found" : "Not found");

    if (user) {
      console.log("💎 User premium status:", user.is_premium);
    }

    if (!user) {
      console.log("❌ User not found in database");
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    // Return just the premium status - handling boolean value
    const response = {
      success: true,
      isPremium: Boolean(user.is_premium),
    };
    console.log("✅ Sending response:", response);
    return res.json(response);
  } catch (error) {
    console.error("❌ Error fetching premium status:", error);
    return res.status(500).json({
      success: false,
      error: "Server error",
      details: error.message,
    });
  }
});

// Credit card API endpoint
app.post("/api/credit-cards", async (req, res) => {
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
    card_network,
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
      card_network,
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

  try {
    // Create new credit card document
    const newCreditCard = new CreditCard({
      user_id: userId,
      card_number: sanitizedCardNumber,
      cardholder_name,
      valid_from,
      valid_thru,
      bank_name: bank_name || "Unknown Bank",
      card_type: card_type || "credit",
      card_network: card_network || "Unknown",
    });

    // Save the credit card to database
    const savedCard = await newCreditCard.save();
    console.log("Card added successfully, result:", savedCard);

    // Return success response
    res.status(201).json({
      success: true,
      message: "Credit card added successfully",
      cardId: savedCard._id,
    });
  } catch (error) {
    console.error("Database error adding credit card:", error);
    return res.status(500).json({
      error: "Failed to add credit card",
      details: error.message,
    });
  }
});

// DELETE endpoint for credit cards
app.delete("/api/credit-cards/:id", async (req, res) => {
  if (!req.session || !req.session.userId) {
    return res
      .status(401)
      .json({ error: "You must be logged in to delete a credit card" });
  }

  const userId = req.session.userId;
  const cardId = req.params.id;

  try {
    // First verify the card belongs to this user
    const card = await CreditCard.findOne({ _id: cardId, user_id: userId });

    if (!card) {
      return res.status(404).json({
        error: "Card not found or you don't have permission to delete it",
      });
    }

    // If verification passed, delete the card
    await CreditCard.deleteOne({ _id: cardId, user_id: userId });

    res.json({ success: true, message: "Credit card deleted successfully" });
  } catch (error) {
    console.error("Database error with credit card deletion:", error);
    return res.status(500).json({
      error: "Failed to delete credit card",
      details: error.message,
    });
  }
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

// Premium upgrade endpoint
app.post("/api/upgrade-to-premium", async (req, res) => {
  // Ensure the user is logged in
  const userId = req.session.userId;

  console.log("Upgrade request received for user ID:", userId);

  if (!userId) {
    console.log("Authentication failed: No user ID in session");
    return res
      .status(401)
      .json({ success: false, error: "Unauthorized. Please log in." });
  }

  // Using Mongoose transactions
  let session;
  try {
    session = await mongoose.startSession();
    session.startTransaction();

    console.log("Starting transaction for user:", userId);

    // 1. Update the user's premium status
    console.log("Updating user premium status for ID:", userId);
    
    // First verify the user exists
    const userCheck = await User.findById(userId).session(session);
    if (!userCheck) {
      console.log("User not found with ID:", userId);
      await session.abortTransaction();
      return res.status(404).json({ success: false, error: "User not found" });
    }
    
    console.log("Current user premium status:", userCheck.is_premium);
    
    // Use updateOne instead of findByIdAndUpdate for more direct control
    const updateResult = await User.updateOne(
      { _id: userId },
      { $set: { is_premium: true } },
      { session }
    );
    
    console.log("Update result:", updateResult);
    
    if (updateResult.matchedCount === 0) {
      console.log("No user matched for update");
      await session.abortTransaction();
      return res.status(404).json({ success: false, error: "User not found" });
    }
    
    if (updateResult.modifiedCount === 0) {
      console.log("User found but not modified. May already be premium.");
      // Continue with the process since the user exists
    } else {
      console.log("User premium status updated successfully");
    }
    
    // Re-fetch the user to get the updated document
    const user = await User.findById(userId).session(session);
    console.log("Updated user premium status:", user.is_premium);

    // 2. Find an advisor with fewer than 5 clients
    console.log("Looking for available advisor");
    
    // First, get all advisors
    const allAdvisors = await Advisor.find({}).session(session);
    console.log(`Found ${allAdvisors.length} total advisors`);
    
    let advisor = null;
    
    if (allAdvisors.length === 0) {
      console.log("No advisors found in the database");
      // Continue without an advisor
    } else {
      // Get client counts for each advisor - don't use session here as it might be causing issues
      const clientCountsResult = await ClientAdvisor.aggregate([
        {
          $group: {
            _id: "$advisor_id",
            client_count: { $sum: 1 }
          }
        }
      ]);
      
      console.log("Client counts result:", JSON.stringify(clientCountsResult));
      
      // Create a map of advisor ID to client count
      const advisorClientMap = {};
      clientCountsResult.forEach(item => {
        if (item._id) {
          advisorClientMap[item._id.toString()] = item.client_count;
        }
      });
      
      console.log("Advisor client map:", advisorClientMap);
      
      // Find advisors with fewer than 5 clients
      let availableAdvisors = allAdvisors.filter(advisor => {
        const clientCount = advisorClientMap[advisor._id.toString()] || 0;
        console.log(`Advisor ${advisor._id} has ${clientCount} clients`);
        return clientCount < 5;
      });
      
      console.log(`Found ${availableAdvisors.length} available advisors with fewer than 5 clients`);
      
      // If we found available advisors with fewer than 5 clients
      if (availableAdvisors && availableAdvisors.length > 0) {
        // Sort by client count (those with fewer clients first)
        availableAdvisors.sort((a, b) => {
          const countA = advisorClientMap[a._id.toString()] || 0;
          const countB = advisorClientMap[b._id.toString()] || 0;
          return countA - countB;
        });
        
        // Select the advisor with the fewest clients
        advisor = availableAdvisors[0];
        console.log(`Selected advisor: ${advisor._id} (${advisor.name})`);
        
        try {
          // Check if this user is already assigned to this advisor
          const existingRelationship = await ClientAdvisor.findOne({
            advisor_id: advisor._id,
            user_id: userId
          }).session(session);
          
          if (existingRelationship) {
            console.log("User already assigned to this advisor");
          } else {
            // Create new client-advisor relationship
            const clientAdvisorDoc = {
              advisor_id: advisor._id,
              user_id: userId
            };
            
            await ClientAdvisor.create([clientAdvisorDoc], { session });
            console.log("New client-advisor relationship created");
          }
        } catch (relationshipError) {
          console.error("Error creating client-advisor relationship:", relationshipError);
          throw relationshipError; // Re-throw to be caught by outer catch block
        }
      } else {
        console.log("No advisors with less than 5 clients found");
      }
    }

    // 5. Commit the transaction
    await session.commitTransaction();
    console.log("Transaction committed successfully");

    // 6. Send confirmation email if advisor was assigned
    if (advisor) {
      try {
        sendConfirmationEmail(user, advisor);
        console.log("Confirmation email sent");
      } catch (emailError) {
        console.error("Failed to send confirmation email:", emailError);
        // Don't fail the entire request if just the email fails
      }

      // 7. Return success with advisor details
      return res.json({
        success: true,
        advisor: {
          name: advisor.name,
          email: advisor.email,
        },
      });
    } else {
      // Success but no advisor available
      return res.json({ success: true });
    }
  } catch (error) {
    // Abort transaction on error
    if (session) {
      await session.abortTransaction();
    }
    console.error("Error in premium upgrade transaction:", error);
    return res.status(500).json({ 
      success: false, 
      error: `Database error: ${error.message || "Unknown error"}` 
    });
  } finally {
    if (session) {
      session.endSession();
    }
  }
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

// ---------------------------------------------------------------------------------------------------------------------------------------------
// ACCOUNTS
// ---------------------------------------------------------------------------------------------------------------------------------------------

// Middleware to check authentication
const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.userId) {
    return next();
  }
  return res
    .status(401)
    .json({ status: "error", message: "Not authenticated" });
};

app.get("/api/user/weekly-activity", isAuthenticated, async (req, res) => {
  try {
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

    console.log(
      "Week date range:",
      startOfWeek.toISOString(),
      "to",
      endOfWeek.toISOString()
    );

    // Get the UserTransaction model
    const UserTransaction = mongoose.model("UserTransaction");

    // Query all transactions for this user within the date range
    const transactions = await UserTransaction.find({
      user_id: new mongoose.Types.ObjectId(userId),
      transaction_datetime: { $gte: startOfWeek, $lte: endOfWeek },
    });

    console.log(`Found ${transactions.length} transactions for the week`);

    // Initialize arrays for the whole week (Sunday to Saturday)
    const depositValues = [0, 0, 0, 0, 0, 0, 0];
    const withdrawValues = [0, 0, 0, 0, 0, 0, 0];
    const weekDates = [];

    // Generate dates for the week
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      weekDates.push(date.toISOString().split("T")[0]); // Format as YYYY-MM-DD
    }

    // Process the transactions
    transactions.forEach((transaction) => {
      const txDate = new Date(transaction.transaction_datetime);
      const dayOfWeek = txDate.getDay(); // 0 = Sunday, 1 = Monday, etc.

      if (transaction.amount > 0) {
        depositValues[dayOfWeek] += transaction.amount;
      } else {
        withdrawValues[dayOfWeek] += Math.abs(transaction.amount);
      }
    });

    console.log("Processed deposit values:", depositValues);
    console.log("Processed withdraw values:", withdrawValues);

    // Check if there's any data for the week
    const hasTransactions =
      depositValues.some((val) => val > 0) ||
      withdrawValues.some((val) => val > 0);

    if (!hasTransactions) {
      console.log("No transactions found for the week");
      // If you want to add test data for visualization, you could do it here
    }

    // Send the data
    res.json({
      status: "success",
      data: {
        weekDates,
        depositValues,
        withdrawValues,
      },
    });
  } catch (err) {
    console.error("Error processing weekly activity:", err);
    res.status(500).json({
      status: "error",
      message: "Failed to process weekly activity",
    });
  }
});

// Alternative implementation using Mongoose aggregation
app.get("/api/user/weekly-activity", isAuthenticated, async (req, res) => {
  try {
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

    console.log(
      "Week date range:",
      startOfWeek.toISOString(),
      "to",
      endOfWeek.toISOString()
    );

    // Get the UserTransaction model
    const UserTransaction = mongoose.model("UserTransaction");

    // MongoDB aggregation pipeline to get daily totals
    const dailyTotals = await UserTransaction.aggregate([
      // Match transactions for this user in the date range
      {
        $match: {
          user_id: new mongoose.Types.ObjectId(userId),
          transaction_datetime: { $gte: startOfWeek, $lte: endOfWeek },
        },
      },
      // Group by date and calculate deposit and withdrawal totals
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$transaction_datetime",
            },
          },
          depositTotal: {
            $sum: {
              $cond: [{ $gt: ["$amount", 0] }, "$amount", 0],
            },
          },
          withdrawTotal: {
            $sum: {
              $cond: [{ $lt: ["$amount", 0] }, { $abs: "$amount" }, 0],
            },
          },
        },
      },
      // Sort by date
      {
        $sort: { _id: 1 },
      },
    ]);

    console.log("Aggregation results:", dailyTotals);

    // Initialize arrays for the whole week (Sunday to Saturday)
    const depositValues = [0, 0, 0, 0, 0, 0, 0];
    const withdrawValues = [0, 0, 0, 0, 0, 0, 0];
    const weekDates = [];

    // Generate dates for the week
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      weekDates.push(date.toISOString().split("T")[0]); // Format as YYYY-MM-DD
    }

    // Map the aggregation results to the correct day of the week
    dailyTotals.forEach((day) => {
      const dayDate = new Date(day._id);
      const dayOfWeek = dayDate.getDay();

      depositValues[dayOfWeek] = day.depositTotal;
      withdrawValues[dayOfWeek] = day.withdrawTotal;
    });

    console.log("Processed deposit values:", depositValues);
    console.log("Processed withdraw values:", withdrawValues);

    // Send the data
    res.json({
      status: "success",
      data: {
        weekDates,
        depositValues,
        withdrawValues,
      },
    });
  } catch (err) {
    console.error("Error processing weekly activity:", err);
    res.status(500).json({
      status: "error",
      message: "Failed to process weekly activity",
    });
  }
});

// API route to fetch user profile data
app.get("/api/user/profile", async (req, res) => {
  try {
    // Check if user is logged in
    if (!req.session.userId) {
      return res.status(401).json({
        status: "error",
        message: "Unauthorized - Please log in",
      });
    }

    // Get the User model
    const User = mongoose.model("User");

    // Query the user by ID, excluding the password field
    const user = await User.findById(req.session.userId).select(
      "name email monthly_income employment_status financial_goals risk_tolerance aadhaar_number pan_number created_at"
    );

    // Check if user exists
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    // Return user profile data
    res.json({
      status: "success",
      data: user,
    });
  } catch (err) {
    console.error("Error fetching user profile:", err);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
});

// API route to fetch user holdings
app.get("/api/user/holdings", async (req, res) => {
  try {
    // Check if user is logged in
    if (!req.session.userId) {
      return res.status(401).json({
        status: "error",
        message: "Unauthorized - Please log in",
      });
    }

    // Get the UserHolding model
    const UserHolding = mongoose.model("UserHoldings");

    // Query the user holdings by user ID
    const holdings = await UserHolding.findOne({ user_id: req.session.userId });

    // If no holding records found, return defaults
    if (!holdings) {
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

    // Return user holdings data
    res.json({
      status: "success",
      data: holdings,
    });
  } catch (err) {
    console.error("Error fetching user holdings:", err);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
});

// API route to fetch user loans
app.get("/api/user/loans", async (req, res) => {
  try {
    // Check if user is logged in
    if (!req.session.userId) {
      return res.status(401).json({
        status: "error",
        message: "Unauthorized - Please log in",
      });
    }

    // Get the UserLoan model
    const UserLoan = mongoose.model("UserLoan");

    // Query the user loans by user ID
    const loans = await UserLoan.find({ user_id: req.session.userId }).select(
      "loan_type principal_amount remaining_balance interest_rate loan_term emi_amount loan_taken_on next_payment_due total_paid status"
    );

    // Return user loans data
    res.json({
      status: "success",
      data: loans,
    });
  } catch (err) {
    console.error("Error fetching user loans:", err);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
});

// API route to fetch user transactions
app.get("/api/user/transactions", async (req, res) => {
  try {
    // Check if user is logged in
    if (!req.session.userId) {
      return res.status(401).json({
        status: "error",
        message: "Unauthorized - Please log in",
      });
    }

    // Get limit from query parameter or use default
    const limit = parseInt(req.query.limit) || 10;

    // Get the UserTransaction model
    const UserTransaction = mongoose.model("UserTransaction");

    // Query the user transactions by user ID with limit and ordering
    const transactions = await UserTransaction.find({
      user_id: req.session.userId,
    })
      .sort({ transaction_datetime: -1 })
      .limit(limit);

    // Return user transactions data
    res.json({
      status: "success",
      data: transactions,
    });
  } catch (err) {
    console.error("Error fetching user transactions:", err);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
});

// Endpoint to fetch invoices
app.get("/api/invoices", async (req, res) => {
  try {
    const userId = req.session.userId;
    console.log("Fetching invoices for user:", userId);

    // Get the Invoice model
    const Invoice = mongoose.model("Invoice");

    // Query invoices for the user and sort by transaction_time descending
    const results = await Invoice.find({ user_id: userId })
      .sort({ transaction_time: -1 })
      .select("id store_name amount transaction_time");

    console.log("Found invoices:", results.length);

    // Process data for client
    const invoices = results.map((invoice) => ({
      id: invoice._id || invoice.id, // Using MongoDB's _id or custom id field if present
      storeName: invoice.store_name,
      amount: invoice.amount,
      transactionTime: invoice.transaction_time,
      timeAgo: getTimeAgo(new Date(invoice.transaction_time)),
    }));

    res.json({
      status: "success",
      data: invoices,
    });
  } catch (err) {
    console.error("Database error:", err);
    return res.status(500).json({
      status: "error",
      message: "Failed to fetch invoices from the database",
    });
  }
});

// Helper function for timeAgo calculations
function getTimeAgo(date) {
  const seconds = Math.floor((new Date() - date) / 1000);

  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " years ago";

  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " months ago";

  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " days ago";

  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hours ago";

  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " minutes ago";

  return Math.floor(seconds) + " seconds ago";
}

// ---------------------------------------------------------------------------------------------------------------------------------------------
// INVESTMENTS
// ---------------------------------------------------------------------------------------------------------------------------------------------

// API endpoint to get stock API key
app.get("/api/getStockApiKey", (req, res) => {
  // Store API key in environment variable instead of hardcoding
  res.json({ apiKey: process.env.ALPHA_VANTAGE_API_KEY });
});

// API endpoint to get user investments
app.get("/api/user-investments", async (req, res) => {
  try {
    // Check if user is logged in
    if (!req.session.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const UserStocks = mongoose.model("UserStocks");

    // Query to get user investments
    const userStocks = await UserStocks.find({ user_id: req.session.userId });

    // Send the investment data as JSON
    res.json(userStocks);
  } catch (err) {
    console.error("Error fetching user investments:", err);
    return res.status(500).json({ error: "Database error" });
  }
});

// ---------------------------------------------------------------------------------------------------------------------------------------------
// CREDIT CARDS
// ---------------------------------------------------------------------------------------------------------------------------------------------

app.get("/api/user-credit-cards", async (req, res) => {
  try {
    // Check if user is logged in
    if (!req.session || !req.session.userId) {
      return res
        .status(401)
        .json({ error: "You must be logged in to view credit cards" });
    }

    const userId = req.session.userId;

    // Query to fetch user's credit cards
    const creditCards = await CreditCard.find({
      user_id: userId,
      card_type: "credit",
    }).select(
      "card_number cardholder_name valid_from valid_thru bank_name card_type card_network"
    );

    // Return the cards
    res.status(200).json(creditCards);
  } catch (error) {
    console.error("Database error fetching credit cards:", error);
    return res.status(500).json({
      error: "Failed to retrieve credit cards",
      details: error.message,
    });
  }
});

// Get credit card bill for a specific card
// Get credit card bill for a specific card
app.get("/api/credit-card-bill", async (req, res) => {
  const userId = req.session.userId;
  const { cardNumber } = req.query;

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  if (!cardNumber) {
    return res.status(400).json({ error: "Card number is required" });
  }

  try {
    console.log("Session userId:", userId, "Requested cardNumber:", cardNumber);

    // Validate userId format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      console.log("Invalid userId format:", userId);
      return res.status(400).json({ error: "Invalid user ID format" });
    }

    // Convert userId to ObjectId
    const objectId = new mongoose.Types.ObjectId(userId);

    // Trim cardNumber to handle potential whitespace
    const cleanedCardNumber = cardNumber.trim();

    console.log("Querying with userId:", objectId.toString(), "cleanedCardNumber:", cleanedCardNumber);

    // Query user_id as ObjectId
    const bill = await CreditCardBill.findOne({
      user_id: objectId,
      card_number: cleanedCardNumber,
    });

    if (!bill) {
      console.log("No bill found for userId:", userId, "cardNumber:", cleanedCardNumber);
      // Debug: Try regex query for card_number
      const regexBill = await CreditCardBill.findOne({
        user_id: objectId,
        card_number: { $regex: `^${cleanedCardNumber}$`, $options: "i" }
      });
      console.log("Regex query result:", regexBill ? regexBill : "No match with regex");
      // Debug: Log all bills for this user
      const userBills = await CreditCardBill.find({ user_id: objectId });
      console.log("All bills for userId:", userId, userBills);
      return res.status(404).json({ error: "Bill not found for this card" });
    }

    res.json({
      current_bill: bill.current_bill,
      minimum_amount_due: bill.minimum_amount_due,
      due_date: bill.due_date.toISOString().split("T")[0],
      status: bill.status,
    });
  } catch (error) {
    console.error("Error fetching credit card bill:", error);
    res.status(500).json({ error: "Failed to fetch bill details" });
  }
});

app.get("/api/bank-expenses", async (req, res) => {
  try {
    if (!req.session || !req.session.userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const userId = new mongoose.Types.ObjectId(req.session.userId);

    const results = await CreditCardBill.aggregate([
      {
        $match: { user_id: userId },
      },
      {
        $lookup: {
          from: "credit_card_bills",
          localField: "card_number",
          foreignField: "card_number",
          as: "card_details",
        },
      },
      {
        $unwind: "$card_details",
      },
      {
        $match: {
          "card_details.user_id": userId,
        },
      },
      {
        $group: {
          _id: "$card_details.bank_name",
          total_expense: { $sum: "$current_bill" },
        },
      },
      {
        $sort: { total_expense: -1 },
      },
    ]);

    const bankNames = results.map((item) => item._id);
    const expenses = results.map((item) => item.total_expense);

    const colors = [
      "#3b82f6",
      "#38bdf8",
      "#06b6d4",
      "#4f46e5",
      "#6366f1",
      "#a855f7",
      "#ec4899",
    ];

    res.status(200).json({
      labels: bankNames,
      datasets: [
        {
          data: expenses,
          backgroundColor: colors.slice(0, bankNames.length),
          borderWidth: 2,
        },
      ],
    });
  } catch (error) {
    console.error("MongoDB error fetching bank expenses:", error);
    res.status(500).json({
      error: "Failed to retrieve bank expenses",
      details: error.message,
    });
  }
});

app.get("/api/credit-card-bill", async (req, res) => {
  if (!req.session || !req.session.userId) {
    return res
      .status(401)
      .json({ error: "You must be logged in to view credit card bills" });
  }

  const userId = req.session.userId;
  const creditCardNumber = req.query.cardNumber;

  try {
    const bill = await CreditCardBill.findOne({
      user_id: userId,
      card_number: creditCardNumber,
    })
      .sort({ due_date: -1 })
      .select("current_bill minimum_amount_due due_date");

    if (!bill) {
      return res
        .status(404)
        .json({ error: "No bill found for this credit card" });
    }

    res.status(200).json(bill);
  } catch (error) {
    console.error("Database error fetching credit card bill:", error);
    res.status(500).json({
      error: "Failed to retrieve credit card bill",
      details: error.message,
    });
  }
});

app.get("/api/credit-card-dues", async (req, res) => {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const userId = new mongoose.Types.ObjectId(req.session.userId);

  try {
    const results = await CreditCardBill.aggregate([
      {
        $match: { user_id: userId },
      },
      {
        $lookup: {
          from: "user_credit_cards", // This should match your actual collection name
          let: { cardNumber: "$card_number", userId: "$user_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$card_number", "$$cardNumber"] },
                    { $eq: ["$user_id", "$$userId"] },
                  ],
                },
              },
            },
          ],
          as: "card_details",
        },
      },
      {
        $unwind: "$card_details",
      },
      {
        $project: {
          cardholder_name: "$card_details.cardholder_name",
          masked_card_number: {
            $concat: [
              { $substr: ["$card_number", 0, 4] },
              " **** **** ",
              {
                $substr: [
                  "$card_number",
                  { $subtract: [{ $strLenCP: "$card_number" }, 4] },
                  4,
                ],
              },
            ],
          },
          current_bill: 1,
          minimum_amount_due: 1,
          formatted_due_date: {
            $dateToString: { format: "%d/%m/%Y", date: "$due_date" },
          },
          status: 1,
        },
      },
      {
        $sort: { due_date: 1 },
      },
    ]);

    res.status(200).json(results);
  } catch (error) {
    console.error("Error fetching credit card dues:", error);
    res.status(500).json({
      error: "Failed to retrieve credit card dues",
      details: error.message,
    });
  }
});

// ---------------------------------------------------------------------------------------------------------------------------------------------
// BLOGS
// ---------------------------------------------------------------------------------------------------------------------------------------------

app.get("/api/auth/current-user", (req, res) => {
  if (req.session.userId) {
    res.json({
      authenticated: true,
      userId: req.session.userId,
    });
  } else {
    res.json({
      authenticated: false,
    });
  }
});


// Middleware to check if user is authenticated
const isUserAuthenticated = (req, res, next) => {
  if (req.session && req.session.userId) {
    return next();
  }
  return res.status(401).json({ success: false, message: "Not authenticated" });
};

// POST /api/blogs - Create a new blog
app.post("/api/blogs", isUserAuthenticated, async (req, res) => {
  const { title, content } = req.body;
  const author_id = req.session.userId;

  if (!title || !content) {
    return res.status(400).json({ success: false, message: "Title and content are required" });
  }

  try {
    const newBlog = new Blog({
      title,
      content,
      author_id,
      likes: [], // Array of ObjectId
      dislikes: [], // Array of ObjectId
      comments: [], // Array of comment subdocuments
    });
    await newBlog.save();
    res.status(201).json({ success: true, blog: newBlog });
  } catch (error) {
    console.error("Error creating blog:", error);
    res.status(500).json({ success: false, message: "Failed to create blog" });
  }
});

// GET /api/blogs - Fetch all blogs (with optional search)
app.get("/api/blogs", async (req, res) => {
  const searchQuery = req.query.search;
  let query = {};

  if (searchQuery) {
    query = {
      $or: [
        { title: { $regex: searchQuery, $options: "i" } },
        { content: { $regex: searchQuery, $options: "i" } },
      ],
    };
  }

  try {
    const blogs = await Blog.find(query)
      .populate("author_id", "name") // Populate author name
      .sort({ created_at: -1 });

    // Map to include author_name and counts
    const formattedBlogs = blogs.map((blog) => ({
      _id: blog._id,
      title: blog.title,
      content: blog.content,
      author_id: blog.author_id._id,
      author_name: blog.author_id.name || "Unknown",
      likes: blog.likes.length,
      dislikes: blog.dislikes.length,
      created_at: blog.created_at,
    }));

    res.json(formattedBlogs);
  } catch (error) {
    console.error("Error fetching blogs:", error);
    res.status(500).json({ message: "Failed to fetch blogs" });
  }
});

// POST /api/blogs/:id/like - Like a blog
app.post("/api/blogs/:id/like", isUserAuthenticated, async (req, res) => {
  const blogId = req.params.id;
  const userId = req.session.userId;

  try {
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);

    // Remove from dislikes if present
    blog.dislikes.pull(userObjectId);
    // Add to likes if not already
    if (!blog.likes.some((id) => id.equals(userObjectId))) {
      blog.likes.push(userObjectId);
    }

    await blog.save();
    res.json({ success: true });
  } catch (error) {
    console.error("Error liking blog:", error);
    res.status(500).json({ success: false, message: "Failed to like blog" });
  }
});

// POST /api/blogs/:id/dislike - Dislike a blog
app.post("/api/blogs/:id/dislike", isUserAuthenticated, async (req, res) => {
  const blogId = req.params.id;
  const userId = req.session.userId;

  try {
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);

    // Remove from likes if present
    blog.likes.pull(userObjectId);
    // Add to dislikes if not already
    if (!blog.dislikes.some((id) => id.equals(userObjectId))) {
      blog.dislikes.push(userObjectId);
    }

    await blog.save();
    res.json({ success: true });
  } catch (error) {
    console.error("Error disliking blog:", error);
    res.status(500).json({ success: false, message: "Failed to dislike blog" });
  }
});

// GET /api/blogs/:id/interactions - Check if user has liked/disliked
app.get("/api/blogs/:id/interactions", isUserAuthenticated, async (req, res) => {
  const blogId = req.params.id;
  const userId = req.session.userId;

  try {
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);
    const liked = blog.likes.some((id) => id.equals(userObjectId));
    const disliked = blog.dislikes.some((id) => id.equals(userObjectId));

    res.json({ liked, disliked });
  } catch (error) {
    console.error("Error fetching interactions:", error);
    res.status(500).json({ message: "Failed to fetch interactions" });
  }
});

// POST /api/blogs/:id/comments - Add a comment
app.post("/api/blogs/:id/comments", isUserAuthenticated, async (req, res) => {
  const blogId = req.params.id;
  const { text } = req.body;
  const userId = req.session.userId;

  if (!text) {
    return res.status(400).json({ success: false, message: "Comment text is required" });
  }

  try {
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }

    blog.comments.push({
      user_id: userId,
      text,
      created_at: new Date(),
    });

    await blog.save();
    res.json({ success: true });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ success: false, message: "Failed to add comment" });
  }
});

// GET /api/blogs/:id/comments - Fetch comments for a blog
app.get("/api/blogs/:id/comments", async (req, res) => {
  const blogId = req.params.id;

  try {
    const blog = await Blog.findById(blogId).populate("comments.user_id", "name");
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Map comments to include username
    const formattedComments = blog.comments.map((comment) => ({
      _id: comment._id,
      user_id: comment.user_id._id,
      username: comment.user_id.name || "Unknown",
      text: comment.text,
      created_at: comment.created_at,
    }));

    res.json(formattedComments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ message: "Failed to fetch comments" });
  }
});

// DELETE /api/comments/:id - Delete a comment
app.delete("/api/comments/:id", isUserAuthenticated, async (req, res) => {
  const commentId = req.params.id;
  const userId = req.session.userId;

  try {
    const blog = await Blog.findOne({ "comments._id": commentId });
    if (!blog) {
      return res.status(404).json({ success: false, message: "Comment not found" });
    }

    const comment = blog.comments.id(commentId);
    if (!comment.user_id.equals(userId)) {
      return res.status(403).json({ success: false, message: "Not authorized to delete this comment" });
    }

    blog.comments.pull(commentId);
    await blog.save();
    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ success: false, message: "Failed to delete comment" });
  }
});

// DELETE /api/blogs/:id - Delete a blog
app.delete("/api/blogs/:id", isUserAuthenticated, async (req, res) => {
  const blogId = req.params.id;
  const userId = req.session.userId;

  try {
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }

    if (!blog.author_id.equals(userId)) {
      return res.status(403).json({ success: false, message: "Not authorized to delete this blog" });
    }

    await Blog.deleteOne({ _id: blogId });
    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting blog:", error);
    res.status(500).json({ success: false, message: "Failed to delete blog" });
  }
});

// ---------------------------------------------------------------------------------------------------------------------------------------------
// INSURANCE POLICIES
// ---------------------------------------------------------------------------------------------------------------------------------------------

// Get all insurance policies for a user
app.get("/api/policies", async (req, res) => {
  const userId = req.session.userId; // Get user ID from session

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const policies = await UserInsurancePolicy.find({ user_id: userId });
    res.json(policies);
  } catch (error) {
    console.error("Error fetching policies:", error);
    res.status(500).json({ error: "Failed to fetch policies" });
  }
});

// Add a new insurance policy
app.post("/api/policies", async (req, res) => {
  const userId = req.session.userId; // Get user ID from session

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const {
    policy_name,
    policy_number,
    property_description,
    coverage_amount,
    renewal_date,
  } = req.body;

  try {
    const newPolicy = new UserInsurancePolicy({
      user_id: userId,
      policy_name,
      policy_number,
      property_description,
      coverage_amount,
      renewal_date,
    });

    const savedPolicy = await newPolicy.save();

    res.status(201).json({
      id: savedPolicy._id,
      message: "Policy added successfully",
    });
  } catch (error) {
    console.error("Error adding policy:", error);

    // Check for duplicate policy number
    if (error.code === 11000) {
      return res.status(400).json({ error: "Policy number already exists" });
    }

    res.status(500).json({ error: "Failed to add policy" });
  }
});

// Delete an insurance policy
app.delete("/api/policies/:policyId", async (req, res) => {
  const userId = req.session.userId; // Get user ID from session

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const result = await UserInsurancePolicy.deleteOne({
      _id: req.params.policyId,
      user_id: userId,
    });

    if (result.deletedCount > 0) {
      res.json({ message: "Policy deleted successfully" });
    } else {
      res.status(404).json({ error: "Policy not found" });
    }
  } catch (error) {
    console.error("Error deleting policy:", error);
    res.status(500).json({ error: "Failed to delete policy" });
  }
});

// Update an existing policy
app.put("/api/policies/:policyId", async (req, res) => {
  const userId = req.session.userId; // Get user ID from session

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const {
    policy_name,
    policy_number,
    property_description,
    coverage_amount,
    renewal_date,
  } = req.body;

  try {
    const result = await UserInsurancePolicy.updateOne(
      { _id: req.params.policyId, user_id: userId },
      {
        $set: {
          policy_name,
          policy_number,
          property_description,
          coverage_amount,
          renewal_date,
        },
      }
    );

    if (result.matchedCount > 0) {
      res.json({ message: "Policy updated successfully" });
    } else {
      res.status(404).json({ error: "Policy not found" });
    }
  } catch (error) {
    console.error("Error updating policy:", error);

    // Check for duplicate policy number
    if (error.code === 11000) {
      return res.status(400).json({ error: "Policy number already exists" });
    }

    res.status(500).json({ error: "Failed to update policy" });
  }
});

// Get user's precious metal holdings
app.get("/precious-holdings", async (req, res) => {
  try {
    // Assuming user_id is available from the authenticated session
    const userId = req.session.userId;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const holdings = await UserPreciousHoldings.find({ user_id: userId });
    res.json(holdings);
  } catch (error) {
    console.error("Error fetching precious holdings:", error);
    res.status(500).json({ error: "Failed to retrieve precious holdings" });
  }
});

// Add new precious metal holding
app.post("/precious-holdings", async (req, res) => {
  try {
    const userId = req.session.userId;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { metalType, metalAmount, metalUnit, metalValue, metalPurchaseDate } =
      req.body;

    // Validate input
    if (
      !metalType ||
      !metalAmount ||
      !metalUnit ||
      !metalValue ||
      !metalPurchaseDate
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newHolding = new UserPreciousHoldings({
      user_id: userId,
      metal_type: metalType.toLowerCase(),
      amount: metalAmount,
      amount_unit: metalUnit,
      value: metalValue,
      date_of_purchase: metalPurchaseDate,
    });

    const savedHolding = await newHolding.save();

    res.status(201).json({
      id: savedHolding._id,
      message: "Metal holding added successfully",
    });
  } catch (error) {
    console.error("Error in adding precious metal:", error);
    res.status(500).json({ error: "Failed to add precious metal" });
  }
});

// Delete a precious metal holding
app.delete("/precious-holdings/:id", async (req, res) => {
  try {
    const userId = req.session.userId;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const metalId = req.params.id;

    const result = await UserPreciousHoldings.deleteOne({
      _id: metalId,
      user_id: userId,
    });

    if (result.deletedCount > 0) {
      res.json({ message: "Metal holding deleted successfully" });
    } else {
      res
        .status(403)
        .json({ error: "Unauthorized or metal holding not found" });
    }
  } catch (error) {
    console.error("Error in deleting precious metal:", error);
    res.status(500).json({ error: "Failed to delete precious metal" });
  }
});

// Update a precious metal holding
app.put("/precious-holdings/:id", async (req, res) => {
  try {
    const userId = req.session.userId;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const metalId = req.params.id;
    const { metalType, metalAmount, metalUnit, metalValue, metalPurchaseDate } =
      req.body;

    // Validate input
    if (
      !metalType ||
      !metalAmount ||
      !metalUnit ||
      !metalValue ||
      !metalPurchaseDate
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const result = await UserPreciousHoldings.updateOne(
      { _id: metalId, user_id: userId },
      {
        $set: {
          metal_type: metalType.toLowerCase(),
          amount: metalAmount,
          amount_unit: metalUnit,
          value: metalValue,
          date_of_purchase: metalPurchaseDate,
        },
      }
    );

    if (result.matchedCount > 0) {
      res.json({ message: "Metal holding updated successfully" });
    } else {
      res
        .status(403)
        .json({ error: "Unauthorized or metal holding not found" });
    }
  } catch (error) {
    console.error("Error in updating precious metal:", error);
    res.status(500).json({ error: "Failed to update precious metal" });
  }
});

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, "public", "uploads", "properties");

    // Ensure directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Create unique filename with original extension
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const extension = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + extension);
  },
});

// Create the upload middleware
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
  fileFilter: function (req, file, cb) {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error("Only image files are allowed!"), false);
    }
    cb(null, true);
  },
});

// Get all properties for a user
app.get("/properties", async (req, res) => {
  // Check if user is logged in (session exists)
  if (!req.session || !req.session.userId) {
    return res.status(401).json({
      error: "Unauthorized",
      message: "User not logged in",
    });
  }

  try {
    const properties = await UserProperty.find({
      user_id: req.session.userId,
    }).select("property_name property_value location image_url");

    res.json(properties);
  } catch (error) {
    console.error("Database query error:", error);
    return res.status(500).json({
      error: "Failed to fetch properties",
      details: error.message,
    });
  }
});

// Middleware to serve local images
app.use("/local-images", (req, res, next) => {
  // Base directory for local images (adjust as needed)
  const baseDir = "/Users/ziko/Downloads";

  // Construct the full file path
  const filePath = path.join(baseDir, req.path);

  // Check if file exists
  if (fs.existsSync(filePath)) {
    // Serve the file
    res.sendFile(filePath);
  } else {
    // If file not found, send default image
    res.sendFile(
      path.join(__dirname, "public", "assets", "images", "default-property.jpg")
    );
  }
});

// Add new property
app.post("/properties", upload.single("propertyImage"), async (req, res) => {
  // Check if user is logged in
  if (!req.session || !req.session.userId) {
    return res.status(401).json({
      error: "Unauthorized",
      message: "User not logged in",
    });
  }

  const { propertyName, propertyValue, propertyLocation } = req.body;

  // Handle image upload
  let imageUrl = null;
  if (req.file) {
    imageUrl = `/uploads/properties/${req.file.filename}`;
  }

  try {
    // Create new property document
    const newProperty = new UserProperty({
      user_id: req.session.userId,
      property_name: propertyName,
      property_value: parseFloat(propertyValue),
      location: propertyLocation,
      image_url: imageUrl,
    });

    // Save the new property
    const savedProperty = await newProperty.save();

    res.status(201).json({
      id: savedProperty._id,
      property_name: propertyName,
      property_value: propertyValue,
      location: propertyLocation,
      image_url: imageUrl,
    });
  } catch (error) {
    console.error("Error adding property:", error);

    // If an image was uploaded but insert failed, remove the image
    if (req.file) {
      const imagePath = path.join(
        __dirname,
        "public",
        `/uploads/properties/${req.file.filename}`
      );
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    return res.status(500).json({
      error: "Failed to add property",
      details: error.message,
    });
  }
});

// Update property
app.put("/properties/:id", upload.single("propertyImage"), async (req, res) => {
  // Check if user is logged in
  if (!req.session || !req.session.userId) {
    return res.status(401).json({
      error: "Unauthorized",
      message: "User not logged in",
    });
  }

  const propertyId = req.params.id;
  const { propertyName, propertyValue, propertyLocation } = req.body;

  try {
    // First, check if the property belongs to the user
    const existingProperty = await UserProperty.findOne({
      _id: propertyId,
      user_id: req.session.userId,
    });

    if (!existingProperty) {
      return res.status(404).json({ error: "Property not found" });
    }

    // Handle image upload
    let imageUrl = existingProperty.image_url;
    if (req.file) {
      // Delete old image if exists
      if (existingProperty.image_url) {
        const oldImagePath = path.join(
          __dirname,
          "public",
          existingProperty.image_url
        );
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      imageUrl = `/uploads/properties/${req.file.filename}`;
    }

    // Update property
    const updatedProperty = await UserProperty.findByIdAndUpdate(
      propertyId,
      {
        property_name: propertyName,
        property_value: parseFloat(propertyValue),
        location: propertyLocation,
        image_url: imageUrl,
      },
      { new: true } // Return the updated document
    );

    res.json({
      id: updatedProperty._id,
      property_name: updatedProperty.property_name,
      property_value: updatedProperty.property_value,
      location: updatedProperty.location,
      image_url: updatedProperty.image_url,
    });
  } catch (error) {
    console.error("Error updating property:", error);
    return res.status(500).json({
      error: "Failed to update property",
      details: error.message,
    });
  }
});

// Delete property
app.delete("/properties/:id", async (req, res) => {
  // Check if user is logged in
  if (!req.session || !req.session.userId) {
    return res.status(401).json({
      error: "Unauthorized",
      message: "User not logged in",
    });
  }

  const propertyId = req.params.id;

  try {
    // First, find the property to get its image
    const existingProperty = await UserProperty.findOne({
      _id: propertyId,
      user_id: req.session.userId,
    });

    if (!existingProperty) {
      return res.status(404).json({ error: "Property not found" });
    }

    // Delete image file if exists
    if (existingProperty.image_url) {
      const imagePath = path.join(
        __dirname,
        "public",
        existingProperty.image_url
      );
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    // Delete property from database
    await UserProperty.findByIdAndDelete(propertyId);

    res.status(200).json({ message: "Property deleted successfully" });
  } catch (error) {
    console.error("Error deleting property:", error);
    return res.status(500).json({
      error: "Failed to delete property",
      details: error.message,
    });
  }
});

// ---------------------------------------------------------------------------------------------------------------------------------------------
// LLM ChatBot
// ---------------------------------------------------------------------------------------------------------------------------------------------

app.post("/api/financial-advice", (req, res) => {
  const { query, userData = {} } = req.body;

  if (!query) {
    return res.status(400).json({ error: "Query is required" });
  }

  // Create context string if user data is available
  let context = "";
  if (userData.monthly_income > 0) {
    const income = userData.monthly_income;
    const savings = userData.savings;

    if (userData.currency === "INR") {
      context = `With a monthly income of ₹${income.toFixed(
        2
      )} and savings of ₹${savings.toFixed(2)}: `;
    } else {
      context = `With a monthly income of $${income.toFixed(
        2
      )} and savings of $${savings.toFixed(2)}: `;
    }
  }

  // Full prompt to send to the model
  const fullPrompt = `
  <|system|>
  You are a knowledgeable financial advisor assistant. Provide clear, accurate, and helpful advice on personal finance topics. 
  Keep responses concise but informative. Don't recommend specific investments or make promises about returns.
  </|system|>

  <|user|>
  ${context}${query}
  </|user|>

  <|assistant|>
  `;

  // Call your Python script that loads and runs the LLM model
  exec(
    `python llm.py "${fullPrompt.replace(/"/g, '\\"')}"`,
    (error, stdout, stderr) => {
      if (error) {
        console.error(`LLM execution error: ${error}`);
        return res
          .status(500)
          .json({ error: "Error processing request with LLM" });
      }

      if (stderr) {
        console.error(`LLM stderr: ${stderr}`);
      }

      // Extract response from the LLM output
      let llmResponse = stdout.trim();

      // Clean up the response if needed
      if (llmResponse.includes("<|")) {
        llmResponse = llmResponse.split("<|")[0].trim();
      }

      res.json({
        response: llmResponse,
        timestamp: new Date(),
      });
    }
  );
});

// ---------------------------------------------------------------------------------------------------------------------------------------------
// Settings Page
// ---------------------------------------------------------------------------------------------------------------------------------------------

// API endpoint to fetch user profile details
app.get("/api/user/profile", async (req, res) => {
  // Ensure the user is logged in
  const userId = req.session.userId;
  console.log("Session userId:", userId);

  // Set content type
  res.setHeader("Content-Type", "application/json");

  if (!userId) {
    return res
      .status(401)
      .json({ status: "error", message: "Unauthorized. Please log in." });
  }

  try {
    // Find the user by ID
    const user = await mongoose.model("User").findById(userId);

    // If user not found, return 404
    if (!user) {
      return res
        .status(404)
        .json({ status: "error", message: "User not found" });
    }

    // Return user profile information with status and data structure
    res.json({
      status: "success",
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        monthly_income: user.monthly_income,
        employment_status: user.employment_status,
        financial_goals: user.financial_goals,
        risk_tolerance: user.risk_tolerance,
        aadhaar_number: user.aadhaar_number,
        pan_number: user.pan_number,
        created_at: user.created_at,
      },
    });
  } catch (error) {
    console.error("Error fetching user profile data:", error);
    res.status(500).json({
      status: "error",
      message: "Database error",
      details: error.message,
    });
  }
});

// API endpoint to update user profile
app.put("/api/user/profile", async (req, res) => {
  // Ensure the user is logged in
  const userId = req.session.userId;

  if (!userId) {
    return res
      .status(401)
      .json({ status: "error", message: "Unauthorized. Please log in." });
  }

  try {
    // Find the user by ID
    const user = await mongoose.model("User").findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ status: "error", message: "User not found" });
    }

    // Update allowed fields
    const allowedFields = [
      "name",
      "email",
      "monthly_income",
      "employment_status",
      "financial_goals",
      "risk_tolerance",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        user[field] = req.body[field];
      }
    });

    // Save the updated user
    await user.save();

    console.log("User profile updated:", user.name);

    // Return the updated user data with status wrapper
    res.json({
      status: "success",
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        monthly_income: user.monthly_income,
        employment_status: user.employment_status,
        financial_goals: user.financial_goals,
        risk_tolerance: user.risk_tolerance,
        aadhaar_number: user.aadhaar_number,
        pan_number: user.pan_number,
        created_at: user.created_at,
      },
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({
      status: "error",
      message: "Database error",
      details: error.message,
    });
  }
});

// =========================================================================
// NEW APIS FOR VIDEO SESSION PAGE
// =========================================================================

// Middleware to check if the user is an authenticated advisor
const isAdvisorAuthenticated = (req, res, next) => {
  if (req.session && req.session.advisorId) {
    return next();
  }
  return res.status(401).json({ status: "error", message: "Not authenticated as an advisor" });
};

// GET /api/videos - Fetch video library for the advisor
app.get("/api/videos", isAdvisorAuthenticated, async (req, res) => {
    try {
        const advisorId = req.session.advisorId;
        // Check if the advisor has any videos, if not, add some defaults
        const videoCount = await Video.countDocuments({ advisor_id: advisorId });

        if (videoCount === 0) {
            await Video.insertMany([
                { advisor_id: advisorId, title: "Beginner's Guide to Investing", videoId: "Cda-fUJ-GjE" },
                { advisor_id: advisorId, title: "Understanding Mutual Funds", videoId: "k_gE4a-P57s" },
                { advisor_id: advisorId, title: "How to Save Money", videoId: "3_kCsig2-oA" }
            ]);
        }
        
        const videos = await Video.find({ advisor_id: advisorId }).sort({ created_at: -1 });
        res.json({ videos });
    } catch (error) {
        console.error("Error fetching video library:", error);
        res.status(500).json({ error: "Server error while fetching videos." });
    }
});

// POST /api/session-notes - Save a note for a session
app.post("/api/session-notes", isAdvisorAuthenticated, async (req, res) => {
    const { userId, note } = req.body;
    if (!userId || !note) {
        return res.status(400).json({ success: false, error: "Client user ID and note content are required." });
    }
    try {
        const newNote = new SessionNote({
            advisor_id: req.session.advisorId,
            user_id: userId,
            note: note,
        });
        await newNote.save();
        res.json({ success: true, message: "Note saved successfully." });
    } catch (error) {
        console.error("Error saving session note:", error);
        res.status(500).json({ success: false, error: "Failed to save note." });
    }
});

// GET /api/session-notes/:userId - Load notes for a client
app.get("/api/session-notes/:userId", isAdvisorAuthenticated, async (req, res) => {
    try {
        const notes = await SessionNote.find({
            advisor_id: req.session.advisorId,
            user_id: req.params.userId
        }).sort({ created_at: -1 });
        res.json({ notes });
    } catch (error) {
        console.error("Error loading session notes:", error);
        res.status(500).json({ error: "Failed to load notes." });
    }
});

// --- Video Recording Upload ---
// Configure multer for video uploads
const videoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, 'public', 'uploads', 'recorded-videos');
    fs.mkdirSync(uploadPath, { recursive: true }); // Ensure directory exists
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '.webm'); // Save files as .webm
  }
});

const videoUpload = multer({ storage: videoStorage });

// POST /api/videos/upload - Upload a recorded video
app.post('/api/videos/upload', isAdvisorAuthenticated, videoUpload.single('video'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send({ error: 'No video file uploaded.' });
  }

  const { title } = req.body;
  if (!title) {
    // If upload fails due to missing title, delete the orphaned file
    fs.unlinkSync(req.file.path);
    return res.status(400).send({ error: 'Video title is required.' });
  }

  try {
    const newVideo = new Video({
      advisor_id: req.session.advisorId,
      title: title,
      filename: req.file.filename,
      url: `/uploads/recorded-videos/${req.file.filename}`, // Public URL to serve the file
    });
    await newVideo.save();
    
    res.status(201).json({ success: true, message: 'Video uploaded successfully!', video: newVideo });
  } catch (error) {
    console.error('Error saving video to database:', error);
    res.status(500).json({ error: 'Failed to save video information.' });
  }
});

// =========================================================================


// Start the server
server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});