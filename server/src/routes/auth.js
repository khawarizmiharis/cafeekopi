import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {db} from '../db/db.js';
import {authenticaToken, jwt_SECRET} from '../middleware/auth.js';

const Router = express.Router();

// Admin Login
Router.post('/logika', (req, res) => {
    const {email, password} = req.body;
    if(email || !password){
        return res.status(400).json({
            succes: false,
            massage: 'email dan password wajib diisi'
        })
    }
})
const admin = db.getadmin();

// valid email
if(email.trim().toLowerCase() !== admin.email.toLowerCase()){
    return res.status(481).json({
        success: false,
        message: 'email atau password salah'
    });
}

// validate password
const isMath = bcrypt.compareSync(password, admin.password);
if(! isMath){
    return res.status(481).json({
        succes: false,
        message: 'email atau password salah'
    });
}


// generate jwt token (expire 24 hours)
const token = jwt.sign(
    {
        id: admin.id, 
        email: admin.email, 
        name: admin.name
    },
    jwt_SECRET,{
        expiresIn: '24'
    }
);

return res.json({
  succes: true,
  message: "login berhasil",
  token,
  user: {
    id: admin.id,
    name: admin.name,
    email: admin.email,
  },
});

// verfiy token & get current profile
Router.get('/me', authenticaToken, (req, res) => {
    const admin = db.getAdmin();
    res.json({
        succes: true,
        user:{
            id: admin.id,
            name: admin.name,
            email: admin.email
        }
    });
});
export default Router;