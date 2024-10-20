const express = require('express');
const { Logger } = require('@oxycode/express-utilities');
const Router = express.Router();
const ValidateInput = require('./validator');
const DAO = require('./dao');

/**
 * Endpoint POST /auth/login
 * Used to authenticate against credentials
 */
Router.post('/auth/login', async (req, res, next) => {
    const payload = req.body;

    try {
        // Validating API inputs against the predefined json schema
        ValidateInput(payload);

        // Accessing Data layer to create new project
        const data = await DAO.login(payload);

        res.json(data);
    }
    catch(e) {
        if (e.message === 'INVALID_PAYLOAD') {
            Logger.error('Invalid Payload', e);
            res.status(400).json({
                message: 'Invalid Payload',
                details: e.cause
            });
        }
        else if (e.message === 'INVALID_USER') {
            Logger.error('Invalid user', e);
            res.status(401).json({
                message: 'Invalid user',
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