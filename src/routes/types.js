const express = require('express');
const router = express.Router();
const InstrumentType = require('../models/InstrumentType');
const auth = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: InstrumentTypes
 *   description: Gestión de Tipos de Instrumentos
 */

/**
 * @swagger
 * /api/types:
 *   post:
 *     summary: Crear un nuevo tipo de instrumento
 *     tags: [InstrumentTypes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Tipo creado
 */
router.post('/', auth, async (req, res) => {
     try {
     const type = new InstrumentType(req.body);
     await type.save();
     res.status(201).json(type);
     } catch (err) {
     res.status(400).json({ error: err.message });
     }
});

/**
 * @swagger
 * /api/types:
 *   get:
 *     summary: Listar todos los tipos de instrumentos
 *     tags: [InstrumentTypes]
 *     responses:
 *       200:
 *         description: Lista de tipos de instrumentos
 */
router.get('/', async (req, res) => {
     const types = await InstrumentType.find();
     res.json(types);
});

/**
 * @swagger
 * /api/types/{id}:
 *   get:
 *     summary: Obtener un tipo por ID
 *     tags: [InstrumentTypes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tipo encontrado
 *       404:
 *         description: No encontrado
 */
router.get('/:id', async (req, res) => {
     const type = await InstrumentType.findById(req.params.id);
     if(!type) return res.status(404).json({ msg: 'Not found' });
     res.json(type);
});

/**
 * @swagger
 * /api/types/{id}:
 *   put:
 *     summary: Actualizar un tipo por ID
 *     tags: [InstrumentTypes]
 *     security:
 *       - bearerAuth: []
 */
router.put('/:id', auth, async (req, res) => {
     const type = await InstrumentType.findByIdAndUpdate(req.params.id, req.body, { new: true });
     res.json(type);
});

/**
 * @swagger
 * /api/types/{id}:
 *   delete:
 *     summary: Eliminar un tipo por ID
 *     tags: [InstrumentTypes]
 *     security:
 *       - bearerAuth: []
 */
router.delete('/:id', auth, async (req, res) => {
     await InstrumentType.findByIdAndDelete(req.params.id);
     res.json({ msg: 'Deleted' });
});

module.exports = router;