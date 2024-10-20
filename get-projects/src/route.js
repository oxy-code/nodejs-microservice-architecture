const express = require('express');
const { Logger } = require('@oxycode/express-utilities');
const Router = express.Router();
const ValidateInput = require('./validator');
const DAO = require('./dao');

/**
 * Endpoint GET /projects
 * Used to fetch all the items
 */
Router.get('/projects', async (req, res, next) => {
    const payload = req.query;
    
    try {
        // Validating API inputs against the predefined json schema
        ValidateInput(payload);

        // Accessing Data layer
        const projects = await DAO.getProjects(payload);

        res.json(projects);
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