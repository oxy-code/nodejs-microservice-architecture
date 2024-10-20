const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const { JWT } = require('@oxycode/express-utilities');
const prisma = new PrismaClient({
    errorFormat: process.env.NODE_ENV !== 'production' ? 'colorless' : 'minimal'
});

/**
 * @function login
 * It has access to data layer using Prisma ORM client
 * for more info https://www.prisma.io/docs/orm/prisma-client
 * @param {*} data 
 */
async function login(data) {
    try {
        const record = await prisma.user.findUnique({
            where: {
                email: data.email
            }
        });
        if (!record) {
            throw new Error('INVALID_USER', {cause: 'User does not exist'});
        }
        const { password: passwordHash, ...user } = record;
        const isAuthenticated = await bcrypt.compareSync(data.password, passwordHash);
        if (!isAuthenticated) {
            throw new Error('INVALID_USER', {cause: 'Wrong password'});
        }
        await prisma.$disconnect();
        // it uses env JWT_SECRET for encryption
        return {
            token: JWT.generateToken(user, { algorithm: 'HS256', expiresIn: '30 mins' })
        }
    }
    catch(e) {
        await prisma.$disconnect();
        if (e.message !== 'INVALID_USER') {
            throw new Error('Error authenticating user', {cause: e.stack})
        }
        else {
            throw e;
        }
    }
}

module.exports = {
    login,
};