const { Router } = require('express');
const {
  getAllHistory,
  getHistoryByTodoId,
  clearHistory,
} = require('../controllers/historyController');

/**
 * History routes — endpoint definitions only.
 *
 * SOLID — Single Responsibility:
 *   URL + method mapping. No logic.
 */
const router = Router();

router.get('/',               getAllHistory);
router.get('/todo/:todoId',   getHistoryByTodoId);
router.delete('/',            clearHistory);

module.exports = router;
