const ValidateInput = require('../src/validator');

describe('Validator', ()=>{
    it('should throws an error for invalid input', () => {
        const testData = {
            mockField: 'data'
        };
        expect(() => ValidateInput(testData)).toThrow('INVALID_PAYLOAD');
    });

    it('should throws an error for missing name', () => {
        const testData = {
            email: 'mockemail@dot.com',
            password: 'mockpassword'
        };
        try {
            ValidateInput(testData);
        }
        catch(e) {
            expect(e.message).toBe('INVALID_PAYLOAD');
            expect(e.cause).toContainEqual({"keyword": "required", "message": "must have required property 'name'", "params": {"missingProperty": "name"}})
        }
    });

    it('should throws an error for missing email', () => {
        const testData = {
            name: 'mock name',
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

    it('should throws an error for missing password', () => {
        const testData = {
            name: 'mock name',
            email: 'mockemail@dot.com'
        };
        try {
            ValidateInput(testData);
        }
        catch(e) {
            expect(e.message).toBe('INVALID_PAYLOAD');
            expect(e.cause).toContainEqual({"keyword": "required", "message": "must have required property 'password'", "params": {"missingProperty": "password"}})
        }
    });

    it('should return true for valid input', () => {
        const testData = {
            name: 'mock name',
            email: 'mockemail@dot.com',
            password: 'mockpassword'
        };
        const valid = ValidateInput(testData);
        expect(valid).toBeTruthy();
    });
});