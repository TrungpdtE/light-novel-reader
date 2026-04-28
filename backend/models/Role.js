const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: String,
  color: {
    type: String,
    default: '#808080'
  },
  permissions: [{
    type: String,
    enum: [
      'upload_novel',
      'edit_novel',
      'delete_novel',
      'delete_comment',
      'manage_users',
      'manage_roles',
      'view_analytics',
      'ban_user',
      'edit_user',
      'create_announcement',
      'moderate_comments'
    ]
  }],
  priority: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Role', roleSchema);
