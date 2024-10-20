const mockPrismaDisconnect = jest.fn();
const mockPrismaUpdate = jest.fn();
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
                    update: mockPrismaUpdate
                },
                $disconnect: mockPrismaDisconnect
            }
        })
    }
})

const DAO = require('../src/dao');

describe('DAO', () => {
    const id = 1;
    const data = {
        title: 'mock title',
    };
    afterAll(()=>{
        jest.clearAllMocks();
    });

    it('should update task with params using prisma client', async()=>{
        mockPrismaUpdate.mockResolvedValueOnce;
        await DAO.update({...data, id});
        expect(mockPrismaUpdate).toHaveBeenCalledWith({where: {id}, data});
        expect(mockPrismaDisconnect).toHaveBeenCalled();
    });

    it('should throw an error while update task using prisma client', async()=>{
        const error = new Error('Invalid Data');
        mockPrismaUpdate.mockRejectedValueOnce(error);
        try {
            await DAO.update(data)
        }
        catch(e) {
            expect(e.message).toBe('Error updating a task');
            expect(e.cause).toEqual(error.stack);
            expect(mockPrismaUpdate).toHaveBeenCalledWith({where: {id}, data});
            expect(mockPrismaDisconnect).toBeCalled();
        }
    });
})