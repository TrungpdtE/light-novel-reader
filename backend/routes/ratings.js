const express = require('express');
const router = express.Router();
const Rating = require('../models/Rating');
const Novel = require('../models/Novel');
const { protect } = require('../middleware/auth');

// Get ratings by novel
router.get('/novel/:novelId', async (req, res) => {
  try {
    const ratings = await Rating.find({ novelId: req.params.novelId })
      .populate('userId', 'username avatar');
    res.status(200).json({ success: true, ratings });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create or update rating
router.post('/', protect, async (req, res) => {
  try {
    const { novelId, score, review } = req.body;
    
    let rating = await Rating.findOne({ novelId, userId: req.user._id });
    
    if (rating) {
      rating.score = score;
      rating.review = review;
      await rating.save();
    } else {
      rating = await Rating.create({
        userId: req.user._id,
        novelId,
        score,
        review
      });
    }
    
    // Update novel rating
    const allRatings = await Rating.find({ novelId });
    const avgRating = allRatings.reduce((sum, r) => sum + r.score, 0) / allRatings.length;
    
    await Novel.findByIdAndUpdate(
      novelId,
      { rating: avgRating, ratingCount: allRatings.length }
    );
    
    await rating.populate('userId', 'username avatar');
    
    res.status(200).json({ success: true, rating });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
