const mockPrismaDisconnect = jest.fn();
const mockPrismaDelete = jest.fn();
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
                    delete: mockPrismaDelete
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

    it('should delete task with queryParams using prisma client', async()=>{
        const testData = {
            id: 1,
        };
        mockPrismaDelete.mockResolvedValueOnce();
        await DAO.deleteTask(testData);
        expect(mockPrismaDelete).toHaveBeenCalledWith({where: testData});
        expect(mockPrismaDisconnect).toHaveBeenCalled();
    });

    it('should throw an error while deleting task using prisma client', async()=>{
        const testData = {
            id: 1,
        };
        const error = new Error('Invalid Data');
        mockPrismaDelete.mockRejectedValueOnce(error);
        try {
            await DAO.deleteTask(testData)
        }
        catch(e) {
            expect(e.message).toBe('Error deleting a task');
            expect(e.cause).toEqual(error.stack);
            expect(mockPrismaDelete).toBeCalledWith({where: testData});
            expect(mockPrismaDisconnect).toBeCalled();
        }
    });
})