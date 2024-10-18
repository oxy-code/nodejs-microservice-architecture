FROM node:20.18.0-alpine AS build

WORKDIR /app

RUN mkdir prisma
COPY ./src ./src
COPY index.js package*.json ./
COPY prisma/schema.prisma ./prisma/schema.prisma
RUN npm install
RUN npm run generate-prisma-client

FROM node:20.18.0-alpine
ENV PORT=${PORT}
WORKDIR /app

COPY --from=build /app/ ./
RUN rm -rf node_modules/*
RUN mkdir -p node_modules/@prisma
RUN mkdir -p node_modules/.prisma
COPY --from=build /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma

RUN npm install --omit=dev
EXPOSE ${PORT}
CMD ["node", "index.js"]