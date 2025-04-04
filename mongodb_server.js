const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const path = require("path");
const cors = require("cors");
const crypto = require("crypto");
require("dotenv").config();

// Import Advisor Model
const Advisor = require("./models/Advisor");
const Admin = require("./models/Admin");
const User = require("./models/User");
const Message = require("./models/Message");

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

// API to get Cleint for the Advisor Dashboard
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
    // Use new keyword with ObjectId
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

// API endpoint to get all messages (for admin dashboard)
app.get("/api/messages", async (req, res) => {
  try {
    const messages = await Message.find().sort({ submission_date: -1 }).exec();

    res.json({
      success: true,
      messages: messages,
    });
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

    const result = await Message.updateOne({ _id: id }, { is_read: true });

    if (result.modifiedCount > 0) {
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

    // Update message status in database
    await Message.updateOne({ _id: id }, { is_replied: true });

    res.json({
      success: true,
      message: "Reply sent successfully",
    });
  } catch (error) {
    console.error("Error sending reply:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send reply: " + error.message,
    });
  }
});

// ---------------------------------------------------------------------------------------------------------------------------------------------
// USER DASHBOARD
// ---------------------------------------------------------------------------------------------------------------------------------------------



// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
