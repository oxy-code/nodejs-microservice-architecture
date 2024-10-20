const mockPrismaDisconnect = jest.fn();
const mockPrismaFindMany = jest.fn();
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
                    findMany: mockPrismaFindMany
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

    it('should get all tasks when no queryParams using prisma client', async()=>{
        const testData = {};
        mockPrismaFindMany.mockResolvedValueOnce([]);
        const data = await DAO.getTasks(testData);
        expect(data.tasks).toEqual([]);
        expect(mockPrismaFindMany).toHaveBeenCalledWith();
        expect(mockPrismaDisconnect).toHaveBeenCalled();
    });

    it('should get all tasks with queryParams using prisma client', async()=>{
        const testData = {
            projectId: 100,
        };
        const mockTasks = [{
            title: 'mock title',
            description: 'mock desc',
            status: 'Active'
        }];
        mockPrismaFindMany.mockResolvedValueOnce(mockTasks);
        const data = await DAO.getTasks(testData);
        expect(data.tasks).toBe(mockTasks);
        expect(mockPrismaFindMany).toHaveBeenCalledWith({where: testData});
        expect(mockPrismaDisconnect).toHaveBeenCalled();
    });

    it('should throw an error while fetching tasks using prisma client', async()=>{
        const testData = {
            projectId: 100,
        };
        const error = new Error('Invalid Data');
        mockPrismaFindMany.mockRejectedValueOnce(error);
        try {
            await DAO.getTasks(testData)
        }
        catch(e) {
            expect(e.message).toBe('Error fetching tasks');
            expect(e.cause).toEqual(error.stack);
            expect(mockPrismaFindMany).toBeCalledWith({where: testData});
            expect(mockPrismaDisconnect).toBeCalled();
        }
    });
})