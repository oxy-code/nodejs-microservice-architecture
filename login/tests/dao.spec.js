const mockPrismaDisconnect = jest.fn();
const mockPrismaFindUnique = jest.fn();
const mockBcryptCompare = jest.fn();
const mockGenerateToken = jest.fn();
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
                    findUnique: mockPrismaFindUnique
                },
                $disconnect: mockPrismaDisconnect
            }
        })
    }
})

jest.mock('bcrypt', ()=>({
    compareSync: mockBcryptCompare
}))
jest.mock('@oxycode/express-utilities', ()=>({
    JWT: {
        generateToken: mockGenerateToken
    }
}));

const DAO = require('../src/dao');
const testData = {
    email: 'mock@email.com',
    password: 'mockpassword'
};
const mockUserInfo = {
    id: 1000,
    email: 'mock@email.com',
    password: '....hashed...',
    role: 'mock'
}

describe('DAO', () => {
    afterAll(()=>{
        jest.clearAllMocks();
    });

    it('should generateToken successfully', async()=>{
        const mockToken = 'mocked..token';
        mockPrismaFindUnique.mockResolvedValueOnce(mockUserInfo);
        mockBcryptCompare.mockResolvedValueOnce(true);
        mockGenerateToken.mockReturnValueOnce(mockToken);

        expect(await DAO.login(testData)).toEqual({token: mockToken});
        expect(mockPrismaFindUnique).toHaveBeenCalledWith({where: {email: testData.email}});
        expect(mockBcryptCompare).toHaveBeenCalledWith(testData.password, mockUserInfo.password);
        expect(mockPrismaDisconnect).toHaveBeenCalled();
    });

    it('should throw an error while login - user not found', async()=>{
        mockPrismaFindUnique.mockResolvedValueOnce(undefined);
        try {
            await DAO.login(testData)
        }
        catch(e) {
            expect(e.message).toBe('INVALID_USER');
            expect(e.cause).toEqual('User does not exist');
            expect(mockPrismaFindUnique).toHaveBeenCalledWith({where: {email: testData.email}});
            expect(mockPrismaDisconnect).toHaveBeenCalled();
        }
    });

    it('should throw an error while login - invalid password', async()=>{
        mockPrismaFindUnique.mockResolvedValueOnce(mockUserInfo);
        mockBcryptCompare.mockResolvedValueOnce(false);
        try {
            await DAO.login(testData)
        }
        catch(e) {
            expect(e.message).toBe('INVALID_USER');
            expect(e.cause).toEqual('Wrong password');
            expect(mockPrismaFindUnique).toHaveBeenCalledWith({where: {email: testData.email}});
            expect(mockPrismaDisconnect).toHaveBeenCalled();
        }
    });

    it('should throw an error while login - internal server error', async()=>{
        const customError = new Error('mock error');
        mockPrismaFindUnique.mockResolvedValueOnce(mockUserInfo);
        mockBcryptCompare.mockRejectedValueOnce(customError);
        try {
            await DAO.login(testData)
        }
        catch(e) {
            expect(e.message).toBe('Error authenticating user');
            expect(e.cause).toEqual(customError.stack);
            expect(mockPrismaFindUnique).toHaveBeenCalledWith({where: {email: testData.email}});
            expect(mockPrismaDisconnect).toHaveBeenCalled();
        }
    });
})