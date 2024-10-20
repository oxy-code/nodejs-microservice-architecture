const express = require('express');
const app = express();
const PORT = process.env.PORT;
const SERVICE_NAME = require('./package.json').name;
const v1Router = require('./src/route');
const { RequestTracking, Logger } = require('@oxycode/express-utilities');

// json body parser
app.use(express.json());

// Request Tracking Middleware
app.use(RequestTracking);

app.use('/v1', v1Router);

// handling errors thrown from the router
app.use((err, req, res, next) => {
    if (err) {
        Logger.error(err.message, err);
        return res.status(500).json({
            message: err.message,
            details: err.cause
        });
    }
    next(null, req, res);
});

app.listen(PORT, () => {
    Logger.info(`${SERVICE_NAME} service is running on port ${PORT}`);
});

process.on('uncaughtException', (error) => {
    Logger.error('uncaught exception', error);
});

process.on('unhandledRejection', (error) => {
    Logger.error('unhandled rejection', error);
});