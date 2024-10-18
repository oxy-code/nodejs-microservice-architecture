const ValidateInput = require('../src/validator');

describe('Validator', ()=>{
    it('should throws an error for invalid input', () => {
        const testData = {
            mockField: 'data'
        };
        expect(() => ValidateInput(testData)).toThrow('INVALID_PAYLOAD');
    });

    it('should throws an error for missing title', () => {
        const testData = {
            description: 'mock description'
        };
        try {
            ValidateInput(testData);
        }
        catch(e) {
            expect(e.message).toBe('INVALID_PAYLOAD');
            expect(e.cause).toContainEqual({"keyword": "required", "message": "must have required property 'title'", "params": {"missingProperty": "title"}})
        }
    });

    it('should throws an error for missing description', () => {
        const testData = {
            title: 'mock title'
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
            title: 'mock title',
            description: 'mock description'
        };
        const valid = ValidateInput(testData);
        expect(valid).toBeTruthy();
    });
});