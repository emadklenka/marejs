export function mareMiddleware(req, res, next) {
  // Decode and check for traversal
  const decodedPath = decodeURIComponent(req.path);
  
  if (decodedPath.includes('..')) {
    return res.status(400).json({ error: "Invalid path" });
  }
  
  // Allow public routes
  if (req.path.startsWith('/public')) {
    return next();
  }

  // TODO: Implement authentication
  return res.status(401).json({ error: "Unauthorized" });
}