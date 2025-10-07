const express = require('express');
const router = express.Router();
const Instrument = require('../models/Instrument');
const InstrumentType = require('../models/InstrumentType');
const auth = require('../middleware/auth');


/**
 * @swagger
 * tags:
 *   name: Instruments
 *   description: Gestión de instrumentos musicales
 */

/**
 * @swagger
 * /api/instruments:
 *   post:
 *     summary: Crear un nuevo instrumento
 *     tags: [Instruments]
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
 *               - type
 *             properties:
 *               name:
 *                 type: string
 *               brand:
 *                 type: string
 *               year:
 *                 type: integer
 *               type:
 *                 type: string
 *               details:
 *                 type: string
 *     responses:
 *       201:
 *         description: Instrumento creado
 */
router.post('/', auth, async (req, res) => {
     try {
     const typeExists = await InstrumentType.findById(req.body.type);
     if(!typeExists) return res.status(400).json({ msg: 'Invalid type' });

     const inst = new Instrument(req.body);
     await inst.save();
     res.status(201).json(inst);
     } catch (err) {
     res.status(400).json({ error: err.message });
     }
});

/**
 * @swagger
 * /api/instruments:
 *   get:
 *     summary: Listar todos los instrumentos
 *     tags: [Instruments]
 *     responses:
 *       200:
 *         description: Lista de instrumentos
 */
router.get('/', async (req, res) => {
     const items = await Instrument.find().populate('type');
     res.json(items);
});

/**
 * @swagger
 * /api/instruments/{id}:
 *   get:
 *     summary: Obtener un instrumento por ID
 *     tags: [Instruments]
 */
router.get('/:id', async (req, res) => {
     const item = await Instrument.findById(req.params.id).populate('type');
     if(!item) return res.status(404).json({ msg: 'Not found' });
     res.json(item);
});

/**
 * @swagger
 * /api/instruments/{id}:
 *   put:
 *     summary: Actualizar un instrumento
 *     tags: [Instruments]
 *     security:
 *       - bearerAuth: []
 */
router.put('/:id', auth, async (req, res) => {
     const item = await Instrument.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('type');
     res.json(item);
});

/**
 * @swagger
 * /api/instruments/{id}:
 *   delete:
 *     summary: Eliminar un instrumento
 *     tags: [Instruments]
 *     security:
 *       - bearerAuth: []
 */
router.delete('/:id', auth, async (req, res) => {
     await Instrument.findByIdAndDelete(req.params.id);
     res.json({ msg: 'Deleted' });
});

module.exports = router;