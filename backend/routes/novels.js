const express = require('express');
const router = express.Router();
const Novel = require('../models/Novel');
const { protect, authorize } = require('../middleware/auth');

// Get all novels
router.get('/', async (req, res) => {
  try {
    const novels = await Novel.find()
      .populate('chapters')
      .populate('uploadedBy', 'username email');
    res.status(200).json({ success: true, novels });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get novel by ID
router.get('/:id', async (req, res) => {
  try {
    const novel = await Novel.findById(req.params.id)
      .populate('chapters')
      .populate('uploadedBy', 'username email');
    if (!novel) {
      return res.status(404).json({ error: 'Novel not found' });
    }
    res.status(200).json({ success: true, novel });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create novel (need upload_novel permission)
router.post('/', protect, authorize('upload_novel'), async (req, res) => {
  try {
    const { title, description, cover, banner, author, illustrator, genres, status } = req.body;
    
    const slug = title.toLowerCase().replace(/\s+/g, '-');
    
    const novel = await Novel.create({
      title,
      slug,
      description,
      cover,
      banner,
      author,
      illustrator,
      genres,
      status,
      uploadedBy: req.user._id
    });
    
    res.status(201).json({ success: true, novel });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update novel
router.put('/:id', protect, authorize('edit_novel'), async (req, res) => {
  try {
    const novel = await Novel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json({ success: true, novel });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete novel
router.delete('/:id', protect, authorize('delete_novel'), async (req, res) => {
  try {
    await Novel.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Novel deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
