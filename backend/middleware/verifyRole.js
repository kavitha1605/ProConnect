export const verifyRole = (allowedRoles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "No user found" });
      }

      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({ message: `Access denied. Only ${allowedRoles.join(", ")} can access this.` });
      }

      next();
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  };
};

export default verifyRole;
