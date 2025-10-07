const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Rutas de autenticación de usuarios
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Usuario registrado y token generado
 *       400:
 *         description: Usuario ya existe o datos inválidos
 */
router.post('/register', 
     body('email').isEmail(),
     body('password').isLength({ min: 6 }),
     async (req, res) => {
     const errors = validationResult(req);
     if(!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

     const { name, email, password } = req.body;
     
     try {
          let user = await User.findOne({ email });
          if(user) return res.status(400).json({ msg: 'User already exists' });

          const salt = await bcrypt.genSalt(10);
          const passwordHash = await bcrypt.hash(password, salt);

          user = new User({ name, email, passwordHash });
          await user.save();

          const payload = { id: user._id };
          const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
          res.json({ token });
     } catch (err) {
          console.error(err);
          res.status(500).send('Server error');
     }
});

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Iniciar sesión
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login exitoso, devuelve token
 *       400:
 *         description: Credenciales inválidas
 */
router.post('/login', async (req, res) => {

     const { email, password } = req.body;
     try {
     const user = await User.findOne({ email });
     if(!user) return res.status(400).json({ msg: 'Invalid credentials' });

     const isMatch = await bcrypt.compare(password, user.passwordHash);
     if(!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

     const payload = { id: user._id };
     const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
     res.json({ token });
     } catch (err) {
     console.error(err);
     res.status(500).send('Server error');
     }
});

module.exports = router;