const express = require('express');
const { v4: uuidv4 } = require('uuid');
const app = express();
const PORT = process.env.PORT;
const SERVICE_NAME = require('./package.json').name;
const ProjectRouter = require('./src/route');

// json body parser
app.use(express.json());

app.use('/v1', (req, res, next) => {
    res.setHeader('reqTrackingId', uuidv4());
    next(null, req, res);
}, ProjectRouter);

// handling errors thrown from the router
app.use((err, req, res, next) => {
    if (err) {
        // implement logger to print error stack
        res.status(500).json({
            message: err.message,
            details: err.cause
        });
    }
    next(null, req, res);
});

app.listen(PORT, () => {
    console.log(`${SERVICE_NAME} service is running on port ${PORT}`);
});

process.on('uncaughtException', (error) => {
    console.log('uncaught exception', error);
});

process.on('unhandledRejection', (error) => {
    console.log('unhandled rejection', error);
});