const mongoose = require('mongoose');

const wasteSchema = new mongoose.Schema({
  title: String,
  description: String,
  location: String,
  status: { type: String, default: "Pending" },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  }
}, { timestamps: true });

module.exports = mongoose.model("Waste", wasteSchema);