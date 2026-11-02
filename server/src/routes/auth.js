import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { db } from "../db/db.js";
import { authenticaToken, jwt_SECRET } from "../middleware/auth.js";

const Router = express.Router();

// Admin Login
Router.post("/logika", (req, res) => {
  try {
    const { email, password } = req.body;

    // Validasi email dan password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email dan password wajib diisi",
      });
    }

    // Ambil data admin
    const admin = db.getAdmin();

    // Periksa apakah admin tersedia
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Email atau password salah",
      });
    }

    // Validasi email
    if (email.trim().toLowerCase() !== admin.email.toLowerCase()) {
      return res.status(401).json({
        success: false,
        message: "Email atau password salah",
      });
    }

    // Validasi password
    const isMatch = bcrypt.compareSync(password, admin.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Email atau password salah",
      });
    }

    // Generate JWT token (berlaku 24 jam)
    const token = jwt.sign(
      {
        id: admin.id,
        email: admin.email,
        name: admin.name,
      },
      jwt_SECRET,
      {
        expiresIn: "24h",
      },
    );

    // Respons login berhasil
    return res.json({
      success: true,
      message: "Login berhasil",
      token,
      user: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
      },
    });
  } catch (err) {
    console.error("Login error:", err);

    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server",
    });
  }
});

// Verify token & get current profile
Router.get("/me", authenticaToken, (req, res) => {
  try {
    const admin = db.getAdmin();

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Data admin tidak ditemukan",
      });
    }

    return res.json({
      success: true,
      user: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
      },
    });
  } catch (err) {
    console.error("Profile error:", err);

    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server",
    });
  }
});

export default Router;
