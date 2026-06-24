const { Router } = require('express');
const {
  getAllTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo,
  toggleTodo,
} = require('../controllers/todoController');


/**
 * Todo routes — endpoint definitions only.
 * Delegates immediately to the controller; contains zero logic.
 *
 * SOLID — Single Responsibility Principle:
 *   This file owns URL mapping and HTTP method binding only.
 */
const router = Router();

router.get('/',             getAllTodos);
router.get('/:id',          getTodoById);
router.post('/',            createTodo);
router.put('/:id',          updateTodo);
router.delete('/:id',       deleteTodo);
router.patch('/:id/toggle', toggleTodo);  // dedicated atomic toggle


module.exports = router;
