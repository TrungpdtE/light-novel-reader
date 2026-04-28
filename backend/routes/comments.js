const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const { protect, authorize } = require('../middleware/auth');

// Get comments by novel
router.get('/novel/:novelId', async (req, res) => {
  try {
    const comments = await Comment.find({ novelId: req.params.novelId, isDeleted: false })
      .populate('userId', 'username avatar')
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, comments });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create comment
router.post('/', protect, async (req, res) => {
  try {
    const { content, novelId, chapterId } = req.body;
    
    const comment = await Comment.create({
      content,
      novelId,
      chapterId,
      userId: req.user._id
    });
    
    await comment.populate('userId', 'username avatar');
    
    res.status(201).json({ success: true, comment });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete comment (admin or own comment)
router.delete('/:id', protect, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }
    
    if (comment.userId.toString() !== req.user._id.toString() && !req.user.roles.some(r => r.permissions.includes('delete_comment'))) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    
    comment.isDeleted = true;
    await comment.save();
    
    res.status(200).json({ success: true, message: 'Comment deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
