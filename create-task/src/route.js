const express = require('express');
const { Logger } = require('@oxycode/express-utilities');
const Router = express.Router();
const ValidateInput = require('./validator');
const DAO = require('./dao');

/**
 * Endpoint POST /tasks
 * Used to save new project
 */
Router.post('/tasks', async (req, res, next) => {
    const payload = req.body;

    try {
        // Validating API inputs against the predefined json schema
        ValidateInput(payload);

        // Accessing Data layer to create new task
        await DAO.createTask(payload);

        res.json({
            message: `Task '${payload.title}' created successfully`
        });
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