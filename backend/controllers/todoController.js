const todoService = require('../services/todoService');

/**
 * TodoController — HTTP request/response handling only.
 *
 * SOLID — Single Responsibility Principle:
 *   Extracts data from req, calls the service, sends a JSON response.
 *   Contains zero business logic and zero data-access logic.
 */

/**
 * GET /api/todos
 * Supports query params: ?search=, ?status=, ?priority=, ?sortBy=, ?sortDir=
 */
async function getAllTodos(req, res, next) {
  try {
    const todos = await todoService.getAllTodos(req.query);
    res.status(200).json({ success: true, count: todos.length, data: todos });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/todos/:id
 */
async function getTodoById(req, res, next) {
  try {
    const todo = await todoService.getTodoById(req.params.id);
    res.status(200).json({ success: true, data: todo });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/todos
 */
async function createTodo(req, res, next) {
  try {
    const todo = await todoService.createTodo(req.body);
    res.status(201).json({ success: true, data: todo });
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /api/todos/:id
 */
async function updateTodo(req, res, next) {
  try {
    const todo = await todoService.updateTodo(req.params.id, req.body);
    res.status(200).json({ success: true, data: todo });
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/todos/:id
 */
async function deleteTodo(req, res, next) {
  try {
    await todoService.deleteTodo(req.params.id);
    res.status(200).json({ success: true, message: 'Todo deleted successfully.' });
  } catch (err) {
    next(err);
  }
}

module.exports = { getAllTodos, getTodoById, createTodo, updateTodo, deleteTodo };
