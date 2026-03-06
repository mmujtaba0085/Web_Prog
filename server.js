// server.js
const express = require("express");
const dotenv = require("dotenv");
const session = require("express-session");
const connectDB = require("./db");
const { User } = require("./User");

dotenv.config();

const app = express();
app.use(express.json()); // to read JSON request bodies
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "task3_session_secret",
    resave: false,
    saveUninitialized: false,
  })
);

function authMiddleware(req, res, next) {
  if (!req.session.user) {
    return res.status(401).send("Unauthorized: Please login first");
  }

  next();
}

app.get("/", (req, res) => {
  res.send("Server is running ✅");
});

app.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).send("Username and password are required");
    }

    const user = new User(username, password);
    const result = await user.register();

    if (!result.success) {
      return res.status(400).send(result.message);
    }

    return res.send("User registered successfully");
  } catch (error) {
    return res.status(500).send("Server error while registering user");
  }
});

app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).send("Username and password are required");
    }

    const user = new User(username, password);
    const result = await user.login();

    if (!result.success) {
      return res.status(401).send(result.message);
    }

    req.session.user = username;
    return res.send("Login successful");
  } catch (error) {
    return res.status(500).send("Server error while logging in");
  }
});

app.get("/dashboard", authMiddleware, (req, res) => {
  res.send(`Welcome ${req.session.user}`);
});

app.get("/logout", (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      return res.status(500).send("Server error while logging out");
    }

    return res.send("Logout successful");
  });
});

const PORT = process.env.PORT || 3000;

(async () => {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    console.error("❌ Missing MONGO_URI in .env");
    process.exit(1);
  }

  await connectDB(mongoUri);

  app.listen(PORT, () => {
    console.log(`🚀 Server started on http://localhost:${PORT}`);
  });
})();