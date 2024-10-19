const express = require('express');
const { Logger } = require('@oxycode/express-utilities');
const Router = express.Router();
const ValidateInput = require('./validator');
const DAO = require('./dao');

/**
 * Endpoint POST /users
 * Used to save new project
 */
Router.post('/users', async (req, res, next) => {
    const payload = req.body;

    try {
        // Validating API inputs against the predefined json schema
        ValidateInput(payload);

        // check user email has been already registered
        await DAO.checkUserIsAlreadyExist(payload.email);

        // Accessing Data layer to create new project
        await DAO.registerUser(payload);

        res.json({
            message: `User '${payload.name}' registered successfully`
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
        else if (e.message === 'EMAIL_ALREADY_IN_USE') {
            Logger.error('Email already in use', e);
            res.status(400).json({
                message: 'Email already in use',
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