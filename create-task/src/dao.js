const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient({
    errorFormat: process.env.NODE_ENV !== 'production' ? 'colorless' : 'minimal'
});

/**
 * @function createTask
 * It has access to data layer using Prisma ORM client
 * for more info https://www.prisma.io/docs/orm/prisma-client
 * @param {*} data 
 */
async function createTask(data) {
    try {
        await prisma.task.create({ data });
        await prisma.$disconnect();
    }
    catch(e) {
        await prisma.$disconnect();
        throw new Error('Error creating a new task', {cause: e.stack})
    }
}

module.exports = {
    createTask,
};