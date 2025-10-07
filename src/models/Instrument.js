const mongoose = require('mongoose');

const InstrumentSchema = new mongoose.Schema({
     name: { type: String, required: true },
     brand: { type: String },
     year: { type: Number },
     type: { type: mongoose.Schema.Types.ObjectId, ref: 'InstrumentType', required: true },
     details: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Instrument', InstrumentSchema);