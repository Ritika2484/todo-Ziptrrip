const { Router } = require('express');
const {
  getAllTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo,
} = require('../controllers/todoController');

/**
 * Todo routes — endpoint definitions only.
 * Delegates immediately to the controller; contains zero logic.
 *
 * SOLID — Single Responsibility Principle:
 *   This file owns URL mapping and HTTP method binding only.
 */
const router = Router();

router.get('/',     getAllTodos);
router.get('/:id',  getTodoById);
router.post('/',    createTodo);
router.put('/:id',  updateTodo);
router.delete('/:id', deleteTodo);

module.exports = router;
