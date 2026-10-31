const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

const seedAdmin = async () => {
  try {
    const adminExists = await User.findOne({ email: "admin@gmail.com" });
    if (!adminExists) {
      const hashed = await bcrypt.hash("admin123", 10);
      await User.create({
        name: "Master Admin",
        email: "admin@gmail.com",
        password: hashed,
        role: "admin",
      });
      console.log("Admin user created (admin@gmail.com / admin123)");
    }
  } catch (error) {
    console.error("Failed to seed admin:", error);
  }
};
seedAdmin();

const authRoutes = require('./routes/authRoutes');
const wasteRoutes = require('./routes/wasteRoutes');
app.use('/api/auth', authRoutes);
app.use('/api/waste', wasteRoutes);

app.get("/", (req, res) => {
  res.send("Waste Management API Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});