import jwt from "jsonwebtoken";

const jwt_SECRET =
  process.env.JWT_SECRET || "katalogwa_super_jwt_key_2026";

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.slice(7).trim()
    : null;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Akses ditolak: token autentikasi tidak ditemukan",
    });
  }

  jwt.verify(token, jwt_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: "Sesi kedaluwarsa atau token tidak valid",
      });
    }

    req.user = user;
    next();
  });
};

export { jwt_SECRET };
