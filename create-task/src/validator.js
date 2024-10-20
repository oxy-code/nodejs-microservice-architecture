const Ajv = require("ajv");
const addFormats = require('ajv-formats');
/**
 * JSON schema for the POST /tasks service
 */
const PAYLOAD_SCHEMA = {
    type: "object",
    properties: {
        title: {
            type: "string"
        },
        description: {
            type: "string"
        },
        status: {
            enum: ['Active', 'Completed', 'Archived'],
        },
        priority: {
            enum: ['Low', 'Medium', 'High', 'Urgent'],
        },
        dueDate: {
            type: "string",
            format: "iso-date-time"
        },
        userId: {type: "number"},
        projectId: {type: "number"},
    },
    required: ["title", "description", "dueDate", "userId", "projectId"],
    additionalProperties: false,
};

/**
 * It exports a function which can validate the payload
 * against the PAYLOAD_SCHEMA
 * @param {json} payload 
 * @returns boolean or throw error an if validation failed
 */
module.exports = (payload) => {
    const ajv = new Ajv({allErrors: true, messages: true})
    addFormats(ajv);
    const validate = ajv.compile(PAYLOAD_SCHEMA);
    const valid = validate(payload); 
    if (!valid) {
        // removing unwanted fields from the validation.errors
        // and returning only the relevant fields
        const formattedErrors = validate.errors.map((({keyword, params, message}) => {
            return {
                keyword,
                params,
                message
            }
        }));
        throw new Error('INVALID_PAYLOAD', { cause: formattedErrors });
    }
    return true;
};