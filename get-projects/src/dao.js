const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient({
    errorFormat: process.env.NODE_ENV !== 'production' ? 'colorless' : 'minimal'
});

/**
 * @function getProjects
 * It has access to data layer using Prisma ORM client
 * for more info https://www.prisma.io/docs/orm/prisma-client
 * @param {*} queryParams 
 */
async function getProjects(queryParams) {
    try {
        let projects = [];
        if (Object.keys(queryParams).length) {
            projects = await prisma.project.findMany({ where: queryParams });
        }
        else {
            projects = await prisma.project.findMany();
        }
        await prisma.$disconnect();
        return { projects };
    }
    catch(e) {
        await prisma.$disconnect();
        throw new Error('Error fetching projects', {cause: e.stack})
    }
}

module.exports = {
    getProjects,
};