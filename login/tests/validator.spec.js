const ValidateInput = require('../src/validator');

describe('Validator', ()=>{
    it('should throws an error for invalid input', () => {
        const testData = {
            mockField: 'data'
        };
        expect(() => ValidateInput(testData)).toThrow('INVALID_PAYLOAD');
    });

    it('should throws an error for missing password', () => {
        const testData = {
            email: 'mock@email.com'
        };
        try {
            ValidateInput(testData);
        }
        catch(e) {
            expect(e.message).toBe('INVALID_PAYLOAD');
            expect(e.cause).toContainEqual({"keyword": "required", "message": "must have required property 'password'", "params": {"missingProperty": "password"}})
        }
    });

    it('should throws an error for missing email', () => {
        const testData = {
            password: 'mockpassword'
        };
        try {
            ValidateInput(testData);
        }
        catch(e) {
            expect(e.message).toBe('INVALID_PAYLOAD');
            expect(e.cause).toContainEqual({"keyword": "required", "message": "must have required property 'email'", "params": {"missingProperty": "email"}})
        }
    });

    it('should return true for valid input', () => {
        const testData = {
            email: 'mock@email.com',
            password: 'mockpassword'
        };
        const valid = ValidateInput(testData);
        expect(valid).toBeTruthy();
    });
});