// Lightweight Auth & Role Verification Middleware

export function requireAdmin(req, res, next) {
  const role = req.headers['x-user-role'];
  if (role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied: Administrator privileges required.'
    });
  }
  next();
}

export function requireAuth(req, res, next) {
  const userId = req.headers['x-user-id'];
  if (!userId) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required. Please log in.'
    });
  }
  next();
}
