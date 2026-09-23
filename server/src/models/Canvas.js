const mongoose = require('mongoose');

const elementSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    type: { type: String, enum: ['rect', 'circle', 'text'], required: true },
    x: { type: Number, required: true },
    y: { type: Number, required: true },
    width: Number,
    height: Number,
    rotation: { type: Number, default: 0 },
    fill: { type: String, default: '#000000' },
    text: String,
    fontSize: { type: Number, default: 20 },
  },
  { _id: false }
);

const canvasSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    elements: [elementSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Canvas', canvasSchema);
