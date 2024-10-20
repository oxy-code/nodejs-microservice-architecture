const ValidateInput = require('../src/validator');

describe('Validator', ()=>{

    it('should throws an error for invalid status', () => {
        const testData = {
            status: 'mock',
        };
        try {
            ValidateInput(testData);
        }
        catch(e) {
            expect(e.message).toBe('INVALID_PAYLOAD');
            expect(e.cause).toContainEqual({"keyword": "enum", "message": "must be equal to one of the allowed values", "params": {"allowedValues": ["Active", "Completed", "Archived"]}})
        }
    });

    it('should return true for empty input', () => {
        const testData = {};
        const valid = ValidateInput(testData);
        expect(valid).toBeTruthy();
    });
});