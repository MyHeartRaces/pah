const express = require('express');
const router = express.Router();
const historyController = require('../controllers/historyController');

router.post('/', historyController.createAction);
router.get('/', historyController.getActions);

module.exports = router;
