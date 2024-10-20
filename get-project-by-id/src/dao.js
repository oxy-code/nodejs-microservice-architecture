const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient({
    errorFormat: process.env.NODE_ENV !== 'production' ? 'colorless' : 'minimal'
});

/**
 * @function getProjects
 * It has access to data layer using Prisma ORM client
 * for more info https://www.prisma.io/docs/orm/prisma-client
 * @param {*} params 
 */
async function getProjects(params) {
    try {
        const project = await prisma.project.findUnique({ where: params });
        await prisma.$disconnect();
        return { project };
    }
    catch(e) {
        await prisma.$disconnect();
        throw new Error('Error fetching projects', {cause: e.stack})
    }
}

module.exports = {
    getProjects,
};