const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ error: 'Not authorized to access this route' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).populate('roles');
    
    if (!req.user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (req.user.isBanned) {
      return res.status(403).json({ error: 'User is banned' });
    }

    next();
  } catch (err) {
    return res.status(401).json({ error: 'Not authorized to access this route' });
  }
};

exports.authorize = (...permissions) => {
  return async (req, res, next) => {
    const userPermissions = [];
    
    if (req.user.roles && req.user.roles.length > 0) {
      req.user.roles.forEach(role => {
        userPermissions.push(...role.permissions);
      });
    }

    const hasPermission = permissions.some(perm => userPermissions.includes(perm));

    if (!hasPermission) {
      return res.status(403).json({ error: 'Not authorized to perform this action' });
    }

    next();
  };
};
