const express = require('express');
const router = express.Router();
const Role = require('../models/Role');
const { protect, authorize } = require('../middleware/auth');

// Get all roles
router.get('/', async (req, res) => {
  try {
    const roles = await Role.find();
    res.status(200).json({ success: true, roles });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create role (admin only)
router.post('/', protect, authorize('manage_roles'), async (req, res) => {
  try {
    const { name, description, color, permissions } = req.body;
    const role = await Role.create({ name, description, color, permissions });
    res.status(201).json({ success: true, role });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update role
router.put('/:id', protect, authorize('manage_roles'), async (req, res) => {
  try {
    const { name, description, color, permissions } = req.body;
    const role = await Role.findByIdAndUpdate(
      req.params.id,
      { name, description, color, permissions },
      { new: true }
    );
    res.status(200).json({ success: true, role });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete role
router.delete('/:id', protect, authorize('manage_roles'), async (req, res) => {
  try {
    await Role.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Role deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
