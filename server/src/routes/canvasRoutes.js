const { Router } = require('express');
const ctrl = require('../controllers/canvasController');

const router = Router();

router.post('/', ctrl.createCanvas);
router.get('/', ctrl.listCanvases);
router.get('/:id', ctrl.getCanvas);
router.put('/:id', ctrl.updateCanvas);
router.delete('/:id', ctrl.deleteCanvas);

module.exports = router;
