FROM --platform=linux/amd64 node:14-alpine as build-stage

WORKDIR /app

COPY package.json .
COPY yarn.lock .

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn tsc

FROM node:14-alpine

ENV PORT=3333

WORKDIR /app

COPY --from=build-stage /app/dist ./dist/
COPY --from=build-stage /app/package.json /app/yarn.lock ./

RUN yarn install --production --frozen-lockfile

EXPOSE ${PORT}

ENTRYPOINT [ "node", "dist" ]
