const Canvas = require('../models/Canvas');

const isCastError = (err) => err.name === 'CastError';

exports.createCanvas = async (req, res, next) => {
  try {
    const { name, elements } = req.body;
    if (!name || typeof name !== 'string') {
      return res.status(400).json({ error: 'name is required and must be a string' });
    }
    const canvas = await Canvas.create({ name, elements: elements || [] });
    res.status(201).json(canvas);
  } catch (err) {
    next(err);
  }
};

exports.listCanvases = async (_req, res, next) => {
  try {
    const canvases = await Canvas.find()
      .select('name createdAt updatedAt')
      .sort({ updatedAt: -1 });
    res.json(canvases);
  } catch (err) {
    next(err);
  }
};

exports.getCanvas = async (req, res, next) => {
  try {
    const canvas = await Canvas.findById(req.params.id);
    if (!canvas) return res.status(404).json({ error: 'canvas not found' });
    res.json(canvas);
  } catch (err) {
    if (isCastError(err)) return res.status(400).json({ error: 'invalid canvas id' });
    next(err);
  }
};

exports.updateCanvas = async (req, res, next) => {
  try {
    const updates = {};
    if (req.body.name !== undefined) updates.name = req.body.name;
    if (req.body.elements !== undefined) updates.elements = req.body.elements;

    const canvas = await Canvas.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });
    if (!canvas) return res.status(404).json({ error: 'canvas not found' });
    res.json(canvas);
  } catch (err) {
    if (isCastError(err)) return res.status(400).json({ error: 'invalid canvas id' });
    next(err);
  }
};

exports.deleteCanvas = async (req, res, next) => {
  try {
    const canvas = await Canvas.findByIdAndDelete(req.params.id);
    if (!canvas) return res.status(404).json({ error: 'canvas not found' });
    res.status(204).end();
  } catch (err) {
    if (isCastError(err)) return res.status(400).json({ error: 'invalid canvas id' });
    next(err);
  }
};
