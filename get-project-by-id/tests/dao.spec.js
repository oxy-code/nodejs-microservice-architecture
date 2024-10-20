const mockPrismaDisconnect = jest.fn();
const mockPrismaFindUnique = jest.fn();
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
                    findUnique: mockPrismaFindUnique
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

    it('should not get projects when no queryParams using prisma client', async()=>{
        const testData = {};
        mockPrismaFindUnique.mockResolvedValueOnce({});
        const data = await DAO.getProjects(testData);
        expect(data.project).toEqual({});
        expect(mockPrismaFindUnique).toHaveBeenCalledWith({where: testData});
        expect(mockPrismaDisconnect).toHaveBeenCalled();
    });

    it('should get projects with queryParams using prisma client', async()=>{
        const testData = {
            id: 1,
        };
        const mockProject = [{
            title: 'mock title',
            description: 'mock desc',
            status: 'Active'
        }];
        mockPrismaFindUnique.mockResolvedValueOnce(mockProject);
        const data = await DAO.getProjects(testData);
        expect(data.project).toBe(mockProject);
        expect(mockPrismaFindUnique).toHaveBeenCalledWith({where: testData});
        expect(mockPrismaDisconnect).toHaveBeenCalled();
    });

    it('should get projects including tasks with queryParams using prisma client', async()=>{
        const testData = {
            id: 1,
        };
        const mockProject = [{
            title: 'mock title',
            description: 'mock desc',
            status: 'Active',
            tasks: [{
                title: 'mock task title',
                description: 'task desc',
                status: 'Active',
            }]
        }];
        mockPrismaFindUnique.mockResolvedValueOnce(mockProject);
        const data = await DAO.getProjectTasks(testData);
        expect(data.project).toBe(mockProject);
        expect(mockPrismaFindUnique).toHaveBeenCalledWith({where: testData});
        expect(mockPrismaDisconnect).toHaveBeenCalled();
    });

    it('should throw an error while fetching projects using prisma client', async()=>{
        const testData = {
            id: 1,
        };
        const error = new Error('Invalid Data');
        mockPrismaFindUnique.mockRejectedValueOnce(error);
        try {
            await DAO.getProjects(testData)
        }
        catch(e) {
            expect(e.message).toBe('Error fetching projects');
            expect(e.cause).toEqual(error.stack);
            expect(mockPrismaFindUnique).toBeCalledWith({where: testData});
            expect(mockPrismaDisconnect).toBeCalled();
        }
    });
})