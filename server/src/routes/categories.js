const { Router } = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const auth = require('../middleware/auth');
const cc = require('../controllers/categoryController');

const router = Router();
router.use(auth);

router.get('/', cc.getCategories);

router.post(
  '/',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('type').isIn(['income', 'expense']),
    validate,
  ],
  cc.createCategory
);

router.put(
  '/:id',
  [
    body('name').optional().trim().notEmpty(),
    body('type').optional().isIn(['income', 'expense']),
    validate,
  ],
  cc.updateCategory
);

router.delete('/:id', cc.deleteCategory);

module.exports = router;
