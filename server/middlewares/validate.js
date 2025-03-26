const { validationResult, check } = require('express-validator');

exports.validateTransaction = [
  check('name').notEmpty().trim().escape(),
  check('amount').isNumeric(),
  check('category').notEmpty(),
  check('date').isISO8601(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];
