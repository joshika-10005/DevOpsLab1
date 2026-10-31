const Waste = require('../models/Waste');

const createWaste = async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.user) data.user = req.user._id;
    const waste = new Waste(data);
    await waste.save();
    res.status(201).json(waste);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getWastes = async (req, res) => {
  const data = await Waste.find();
  res.json(data);
};

const updateWaste = async (req, res) => {
  const updated = await Waste.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
};

const deleteWaste = async (req, res) => {
  await Waste.findByIdAndDelete(req.params.id);
  res.send("Deleted");
};

module.exports = { createWaste, getWastes, updateWaste, deleteWaste };