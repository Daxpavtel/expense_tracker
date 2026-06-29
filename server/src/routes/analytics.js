const { Router } = require('express');
const auth = require('../middleware/auth');
const ac = require('../controllers/analyticsController');

const router = Router();
router.use(auth);

router.get('/monthly', ac.monthlySummary);
router.get('/yearly', ac.yearlySummary);

module.exports = router;
