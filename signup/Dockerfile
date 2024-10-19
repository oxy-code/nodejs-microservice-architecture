FROM node:20.18.0-alpine

ENV PORT=${PORT}

WORKDIR /app

RUN mkdir prisma
COPY ./src ./src
COPY index.js package*.json ./
COPY prisma/schema.prisma ./prisma/schema.prisma

# This package required to alter db with schema/prisma.schema changes - manually from container
RUN npm install -g prisma

RUN npm install --omit=dev
RUN npm run generate-prisma-client

EXPOSE ${PORT}
CMD ["node", "index.js"]