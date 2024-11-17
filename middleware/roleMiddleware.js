const isAdmin = (req, res, next) => {
    if (req.session.user && req.session.user.role === 'admin') {
      return next();
    }
    return res.status(403).json({ error: 'Access denied! You must be an admin to access this route.' });
  };
  
  const isEditor = (req, res, next) => {
    if (req.session.user && (req.session.user.role === 'editor' || req.session.user.role === 'admin')) {
      return next();
    }
    return res.status(403).json({ error: 'Access denied! You must be an editor or admin to access this route.' });
  };
  
  module.exports = { isAdmin, isEditor };