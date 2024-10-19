const { PrismaClient } = require('@prisma/client');
const { createClient: createRedisClient } = require('redis');
const { Logger } = require('@oxycode/express-utilities');
const bcrypt = require('bcrypt');

const redisLogger = Logger.child({ label: 'redis' });
const prisma = new PrismaClient({
    errorFormat: process.env.NODE_ENV !== 'production' ? 'colorless' : 'minimal'
});
const REDIS_USER_EMAILS_KEY = 'users:emails';
const SALT_ROUNDS = 10;
const client = createRedisClient({
    socket: {
        host: process.env.REDIS_HOST
    },
    username: process.env.REDIS_USER,
    password: process.env.REDIS_PASSWORD
}).on('error', err => redisLogger.error('Redis Client Error', err));

/**
 * @function registerUser
 * It has access to data layer using Prisma ORM client
 * for more info https://www.prisma.io/docs/orm/prisma-client
 * @param {*} data 
 */
async function registerUser(data) {
    try {
        await client.connect();
        const { password, ...user } = data;
        user.password = bcrypt.hashSync(password, SALT_ROUNDS);
        await prisma.user.create({ data: user });
        await prisma.$disconnect();
        // Using Set type available in redis, which will store only unique data
        // for more - https://redis.io/docs/latest/develop/data-types/sets/
        await client.sAdd(REDIS_USER_EMAILS_KEY, data.email);
        await client.disconnect();
    }
    catch(e) {
        await client.disconnect();
        await prisma.$disconnect();
        throw new Error('Error while registering a new user', {cause: e.stack})
    }
}
/**
 * Instead of lookup from database, it checks the redis cache to find the user-email
 * is already registered within the system or not. IF email exist throws an error 'EMAIL_ALREADY_IN_USE'
 * THIS IS VERY USEFUL - When we have millions of user records in database
 * @param {*} email 
 */
async function checkUserIsAlreadyExist(email) {
    await client.connect();
    // Using Set type, which will easily find if the given email is already exist or not
    // https://redis.io/docs/latest/commands/sismember/
    const isEmailExist = await client.sIsMember(REDIS_USER_EMAILS_KEY, email);
    await client.disconnect();
    if (isEmailExist) {
        throw new Error('EMAIL_ALREADY_IN_USE', {
            cause: `redis-cache ${REDIS_USER_EMAILS_KEY} already has '${email}'`
        });
    }
}

module.exports = {
    registerUser,
    checkUserIsAlreadyExist
};