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
                project: {
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

    it('should get all projects when no queryParams using prisma client', async()=>{
        const testData = {};
        mockPrismaFindMany.mockResolvedValueOnce([]);
        const data = await DAO.getProjects(testData);
        expect(data.projects).toEqual([]);
        expect(mockPrismaFindMany).toHaveBeenCalledWith();
        expect(mockPrismaDisconnect).toHaveBeenCalled();
    });

    it('should get all projects with queryParams using prisma client', async()=>{
        const testData = {
            status: 'Active',
        };
        const mockTasks = [{
            title: 'mock title',
            description: 'mock desc',
            status: 'Active'
        }];
        mockPrismaFindMany.mockResolvedValueOnce(mockTasks);
        const data = await DAO.getProjects(testData);
        expect(data.projects).toBe(mockTasks);
        expect(mockPrismaFindMany).toHaveBeenCalledWith({where: testData});
        expect(mockPrismaDisconnect).toHaveBeenCalled();
    });

    it('should throw an error while fetching projects using prisma client', async()=>{
        const testData = {
            status: 'Active',
        };
        const error = new Error('Invalid Data');
        mockPrismaFindMany.mockRejectedValueOnce(error);
        try {
            await DAO.getProjects(testData)
        }
        catch(e) {
            expect(e.message).toBe('Error fetching projects');
            expect(e.cause).toEqual(error.stack);
            expect(mockPrismaFindMany).toBeCalledWith({where: testData});
            expect(mockPrismaDisconnect).toBeCalled();
        }
    });
})