const Ajv = require("ajv");

/**
 * JSON schema for the GET /projects?{queryParams} schema
 */
const PAYLOAD_SCHEMA = {
    type: "object",
    properties: {
        id: {
            type: "number",
        },
        name: {
            type: "string"
        },
        password: {
            type: "string",
            minLength: 8
        },
    },
    required: ["id"],
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