const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient({
    errorFormat: process.env.NODE_ENV !== 'production' ? 'colorless' : 'minimal'
});

/**
 * @function deleteTask
 * It has access to data layer using Prisma ORM client
 * for more info https://www.prisma.io/docs/orm/prisma-client
 * @param {*} params 
 */
async function deleteTask(params) {
    try {
        await prisma.task.delete({ where: params });
        await prisma.$disconnect();
    }
    catch(e) {
        await prisma.$disconnect();
        throw new Error('Error deleting a task', {cause: e.stack})
    }
}

module.exports = {
    deleteTask,
};