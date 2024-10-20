const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient({
    errorFormat: process.env.NODE_ENV !== 'production' ? 'colorless' : 'minimal'
});

/**
 * @function getTasks
 * It has access to data layer using Prisma ORM client
 * for more info https://www.prisma.io/docs/orm/prisma-client
 * @param {*} queryParams 
 */
async function getTasks(queryParams) {
    try {
        let tasks = [];
        if (Object.keys(queryParams).length) {
            tasks = await prisma.task.findMany({ where: queryParams });
        }
        else {
            tasks = await prisma.task.findMany();
        }
        await prisma.$disconnect();
        return { tasks };
    }
    catch(e) {
        await prisma.$disconnect();
        throw new Error('Error fetching tasks', {cause: e.stack})
    }
}

module.exports = {
    getTasks,
};