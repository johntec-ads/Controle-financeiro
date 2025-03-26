const { Transaction } = require('../db');

class TransactionController {
  async index(req, res) {
    try {
      const transactions = await Transaction.find();
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async store(req, res) {
    try {
      const transaction = await Transaction.create(req.body);
      res.status(201).json(transaction);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async update(req, res) {
    try {
      const transaction = await Transaction.findByIdAndUpdate(
        req.params.id, 
        req.body,
        { new: true }
      );
      res.json(transaction);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async destroy(req, res) {
    try {
      await Transaction.findByIdAndDelete(req.params.id);
      res.status(204).end();
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new TransactionController();
