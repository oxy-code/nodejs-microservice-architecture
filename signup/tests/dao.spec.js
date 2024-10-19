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
                project: {
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

    it('should create a project data using prisma client', async()=>{
        const testData = {
            title: 'mock title',
            description: 'mock description'
        };
        mockPrismaCreate.mockResolvedValueOnce({});
        await DAO.createProject(testData);
        expect(mockPrismaCreate).toBeCalledWith({data: testData});
        expect(mockPrismaDisconnect).toBeCalled();
    });

    it('should throw an error while creating a project with invalid data using prisma client', async()=>{
        const testData = {
            unknown: 'invalid data',
        };
        const error = new Error('Invalid Data');
        mockPrismaCreate.mockRejectedValueOnce(error);
        try {
            await DAO.createProject(testData)
        }
        catch(e) {
            expect(e.message).toBe('Error creating a new project');
            expect(e.cause).toEqual(error.stack);
            expect(mockPrismaCreate).toBeCalledWith({data: testData});
            expect(mockPrismaDisconnect).toBeCalled();
        }
    });
})