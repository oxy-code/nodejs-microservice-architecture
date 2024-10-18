const express = require('express');
const Router = express.Router();
const ValidateInput = require('./validator');
const DAO = require('./dao');

/**
 * Endpoint POST /projects
 * Used to save new project
 */
Router.post('/projects', async (req, res, next) => {
    const payload = req.body;

    try {
        // Validating API inputs against the predefined json schema
        ValidateInput(payload);

        // Accessing Data layer to create new project
        await DAO.createProject(payload);

        res.json({
            message: `Project '${payload.title}' created successfully`
        });
    }
    catch(e) {
        if (e.message === 'INVALID_PAYLOAD') {
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