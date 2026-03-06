const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    collection: "users",
    timestamps: true,
  }
);

const UserModel = mongoose.model("User", userSchema);

class User {
  constructor(username, password) {
    this.username = username;
    this.password = password;
  }

  async register() {
    const existingUser = await UserModel.findOne({ username: this.username });
    if (existingUser) {
      return { success: false, message: "Username already exists" };
    }

    await UserModel.create({
      username: this.username,
      password: this.password,
    });

    return { success: true, message: "User registered successfully" };
  }

  async login() {
    const user = await UserModel.findOne({
      username: this.username,
      password: this.password,
    });

    if (!user) {
      return { success: false, message: "Invalid username or password" };
    }

    return { success: true, message: "Login successful", user };
  }
}

module.exports = { User, UserModel };
