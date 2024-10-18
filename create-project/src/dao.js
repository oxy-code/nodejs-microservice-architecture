const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient({
    errorFormat: process.env.DEBUG ? 'colorless' : 'minimal'
});

/**
 * @function createProject
 * It has access to data layer using Prisma ORM client
 * for more info https://www.prisma.io/docs/orm/prisma-client
 * @param {*} data 
 */
async function createProject(data) {
    try {
        await prisma.project.create({ data });
        await prisma.$disconnect();
    }
    catch(e) {
        await prisma.$disconnect();
        throw new Error('Error creating a new project', {cause: e.stack})
    }
}

module.exports = {
    createProject,
};