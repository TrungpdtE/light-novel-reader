const express = require('express');
const router = express.Router();
const Novel = require('../models/Novel');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

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
router.post('/', protect, authorize('upload_novel'), upload.fields([
  { name: 'cover', maxCount: 1 },
  { name: 'banner', maxCount: 1 }
]), async (req, res) => {
  try {
    const { title, description, author, illustrator, genres, status } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Tiêu đề là bắt buộc' });
    }

    const slug = title
      .toLowerCase()
      .trim()
      .replace(/[\s_]+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .replace(/^-+|-+$/g, '');

    // Handle file uploads – fall back to URL strings if no file provided
    const cover = req.files?.cover
      ? `/uploads/${req.files.cover[0].filename}`
      : (req.body.cover || '');
    const banner = req.files?.banner
      ? `/uploads/${req.files.banner[0].filename}`
      : (req.body.banner || '');

    // genres may arrive as a comma-separated string or an array
    let parsedGenres = genres;
    if (typeof genres === 'string') {
      parsedGenres = genres.split(',').map(g => g.trim()).filter(Boolean);
    } else if (!Array.isArray(genres)) {
      parsedGenres = [];
    }

    const novel = await Novel.create({
      title,
      slug,
      description,
      cover,
      banner,
      author,
      illustrator,
      genres: parsedGenres,
      status: status || 'Đang tiếp hành',
      uploadedBy: req.user._id
    });

    res.status(201).json({ success: true, novel });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update novel
router.put('/:id', protect, authorize('edit_novel'), upload.fields([
  { name: 'cover', maxCount: 1 },
  { name: 'banner', maxCount: 1 }
]), async (req, res) => {
  try {
    const updates = { ...req.body };

    // genres may arrive as a comma-separated string
    if (typeof updates.genres === 'string') {
      updates.genres = updates.genres.split(',').map(g => g.trim()).filter(Boolean);
    }

    if (req.files?.cover) {
      updates.cover = `/uploads/${req.files.cover[0].filename}`;
    }
    if (req.files?.banner) {
      updates.banner = `/uploads/${req.files.banner[0].filename}`;
    }

    updates.updatedAt = Date.now();

    const novel = await Novel.findByIdAndUpdate(
      req.params.id,
      updates,
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
