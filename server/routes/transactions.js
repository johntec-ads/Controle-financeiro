const express = require('express');
const router = express.Router();
const TransactionController = require('../controllers/TransactionController');

router.get('/transactions', TransactionController.index);
router.post('/transactions', TransactionController.store);
router.put('/transactions/:id', TransactionController.update);
router.delete('/transactions/:id', TransactionController.destroy);

module.exports = router;
