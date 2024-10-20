const ValidateInput = require('../src/validator');

describe('Validator', ()=>{
    it('should throws an error for invalid input', () => {
        const testData = {
            mockField: 'data'
        };
        expect(() => ValidateInput(testData)).toThrow('INVALID_PAYLOAD');
    });

    it('should throws an error for invalid status', () => {
        const testData = {
            status: 'mock',
            userId: 1,
            projectId: 1,
        };
        try {
            ValidateInput(testData);
        }
        catch(e) {
            expect(e.message).toBe('INVALID_PAYLOAD');
            expect(e.cause).toContainEqual({"keyword": "enum", "message": "must be equal to one of the allowed values", "params": {"allowedValues": ["Active", "Completed", "Archived"]}})
        }
    });

    it('should throws an error for missing status', () => {
        const testData = {
            priority: 'Low',
            userId: 1,
            projectId: 1,
        };
        try {
            ValidateInput(testData);
        }
        catch(e) {
            expect(e.message).toBe('INVALID_PAYLOAD');
            expect(e.cause).toContainEqual({"keyword": "required", "message": "must have required property 'description'", "params": {"missingProperty": "description"}})
        }
    });

    it('should return true for valid input', () => {
        const testData = {
            userId: 1,
            projectId: 1,
        };
        const valid = ValidateInput(testData);
        expect(valid).toBeTruthy();
    });
});