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
            description: 'mock description',
            userId: 1,
            projectId: 1,
            dueDate: '2025-11-20T13:57:42.664Z'
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
            title: 'mock title',
            userId: 1,
            projectId: 1,
            dueDate: '2025-11-20T13:57:42.664Z'
        };
        try {
            ValidateInput(testData);
        }
        catch(e) {
            expect(e.message).toBe('INVALID_PAYLOAD');
            expect(e.cause).toContainEqual({"keyword": "required", "message": "must have required property 'description'", "params": {"missingProperty": "description"}})
        }
    });

    it('should throws an error for invalid dueDate', () => {
        const testData = {
            title: 'mock title',
            description: 'mock desc',
            userId: 1,
            projectId: 1,
            dueDate: 'sdf'
        };
        try {
            ValidateInput(testData);
        }
        catch(e) {
            expect(e.message).toBe('INVALID_PAYLOAD');
            expect(e.cause).toContainEqual({"keyword": "format", "message": "must match format \"iso-date-time\"", "params": {"format": "iso-date-time"}})
        }
    });

    it('should return true for valid input', () => {
        const testData = {
            title: 'mock title',
            description: 'mock description',
            userId: 1,
            projectId: 1,
            dueDate: '2025-11-20T13:57:42.664Z'
        };
        const valid = ValidateInput(testData);
        expect(valid).toBeTruthy();
    });
});