const express = require('express');
const router = express.Router();
const Chapter = require('../models/Chapter');
const Novel = require('../models/Novel');
const { protect, authorize } = require('../middleware/auth');

// Get chapters by novel
router.get('/novel/:novelId', async (req, res) => {
  try {
    const chapters = await Chapter.find({ novelId: req.params.novelId });
    res.status(200).json({ success: true, chapters });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get chapter by ID
router.get('/:id', async (req, res) => {
  try {
    const chapter = await Chapter.findById(req.params.id);
    if (!chapter) {
      return res.status(404).json({ error: 'Chapter not found' });
    }
    chapter.views += 1;
    await chapter.save();
    res.status(200).json({ success: true, chapter });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create chapter
router.post('/', protect, authorize('upload_novel'), async (req, res) => {
  try {
    const { title, novelId, chapterNumber, content, contentHtml } = req.body;
    
    const chapter = await Chapter.create({
      title,
      novelId,
      chapterNumber,
      content,
      contentHtml
    });
    
    await Novel.findByIdAndUpdate(
      novelId,
      { $push: { chapters: chapter._id } }
    );
    
    res.status(201).json({ success: true, chapter });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update chapter
router.put('/:id', protect, authorize('edit_novel'), async (req, res) => {
  try {
    const chapter = await Chapter.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json({ success: true, chapter });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete chapter
router.delete('/:id', protect, authorize('delete_novel'), async (req, res) => {
  try {
    const chapter = await Chapter.findById(req.params.id);
    await Novel.findByIdAndUpdate(
      chapter.novelId,
      { $pull: { chapters: req.params.id } }
    );
    await Chapter.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Chapter deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
