const express = require('express');
const { Logger } = require('@oxycode/express-utilities');
const Router = express.Router();
const ValidateInput = require('./validator');
const DAO = require('./dao');

/**
 * Endpoint GET /tasks
 * Used to fetch all the items
 */
Router.get('/tasks', async (req, res, next) => {
    const payload = req.query;
    if (typeof(payload.projectId) === "string") payload.projectId = parseInt(payload.projectId);
    if (typeof(payload.userId) === "string") payload.userId = parseInt(payload.userId);
    try {
        // Validating API inputs against the predefined json schema
        ValidateInput(payload);

        // Accessing Data layer
        const tasks = await DAO.getTasks(payload);

        res.json(tasks);
    }
    catch(e) {
        if (e.message === 'INVALID_PAYLOAD') {
            Logger.error('Invalid Payload', e);
            res.status(400).json({
                message: 'Invalid Payload',
                details: e.cause
            });
        }
        else {
            // passing the execution to common error handler in index.js
            next(e, req, res);
        }
    }
});

module.exports = Router;