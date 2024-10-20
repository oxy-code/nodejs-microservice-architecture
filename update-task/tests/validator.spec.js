const ValidateInput = require('../src/validator');

describe('Validator', ()=>{

    it('should throws an error for missing id', () => {
        const testData = {};
        try {
            ValidateInput(testData);
        }
        catch(e) {
            expect(e.message).toBe('INVALID_PAYLOAD');
            expect(e.cause).toContainEqual({"keyword": "required", "message": "must have required property 'id'", "params": {"missingProperty": "id"}})
        }
    });

    it('should return true for empty input', () => {
        const testData = {
            id: 1,
            title: 'mock title',
            description: 'mock description'
        };
        const valid = ValidateInput(testData);
        expect(valid).toBeTruthy();
    });
});