const express = require('express');
const { Logger } = require('@oxycode/express-utilities');
const Router = express.Router();
const ValidateInput = require('./validator');
const DAO = require('./dao');

/**
 * Endpoint PUT /tasks/:id
 * Used to update single item
 */
Router.put('/tasks/:id', async (req, res, next) => {
    const payload = {...req.params, ...req.body};
    if (typeof(payload.id) === "string") payload.id = parseInt(payload.id);
    try {
        // Validating API inputs against the predefined json schema
        ValidateInput(payload);

        // Accessing Data layer
        await DAO.update(payload);

        res.json({
            message: 'Task has been updated'
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