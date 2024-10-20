const mockPrismaDisconnect = jest.fn();
const mockPrismaCreate = jest.fn();
const mockRedisClient = {
    connect: jest.fn(),
    sIsMember: jest.fn(),
    sAdd: jest.fn(),
    disconnect: jest.fn()
};
const mockHashSync = jest.fn();
/**
 * Below code mocks @prisma/client package
 * and returns only mocked client which
 * will act as mock stub to assert the calls
 */
jest.mock('@prisma/client', ()=>{
    return {
        PrismaClient: jest.fn().mockImplementation(()=>{
            return {
                user: {
                    create: mockPrismaCreate
                },
                $disconnect: mockPrismaDisconnect
            }
        })
    }
});

jest.mock('redis', () => ({
    createClient: jest.fn().mockReturnValue({
        on: jest.fn().mockReturnValue(mockRedisClient),
    })
}));

jest.mock('bcrypt', ()=>({
    hashSync: mockHashSync
}));

const DAO = require('../src/dao');

describe('DAO', () => {
    const mockEmail = 'mockemail@dot.com';
    const mockCacheKey = 'users:emails';
    const mockHashedPass = '...hashed...';
    const testData = {
        name: 'mock user',
        email: mockEmail,
        password: mockHashedPass
    };

    beforeEach(()=>{
        mockRedisClient.connect.mockResolvedValue('');
    });

    afterAll(()=>{
        jest.clearAllMocks();
    });

    it('should checkUserIsAlreadyExist return true', async()=>{
        await DAO.checkUserIsAlreadyExist(mockEmail);
        expect(mockRedisClient.connect).toHaveBeenCalled();
        expect(mockRedisClient.sIsMember).toHaveBeenCalledWith(mockCacheKey, mockEmail);
        expect(mockRedisClient.disconnect).toHaveBeenCalled();
    });

    it('should checkUserIsAlreadyExist throw email already in use error', async()=>{
        mockRedisClient.sIsMember.mockResolvedValueOnce(true);
        const mockError = new Error('EMAIL_ALREADY_IN_USE', {
            cause: `redis-cache users:emails already has '${mockEmail}'`
        });
        try {
            await DAO.checkUserIsAlreadyExist(mockEmail);
        } catch (e) {
            expect(mockRedisClient.connect).toHaveBeenCalled();
            expect(e.message).toBe(mockError.message);
            expect(e.cause).toBe(mockError.cause);
        }
        expect(mockRedisClient.sIsMember).toHaveBeenCalledWith(mockCacheKey, mockEmail);
        expect(mockRedisClient.disconnect).toHaveBeenCalled();
    });

    it('should create a user data using prisma client', async()=>{
        mockPrismaCreate.mockResolvedValueOnce({});
        mockHashSync.mockReturnValueOnce(mockHashedPass);
        await DAO.registerUser(testData);
        expect(mockRedisClient.connect).toHaveBeenCalled();
        expect(mockPrismaCreate).toHaveBeenCalledWith({data: testData});
        expect(mockRedisClient.sAdd).toHaveBeenCalledWith(mockCacheKey, mockEmail);
        expect(mockRedisClient.disconnect).toHaveBeenCalled();
        expect(mockPrismaDisconnect).toHaveBeenCalled();
    });

    it('should throw an error while creating an user with invalid data using prisma client', async()=>{
        const error = new Error('Invalid Data');
        mockHashSync.mockReturnValueOnce(mockHashedPass);
        mockPrismaCreate.mockRejectedValueOnce(error);
        try {
            await DAO.registerUser(testData)
        }
        catch(e) {
            expect(e.message).toBe('Error while registering a new user');
            expect(e.cause).toEqual(error.stack);
            expect(mockRedisClient.connect).toHaveBeenCalled();
            expect(mockPrismaCreate).toBeCalledWith({data: testData});
            expect(mockRedisClient.sAdd).not.toHaveBeenNthCalledWith(2, mockCacheKey, mockEmail);
            expect(mockRedisClient.disconnect).toHaveBeenCalled();
            expect(mockPrismaDisconnect).toBeCalled();
        }
    });
})