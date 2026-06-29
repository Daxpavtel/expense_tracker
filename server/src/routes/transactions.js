const { Router } = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const auth = require('../middleware/auth');
const tc = require('../controllers/transactionController');

const router = Router();
router.use(auth);

router.get('/', tc.getTransactions);
router.get('/:id', tc.getTransaction);

router.post(
  '/',
  [
    body('type').isIn(['income', 'expense']),
    body('amount').isFloat({ min: 0.01 }),
    body('category').isMongoId(),
    body('date').optional().isISO8601(),
    validate,
  ],
  tc.createTransaction
);

router.put(
  '/:id',
  [
    body('type').optional().isIn(['income', 'expense']),
    body('amount').optional().isFloat({ min: 0.01 }),
    body('category').optional().isMongoId(),
    body('date').optional().isISO8601(),
    validate,
  ],
  tc.updateTransaction
);

router.delete('/:id', tc.deleteTransaction);

module.exports = router;
