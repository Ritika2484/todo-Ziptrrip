const historyService = require('../services/historyService');

/**
 * HistoryController — HTTP adapter for the history audit log.
 *
 * SOLID — Single Responsibility:
 *   Extracts query/params from req, delegates to service, sends JSON.
 *   Zero business logic here.
 */

/**
 * GET /api/history
 * Supports ?action=, ?search=, ?todoId=, ?limit=
 */
async function getAllHistory(req, res, next) {
  try {
    const entries = await historyService.getAllHistory(req.query);
    res.status(200).json({ success: true, count: entries.length, data: entries });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/history/todo/:todoId
 */
async function getHistoryByTodoId(req, res, next) {
  try {
    const entries = await historyService.getHistoryByTodoId(req.params.todoId);
    res.status(200).json({ success: true, count: entries.length, data: entries });
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/history
 * Clears all history entries. Requires { confirm: true } in body.
 */
async function clearHistory(req, res, next) {
  try {
    if (!req.body || req.body.confirm !== true) {
      const err = new Error('Send { "confirm": true } in the request body to clear history.');
      err.statusCode = 400;
      throw err;
    }
    await historyService.clearHistory();
    res.status(200).json({ success: true, message: 'History cleared successfully.' });
  } catch (err) {
    next(err);
  }
}

module.exports = { getAllHistory, getHistoryByTodoId, clearHistory };
