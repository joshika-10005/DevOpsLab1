const express = require('express');
const router = express.Router();
const { createWaste, getWastes, updateWaste, deleteWaste } = require('../controllers/wasteController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/', protect, createWaste);
router.get('/', protect, getWastes);
router.put('/:id', protect, admin, updateWaste);
router.delete('/:id', protect, admin, deleteWaste);

module.exports = router;