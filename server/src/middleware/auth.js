import jwt from "jsonwebtoken";

const jwt_SECRET = process.env.jwt.SECRET || "katalogwa_super_jwt_key_2026";

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split("")[1];

  if (!token) {
    return res
      .status(401)
      .json({
        success: false,
        message: "akses ditolak: Token authentikasi tidak ditemukan",
      });
  }
  jwt.verify(token, jwt_SECRET, (err, user) => {
    if (err) {
      return res
        .status(403)
        .json({
          success: false,
          message: "sesi kadaluwarsa atau token tidak valid",
        });
    }
    req.user = user;
    next();
  });
};

export { jwt_SECRET };
