const mockPrismaDisconnect = jest.fn();
const mockPrismaCreate = jest.fn();
/**
 * Below code mocks @prisma/client package
 * and returns only mocked client which
 * will act as mock stub to assert the calls
 */
jest.mock('@prisma/client', ()=>{
    return {
        PrismaClient: jest.fn().mockImplementation(()=>{
            return {
                task: {
                    create: mockPrismaCreate
                },
                $disconnect: mockPrismaDisconnect
            }
        })
    }
})

const DAO = require('../src/dao');

describe('DAO', () => {
    afterAll(()=>{
        jest.clearAllMocks();
    });

    it('should create a task data using prisma client', async()=>{
        const testData = {
            title: 'mock title',
            description: 'mock description',
            userId: 1,
            projectId: 1,
            dueDate: '2025-11-20T13:57:42.664Z'
        };
        mockPrismaCreate.mockResolvedValueOnce({});
        await DAO.createTask(testData);
        expect(mockPrismaCreate).toBeCalledWith({data: testData});
        expect(mockPrismaDisconnect).toBeCalled();
    });

    it('should throw an error while creating a task with invalid data using prisma client', async()=>{
        const testData = {
            unknown: 'invalid data',
        };
        const error = new Error('Invalid Data');
        mockPrismaCreate.mockRejectedValueOnce(error);
        try {
            await DAO.createTask(testData)
        }
        catch(e) {
            expect(e.message).toBe('Error creating a new task');
            expect(e.cause).toEqual(error.stack);
            expect(mockPrismaCreate).toBeCalledWith({data: testData});
            expect(mockPrismaDisconnect).toBeCalled();
        }
    });
})