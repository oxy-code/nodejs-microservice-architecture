const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient({
    errorFormat: process.env.NODE_ENV !== 'production' ? 'colorless' : 'minimal'
});

/**
 * @function update
 * It has access to data layer using Prisma ORM client
 * for more info https://www.prisma.io/docs/orm/prisma-client
 * @param {*} params 
 */
async function update(params) {
    try {
        const {id, ...data} = params;
        await prisma.task.update({ where: { id }, data });
        await prisma.$disconnect();
    }
    catch(e) {
        await prisma.$disconnect();
        throw new Error('Error updating a task', {cause: e.stack})
    }
}

module.exports = {
    update,
};